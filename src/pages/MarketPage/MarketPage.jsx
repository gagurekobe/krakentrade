import React, { useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import MarketOverview from './MarketOverview';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";


const MarketWidget = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Your login session expired, You need to log in again',
      confirmButtonColor: '#22c55e', // Tailwind green-500
    }).then(() => {
      navigate("/login"); // Redirect to login after closing the alert
    });
  }
}, [navigate]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      title: 'Cryptocurrencies',
      title_raw: 'Cryptocurrencies',
      title_link: '/markets/cryptocurrencies/prices-all/',
      width: '100%',
      height: '100%',
      locale: 'en',
      showSymbolLogo: true,
      colorTheme: 'dark',
      symbolsGroups: [
        {
          name: 'Overview',
          symbols: [
            { name: 'CRYPTOCAP:TOTAL' },
            { name: 'BITSTAMP:BTCUSD' },
            { name: 'BITSTAMP:ETHUSD' },
            { name: 'COINBASE:SOLUSD' },
            { name: 'BINANCE:AVAXUSD' },
            { name: 'COINBASE:UNIUSD' }
          ]
        },
        {
          name: 'Bitcoin',
          symbols: [
            { name: 'BITSTAMP:BTCUSD' },
            { name: 'COINBASE:BTCEUR' },
            { name: 'COINBASE:BTCGBP' },
            { name: 'BITFLYER:BTCJPY' },
            { name: 'BMFBOVESPA:BIT1!' }
          ]
        },
        {
          name: 'Ethereum',
          symbols: [
            { name: 'BITSTAMP:ETHUSD' },
            { name: 'KRAKEN:ETHEUR' },
            { name: 'COINBASE:ETHGBP' },
            { name: 'BITFLYER:ETHJPY' },
            { name: 'BINANCE:ETHBTC' },
            { name: 'BINANCE:ETHUSDT' }
          ]
        },
        {
          name: 'Solana',
          symbols: [
            { name: 'COINBASE:SOLUSD' },
            { name: 'BINANCE:SOLEUR' },
            { name: 'COINBASE:SOLGBP' },
            { name: 'BINANCE:SOLBTC' },
            { name: 'COINBASE:SOLETH' },
            { name: 'BINANCE:SOLUSDT' }
          ]
        },
        {
          name: 'Uniswap',
          symbols: [
            { name: 'COINBASE:UNIUSD' },
            { name: 'KRAKEN:UNIEUR' },
            { name: 'COINBASE:UNIGBP' },
            { name: 'BINANCE:UNIBTC' },
            { name: 'KRAKEN:UNIETH' },
            { name: 'BINANCE:UNIUSDT' }
          ]
        }
      ]
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="h-screen bg-black text-white mb-40 p-0">
      <Navbar/>
      <MarketOverview/>
      <div className="tradingview-widget-container" ref={containerRef}></div>
      
      <BottomNavigation/>
    </div>
  );
};

export default MarketWidget;
