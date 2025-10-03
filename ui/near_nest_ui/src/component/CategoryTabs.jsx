import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Store,
  Briefcase,
  Boxes,
  Hotel,
  Users,
  LayoutGrid,
  MapPin,
} from "lucide-react";

const rentalCategories = [
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

export default function CategoryTabs() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Home size={20} className="text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Residential Categories</h2>
      </div>

      <div className="md:overflow-x-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-4 w-full md:w-max">
          {rentalCategories.map((item, index) => {
            const Icon = item.icon;
            const routeSlug = item.label.toLowerCase().replace(/\s+/g, '-'); // normalize

            return (
              <button
                key={index}
                onClick={() => navigate(`/properties/${routeSlug}`)}
                className="flex items-center gap-2 px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 active:scale-95 transition-all duration-200 ease-in-out text-sm font-medium w-full md:w-auto cursor-pointer"
              >
                <Icon size={18} className="text-blue-600" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
