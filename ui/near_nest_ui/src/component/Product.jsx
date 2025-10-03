import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/properties/");
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleCardClick = async (property) => {
    const id = property.id;
    try {
      await axios.get(`http://localhost:8000/api/properties/${id}/`);
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
    navigate(`/property/${id}`);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const getImage = (property) =>
    property.cover_image ||
    property.image_url ||
    property.images?.[0]?.image_url ||
    property.images?.[0]?.image ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const getLocation = (property) =>
    property.city ||
    property.full_address ||
    (property.latitude && property.longitude
      ? `Lat: ${property.latitude}, Lng: ${property.longitude}`
      : "Unknown Location");

  return (
    <div className="p-4">
      {properties.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No properties available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(property)}
              className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden relative"
            >
              {/* Top Image + Availability Badge + Favorite */}
              <div className="relative">
                <img
                  src={getImage(property)}
                  alt={property.property_name}
                  className="w-full h-48 object-cover"
                />
                <div
                  className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                    property.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {property.available ? "Available" : "Not Available"}
                </div>
                <div
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  <button className="bg-white p-1 rounded-full shadow hover:scale-105 transition">
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(property.id)
                          ? "fill-pink-500 text-pink-500"
                          : "text-pink-500"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
                  1 BHK {property.category} Flat for Rent in{" "}
                  {property.property_name?.charAt(0).toUpperCase() +
                    property.property_name?.slice(1)}
                </h2>

                <div className="text-sm text-purple-600">
                  🏷️ {property.category}
                </div>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} className="text-red-400" />
                  {getLocation(property)}
                </p>

                {property.additional_details && (
                  <p className="text-sm text-gray-400 italic">
                    {property.additional_details}
                  </p>
                )}

                <div className="grid grid-cols-3 text-center border-t pt-2 mt-2 text-sm text-gray-700">
                  <div>
                    <div className="font-medium text-black">
                      ₹{property.monthly_rent}
                    </div>
                    <div className="text-xs">Rent /month</div>
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      {property.deposit_amount}
                    </div>
                    <div className="text-xs">Security</div>
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      {property.area_sqft}
                    </div>
                    <div className="text-xs">Area</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
