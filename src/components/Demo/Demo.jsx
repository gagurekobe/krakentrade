import React, { useEffect, useState } from "react";
import axios from "axios";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import "./Demo.css";
import DemoWatchlist from "../DemoWatchlist/DemoWatchlist";
import DemoPopup from "../DemoPopup/DemoPopup";
import CryptoChart from "../../components/Chart/CryptoChart";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const Demo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topCryptos, setTopCryptos] = useState([]); // Top 10 trending cryptocurrencies
  const [allCryptos, setAllCryptos] = useState([]); // All available cryptocurrencies
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isTradePopupOpen, setTradePopupOpen] = useState(false);
  const [tradeType, setTradeType] = useState("Buy"); // Default to Buy
  const [cryptoData, setCryptoData] = useState(null); // Crypto data for the popup
  const [profile, setProfile] = useState(null);
  const [identityStatus, setIdentityStatus] = useState(""); // Added missing state
  const navigate = useNavigate();

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
          console.log("Profile data:", data);
          setIdentityStatus(data.status); // Now this will work
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
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
    const fetchTopCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 200,
              page: 1,
              sparkline: false,
            },
          }
        );
        setTopCryptos(response.data);
      } catch (error) {
        console.error("Error fetching top cryptocurrencies:", error);
      }
    };

    const fetchAllCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100, // Fetch more for better search capability
              page: 1,
              sparkline: false,
            },
          }
        );
        setAllCryptos(response.data);
      } catch (error) {
        console.error("Error fetching all cryptocurrencies:", error);
      }
    };

    fetchTopCryptos();
    fetchAllCryptos();
  }, []);

  useEffect(() => {
    // Update filtered cryptos based on search term
    const filtered = allCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, [searchTerm, allCryptos]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredCryptos([]); // Reset filtered list while typing
  };

  const handleDropdownChange = (e) => {
    const selected = topCryptos.find((crypto) => crypto.id === e.target.value);
    setSelectedCrypto(selected);
    setSearchTerm(selected.name);
    setCryptoData(selected); // Set the selected crypto data for the popup
  };

  const handleTrade = (action) => {
    if (selectedCrypto) {
      setTradeType(action);
      setTradePopupOpen(true);
    }
  };
  const handleDropdownSelect = (crypto) => {
    setSelectedCrypto(crypto.id);
    setCryptoData(crypto);
  };

  return (
    <div
      className="bg-[#0a0f1f] min-h-screen text-white flex flex-col pb-14 trading-page-main pt-0"
      style={{ width: "100vw" }}
    >
      {profile && (
        <div className="bg-[#3b4a6b] p-6 rounded-xl mt-6 w-full flex justify-between">
          <div>
            <h4 className="text-lg font-semibold balance-txt">Demo Balance</h4>
            <p className="text-3xl font-bold usd-balance">
              {profile.demoBalance?.toFixed(2) || "0.00"}
              <span className="text-sm"> USDT</span>
            </p>
            <p className="text-gray-300 text-sm">
              {profile.demoBalance?.toFixed(2) || "0.00"} Today
            </p>
          </div>

          <div className="flex gap-4 deposit-withdraw-buttons">
            <p>Trade with demo balance</p>
            <button className="bg-white text-black rounded">
              <a href="#trade-demo">Trade</a>
            </button>
          </div>
        </div>
      )}

      <div className="trading-page-coontainer">
        <CryptoChart />
        <div className="trending-and-buysell" id="trade-demo">
          <div
            className="bg-gray-800  w-full rounded-lg shadow-md mb-6 selected-crypto-main pb-10"
            style={{ width: "100%" }}
          >
            <h4
              className="text-xl font-semibold mb-4"
              style={{ color: "gray" }}
            >
              Select crypto
            </h4>
            <div className="" style={{ width: "90%", margin: "auto" }}>
              <select
                onChange={(e) => {
                  const selected = topCryptos.find(
                    (crypto) => crypto.id === e.target.value
                  );
                  if (selected) {
                    handleDropdownSelect(selected);
                  }
                }}
                className="w-full p-3 bg-gray-700 text-white rounded"
                value={selectedCrypto || ""}
              >
                <option value="" disabled>
                  Select Crypto
                </option>
                {topCryptos.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div
              className="selected-crypto-buttons-container"
              style={{ width: "90%", margin: "auto", marginTop: "20px" }}
            >
              <button
                onClick={() => handleTrade("Buy")}
                className="bg-green-500 hover:bg-green-600 text-white rounded w-full"
                style={{ background: "green" }}
              >
                Buy
              </button>
              <button
                onClick={() => handleTrade("Sell")}
                className="bg-red-500 hover:bg-red-600 text-white rounded w-full"
                style={{ background: "red" }}
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        <DemoPopup
          cryptoData={cryptoData}
          isOpen={isTradePopupOpen}
          onClose={() => setTradePopupOpen(false)}
          tradeType={tradeType} // Pass the trade type to the popup
        />

        <DemoWatchlist />
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Demo;
