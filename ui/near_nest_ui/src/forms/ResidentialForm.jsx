import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Cookies from 'js-cookie';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates(e.latlng);
    },
  });
  return null;
};

const ResidentialForm = ({ category }) => {
  const [formData, setFormData] = useState({
    property_name: '',
    owner_name: '',
    monthly_rent: '',
    deposit_amount: '',
    area_sqft: '',
    city: '',
    full_address: '',
    contact_number: '',
    zoning: '',
    additional_details: '',
    coordinates: null,
    images: [],
    amenities: [],
    availability: true,
    category: category || 'Residential', // ✅ include category
  });

  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const amenityList = [
    'Parking Available',
    'Attached Washroom',
    'Main Road Facing',
    'Power Backup',
    'AC Fitted',
    '24x7 Water Supply',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length + formData.images.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }

    setError('');
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setPreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coordinates) {
      alert('Please select a location on the map.');
      return;
    }

    setSubmitting(true);
    const accessToken = Cookies.get('access');

    if (!accessToken) {
      alert('User not authenticated. Please log in.');
      setSubmitting(false);
      return;
    }

    const { lat, lng } = formData.coordinates;

    try {
      // Step 1: Create Property
      const propertyRes = await axios.post(
        'http://localhost:8000/api/properties/',
        {
          property_name: formData.property_name,
          owner_name: formData.owner_name,
          property_type: 'Residential',
          category: formData.category, // ✅ send category
          monthly_rent: formData.monthly_rent,
          deposit_amount: formData.deposit_amount,
          area_sqft: formData.area_sqft,
          city: formData.city,
          full_address: formData.full_address,
          contact_number: formData.contact_number,
          zoning: formData.zoning,
          additional_details: formData.additional_details,
          latitude: lat.toFixed(8),
          longitude: lng.toFixed(8),
          availability: formData.availability,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const propertyId = propertyRes.data.id;

      // Step 2: Upload Amenities
      const amenityPromises = formData.amenities.map((amenity) =>
        axios.post(
          'http://localhost:8000/api/amenities/',
          {
            property: propertyId,
            amenity_name: amenity,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      // Step 3: Upload Images
      const imagePromises = formData.images.map((image) => {
        const imageData = new FormData();
        imageData.append('image_url', image);
        imageData.append('property', propertyId);

        return axios.post('http://localhost:8000/api/property-images/', imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        });
      });

      await Promise.all([...amenityPromises, ...imagePromises]);

      alert('Property submitted successfully!');
      setFormData({
        property_name: '',
        owner_name: '',
        monthly_rent: '',
        deposit_amount: '',
        area_sqft: '',
        city: '',
        full_address: '',
        contact_number: '',
        zoning: '',
        additional_details: '',
        coordinates: null,
        images: [],
        amenities: [],
        availability: true,
        category: category || 'Residential', // ✅ reset category
      });
      setPreviews([]);
    } catch (error) {
      console.error(error);
      alert('Failed to submit property: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Residential Property</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="property_name" placeholder="Property Name" value={formData.property_name} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="owner_name" placeholder="Owner's Name" value={formData.owner_name} onChange={handleChange} className="border p-3 rounded-md" required />
          <input type="number" name="monthly_rent" placeholder="Monthly Rent (₹)" value={formData.monthly_rent} onChange={handleChange} className="border p-3 rounded-md" required />
          <input type="number" name="deposit_amount" placeholder="Deposit Amount (₹)" value={formData.deposit_amount} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="area_sqft" placeholder="Area (in sq ft)" value={formData.area_sqft} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="full_address" placeholder="Full Address" value={formData.full_address} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} className="border p-3 rounded-md" required />
          <input name="zoning" placeholder="Zoning (e.g., Commercial)" value={formData.zoning} onChange={handleChange} className="border p-3 rounded-md" required />
          <textarea name="additional_details" placeholder="Additional Details" value={formData.additional_details} onChange={handleChange} className="border p-3 rounded-md" rows="4" required />

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="availability" className="text-sm text-gray-700">Available for Rent</label>
          </div>

          {/* Amenities */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {amenityList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Pick Location on Map</label>
            <MapContainer
              center={[10.0159, 76.3419]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: '250px', width: '100%' }}
              className="rounded-md"
            >
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setCoordinates={(coords) => setFormData({ ...formData, coordinates: coords })} />
              {formData.coordinates && <Marker position={[formData.coordinates.lat, formData.coordinates.lng]} />}
            </MapContainer>
            {formData.coordinates && (
              <p className="text-sm mt-1 text-gray-600">
                Selected: Lat {formData.coordinates.lat.toFixed(4)}, Lng {formData.coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Upload Images (Max 5)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="border p-2 w-full rounded-md" />
            {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {previews.map((src, index) => (
                <div key={index} className="relative group">
                  <img src={src} alt={`preview-${index}`} className="h-32 w-full object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviews(previews.filter((_, i) => i !== index));
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`mt-4 py-3 rounded-lg font-medium transition ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Residential Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResidentialForm;
