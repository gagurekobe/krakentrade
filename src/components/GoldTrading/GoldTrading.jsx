import React, { useState, useEffect } from "react";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import TradePopup from "../TradePopup/TradePopup";
import GoldChart from "../Chart/GoldChart";

const GoldTradingPage = () => {
  const [selectedPair, setSelectedPair] = useState("XAUUSD");
  const [tradeType, setTradeType] = useState("Buy"); // Default to Buy
  const [isTradePopupOpen, setTradePopupOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState(null); 
  const [topCryptos, setTopCryptos] = useState([]);

  // Define the pairs manually
  const goldPairs = [
    { symbol: "XAUUSD", name: "Gold to USD" },
    { symbol: "XAUBTC", name: "Gold to Bitcoin" },
    { symbol: "XAUEUR", name: "Gold to Euro" },
    { symbol: "XAUJPY", name: "Gold to JPY" },
    { symbol: "XAUCAD", name: "Gold to CAD" },
    { symbol: "XAUGBP", name: "Gold to GBP" },
    { symbol: "XAUAUD", name: "Gold to AUD" },
    { symbol: "XAUCHF", name: "Gold to CHF" },
    { symbol: "XAUSGD", name: "Gold to SGD" },
    { symbol: "XAUNZD", name: "Gold to NZD" },
    { symbol: "XAUNPR", name: "Gold to NPR" },
    { symbol: "XAUTHB", name: "Gold to THB" },
    { symbol: "XAUTRYG", name: "Gold to TRYG" },
    { symbol: "XAUHKD", name: "Gold to HKD" },
    { symbol: "XAUCNY", name: "Gold to CNY" },
    { symbol: "XAUTRY", name: "Gold to TRY" },
    { symbol: "XAUIDRG", name: "Gold to IDRG" },
  ];

  // Initialize the topCryptos state when the component mounts
  useEffect(() => {
    setTopCryptos(goldPairs);
    // Set default selected pair
    if (goldPairs.length > 0) {
      setSelectedPair(goldPairs[0].symbol);
      setCryptoData(goldPairs[0]);
    }
  }, []);  // Empty dependency array ensures this only runs once

  const handleDropdownSelect = (pairSymbol) => {
    const selected = goldPairs.find(pair => pair.symbol === pairSymbol);
    setSelectedPair(pairSymbol);
    setCryptoData(selected);  // Set the specific pair's data
  };

  const handleTrade = (action) => {
    if (selectedPair) {
      setTradeType(action);
      setTradePopupOpen(true);
    }
  };

  return (
    <div className="mx-auto pb-80" style={{ width: "100vw", height: "140vh" }}>
      <GoldChart symbol={selectedPair} />
      <div className="select-and-buysell">
        <div
          className="bg-gray-800 p-6 w-full rounded-lg shadow-md mb-6 selected-crypto-main"
          style={{ width: "100%" }}
        >
          <h4 className="text-xl font-semibold mb-4" style={{ color: "gray" }}>
            Select Gold Pair
          </h4>
          <div className="w-full" style={{width:"90%",margin:"auto"}}>
            <select
              onChange={(e) => handleDropdownSelect(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              value={selectedPair}
            >
              <option value="" disabled>
                Select a Gold Pair
              </option>
              {topCryptos.map((pair) => (
                <option key={pair.symbol} value={pair.symbol}>
                  {pair.name} ({pair.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="selected-crypto-buttons-container mt-4" style={{width:"90%",margin:"auto",marginTop:"20px"}}>
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

      <BottomNavigation />
      <TradePopup
        cryptoData={cryptoData}  // Passing selected crypto data
        isOpen={isTradePopupOpen}
        onClose={() => setTradePopupOpen(false)}
        tradeType={tradeType}
      />
    </div>
  );
};

export default GoldTradingPage;