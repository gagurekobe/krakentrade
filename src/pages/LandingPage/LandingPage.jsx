import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBitcoin, FaChartLine, FaShieldAlt, FaExchangeAlt, FaUsers, FaMobileAlt, FaEthereum } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importing Link for routing

const features = [
  { icon: <FaBitcoin size={40} />, title: "Real-Time Trading", desc: "Execute trades instantly with our high-speed trading engine." },
  { icon: <FaChartLine size={40} />, title: "Advanced Analytics", desc: "Make informed decisions with our AI-powered market insights." },
  { icon: <FaShieldAlt size={40} />, title: "Secure Transactions", desc: "Your funds are protected with top-tier encryption and security." },
  { icon: <FaExchangeAlt size={40} />, title: "Low Transaction Fees", desc: "Enjoy some of the lowest fees in the industry." },
  { icon: <FaUsers size={40} />, title: "Community Support", desc: "Engage with our active trading community for insights and help." },
  { icon: <FaMobileAlt size={40} />, title: "Mobile Trading", desc: "Trade on the go with our fully responsive website in mobile phones." },
];

const LandingPage = () => {
    const bnb = "bnb.png";
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: null,
    ETH: null,
    BNB: null,
  });

  const [priceChanges, setPriceChanges] = useState({
    BTC: null,
    ETH: null,
    BNB: null,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"),
        ]);
        
        const data = await Promise.all(response.map(res => res.json()));

        setCryptoPrices({
          BTC: parseFloat(data[0].price).toFixed(2),
          ETH: parseFloat(data[1].price).toFixed(2),
          BNB: parseFloat(data[2].price).toFixed(2),
        });

        const changes = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT"),
          fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT"),
        ]);
        
        const changeData = await Promise.all(changes.map(res => res.json()));
        setPriceChanges({
          BTC: parseFloat(changeData[0].priceChangePercent).toFixed(2),
          ETH: parseFloat(changeData[1].priceChangePercent).toFixed(2),
          BNB: parseFloat(changeData[2].priceChangePercent).toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-6 bg-transparent backdrop-blur-md">
        <div className="flex items-center text-2xl font-bold text-yellow-400">
          <img src="/logo.png" width = {90} height = {90} />
          <h2>KRAKEN</h2>
        </div>
        <Link to='/login'>
          <button className="px-4 py-2 bg-blue-500 rounded font-semibold shadow-lg hover:bg-blue-600" style={{width:"120px",background:"green",color:"white"}}>
            Login
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="text-center mt-24"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 mt-10">
          Next-Gen Crypto Trading
        </h2>
        <p className="mt-4 text-lg text-gray-300 ml-5 mr-5">
          Trade smarter with AI-driven insights and lightning-fast execution.
        </p>
              {/* Watchlist Section */}
      <div className="mt-16 w-full text-center">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 ml-5 mr-5">
          {Object.keys(cryptoPrices).map((crypto, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {crypto === "BTC" && <FaBitcoin size={40} className="text-yellow-400" />}
                  {crypto === "ETH" && <FaEthereum size={40} className="text-blue-400" />}
                  {crypto === "BNB" && <img src={bnb} alt="XRP Icon" className="w-8 h-8" />}
                  <h4 className="text-xl font-semibold text-white mr-1">{crypto} |</h4>
                </div>
                <div className="text-lg text-green-400"> {cryptoPrices[crypto]} USD</div>
              </div>
              <div className={`mt-2 text-lg ${priceChanges[crypto] > 0 ? "text-green-500" : "text-red-500"}`}>
                {priceChanges[crypto]}%
              </div>
            </div>
          ))}
        </div>
      </div>
        <Link to='/register'>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-lg hover:bg-blue-600"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
      
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-20 ml-5 mr-5" style={{width:"88%"}}>
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-gray-800 p-6 rounded-lg text-center shadow-xl"
          >
            <div className="flex justify-center text-yellow-400 mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400 mt-2">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Footer Section */}
      <footer className="mt-16 w-full bg-gray-900 p-6 text-center text-gray-400 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Kraken. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
