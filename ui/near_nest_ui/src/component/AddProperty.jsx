import React, { useState, useRef } from "react";
import {
  Users,
  Building2,
  Home,
  Store,
  Briefcase,
  Boxes,
  Hotel,
  LayoutGrid,
  MapPin,
} from "lucide-react";
import ResidentialForm from "../forms/ResidentialForm";

// These are now treated as categories
const residentialCategories = [
  { label: "PG", icon: Users },
  { label: "Apartments", icon: Building2 },
  { label: "Villas", icon: Home },
  { label: "Shops", icon: Store },
  { label: "Office Spaces", icon: Briefcase },
  { label: "Warehouses", icon: Boxes },
  { label: "Hostels", icon: Hotel },
  { label: "Serviced Apartments", icon: LayoutGrid },
  { label: "Co-living Spaces", icon: Users },
  { label: "Plots", icon: MapPin },
];

export default function AddProperty() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const formRef = useRef(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Select a Property Category
      </h2>

      {/* Category buttons with icons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {residentialCategories.map(({ label, icon: Icon }, idx) => (
          <button
            key={idx}
            onClick={() => handleCategorySelect(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border font-medium transition duration-300 ${
              selectedCategory === label
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Render Form */}
      <div ref={formRef} className="bg-white rounded-xl shadow-lg px-6 py-6">
        {selectedCategory ? (
          <ResidentialForm category={selectedCategory} />
        ) : (
          <p className="text-gray-500 text-center">
            Please select a category to add property.
          </p>
        )}
      </div>
    </div>
  );
}
