import React from "react";
import './Footer.css'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 footer-main-container" >
      <div className="container mx-auto px-6 md:px-12">
        {/* Flexbox for row layout on large screens */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 footer-main-container">
          {/* Company Info */}
          <div className="about-company-container">
            <h2 className="text-2xl font-semibold">KRAKEN</h2>
            <p className="mt-2 text-gray-400">
            Our crypto trading system offers a seamless experience for buying, selling, and managing digital currencies. With real-time market data, secure transactions, and a user-friendly interface, traders can make informed decisions and execute trades with confidence. Whether you're a beginner or an experienced trader, our platform provides all the tools you need for successful cryptocurrency trading.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-listitem-contents">
            <h3 className="text-gray-500 font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/home" className="text-gray-400 hover:text-white">Homepage</a></li>
              <li><a href="/market" className="text-gray-400 hover:text-white">Market</a></li>
              <li><a href="/trade" className="text-gray-400 hover:text-white">Trade</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-white">Get latest News</a></li>
            </ul>
          </div>

          {/* Subscribe to Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
            <p className="mt-2 text-gray-400">Get the latest updates right in your inbox.</p>
            <div className="mt-4 flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full md:w-auto px-4 py-2 rounded-l-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-md text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Kraken. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
