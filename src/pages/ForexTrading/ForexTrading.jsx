import React, { useEffect, useState } from 'react';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import TradePopup from '../../components/TradePopup/TradePopup';
import ForexChart from '../../components/Chart/ForexChart';

export function ForexTrading() {
    const [selectedPair, setSelectedPair] = useState("EURUSD");
    const [tradeType, setTradeType] = useState("Buy"); // Default to Buy
    const [isTradePopupOpen, setTradePopupOpen] = useState(false);
    const [cryptoData, setCryptoData] = useState(null); 
    const [topCryptos, setTopCryptos] = useState([]);
  
    // Define the pairs manually
    const goldPairs = [
      { symbol: "EURUSD", name: "EUR to USD" },
      { symbol: "USDJPY", name: "USD to JPY" },
      { symbol: "GBPUSD", name: "GBP to USD" },
      { symbol: "AUDUSD", name: "AUD to USD" },
      { symbol: "USDCAD", name: "USD to CAD" },
      { symbol: "USDCHF", name: "USD to CHF" },
      { symbol: "EURGBP", name: "EUR to GBP" },
      { symbol: "EURJPY", name: "EUR to JPY" },

      { symbol: "GBPJPY", name: "GBP to JPY" },
      { symbol: "CADJPY", name: "CAD to JPY" },
      { symbol: "GBPCAD", name: "GBP to CAD" },
      { symbol: "EURCAD", name: "EUR to CAD" },
      { symbol: "USDMXN", name: "USD to MXN" },
      { symbol: "USDSEK", name: "USD to SEK" },
      { symbol: "USDZAR", name: "USD to ZAR" },
      { symbol: "EURTRY", name: "EUR to TRY" },
      { symbol: "EURNOK", name: "EUR to NOK" },
      { symbol: "GBPPLN", name: "GBP to PLN" },
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
    <div className="bg-gray-900 text-white rounded shadow mx-auto mb-80" style={{width:"100vw",height:"100vh"}}>
      <ForexChart symbol={selectedPair} />
      <div
            className="bg-gray-800 p-6 w-full rounded-lg shadow-md mb-6 selected-crypto-main"
            style={{ width: "100%" }}
          >
      <div className="mb-4" style={{width:"90%",margin:"auto"}}>
        <label className="block mb-1 font-semibold">Select Pair</label>
        <select
              onChange={(e) => handleDropdownSelect(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
              value={selectedPair}
            >
              <option value="" disabled>
                Select a Forex Pair
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
            
      <BottomNavigation/>
      <TradePopup
        cryptoData={cryptoData}  // Passing selected crypto data
        isOpen={isTradePopupOpen}
        onClose={() => setTradePopupOpen(false)}
        tradeType={tradeType}
      />
    </div>
  );
}