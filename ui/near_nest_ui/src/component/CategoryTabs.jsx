import React from "react";

export default function CategoryTabs() {
  const categories = ["PG", "Flats", "Bikes", "Apartments", "Nearby", "Shops", "Hostels", "Rooms"];

  return (
    <div className="overflow-x-auto no-scrollbar py-3 px-2">
      <div className="flex space-x-3 w-max">
        {categories.map((item, idx) => (
          <button
            key={idx}
            className="px-4 py-2 bg-white text-gray-800 rounded-b-md shadow hover:bg-blue-100 transition whitespace-nowrap text-sm font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
