import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import Navbar from '../Navbar/Navbar';
import { ToastContainer, toast } from "react-toastify";
import config from '../../config';
import Swal from 'sweetalert2';

const ChangePassword = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token'); // Retrieve authentication token
      const response = await axios.post(
        `${config.BACKEND_URL}/api/auth/change-password`,
        { ...formData, type: activeTab },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        confirmButtonColor: '#22c55e', // Tailwind green-500
      });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

    
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
        confirmButtonColor: '#ef4444', // Tailwind red-500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col" style={{ width: '100vw' }}>
      <Navbar />
      <div className="bg-gray-800 rounded-lg shadow-lg w-full p-6 flex-grow">
        <div className="flex mb-6 border-b border-gray-600 pb-3">
          <div
            onClick={() => handleTabClick('login')}
            className={`flex-1 text-center py-2 cursor-pointer font-semibold ${
              activeTab === 'login' ? 'text-white border-b-2 border-green-500' : 'text-gray-400'
            }`}
          >
            Login Password
          </div>
          <div
            onClick={() => handleTabClick('transaction')}
            className={`flex-1 text-center py-2 cursor-pointer font-semibold ${
              activeTab === 'transaction' ? 'text-white border-b-2 border-green-500' : 'text-gray-400'
            }`}
          >
            Transaction Password
          </div>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form-container">
          <div>
            <label className="block text-gray-300 text-left">
              {activeTab === 'login' ? 'Original Password' : 'Transaction Password'}
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              placeholder={activeTab === 'login' ? 'Enter the original password' : 'Enter the transaction password'}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-left">
              {activeTab === 'login' ? 'New Password' : 'New Transaction Password'}
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              placeholder={activeTab === 'login' ? 'Enter the new password (8 or more characters)' : 'Enter the new transaction password'}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-left">
              {activeTab === 'login' ? 'Confirm Password' : 'Confirm Transaction Password'}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-500"
              placeholder={activeTab === 'login' ? 'Re-enter the new password' : 'Re-enter the new transaction password'}
              required
            />
          </div>

          {message && <p className="mt-4 text-center text-white">{message}</p>}

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Modification'}
          </button>
        </form>
      </div>
      <BottomNavigation />
      <ToastContainer/>
    </div>
  );
};

export default ChangePassword;
