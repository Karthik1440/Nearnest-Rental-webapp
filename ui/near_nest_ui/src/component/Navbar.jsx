import React from "react";
import { HiBell, HiUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <div className="text-xl font-bold text-blue-600">NearNest</div>

      <input
        type="text"
        placeholder="Search"
        className="w-1/2 max-w-xs px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex items-center space-x-4 text-gray-600 text-xl">
        <Link to="/add" className="hidden sm:inline-block px-5 py-1 bg-blue-500 text-black rounded-md hover:bg-blue-700 transition">
      SELL
      </Link>
        <Link to="/notifications">
        <HiBell className="text-3xl mb-1" />
      </Link>
        <Link to="/profile">
        <HiUserCircle className="text-3xl mb-1" />
      </Link>
      </div>
    </div>
  );
}
