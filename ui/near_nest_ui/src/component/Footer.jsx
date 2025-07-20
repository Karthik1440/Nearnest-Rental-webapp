import React from "react";
import {
  HiHome,
  HiChatAlt2,
  HiClipboardList,
  HiUserCircle,
  HiPlusCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-cyan-100 border-t border-gray-200 flex justify-around items-center py-2 text-gray-700 text-center">
      
      {/* Home */}
      <Link to="/" className="flex flex-col items-center text-sm">
        <HiHome className="text-3xl mb-1" />
        <span>Home</span>
      </Link>

      {/* Chat */}
      <Link to="/chat" className="flex flex-col items-center text-sm">
        <HiChatAlt2 className="text-3xl mb-1" />
        <span>Chat</span>
      </Link>

      {/* Add */}
      <Link to="/add" className="flex flex-col items-center text-sm text-blue-600">
        <HiPlusCircle className="text-4xl mb-1" />
        <span>Add</span>
      </Link>

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
