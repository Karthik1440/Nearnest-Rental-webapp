import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaCommentDots, FaCheckCircle } from "react-icons/fa";

const PropertyDetail = ({ property }) => {
  const {
    images = [],
    name = "Spacious Apartment",
    price = "₹15,000/month",
    deposit = "₹5,000",
    area = "1200 sq ft",
    city = "Kochi",
    fullAddress = "123 Main Street, Kerala",
    contact = "6235416821",
    propertyType = "Apartment",
    zoning = "Residential",
    description = " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also ",
    amenities = [],
    mapEmbed = "https://www.google.com/maps/embed?pb=..."
  } = property || {};

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md mt-6">
      
      {/* Image Slider */}
      <div className="overflow-x-auto flex gap-4 mb-6">
        {images.length > 0 ? (
          images.slice(0, 5).map((img, i) => (
            <img key={i} src={img} alt={`Property ${i + 1}`} className="w-64 h-40 object-cover rounded-lg border" />
          ))
        ) : (
          <p className="text-gray-500">No images available.</p>
        )}
      </div>

      {/* Title & Pricing */}
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-lg text-green-600 font-semibold">{price}</p>
      <p className="text-sm text-gray-600 mb-2">Deposit: {deposit}</p>

      {/* Basic Details */}
      <div className="text-gray-700 space-y-1 mb-4">
        <p><strong>Type:</strong> {propertyType}</p>
        <p><strong>Area:</strong> {area}</p>
        <p><strong>Zoning:</strong> {zoning}</p>
        <p><strong>City:</strong> {city}</p>
        <p className="flex items-center"><FaMapMarkerAlt className="mr-2" />{fullAddress}</p>
      </div>

      {/* Description */}
      <p className="text-gray-800 mb-6">{description}</p>

      {/* Amenities */}
      {amenities?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Amenities:</h3>
          <ul className="flex flex-wrap gap-3">
            {amenities.map((item, index) => (
              <li key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800">
                <FaCheckCircle className="text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Google Map */}
      <div className="w-full h-64 mb-6">
        <iframe
          src={mapEmbed}
          className="w-full h-full rounded-lg border"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Chat & Call */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          <FaCommentDots /> Chat
        </button>
        <a
          href={`tel:${contact}`}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          <FaPhoneAlt /> Call
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
