import React, { useState, useRef, useEffect } from "react";

const cities = [
  { name: "Bangalore", icon: "/icons/skyline-2.svg" },
  { name: "Delhi", icon: "/icons/skyline-2.svg"},
  { name: "Faridabad", icon: "/icons/faridabad.svg" },
  { name: "Ghaziabad", icon: "/icons/ghaziabad.svg" },
  { name: "Greater Noida", icon: "/icons/greater-noida.svg" },
  { name: "Gurgaon", icon: "/icons/gurgaon.svg" },
  { name: "Hyderabad", icon: "/icons/hyderabad.svg" },
  { name: "Indore", icon: "/icons/indore.svg" },
  { name: "Jaipur", icon: "/icons/jaipur.svg" },
  { name: "Mumbai", icon: "/icons/mumbai.svg" },
  { name: "Navi Mumbai", icon: "/icons/navi-mumbai.svg" },
  { name: "Noida", icon: "/icons/noida.svg" },
  { name: "Pune", icon: "/icons/pune.svg" },
  { name: "Thane", icon: "/icons/thane.svg" },
];

export default function Banner() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-[#1E1F4B] text-white py-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/your-bg-image.jpg"
          alt="Banner Background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-yellow-400 text-base sm:text-lg font-semibold mb-2">
          Homes for rent that fit your timeline
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10">
          Discover a place you'll love
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row max-w-3xl mx-auto bg-white rounded-full overflow-visible shadow-lg text-black relative z-20">
          {/* Location Selector */}
          <div
            ref={dropdownRef}
            className="relative border-b sm:border-b-0 sm:border-r w-full sm:w-auto z-50"
          >
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full sm:w-56 px-5 py-3 text-left flex items-center justify-between gap-2 text-[#1E1F4B] font-medium"
            >
              <span>📍 {selectedCity}</span>
              <span
                className={`text-lg transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-72 sm:w-[500px] max-h-[300px] overflow-y-auto z-50">
                {cities.map((city) => (
                  <div
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city.name);
                      setShowDropdown(false);
                    }}
                    className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <img src={city.icon} alt={city.name} className="w-8 h-8 mb-1" />
                    <span className="text-sm text-[#1E1F4B] text-center">{city.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search Locality, Landmark or Tech Park"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-5 py-3 focus:outline-none text-[#1E1F4B] placeholder:text-gray-500"
          />

          {/* Search Button */}
          <button
            onClick={() => alert(`Searching "${search}" in ${selectedCity}`)}
            className="px-6 py-3 bg-[#1E1F4B] text-white font-semibold rounded-r-full"
          >
            🔍
          </button>
        </div>

        {/* Options Section */}
       

        {/* Statistics Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white text-center">
          <div>
            <div className="text-2xl font-bold">1,00,000+</div>
            <div>Homes Rented / Sold</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2,00,000+</div>
            <div>Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">1,00,000+</div>
            <div>Trusted Owners</div>
          </div>
        </div>
      </div>
    </div>
  );
}
