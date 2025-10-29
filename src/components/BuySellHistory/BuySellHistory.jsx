import React, { useState, useEffect } from "react";
import "./TradeHistory.css";
import tradeHistoryController from "../../controllers/tradeHistoryController";
import BottomNavigation from "../BottomNavigation/BottomNavigation";

const BuySellHistory = ({ tradeType }) => {
  const [trades, setTrades] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage, setTradesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    tradeHistoryController.getTrades((data, total, err) => {
      if (err) {
        setError(err);
        return;
      }
      const filtered = data.filter((trade) => trade.tradeType === tradeType);
      setTrades(filtered);
      setTotalPages(Math.ceil(filtered.length / tradesPerPage));
    });
  }, [tradeType, tradesPerPage]);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = [...trades]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(indexOfFirstTrade, indexOfLastTrade);


  return (
    <div className="bg-[#0a0f1f] text-white flex flex-col pb-14 mt-10" style={{ width: "100vw" }}>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between mb-4">
        <label className="self-center ml-8">
          Rows per page:
          <select
            className="ml-2 bg-gray-700 text-white px-2 py-1 rounded"
            value={tradesPerPage}
            onChange={(e) => {
              setTradesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto" style={{width:"96%", margin:"auto"}}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="py-1 px-1">Crypto</th>
              <th className="py-1 px-1">Type</th>
              <th className="py-1 px-1">Expiration</th>
              <th className="py-1 px-1">Amount</th>
              <th className="py-1 px-1">Profit</th>
              <th className="py-1 px-1">Status</th>
              <th className="py-1 px-1">Traded At</th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-700">
                <td className="py-1 px-1">{trade.tradePair}</td>
                <td className="py-1 px-1">{trade.tradeType}</td>
                <td className="py-1 px-1">{trade.expirationTime}s</td>
                <td className="py-1 px-1">${trade.tradingAmountUSD}</td>
                <td className="py-1 px-1">${trade.estimatedIncome}</td>
                <td className="py-1 px-1">
                  <span
                    className={`px-1 py-1 rounded text-sm font-medium ${
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
                <td className="py-2 px-4">{new Date(trade.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Pagination */}
<div className="flex justify-center items-center mt-4 space-x-2">
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
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

      <BottomNavigation />
    </div>
  );
};

export default BuySellHistory;
