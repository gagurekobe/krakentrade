import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaNewspaper, FaUser, FaCoins } from "react-icons/fa";
import './BottomNavigation.css'; 

const BottomNavigation = () => {
  const location = useLocation(); // Get the current route

  return (
    <div className="bottom-navigation">
      <Link to="/home" className={`nav-item ${location.pathname === "/home" ? "active" : ""}`}>
        <FaHome className="nav-icon" />
        <span>Home</span>
      </Link>
      {/* <Link to="/staking" className={`nav-item ${location.pathname === "/staking" ? "active" : ""}`}>
        <FaCoins className="nav-icon" />
        <span>Staking</span>
      </Link> */}
      <Link to="/trade" className={`nav-item ${location.pathname === "/trade" ? "active" : ""}`}>
        <FaMoneyBillWave className="nav-icon" />
        <span>Trade</span>
      </Link>
      <Link to="/market" className={`nav-item ${location.pathname === "/market" ? "active" : ""}`}>
        <FaCoins className="nav-icon" />
        <span>Market</span>
      </Link>
      <Link to="/news" className={`nav-item ${location.pathname === "/news" ? "active" : ""}`}>
        <FaNewspaper className="nav-icon" />
        <span>News</span>
      </Link>
      <Link to="/demo" className={`nav-item ${location.pathname === "/demo" ? "active" : ""}`}>
        <FaMoneyBillWave className="nav-icon" />
        <span>Demo</span>
      </Link>
      <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
        <FaUser className="nav-icon" />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;