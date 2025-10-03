import React from "react";
import {
  HiHome,
  HiClipboardList,
  HiUserCircle,
  HiPlusCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';
import Cookies from "js-cookie";


export default function Footer() {
  
const access = Cookies.get("access");
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-cyan-100 border-t border-gray-200 flex justify-around items-center py-2 text-gray-700 text-center">
      
      {/* Home */}
      <Link to="/" className="flex flex-col items-center text-sm">
        <HiHome className="text-3xl mb-1" />
        <span>Home</span>
      </Link>

      {/* favarates*/}
     <Link to="/favorites" className="flex flex-col items-center text-sm">
  <FaHeart className="text-3xl mb-1" />
  <span>Favorites</span>
</Link>

      {/* Add */}
     {access ? (
     <Link to="/add" className="flex flex-col items-center text-sm text-blue-600">
       <HiPlusCircle className="text-4xl mb-1" />
        <span>Add</span>
      </Link>
     ) : (
     <Link to="/login" className="flex flex-col items-center text-sm text-blue-600">
        <HiPlusCircle className="text-4xl mb-1" />
       <span>Add</span>
     </Link>
     )}

      {/* My Ads */}
      <Link to="/mypost" className="flex flex-col items-center text-sm">
        <HiClipboardList className="text-3xl mb-1" />
        <span>My Post</span>
      </Link>

      {/* Profile */}
      <Link to="/profile" className="flex flex-col items-center text-sm">
        <HiUserCircle className="text-3xl mb-1" />
        <span>Profile</span>
      </Link>
      
    </div>
  );
}
