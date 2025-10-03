import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authAxios from "../component/authAxios";
import Cookies from "js-cookie";

export default function EnquiryForm() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    visit_date: "",
    visit_time: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const access = Cookies.get("access");
    if (!access) {
      alert("You must be logged in to submit an enquiry.");
      navigate("/login");
      return;
    }

    if (!propertyId || isNaN(parseInt(propertyId))) {
      alert("Invalid property. Please go back and try again.");
      navigate("/");
    }
  }, [propertyId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const property = parseInt(propertyId);
    if (!property) {
      alert("Invalid property ID.");
      return;
    }

    if (formData.phone.length < 10 || !/^\d+$/.test(formData.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const payload = {
      ...formData,
      property,
    };

    console.log("Submitting payload:", payload);

    setSubmitting(true);

    try {
      await authAxios.post("/api/enquiries/", payload);
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        visit_date: "",
        visit_time: "",
      });
      navigate("/");
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book a Visit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="tel"
          name="phone"
          required
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="message"
          placeholder="Message (Optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex gap-4">
          <input
            type="date"
            name="visit_date"
            required
            min={today}
            value={formData.visit_date}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
          <input
            type="time"
            name="visit_time"
            required
            value={formData.visit_time}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}
