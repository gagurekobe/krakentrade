import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react"; // Importing Plus Icon
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import Navbar from "../Navbar/Navbar";
import './Identity.css';
import config from "../../config";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Identity = () => {
  const [documentType, setDocumentType] = useState("Identity Card");
  const [realName, setRealName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [status, setStatus] = useState(""); 
  const [formVisible, setFormVisible] = useState(false); 
  const [loading, setLoading] = useState(false);  // <-- loading state added
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchIdentityStatus = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/identity/identity-status`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setStatus(data.identity.status);
      } catch (error) {
        // Error handling without console.log
      }
    };

    fetchIdentityStatus();
  }, []);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      type === "front" ? setFrontImage(file) : setBackImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "Pending" || status === "Verified") {
      Swal.fire({
        title: 'Info',
        text: 'You have already uploaded your identity document!',
        icon: 'info',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile");
        }
      });
      return;
    }

    // Show loading spinner on button
    setLoading(true);

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("realName", realName);
    formData.append("documentNumber", documentNumber);
    formData.append("status", "Pending");
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/identity/verify-identity`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          // Do not set Content-Type with FormData
        },
        body: formData,
      });

      setLoading(false); // stop loading after response

      if (response.ok) {
        setStatus("Pending");
        Swal.fire({
          title: 'Success!',
          text: 'Identity document uploaded successfully...',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            setFormVisible(false);
            navigate("/profile");
          }
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.message || 'Failed to upload identity document.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

    } catch (error) {
      setLoading(false); // stop loading on error too
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col" style={{ width: "100vw" }}>
      <Navbar />
      <form onSubmit={handleSubmit} className="identity-form-container">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Document Type</label>
            <select
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="Identity Card">Identity Card</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Real Name</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              placeholder="Enter real name"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Document Number</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
            placeholder="Please enter document number"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </div>

        <div className="mt-4 document-upload-main-container">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative identity-upload-container">
              <input
                type="file"
                className="hidden"
                id="front-upload"
                onChange={(e) => handleFileUpload(e, "front")}
              />
              <label
                htmlFor="front-upload"
                className="block bg-gray-700 p-4 rounded-lg text-center cursor-pointer border border-gray-600 flex items-center justify-center aspect-[4/3]"
              >
                <img
                  src={frontImage ? URL.createObjectURL(frontImage) : "/uploadFront.jpg"}
                  alt="Front"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Plus className="absolute text-white bg-gray-800 p-1 rounded-full" size={24} />
              </label>
              <p className="text-center text-gray-400 text-sm mt-2">Front</p>
            </div>

            <div className="relative identity-upload-container">
              <input
                type="file"
                className="hidden"
                id="back-upload"
                onChange={(e) => handleFileUpload(e, "back")}
              />
              <label
                htmlFor="back-upload"
                className="block bg-gray-700 p-4 rounded-lg text-center cursor-pointer border border-gray-600 flex items-center justify-center aspect-[4/3]"
              >
                <img
                  src={backImage ? URL.createObjectURL(backImage) : "/uploadBack.png"}
                  alt="Back"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Plus className="absolute text-white bg-gray-800 p-1 rounded-full" size={24} />
              </label>
              <p className="text-center text-gray-400 text-sm mt-2">Back</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      <BottomNavigation />
    </div>
  );
};

export default Identity;