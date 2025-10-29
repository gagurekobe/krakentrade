import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import "./PersonalProfile.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import Swal from "sweetalert2";

const PersonalCenter = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositProof, setDepositProof] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [profile, setProfile] = useState(null);
  const [identityStatus, setIdentityStatus] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState("");
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [fundPassword, setFundPassword] = useState("");
  const [cryptoRates, setCryptoRates] = useState({});
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/admin/alladdresses`
      );
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      // Error handling without console.log
    }
  };

  const fetchCryptoRates = async () => {
    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/price"
      );
      const data = await response.json();

      const rates = {};
      data.forEach((item) => {
        const symbol = item.symbol;
        const price = parseFloat(item.price);
        if (symbol === "BTCUSDT") rates.BTC = price;
        if (symbol === "ETHUSDT") rates.ETH = price;
        if (symbol === "BNBUSDT") rates.BNB = price;
        if (symbol === "USDTUSDT") rates.USDT = price;
      });

      setCryptoRates(rates);
    } catch (error) {
      // Error handling without console.log
    }
  };
  useEffect(() => {
    fetchAddresses();
    fetchCryptoRates();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your login session expired, You need to log in again",
        confirmButtonColor: "#22c55e", // Tailwind green-500
      }).then(() => {
        navigate("/login"); // Redirect to login after closing the alert
      });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setIdentityStatus(data.status);
        } else {
          navigate("/");
        }
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchProfile();
  }, []);

  const handleCryptoChange = (event) => {
    const selected = event.target.value;
    setSelectedCrypto(selected);
    const selectedAddress =
      addresses.find((addr) => addr.cryptoType === selected)?.address || "";
    setAddress(selectedAddress);
  };

  const handleDeposit = async () => {
    setDepositLoading(true); // Set loading state
    const parsedAmount = parseFloat(depositAmount);
    const rate = cryptoRates[selectedCrypto] || 1;
    let equivalentInUSDT = parsedAmount;

    if (selectedCrypto !== "USDT") {
      equivalentInUSDT = parsedAmount * rate;
    }

    const formData = new FormData();
    formData.append("cryptoType", selectedCrypto);
    formData.append("cryptoAddress", address);
    formData.append("amount", parsedAmount); // ✅
    formData.append("equivalentInUSDT", equivalentInUSDT); // ✅
    formData.append("proofOfDeposit", depositProof);

    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/deposits/deposit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const { balance } = await response.json();
        Swal.fire({
          icon: "success",
          title: "Deposit Successful!",
          text: "Your deposit has been submitted successfully.",
          confirmButtonColor: "#22c55e",
        });
        setProfile((prev) => ({ ...prev, balance }));
        setDepositAmount("");
        setDepositProof(null);
        setShowDepositModal(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Deposit Failed",
          text: errorData.message || "Please try again.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDepositLoading(false); // Reset loading state
    }
  };

  const handleWithdrawalSubmit = () => {
    if (loading || isAuthenticating) return; // Prevent double-click during loading or authentication
    setAuthPopupOpen(true); // Open authentication popup
  };
  const resetAuthState = () => {
    setAuthPopupOpen(false); // Close the auth popup
    setFundPassword(""); // Clear the password field
    setAuthError(""); // Clear authentication error message
  };
  const handleWithdraw = async () => {
    setWithdrawLoading(true); // Set loading state
    let minimumWithdrawalAmount = 15;

    // Check if withdrawal amount is too low
    if (withdrawAmount < minimumWithdrawalAmount) {
      Swal.fire({
        icon: "warning",
        title: "Withdrawal Amount Too Low",
        text: `The minimum withdrawal amount is ${minimumWithdrawalAmount}. Please enter a valid amount.`,
        confirmButtonText: "Okay",
      });

      setWithdrawLoading(false); // Reset loading state
      // Prevent further code execution if the condition is met
      return;
    }

    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/withdrawals/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: parseFloat(withdrawAmount),
            withdrawalAddress: withdrawAddress,
            withdrawalNetwork: withdrawNetwork,
          }),
        }
      );

      if (response.ok) {
        const { balance } = await response.json();
        Swal.fire({
          icon: "success",
          title: "Withdrawal Successful!",
          text: "Your withdrawal has been processed successfully.",
          confirmButtonColor: "#22c55e", // Tailwind green-500
        });
        setProfile((prev) => ({ ...prev, balance }));
        setWithdrawAmount(""); // Clear input
        setWithdrawAddress(""); // Clear input
        setShowWithdrawModal(false); // Close modal
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Withdrawal Failed",
          text: `Withdrawal failed: ${errorData.message}`,
          confirmButtonColor: "#ef4444", // Tailwind red-500
        });
      }
    } catch (error) {
      // Error handling without console.log
    } finally {
      setWithdrawLoading(false); // Reset loading state
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  if (
    !identityStatus ||
    (identityStatus !== "Verified")
  ) {
    const message = identityStatus
      ? `${identityStatus}`
      : "Identity status not found. Please verify your identity to view your wallet.";

    return (
      <div className="flex-column justify-center bg-[#1e253b] text-xl font-semibold p-2">
        <p>
          Identification status:{" "}
          <span
            style={{ background: "red", padding: "3px", borderRadius: "5px" }}
          >
            {message}
          </span>
        </p>
        <p style={{ color: "gray", fontSize: "18px", marginTop: "10px" }}>
          Please identify to view your wallet and trade
        </p>
      </div>
    );
  }

  const handleAuthSubmit = async () => {
    if (loading || isAuthenticating) return; // Prevent double-click during loading or authentication
    setAuthError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${config.BACKEND_URL}/api/auth/verify-fund-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fundPassword }),
        }
      );

      if (response.ok) {
        setIsAuthenticating(true);
        setAuthPopupOpen(false);
        handleWithdraw();
      } else {
        setAuthError("Incorrect password. Please try again.");
        setFundPassword("");
      }
    } catch (error) {
      setAuthError("Authentication error.");
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    Swal.fire({
      icon: "success",
      title: "Copied to Clipboard!",
      text: `${selectedCrypto} address has been copied to your clipboard.`,
      confirmButtonColor: "#22c55e",
    });
  };

  return (
    <div className="flex flex-col items-center bg-[#1e253b] rounded-xl text-center shadow-lg personal-profile-main-container">
      <img
        src="/profile.png"
        alt="Profile"
        className="w-20 h-20 rounded-full mx-auto mb-4 border border-gray-500"
      />
      <h3 className="text-xl font-semibold">{profile.email}</h3>
      <p style={{ margin: "10px" }}>
        Identity:
        <span
          className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
            profile.status === "Verified"
              ? "bg-green-500 text-white"
              : profile.status === "Pending"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-gray-900"
          }`}
        >
          {profile.status}
        </span>
      </p>
      <p className="text-gray-400 text-sm flex justify-center gap-2 mt-2">
        <span className="bg-[#2d354b] px-3 py-1 rounded-full">
          UID: {profile._id}
        </span>
        <span className="bg-[#2d354b] px-3 py-1 rounded-full">
          {profile.firstName} {profile.lastName}
        </span>
      </p>

      <div className="bg-[#3b4a6b] p-6 rounded-xl mt-6 w-full flex justify-between">
        <div>
          <h4 className="text-lg font-semibold balance-txt">Account Balance</h4>
          <p className="text-3xl font-bold usd-balance">
            {profile.balance ? profile.balance.toFixed(2) : "0.00"}
            <span className="text-sm"> USDT</span>
          </p>
          <p className="text-gray-300 text-sm">
            {profile.balance ? profile.balance.toFixed(2) : "0.00"} Today
          </p>
        </div>

        <div className="flex gap-4 deposit-withdraw-buttons">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center"
            disabled={withdrawLoading}
          >
            {withdrawLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Withdraw"
            )}
          </button>
          <button
            onClick={() => setShowDepositModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center"
            disabled={depositLoading}
          >
            {depositLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Deposit"
            )}
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2d354b] p-6 rounded-xl shadow-lg text-white w-90 relative">
            <h3 className="text-xl mb-4">Deposit</h3>
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              style={{ background: "transparent", color: "red" }}
            >
              ✖️
            </button>
            <select
              value={selectedCrypto}
              onChange={handleCryptoChange}
              className="mb-4 p-2 w-full bg-gray-800 rounded-md"
            >
              <option value="">Select</option>
              {addresses.map((addr) => (
                <option key={addr.cryptoType} value={addr.cryptoType}>
                  {addr.cryptoName}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between bg-gray-700 p-2 rounded text-white gap-4">
              <span className="break-all">{address}</span>
              <button onClick={copyToClipboard} className="text-white">
                <FaCopy />
              </button>
            </div>
            <input
              type="number"
              className="mb-4 p-2 w-full bg-gray-800 rounded-md"
              placeholder="Amount to Deposit"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,application/pdf"
              className="mb-4 p-2 w-full bg-gray-800 rounded-md"
              onChange={(e) => setDepositProof(e.target.files[0])}
            />
            <button
              onClick={handleDeposit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              disabled={depositLoading}
            >
              {depositLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Deposit"
              )}
            </button>

          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2d354b] p-6 rounded-xl shadow-lg text-white w-90 relative">
            <h3 className="text-xl mb-4">Withdraw USDT</h3>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              style={{ background: "transparent", color: "red" }}
            >
              ✖️
            </button>

            {/* Network Selection */}
            <select
              className="w-full p-2 bg-gray-800 rounded-md mb-4"
              value={withdrawNetwork}
              onChange={(e) => setWithdrawNetwork(e.target.value)}
            >
              <option value="">Select Network</option>
              <option value="TRC20">TRC20 (Tron)</option>
              <option value="ERC20">ERC20 (Ethereum)</option>
              <option value="BEP20">BEP20 (Binance Smart Chain)</option>
              <option value="XRP">XRP (Ripple)</option>
              <option value="BTC">BTC (Bitcoin)</option>
              <option value="DOGE ">DOGE (Dogecoin)</option>
            </select>

            {/* Withdrawal Address */}
            <input
              type="text"
              className="w-full p-2 bg-gray-800 rounded-md mb-4"
              placeholder="Withdrawal Address"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />

            {/* Withdrawal Amount */}
            <input
              type="number"
              className="w-full p-2 bg-gray-800 rounded-md mb-4"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            {/* Confirm Button */}
            <button
              onClick={handleWithdrawalSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              disabled={withdrawLoading}
            >
              {withdrawLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Withdrawal"
              )}
            </button>

          </div>
        </div>
      )}

      {/* Authentication Popup */}
      {isAuthPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg w-90">
            <h3
              className="text-xl font-bold mb-4 text-white"
              style={{ textAlign: "start" }}
            >
              Enter Fund Password
            </h3>
            <input
              type="password"
              value={fundPassword}
              onChange={(e) => setFundPassword(e.target.value)}
              placeholder="Fund Password"
              className="w-full p-2 mb-4 rounded border border-gray-600"
              required
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <div className="flex justify-between mt-6 m-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                style={{ width: "50%" }}
                onClick={handleAuthSubmit}
                disabled={loading || isAuthenticating} // Disable while authentication is in process
              >
                {isAuthenticating ? "Authenticating" : "Authenticate"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                style={{ width: "50%", marginLeft: "20px" }}
                onClick={resetAuthState}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalCenter;