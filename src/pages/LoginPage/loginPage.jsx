import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from "../../controllers/authController";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = { email, loginPassword };

    try {
      await loginUser(userData, navigate);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error?.message || 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#0f172a] p-0">
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg m-4 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2 text-left" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2 text-left" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="flex items-center justify-between mt-6">
              <Link to="/resetPassword" className="text-green-400 hover:text-green-300 text-sm font-medium">
                Forgot Password?
              </Link>
              <Link to='/register' className="text-green-400 hover:text-green-300 text-sm font-medium">
                Create Account
              </Link>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              By signing in, you agree to our{' '}
              <Link to="/terms-of-service" className="text-green-400 hover:text-green-300">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" className="text-green-400 hover:text-green-300">Privacy Policy</Link>
            </p>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-green-900 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-white mb-4">Kraken Trading Platform</h2>
              <p className="text-xl text-gray-300">Trade smarter, earn faster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;