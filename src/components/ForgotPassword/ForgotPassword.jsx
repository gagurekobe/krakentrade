import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import config from "../../config";
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      newPassword,
    };

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'You can now log in with your new password.',
          confirmButtonColor: '#22c55e', // Tailwind green-500
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login'); // Redirect after user clicks OK
          }
        });
      } else {
        Swal.fire({
          icon: 'info', // You can change the icon based on the type of message
          title: 'Information', // You can modify this as per your context
          text: data.message,
          confirmButtonColor: '#3490dc', // Tailwind blue-500 or another color of your choice
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error', // Display an error icon
        title: 'Password Reset Failed',
        text: 'Failed to reset password. Please try again.',
        confirmButtonColor: '#ef4444', // Tailwind red-500 or another color of your choice
      });
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f172a]">
      <div className="w-90 max-w-md m-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-start gap-4">
            <label className="text-white block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white rounded-md"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-4 mt-4">
            <label className="text-white block">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-md text-lg mt-4" style={{background:"green"}}>
            Submit
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Remembered your password?{" "}
          <Link to='/login'>
            <span className="text-blue-400 hover:underline">Back to Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
