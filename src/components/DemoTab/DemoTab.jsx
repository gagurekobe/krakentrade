import React, { useState } from 'react';
import Demo from '../Demo/Demo';
import Navbar from '../Navbar/Navbar';
import { ForexTrading } from '../../pages/ForexTrading/ForexTrading';
import GoldTradingPage from '../GoldTrading/GoldTrading';

const DemoTab = () => {
  const tabs = ['Crypto','Forex', 'Gold'];
  const [activeTab, setActiveTab] = useState('Crypto');

  const renderContent = () => {
    switch (activeTab) {
      case 'Crypto':
        return <Demo/>;
      case 'Forex':
        return <ForexTrading/>;
        case 'Gold':
        return <GoldTradingPage/>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen" style={{ width: "100vw" }}>
        <Navbar/>
      <div className="flex justify-between border-b border-gray-700" style={{overflowX:"auto"}}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-center text-sm font-medium focus:outline-none relative
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

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DemoTab;
