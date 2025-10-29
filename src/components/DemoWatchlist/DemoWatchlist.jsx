import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const cryptoIconMap = {
  btc: "bitcoin.png",
  eth: "ethereum.png",
  bnb: "bnb.png",
  bcc: "bitconnect.png",
  ltc: "LTC.png",
  xrp: "xrp.png",
  ada: "cardano.png",
  sol: "sol.png",
  doge: "dogecoin.png",
  dot: "polkadot.png",
  matic: "polygon.png",
  shib: "shiba.png",
  avax: "avalanche.png",
  trx: "trx.png",
  xlm: "stellar.png",
  link: "link.png",
  neo: "neo.png",
  eos: "eos.png",
  tusd: "tusd.png",
  iota: "iota.png",
  qtum: "qtum.png",
  icx: "icx.png",
  ven: "https://cryptologos.cc/logos/vechain-vet-logo.png",
  nuls: "https://cryptologos.cc/logos/nuls-nuls-logo.png",
  vet: "vechain.png",
  ont:"ont.png"
};

const defaultIconUrl = "https://via.placeholder.com/32"; // Placeholder image URL

const DemoWatchlist = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchCryptoData = async () => {
    try {
      const marketUrl = "https://api.binance.com/api/v3/ticker/24hr";
      const { data } = await axios.get(marketUrl);

      const topCryptos = data
        .filter((coin) => coin.symbol.endsWith("USDT"))
        .slice(0, 15)
        .map((coin) => ({
          id: coin.symbol.replace("USDT", "").toLowerCase(),
          name: coin.symbol.replace("USDT", ""),
          symbol: coin.symbol.replace("USDT", ""),
          current_price: parseFloat(coin.lastPrice),
          lowPrice: parseFloat(coin.lowPrice),
          highPrice: parseFloat(coin.highPrice),
          price_change_percentage_24h: parseFloat(coin.priceChangePercent),
        }));

      // Fetch candlestick (OHLC) data
      const promises = topCryptos.map(async (coin) => {
        try {
          const chartUrl = `https://api.binance.com/api/v3/klines?symbol=${coin.symbol}USDT&interval=5m&limit=40`;
          const { data: chartData } = await axios.get(chartUrl);
          return {
            ...coin,
            sparkline: chartData.map(([timestamp, open, high, low, close]) => ({
              time: new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              price: parseFloat(close),
            })),
          };
        } catch (error) {
          console.error(`Error fetching chart for ${coin.symbol}:`, error);
          return { ...coin, sparkline: [] };
        }
      });

      const cryptoWithChart = await Promise.all(promises);
      setCryptoData(cryptoWithChart);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
    setLoading(false); // Hide the spinner after data fetch
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen w-screen pb-16" style={{ width: "calc(100vw - 16px)" }}>
      <div className="px-5 w-full mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {cryptoData.map((coin) => (
              <Link
                to={`/demo-crypto/${coin.id}`}
                state={{ cryptoData: coin }}
                key={coin.id}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center w-full"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cryptoIconMap[coin.id] || defaultIconUrl}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultIconUrl;
                    }} // Fallback on error
                  />
                  <h3 className="text-lg font-bold">{coin.name}</h3>
                </div>

                {/* Center - Fixed Sparkline Chart */}
                <div className="w-32 h-10 flex items-center">
                  {coin.sparkline.length > 0 ? (
                    <ResponsiveContainer width="100%" height={40}>
                      <LineChart data={coin.sparkline}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={["dataMin", "dataMax"]} hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#333",
                            color: "white",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={
                            coin.price_change_percentage_24h >= 0
                              ? "green"
                              : "red"
                          }
                          strokeWidth={2}
                          dot={false}
                          animationDuration={500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No Data</p>
                  )}
                </div>

                {/* Right Side - Price & Change */}
                <div className="flex flex-col items-end">
                  <p className="text-xl font-semibold">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                      `$${coin.current_price.toFixed(2)}`
                    )}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoWatchlist;
