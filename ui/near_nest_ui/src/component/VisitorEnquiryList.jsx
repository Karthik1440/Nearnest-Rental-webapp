import React, { useEffect, useState } from "react";
import authAxios from "./authAxios";
import {
  HiUser,
  HiPhone,
  HiClock,
  HiCalendar,
  HiMail,
  HiHome,
} from "react-icons/hi";

const VisitorEnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/api/enquiries/");
      setEnquiries(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load enquiries", err);
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await authAxios.patch(`/api/enquiries/${id}/`, { status });
      fetchEnquiries();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Visitor Enquiries</h2>

      {loading ? (
        <p className="text-gray-500">Loading enquiries...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : enquiries.length === 0 ? (
        <p className="text-gray-500">No visitor enquiries.</p>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="border rounded-xl p-4 shadow-md bg-white"
            >
              <p className="flex items-center gap-2 font-medium text-lg">
                <HiUser /> {enq.name}
              </p>
              <p className="flex items-center gap-2">
                <HiMail /> {enq.email || "No email provided"}
              </p>
              <p className="flex items-center gap-2">
                <HiPhone /> {enq.phone}
              </p>
              <p className="flex items-center gap-2">
                <HiCalendar /> {enq.visit_date}
              </p>
              <p className="flex items-center gap-2">
                <HiClock /> {enq.visit_time}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <HiHome /> Property:{" "}
                <span className="font-medium text-gray-800">
                  {enq.property?.property_name || "Unknown Property"}
                </span>
              </p>
              <p className="text-gray-600 mt-1">Message: {enq.message}</p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="capitalize text-blue-600">{enq.status}</span>
              </p>

              {enq.status === "pending" && (
                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded"
                    onClick={() => updateStatus(enq.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => updateStatus(enq.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitorEnquiryList;
