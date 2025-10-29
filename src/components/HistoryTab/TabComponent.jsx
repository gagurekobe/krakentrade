import React, { useState } from 'react';
import DepositHistory from '../DepositHistory/DepositHistory';
import WithdrawalHistory from '../WithdrawalHistory/WithdrawalHistory';
import Navbar from '../Navbar/Navbar';
import BuySellHistory from '../BuySellHistory/BuySellHistory';
import TradeHistory from '../TradeHistory/TradeHistory'

const TabComponent = () => {
  const tabs = ['Withdrawals','Trades', 'Deposits', 'Buy', 'Sell'];
  const [activeTab, setActiveTab] = useState('Withdrawals');

  const renderContent = () => {
    switch (activeTab) {
      case 'Withdrawals':
        return <WithdrawalHistory />;
      case 'Deposits':
        return <DepositHistory />;
        case 'Trades':
        return <TradeHistory />;
      case 'Buy':
        return <BuySellHistory tradeType="Buy" />;
      case 'Sell':
        return <BuySellHistory tradeType="Sell" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen" style={{ width: "100vw" }}>
      <Navbar />
      <div className="flex justify-between border-b border-gray-700" style={{overflowX:"auto"}}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-center py-2 text-sm font-medium focus:outline-none relative
              ${activeTab === tab ? 'text-green-400' : 'text-gray-400'}
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <div style={{ width: "calc(100vw - 16px)" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default TabComponent;
