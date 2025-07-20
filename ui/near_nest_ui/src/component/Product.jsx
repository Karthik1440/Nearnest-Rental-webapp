import React, { useEffect, useState } from "react";
import { HiOutlineHeart, HiLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Product() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/properties/")
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-xl h-40 sm:h-28 w-full max-w-md mx-auto"
          />
        ))}
      </div>
    );
  }

  // Main Property Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {properties.map((property) => {
        // Get first image (Cloudinary URL) or fallback
        const imageUrl =
          property.images && property.images.length > 0
            ? property.images[0].image_url
            : "https://placehold.co/300x200?text=No+Image";

        return (
          <Link
            key={property.id}
            to={`/property/${property.id}`}
            className="block bg-white rounded-xl shadow p-3 w-full max-w-md mx-auto sm:flex sm:items-start hover:shadow-lg hover:scale-[1.02] transition duration-200"
          >
            <img
           src={property.images[0]?.image_url || "https://placehold.co/300x200?text=No+Image"}
            alt="property"
            className="w-full h-48 object-cover rounded"
                />

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-base sm:text-sm">
                  {property.property_name}
                </h3>
                <HiOutlineHeart className="text-gray-500 text-xl cursor-pointer" />
              </div>

              <p className="text-gray-700 text-sm mt-1">
                ₹ {property.monthly_rent}/month
              </p>

              <div className="flex items-center text-gray-500 text-sm mt-1">
                <HiLocationMarker className="mr-1 text-lg" />
                <span>{property.city}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
