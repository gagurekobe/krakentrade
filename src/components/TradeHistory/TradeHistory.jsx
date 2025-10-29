// TradeHistory.js
import React, { useState, useEffect } from "react";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import "./TradeHistory.css";
import tradeHistoryController from "../../controllers/tradeHistoryController";
import Swal from "sweetalert2";
import config from "../../config";

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage, setTradesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    tradeHistoryController.getTrades(setTrades, setTotalPages, setError);
  }, [tradesPerPage]);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = [...trades]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirstTrade, indexOfLastTrade);

  const handleCancelTrade = async (tradeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this trade?",
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
        `${config.BACKEND_URL}/api/trades/cancel/${tradeId}`,
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
        setTrades((prev) => prev.filter((dep) => dep._id !== tradeId));

        Swal.fire("Cancelled!", "Trade has been cancelled.", "success");
      } else {
        console.error("Error cancelling trade:", data.message);
        Swal.fire(
          "Error",
          data.message || "Failed to cancel trade.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error cancelling trade:", error);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };
  return (
    <div
      className="bg-[#0a0f1f] min-h-screen text-white flex flex-col pb-14 mt-10"
      style={{ width: "100vw" }}
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between mb-4">
        <label className="self-center ml-8">
          Rows per page:
          <select
            className="ml-2 bg-gray-700 text-white px-2 py-1 rounded"
            value={tradesPerPage}
            onChange={(e) => {
              setTradesPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div
        className="overflow-x-auto"
        style={{ width: "96%", marginLeft: "auto", marginRight: "auto" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="py-1 px-1">Crypto type</th>
              <th className="py-1 px-1">Trade type</th>
              <th className="py-1 px-1">Expiration time</th>
              <th className="py-1 px-1">Traded amount</th>
              <th className="py-1 px-1">Profit</th>
              <th className="py-1 px-1">Status</th>
              <th className="py-1 px-1">Traded at</th>
              <th className="py-1 px-1">Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "start" }}>
            {currentTrades.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No Trade History Available
                </td>
              </tr>
            ) : (
              currentTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700">
                  <td className="py-1 px-1">{trade.tradePair}</td>
                  <td className="py-1 px-1">{trade.tradeType}</td>
                  <td className="py-1 px-1">{trade.expirationTime}</td>
                  <td className="py-1 px-1">${trade.tradingAmountUSD}</td>
                  <td className="py-1 px-1">${trade.estimatedIncome}</td>
                  <td className="py-1 px-1">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        trade.status === "Completed"
                          ? "bg-green-500 text-white"
                          : trade.status === "Rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-gray-900"
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    {new Date(trade.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      View
                    </button>
                    {trade.status !== "Completed" && (
                      <a
                        className="cursor-pointer ml-4 text-center"
                        style={{ color: "red" }}
                        onClick={() => handleCancelTrade(trade._id)}
                      >
                        Cancel trade
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for Trade Details */}
      {selectedTrade && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 trade-history-popup">
            <h3 className="text-lg font-semibold mb-2 text-green-400">
              Trade Details
            </h3>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Crypto type</span>
              <p>{selectedTrade.tradePair}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Trade type</span>
              <p>{selectedTrade.tradeType}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Expiration time</span>
              <p>{selectedTrade.expirationTime}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Traded amount</span>
              <p>${selectedTrade.tradingAmountUSD}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Transaction fee</span>
              <p>0.5</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Profit</span>
              <p>{selectedTrade.estimatedIncome}</p>
            </div>

            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Status</span>
              <p
                className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                  selectedTrade.status === "Completed"
                    ? "bg-green-500 text-white"
                    : selectedTrade.status === "Rejected"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-gray-900"
                }`}
              >
                {selectedTrade.status}
              </p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Win/Lose</span>
              <p
                className={`px-2 py-1 rounded text-sm font-medium ${
                  selectedTrade.winLose === "Win"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
                style={{ fontSize: "16px" }}
              >
                {selectedTrade.winLose}
              </p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Traded At</span>
              <p>{new Date(selectedTrade.createdAt).toLocaleString()}</p>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 w-50"
              onClick={() => setSelectedTrade(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default TradeHistory;
