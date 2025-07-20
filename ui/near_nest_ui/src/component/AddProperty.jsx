import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates(e.latlng);
    }
  });
  return null;
};

const AddProperty = () => {
  const options = ['PG', 'Apartment', 'Flat', 'House', 'Shop'];
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    PropertyName: '',
    ownerName: '',
    rent: '',
    deposit: '',
    area: '',
    location: '',
    address: '',
    contact: '',
    description: '',
    zoning: '',
    images: [],
    amenities: [],
    coordinates: null,
  });
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  const handleSelect = (option) => setSelectedType(option);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }

    setError('');
    const newImages = [...formData.images, ...files];
    const newPreviews = [...previews, ...files.map((file) => URL.createObjectURL(file))];
    setFormData((prev) => ({ ...prev, images: newImages }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coordinates) {
      alert('Please select a location on the map.');
      return;
    }

    try {
      // 1. Submit property
      const propertyRes = await axios.post('http://localhost:8000/api/properties/', {
  property_name: formData.PropertyName,
  owner_name: formData.ownerName,
  monthly_rent: parseFloat(formData.rent),
  deposit_amount: parseFloat(formData.deposit),
  area_sqft: formData.area,
  city: formData.location,
  full_address: formData.address,
  contact_number: formData.contact,
  zoning: formData.zoning,
  additional_details: formData.description,
  latitude: parseFloat(formData.coordinates.lat.toFixed(8)),
  longitude: parseFloat(formData.coordinates.lng.toFixed(8)),
  owner: 1
});

      const propertyId = propertyRes.data.id;

      // 2. Submit amenities
      for (const amenity of formData.amenities) {
        await axios.post('http://localhost:8000/api/amenities/', {
          property: propertyId,
          amenity_name: amenity
        });
      }

      // 3. Upload images to Cloudinary via Django
      for (const img of formData.images) {
        const imageForm = new FormData();
        imageForm.append('image_url', img);
        imageForm.append('property', propertyId);

        await axios.post('http://localhost:8000/api/property-images/', imageForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert('Property submitted successfully!');
      // Reset form
      setSelectedType(null);
      setFormData({
        PropertyName: '',
        ownerName: '',
        rent: '',
        deposit: '',
        area: '',
        location: '',
        address: '',
        contact: '',
        description: '',
        zoning: '',
        images: [],
        amenities: [],
        coordinates: null,
      });
      setPreviews([]);
      setError('');
    } catch (err) {
      console.error(err);
      alert('Error submitting property.');
    }
  };

  const amenityList = [
    'Parking Available',
    'Attached Washroom',
    'Main Road Facing',
    'Power Backup',
    'AC Fitted',
    '24x7 Water Supply'
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">What are you trying to rent?</h1>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-5 py-2 rounded-md border text-sm font-medium shadow-sm transition-all
                ${selectedType === option
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300'}`}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedType && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="PropertyName" placeholder="Property Name" value={formData.PropertyName} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="ownerName" placeholder="Owner's Name" value={formData.ownerName} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="rent" placeholder="Monthly Rent (₹)" value={formData.rent} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="deposit" placeholder="Deposit Amount (₹)" value={formData.deposit} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="area" placeholder="Area (in sq ft)" value={formData.area} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="location" placeholder="City" value={formData.location} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="tel" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} className="border p-3 rounded-md" required />
            <input type="text" name="zoning" placeholder="Zoning (e.g., Commercial)" value={formData.zoning} onChange={handleChange} className="border p-3 rounded-md" required />
            <textarea name="description" placeholder="Additional Details" value={formData.description} onChange={handleChange} className="border p-3 rounded-md" rows="4" required />

            {/* Amenities */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenityList.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Map Location Picker */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Pick Property Location on Map</label>
              <MapContainer
                center={[10.0159, 76.3419]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '250px', width: '100%' }}
                className="rounded-md"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker setCoordinates={(coords) => setFormData({ ...formData, coordinates: coords })} />
                {formData.coordinates && (
                  <Marker position={[formData.coordinates.lat, formData.coordinates.lng]} />
                )}
              </MapContainer>
              {formData.coordinates && (
                <p className="text-sm mt-1 text-gray-600">
                  Selected: Lat {formData.coordinates.lat.toFixed(4)}, Lng {formData.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Upload Property Images (Max 5)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="border p-2 w-full rounded-md" />
              {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {previews.map((src, index) => (
                  <img key={index} src={src} alt={`preview-${index}`} className="h-32 w-full object-cover rounded-md border" />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Submit {selectedType} Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProperty;
