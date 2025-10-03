import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Favorites = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/properties/");
        const favProps = res.data.filter((prop) =>
          favorites.includes(prop.id)
        );
        setProperties(favProps);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, [favorites]);

  // 🗑️ Remove property from favorites
  const removeFromFavorites = (id) => {
    const updated = favorites.filter((favId) => favId !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Favorite Properties</h2>
      {properties.length === 0 ? (
        <p>No favorites added.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition relative"
            >
              <img
                src={
                  property.cover_image ||
                  property.image_url ||
                  property.images?.[0]?.image_url
                }
                alt={property.property_name}
                className="w-full h-52 object-cover rounded-t-xl"
              />

              {/* Remove Button */}
              <button
                onClick={() => removeFromFavorites(property.id)}
                className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 p-1 rounded-full"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>

              <div
                className="p-4 cursor-pointer"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <h3 className="font-semibold text-lg truncate">
                  {property.property_name}
                </h3>
                <p className="text-sm text-gray-600">{property.city}</p>
                <p className="text-indigo-600 font-bold mt-1">
                  ₹{property.monthly_rent}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
