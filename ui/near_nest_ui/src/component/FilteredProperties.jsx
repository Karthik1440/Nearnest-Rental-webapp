import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FilteredProperties() {
  const { category } = useParams();
  const [properties, setProperties] = useState([]);

  // Format category name for display
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/properties/?category=${category}`)
      .then((res) => setProperties(res.data))
      .catch((err) =>
        console.error("Error fetching filtered properties:", err)
      );
  }, [category]);

  return (
    <>
      <Navbar />

      <div className="p-4 max-w-6xl mx-auto min-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">{formattedCategory} Properties</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {properties.length > 0 ? (
            properties.map((property) => (
              <Link
                to={`/property/${property.id}`}
                key={property.id}
                className="border rounded p-4 shadow bg-white hover:shadow-lg transition duration-200"
              >
                <img
                  src={
                    property.images[0]?.image_url ||
                    "https://placehold.co/300x200?text=No+Image"
                  }
                  alt={property.property_name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">
                  {property.property_name}
                </h3>
                <p className="text-sm text-gray-600">{property.city}</p>
                <p className="text-sm font-bold text-green-600">
                  ₹ {property.monthly_rent}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No properties found in this category.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
