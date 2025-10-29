import React, { useEffect, useRef } from 'react';
import './CryptoChart.css';

const CryptoChart = ({ symbol = 'BTCUSDT' }) => {
  const container = useRef(null);

  useEffect(() => {
    // Format symbol for TradingView (e.g., BTCUSDT -> BINANCE:BTCUSDT)
    const formattedSymbol = `BINANCE:${symbol}`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: formattedSymbol,
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          width: '100%',
          height: '700'
        });
      }
    };

    // Clean up previous script if it exists
    const existingScript = document.getElementById('tradingview-widget-script');
    if (existingScript) {
      existingScript.remove();
    }

    script.id = 'tradingview-widget-script';
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
      const scriptToRemove = document.getElementById('tradingview-widget-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [symbol]); // Reload when symbol changes

  return (
    <div className="crypto-chart">
      <div className="crypto-chart__header">
      </div>
      <div 
        ref={container}
        id={`tradingview_${symbol.toLowerCase()}`}
        className="crypto-chart__container"
      />
    </div>
  );
};

export default CryptoChart; 
