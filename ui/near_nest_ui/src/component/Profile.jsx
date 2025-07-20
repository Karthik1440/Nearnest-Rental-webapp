import React, { useState, useEffect } from "react";
import {
  HiCog,
  HiQuestionMarkCircle,
  HiGlobe,
  HiCreditCard,
  HiLocationMarker,
  HiCamera,
} from "react-icons/hi";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

// Reusable Menu Item with optional routing
const MenuItem = ({ icon, label, to = "#" }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-blue-500 transition"
  >
    <span>{icon}</span>
    <span className="text-sm sm:text-base">{label}</span>
  </Link>
);

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);

  // Load from localStorage if available (optional)
  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved) setProfileImage(saved);
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result); // optional for demo
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="w-full max-w-md mx-auto p-6 mt-6 mb-20 sm:mb-24 sm:bg-white sm:rounded-xl sm:shadow-md">
          {/* Profile Section */}
          <div className="flex flex-col items-center relative">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-2">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-500">👤</span>
              )}

              {/* Camera Icon Overlay */}
              <label
                htmlFor="profileUpload"
                className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100"
              >
                <HiCamera className="text-gray-700 text-lg" />
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <h2 className="text-lg font-semibold">Name</h2>
            <button className="text-blue-500 text-sm hover:underline">View and edit</button>
          </div>

          {/* Menu List */}
          <div className="mt-6 space-y-4">
            <MenuItem icon={<HiCog className="text-xl" />} label="Settings" to="/settings" />
            <MenuItem icon={<HiQuestionMarkCircle className="text-xl" />} label="Help & Support" to="/help" />
            <MenuItem icon={<HiGlobe className="text-xl" />} label="Select Language" to="/language" />
            <MenuItem icon={<HiCreditCard className="text-xl" />} label="Subscription Plan" to="/plan" />
            <MenuItem icon={<HiLocationMarker className="text-xl" />} label="Location" to="/location" />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
