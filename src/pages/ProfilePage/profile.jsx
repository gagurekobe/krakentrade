import React, { useState } from "react";
import {
  FaUser,
  FaGift,
  FaShieldAlt,
  FaHistory,
  FaKey,
  FaChevronRight,
  FaSignOutAlt
} from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom"; // Importing Link for routing
import Navbar from "../../components/Navbar/Navbar"; 
import "./profile.css";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import PersonalProfile from '../../components/Wallet/personalProfile';

const ProfilePage = () => {
  const [activePage, setActivePage] = useState("personal-center"); // Default active page
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Optionally, navigate to the login page after logout
    navigate("/login");
  };

  return (
    <div className="bg-[#0a0f1f] min-h-screen text-white flex flex-col pb-14 w-[100vw]">

      {/* Full-width Navbar */}
      <Navbar />

      <div className="flex flex-row w-full flex-1 profile-page-container">
        {/* Placeholder for Main Content */}
        <div className="profile-main-content-container">
          <PersonalProfile />
        </div>
        {/* Sidebar */}
        <div className="w-72 bg-[#1a2235] p-0 h-fit rounded-xl profilePage-sidebar">
          <ul className="space-y-4">
            {/** Sidebar items */}
            {[ 
              {
                icon: <FaUser />,
                label: "Personal Center",
                key: "personal-center",
                path: "/personal-center",
              },
              {
                icon: <FaGift />,
                label: "Top-up Rewards",
                key: "top-up-rewards",
                path: "/topupRewards",
              },
              {
                icon: <FaShieldAlt />,
                label: "Real Name Authentication",
                key: "real-name-authentication",
                path: "/real-name-authentication",
              },
              {
                icon: <FaHistory />,
                label: "Spot History",
                key: "spot-history",
                path: "/spot-history",
              },
              {
                icon: <FaKey />,
                label: "Change Password",
                key: "change-password",
                path: "/changePassword",
              },
              {
                icon: <FaSignOutAlt />, // Logout icon
                label: "Logout",
                key: "logout",
                path: "/login", // Path can be set to the login page
                onClick: handleLogout, // Call the handleLogout function when clicked
              },
            ].map((item) => (
              <Link to={item.path} key={item.key} className="w-full">
                <li
                  className={`flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer ${
                    activePage === item.key
                      ? "bg-[#121a2a] text-green-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick(); // Call the onClick if provided
                    }
                    setActivePage(item.key);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.icon} {item.label}
                  </div>
                  <FaChevronRight className="text-gray-400" />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
