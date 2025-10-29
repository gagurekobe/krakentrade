import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useLocation } from "react-router-dom";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

const AdvancedChart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");


  const { symbol } = location.state.cryptoData || {};
  const coin = location.state.cryptoData;


  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 5000); // Auto-refresh every 5 seconds
    setSelectedCrypto(symbol);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const fetchCryptoData = async () => {
    try {
      const symbol = selectedCrypto.toUpperCase() + "USDT";

      const marketResponse = await axios.get(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      );
      const chartResponse = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=100`
      );

      if (!marketResponse.data || !chartResponse.data)
        throw new Error("Invalid crypto ID or data unavailable");

      setCryptoData({
        name: selectedCrypto.toUpperCase(),
        symbol: selectedCrypto,
        current_price: parseFloat(marketResponse.data.lastPrice),
        price_change_percentage_24h: parseFloat(
          marketResponse.data.priceChangePercent
        ),
        high: parseFloat(marketResponse.data.highPrice),
        low: parseFloat(marketResponse.data.lowPrice),
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (!symbol) {
      return;
    }

    setIsLoading(true);

    // Remove the existing chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create a new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: "#D9D9D9",
        background: { type: "solid", color: "#080808" },
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#363C4E" },
      },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      backgroundColor: "#080808",
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const fetchInitialData = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=1d&limit=365`
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        const formatted = data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));


        candleSeriesRef.current.setData(formatted);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_1m`
    );

    ws.onopen = () => {};
    ws.onerror = (error) => {};
    ws.onclose = () => {};

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      const candlestick = msg.k;

      candleSeriesRef.current.update({
        time: candlestick.t / 1000,
        open: parseFloat(candlestick.o),
        high: parseFloat(candlestick.h),
        low: parseFloat(candlestick.l),
        close: parseFloat(candlestick.c),
      });
    };

    // Responsive resize
    const observer = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          backgroundColor: "#080808",
        });
      }
    });
    observer.observe(chartContainerRef.current);

    // Cleanup on unmount or symbol change
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      observer.disconnect();
      chart.remove();
    };
  }, [symbol]);

  return (
    <div
      className="relative"
      style={{ height: "100vh", backgroundColor: "#080808" }}
    >
      <Navbar />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 z-10">
          Chart: {symbol.toUpperCase()} — Loading...
        </div>
      )}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h3 className="text-2xl font-bold">{coin.symbol}</h3>
        <div className="flex gap-6 text-lg">
          <p className="text-gray-400">
            Low <span className="text-red-400">${coin.lowPrice}</span>
          </p>
          <p className="text-gray-400">
            High <span className="text-green-400">${coin.highPrice}</span>
          </p>
        </div>
      </div>
      <div className="text-center py-4">
        <p className="text-green-400 text-3xl">${coin.current_price}</p>
        <p
          className={`text-xl ${
            coin.price_change_percentage_24h >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {coin.price_change_percentage_24h}%
        </p>
      </div>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#080808", // Dark background for the chart container
        }}
      />
      <BottomNavigation />
    </div>
  );
};

export default AdvancedChart;