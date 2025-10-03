import React, { useEffect, useState } from "react";
import {  HiUserCircle ,HiClipboardList} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FaHeart } from 'react-icons/fa';

export default function Navbar() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const access = Cookies.get("access");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (access) {
        try {
          const res = await axios.get("http://localhost:8000/api/user/profile/", {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
          setProfileImage(res.data.profile_image);
          setUserName(res.data.name);
        } catch (error) {
          console.error("Failed to load profile:", error);
          Cookies.remove("access");
          Cookies.remove("refresh");
          setProfileImage(null);
          setUserName("");
        }
      }
    };

    fetchProfile();
  }, [access]);

  const handleLogout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    setProfileImage(null);
    setUserName("");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600">NearNest</Link>

      <div className="flex items-center space-x-4 text-gray-600 text-xl relative">
                
          {access ? (
              <Link
               to="/add"
                className="hidden sm:inline-block px-5 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
               List Property
              </Link>
              ) : (
            <Link
                to="/login"
                className="hidden sm:inline-block px-5 py-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                   >
                  List Property
               </Link>
              ) }
              <Link to="/mypost" className="flex flex-col items-center text-sm">
                      <HiClipboardList className="text-3xl mb-1" />
                    </Link>

                         <Link to="/favorites" className="flex flex-col items-center text-sm">
                      <FaHeart className="text-2xl  mb-1   " />
                    </Link>

        {access ? (
          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Link to="/profile" className="flex items-center space-x-2">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <HiUserCircle className="text-3xl mb-1" />
                )}
                <span className="text-sm font-medium">{userName}</span>
              </Link>
            </div>

            {/* Dropdown on hover */}
            <div className="absolute top-10 right-0 w-24 bg-white border rounded-md shadow-md hidden group-hover:block z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <HiUserCircle className="text-3xl mb-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
