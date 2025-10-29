import React, { useState, useEffect } from "react";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import "./DepositHistory.css";
import config from "../../config";
import Swal from "sweetalert2";

const DepositHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [imagePopup, setImagePopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [depositsPerPage, setDepositsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageUrl = (filename) => `${config.BACKEND_URL}/uploads/${filename}`;

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          `${config.BACKEND_URL}/api/deposits/user-deposits`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.deposits) {
          const sortedDeposits = [...data.deposits].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setDeposits(sortedDeposits);
          setTotalPages(Math.ceil(sortedDeposits.length / depositsPerPage));
        } else {
          console.error("Error fetching deposit history:", data.error);
        }
      } catch (error) {
        console.error("Error fetching deposit history:", error);
      }
    };

    fetchDeposits();
  }, [depositsPerPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(deposits.length / depositsPerPage));
  }, [deposits, depositsPerPage]);

  const indexOfLastDeposit = currentPage * depositsPerPage;
  const indexOfFirstDeposit = indexOfLastDeposit - depositsPerPage;
  const currentDeposits = deposits.slice(
    indexOfFirstDeposit,
    indexOfLastDeposit
  );

  const handleCancelDeposit = async (depositId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this deposit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${config.BACKEND_URL}/api/deposits/cancel/${depositId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Remove cancelled deposit from state
        setDeposits((prev) => prev.filter((dep) => dep._id !== depositId));

        Swal.fire("Cancelled!", "Deposit has been cancelled.", "success");
      } else {
        console.error("Error cancelling deposit:", data.message);
        Swal.fire(
          "Error",
          data.message || "Failed to cancel deposit.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error cancelling deposit:", error);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <div
      className="bg-[#0a0f1f] min-h-screen text-white flex flex-col pb-14 mt-10"
      style={{ width: "100vw" }}
    >
      <div
        className="overflow-x-auto"
        style={{ width: "96%", marginLeft: "auto", marginRight: "auto" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="py-2 px-4">Crypto Type</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Amount in USDT</th>
              <th className="py-2 px-4">Proof</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Deposited At</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDeposits.map((deposit) => (
              <tr key={deposit._id} className="border-b border-gray-700">
                <td className="py-2 px-4">{deposit.cryptoType}</td>
                <td className="py-2 px-4">${deposit.amount}</td>
                <td className="py-2 px-4">${deposit.equivalentInUSDT}</td>
                <td className="py-2 px-4">
                  <td>
                    <button
                      lassName="text-blue-500 underline"
                      onClick={() =>
                        setSelectedImage(getImageUrl(deposit.proofOfDeposit))
                      }
                      style={{ color: "gray" }}
                    >
                      View
                    </button>
                  </td>
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      deposit.status === "Approved"
                        ? "bg-green-500 text-white"
                        : deposit.status === "Pending"
                        ? "bg-yellow-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {deposit.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {new Date(deposit.createdAt).toLocaleString()}
                </td>
                <td className="flex py-2 px-2 gap-4">
                  <button
                    className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600"
                    onClick={() => setSelectedDeposit(deposit)}
                  >
                    View
                  </button>
                  {/* Only show Cancel button if deposit status is NOT "Approved" */}
                  {deposit.status !== "Approved" && (
                    <a
                      className="cursor-pointer"
                      style={{ color: "red" }}
                      onClick={() => handleCancelDeposit(deposit._id)}
                    >
                      Cancel deposit
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-6 mt-4">
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={depositsPerPage}
            onChange={(e) => {
              setDepositsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Deposit Details */}
      {selectedDeposit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-90">
            <h3 className="text-lg font-semibold mb-2 text-green-400">
              Deposit history
            </h3>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Crypto Type</span>
              <p>{selectedDeposit.cryptoType}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Amount</span>
              <p>{selectedDeposit.amount}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Amount in USDT</span>
              <p>${selectedDeposit.equivalentInUSDT}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Status</span>
              <p
                className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                  selectedDeposit.status === "Approved"
                    ? "bg-green-500 text-white"
                    : selectedDeposit.status === "Pending"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {selectedDeposit.status}
              </p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Deposited At</span>
              <p>{new Date(selectedDeposit.createdAt).toLocaleString()}</p>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-50"
              onClick={() => setSelectedDeposit(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Identity Proof" />
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default DepositHistory;
