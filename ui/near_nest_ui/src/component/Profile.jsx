import React, { useState, useEffect } from "react";
import {
  HiCog,
  HiQuestionMarkCircle,
  HiGlobe,
  HiCreditCard,
  HiLocationMarker,
  HiCamera,
  HiTrash,
  HiLogout,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { TbDevicesQuestion } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const MenuItem = ({ icon, label, to = "#", onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-blue-500 transition"
  >
    <span>{icon}</span>
    {to !== "#" ? (
      <Link to={to} className="text-sm sm:text-base">
        {label}
      </Link>
    ) : (
      <span className="text-sm sm:text-base">{label}</span>
    )}
  </div>
);

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("User");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");
    navigate("/");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: Cookies.get("refresh"),
      });
      Cookies.set("access", res.data.access, { expires: 1 });
      return res.data.access;
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err);
      return null;
    }
  };

  const loadUserProfile = async () => {
    try {
      const accessToken = Cookies.get("access");

      const res = await axios.get("http://localhost:8000/api/user/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUserName(res.data.name);
      setProfileImage(res.data.profile_image);
    } catch (err) {
      if (
        err.response?.data?.code === "token_not_valid" ||
        err.response?.status === 401
      ) {
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          Cookies.set("access", newAccess);
          loadUserProfile(); // Retry
        } else {
          handleLogout();
        }
      } else {
        console.error("Profile load error:", err);
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const access = Cookies.get("access");
    const refresh = Cookies.get("refresh");

    if (!access || !refresh) {
      handleLogout();
    } else {
      loadUserProfile();
    }
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await axios.patch(
        "http://localhost:8000/api/user/upload-profile-image/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfileImage(res.data.profile_image);
      alert("Profile image updated!");
    } catch (err) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        uploadImage(file);
      } else {
        alert("Upload failed");
        handleLogout();
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadImage(file);
  };

  const deleteImage = async () => {
    try {
      await axios.delete("http://localhost:8000/api/user/delete-profile-image/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("access")}`,
        },
      });
      setProfileImage(null);
      alert("Profile image deleted");
    } catch (err) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        deleteImage();
      } else {
        handleLogout();
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="w-full max-w-md mx-auto p-6 mt-6 mb-20 sm:mb-24 sm:bg-white sm:rounded-xl sm:shadow-md">
          <div className="flex flex-col items-center relative">
            <div
              className={`relative ${
                editing ? "w-36 h-36" : "w-24 h-24"
              } rounded-4xl bg-gray-200 overflow-hidden flex items-center justify-center mb-2 transition-all duration-300`}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-500">👤</span>
              )}

              {editing && (
                <>
                  <label
                    htmlFor="profileUpload"
                    className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100 z-10"
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

                  {profileImage && (
                    <button
                      onClick={deleteImage}
                      className="absolute top-1 left-1 p-1 bg-white rounded-full shadow text-red-600 hover:bg-gray-100 z-10"
                      title="Delete Image"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  )}
                </>
              )}
            </div>

            <h2 className="text-lg font-semibold">{userName}</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-blue-500 text-sm hover:underline"
            >
              {editing ? "Close" : "View and edit"}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <MenuItem
              icon={<FaHeart className="text-xl text-red-500" />}
              label="Favorites"
              to="/favorites"
            />
            <MenuItem icon={<HiCog className="text-xl" />} label="Settings" to="/settings" />
            <MenuItem icon={<HiQuestionMarkCircle className="text-xl" />} label="Help & Support" to="/help" />
            <MenuItem icon={<HiGlobe className="text-xl" />} label="Select Language" to="/language" />
            <MenuItem icon={<HiCreditCard className="text-xl" />} label="Subscription Plan" to="/plan" />
            <MenuItem icon={<HiLocationMarker className="text-xl" />} label="Location" to="/location" />
            <MenuItem icon={<HiLogout className="text-xl" />} label="Logout" onClick={handleLogout} />
            <MenuItem icon={<HiOutlineClipboardList className="text-xl" />}label="Visitor Enquiries"to="/visitor-enquiries"/>
            <MenuItem icon={<TbDevicesQuestion  className="text-xl" />}label="my requests"to="/my-enquiries"/>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
