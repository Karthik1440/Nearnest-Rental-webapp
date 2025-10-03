import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MapPin, Trash2, Pencil, CheckCircle, XCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const MyPost = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("access");

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    if (!token) {
      alert("Please log in to view your properties.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/my-properties/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties:", err);
      alert("Error fetching your properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propId) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/properties/${propId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((prev) => prev.filter((p) => p.id !== propId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property.");
    }
  };

  const handleToggleAvailability = async (prop) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/properties/${prop.id}/`,
        { available: !prop.available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data;

      setProperties((prev) =>
        prev.map((p) => (p.id === prop.id ? { ...p, available: updated.available } : p))
      );
    } catch (err) {
      console.error("Toggle availability failed:", err);
      alert("Failed to update availability.");
    }
  };

  const getImage = (prop) =>
    prop.cover_image ||
    prop.image_url ||
    prop.images?.[0]?.image_url ||
    "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          My Listings
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading your listings...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
              >
                <div className="relative">
                  <img
                    src={getImage(prop)}
                    alt="Property"
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${
                      prop.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {prop.available ? "Available" : "Not Available"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {prop.property_name || "Untitled"}
                  </h3>

                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Eye size={14} className="text-gray-500" /> {prop.views || 0} views
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin size={14} className="text-rose-500" />
                    {prop.city || prop.full_address || "Unknown"}
                  </p>

                  <p className="text-indigo-600 font-bold text-md mt-2">
                    ₹{prop.monthly_rent || "N/A"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <Link
                      to={`/edit-property/${prop.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
                  </div>

                  <button
                    onClick={() => handleToggleAvailability(prop)}
                    className={`mt-3 w-full flex items-center justify-center gap-2 text-white text-sm px-3 py-2 rounded-lg transition ${
                      prop.available
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {prop.available ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {prop.available ? "Mark as Unavailable" : "Mark as Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyPost;
