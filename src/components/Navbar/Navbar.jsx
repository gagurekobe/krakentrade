import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const location = useLocation(); // Get the current route

  return (
    <nav className="navbar">
      {/* Left Section - Logo & Links */}
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />

        <div className="navbar-links">
          <Link
            to="/home"
            className={`navbar-link ${location.pathname === "/home" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/trade"
            className={`navbar-link ${location.pathname === "/trade" ? "active" : ""}`}
          >
            Trade
          </Link>

          <Link
            to="/market"
            className={`navbar-link ${location.pathname === "/market" ? "active" : ""}`}
          >
            Market
          </Link>

          <Link
            to="/news"
            className={`navbar-link ${location.pathname === "/news" ? "active" : ""}`}
          >
            News
          </Link>
          <Link
            to="/demo"
            className={`navbar-link ${location.pathname === "/demo" ? "active" : ""}`}
          >
            Demo
          </Link>
        </div>
      </div>

      {/* Right Section - Welcome, Menu, Profile */}
      <div className="navbar-right">
        <button className="welcome-button">
          <span className="welcome-text">🔊 Welcome to the Kraken</span>
        </button>

        {/* Clickable Avatar - Navigate to Profile Page */}
        <Link to="/profile">
          <img
            src="/profile.png"
            alt="Profile"
            className="profile-avatar"
          />
        </Link>

{/*         <FaGlobe className="globe-icon" /> */}
      </div>
    </nav>
  );
};

export default Navbar;
