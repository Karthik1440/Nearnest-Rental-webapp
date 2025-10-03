import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { HiLocationMarker, HiOutlineChat } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const currentUser = Cookies.get("currentUser")
    ? JSON.parse(Cookies.get("currentUser"))
    : null;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/properties/${id}/`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch property details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading property...</div>;
  if (!property) return <div className="p-4">Property not found</div>;

  const {
    property_name,
    monthly_rent,
    deposit_amount,
    area_sqft,
    city,
    full_address,
    zoning,
    additional_details,
    latitude,
    longitude,
    images,
    amenities,
    category,
    available,
    created_at,
    owner,
  } = property;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* LEFT SIDE */}
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide mb-4">
            <div className="flex gap-4">
              {images?.length > 0 ? (
                images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt="Property"
                    className="w-[450px] h-[300px] object-cover rounded-xl flex-shrink-0"
                  />
                ))
              ) : (
                <img
                  src="https://placehold.co/450x300?text=No+Image"
                  alt="No property"
                  className="w-[450px] h-[300px] object-cover rounded-xl flex-shrink-0"
                />
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Property Details</h2>
            <p className="text-sm text-gray-800">Category: {category}</p>
            <p className="text-sm text-gray-700">Area: {area_sqft} sqft</p>
            <p className="text-sm text-gray-700">Zoning: {zoning}</p>
            <p className="text-sm text-gray-700">Address: {full_address}</p>
            <p className="text-sm text-gray-700">
              Additional Info: {additional_details || "N/A"}
            </p>
            <p className="text-sm text-gray-700">Date Listed: {formattedDate}</p>
            <p
              className={`text-sm font-medium mt-2 ${
                available ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {available ? "Available" : "Not Available"}
            </p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Amenities</h2>
            {amenities?.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {amenities.map((a) => (
                  <li key={a.id}>{a.amenity_name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No amenities listed</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Price Card */}
          <div className="bg-white shadow-md rounded-xl p-4 border relative">
            <div
              className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1 rounded-full ${
                available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {available ? "Available" : "Not Available"}
            </div>

            <p className="text-2xl font-bold text-green-700 mb-2">Rent: ₹ {monthly_rent}</p>
            <p className="text-2xl font-bold text-green-700 mb-2">Deposit: ₹ {deposit_amount}</p>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">{property_name}</h1>
            <div className="flex items-center text-gray-600">
              <HiLocationMarker className="mr-1" />
              <span>{city}</span>
            </div>

            {/* Booking Button */}
                             <button
  onClick={() => navigate(`/enquiry/${id}`)}
  className="mt-4 w-full bg-green-600 text-white py-2 rounded shadow hover:bg-green-700"
>
   Booing visit
</button>
          </div>

          {/* Owner Info + Chat + Map */}
          <div className="bg-white shadow-md rounded-xl p-4 border flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {owner?.profile_image ? (
                <img
                  src={owner.profile_image}
                  alt="Owner"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-3xl text-gray-500" />
              )}
              <div>
                <p className="text-sm text-gray-700 font-medium">Owner:</p>
                <p className="text-sm text-gray-900">{owner?.name}</p>
              </div>
            </div>

            {/* Chat button replaced with coming soon alert */}
            <button
              onClick={() => alert("Chat option coming soon!")}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700"
            >
              <HiOutlineChat className="mr-2" /> Chat with Owner
            </button>

            <div>
              <h2 className="text-md font-semibold text-gray-800 mb-2">Map</h2>
              <iframe
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                width="100%"
                height="200"
                className="rounded w-full"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
