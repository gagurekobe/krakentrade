import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../controllers/authController";
import Swal from "sweetalert2";

const Register = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [fundsPassword, setFundsPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (loginPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "The passwords you entered do not match.",
        confirmButtonColor: "#ef4444", // Tailwind red-500
      });
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      loginPassword,
      fundsPassword,
    };
    setLoading(true);
    await registerUser(userData, navigate);
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#0f172a] p-0 overflow-y-auto">
        <div className="w-full max-w-md bg-[#0c1221] p-6 rounded-lg pb-20 pt-20">
          <h2 className="text-white text-2xl font-semibold text-center mb-6 mt-8">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Input fields for registration */}
            <div className="flex flex-row gap-4 mb-2">
              {/* First Name */}
              <div className="flex flex-col items-start w-full">
                <label className="text-white block ml-2 mb-2">First name</label>
                <input
                  type="text"
                  placeholder="Input First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 bg-gray-900 text-white rounded-md"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col items-start w-full">
                <label className="text-white block ml-2 mb-2">Last name</label>
                <input
                  type="text"
                  placeholder="Input Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 bg-gray-900 text-white rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-white block ml-1">Email</label>
              <input
                type="email"
                placeholder="Input Email Account"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-white block ml-1">Phone number</label>
              <input
                type="text"
                placeholder="phone number e.g +1 8384 8990 5364"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-white block ml-1">Login Password</label>
              <input
                type="password"
                placeholder="Set Login Password (8+ characters)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-white block ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Login Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-white block ml-1">Funds Password</label>
              <input
                type="password"
                placeholder="Set Funds Password (6-digit number)"
                value={fundsPassword}
                onChange={(e) => setFundsPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white rounded-md"
              />
            </div>
            <p className="text-white text-center gap-2 mt-3 mb-2">
              Already have an account?{" "}
              <Link to="/login">
                <a className="text-blue-400">Go to login</a>
              </Link>
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
