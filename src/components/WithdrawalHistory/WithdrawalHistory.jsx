import React, { useState, useEffect } from "react";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import "./TradeHistory.css";
import config from "../../config";
import Swal from "sweetalert2";

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawalsPerPage, setWithdrawalsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch withdrawal history data for the logged-in user
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from storage
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          `${config.BACKEND_URL}/api/withdrawals/all-my-Withdrawals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.withdrawals) {
          const sortedWithdrawals = data.withdrawals.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setWithdrawals(sortedWithdrawals);
          setTotalPages(
            Math.ceil(sortedWithdrawals.length / withdrawalsPerPage)
          );
        } else {
          console.error("Error fetching withdrawal history:", data.error);
        }
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
      }
    };

    fetchWithdrawals();
  }, [withdrawalsPerPage]);

  // Calculate the withdrawals to display for the current page
  const indexOfLastWithdrawal = currentPage * withdrawalsPerPage;
  const indexOfFirstWithdrawal = indexOfLastWithdrawal - withdrawalsPerPage;
  const currentWithdrawals = withdrawals.slice(
    indexOfFirstWithdrawal,
    indexOfLastWithdrawal
  );

  const handleCancelWithdrawal = async (withdrawalId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this withdrawal?",
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
        `${config.BACKEND_URL}/api/withdrawals/cancel/${withdrawalId}`,
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
        setWithdrawals((prev) => prev.filter((dep) => dep._id !== withdrawalId));

        Swal.fire("Cancelled!", "Withdrawal has been cancelled.", "success");
      } else {
        console.error("Error cancelling Withdrawal:", data.message);
        Swal.fire(
          "Error",
          data.message || "Failed to cancel Withdrawal.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error cancelling Withdrawal:", error);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <div
      className="bg-[#0a0f1f] text-white flex flex-col pb-14 mt-10"
      style={{ width: "100%" }}
    >
      <div className="flex justify-between mb-4" style={{ height: "100%" }}>
        <label className="self-center ml-8">
          Rows
          <select
            className="ml-2 bg-gray-700 text-white px-2 py-1 rounded"
            value={withdrawalsPerPage}
            onChange={(e) => {
              setWithdrawalsPerPage(Number(e.target.value));
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
        style={{ width: "98vw", marginLeft: "auto", marginRight: "auto" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Withdrawal Address</th>
              <th className="py-2 px-4">Withdrawal Network</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Withdrawn At</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "start" }}>
            {currentWithdrawals.map((withdrawal) => (
              <tr key={withdrawal._id} className="border-b border-gray-700">
                <td className="py-2 px-4">${withdrawal.amount}</td>
                <td className="py-2 px-4">{withdrawal.withdrawalAddress}</td>
                <td className="py-2 px-4">{withdrawal.withdrawalNetwork}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      withdrawal.Status === "Approved"
                        ? "bg-green-500 text-white"
                        : withdrawal.Status === "Pending"
                        ? "bg-yellow-400 text-black"
                        : withdrawal.Status === "Rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-white"
                    }`}
                  >
                    {withdrawal.Status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {new Date(withdrawal.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 gap-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => setSelectedWithdrawal(withdrawal)}
                  >
                    View
                  </button>
                  {withdrawal.Status !== "Approved" && (
                    <a
                      className="cursor-pointer ml-4"
                      style={{ color: "red" }}
                      onClick={() => handleCancelWithdrawal(withdrawal._id)}
                    >
                      Cancel Withdrawal
                    </a>
                  )}
                </td>
              </tr>
            ))}
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

      {/* Modal for Withdrawal Details */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-90">
            <h3 className="text-lg font-semibold mb-2 text-green-400">
              Withdrawal history
            </h3>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Amount</span>
              <p>${selectedWithdrawal.amount}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Address</span>
              <p>{selectedWithdrawal.withdrawalAddress}</p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Status</span>
              <p
                className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                  selectedWithdrawal.Status === "Approved"
                    ? "bg-green-500 text-white"
                    :selectedWithdrawal.Status === "Pending"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {selectedWithdrawal.Status}
              </p>
            </div>
            <div className="trade-details-content bg-gray-700 p-4 rounded-lg flex justify-between items-center w-full">
              <span>Withdrawn At</span>
              <p>{new Date(selectedWithdrawal.createdAt).toLocaleString()}</p>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-50"
              onClick={() => setSelectedWithdrawal(null)}
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

export default WithdrawalHistory;
