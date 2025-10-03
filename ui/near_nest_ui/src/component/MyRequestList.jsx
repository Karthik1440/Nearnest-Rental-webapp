import React, { useEffect, useState } from "react";
import authAxios from "./authAxios";
import { HiPhone, HiMail, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";

const MyRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await authAxios.get("/api/my-received-enquiries/");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Enquiries for Your Properties</h2>

      {loading ? (
        <p>Loading enquiries...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-600">No enquiries received yet.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((enq) => (
            <div
              key={enq.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium mb-2">{enq.name}</h3>
              <p className="flex items-center gap-2 text-gray-700">
                <HiPhone /> {enq.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <HiMail /> {enq.email || "Not provided"}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <HiOutlineCalendar /> Visit Date: {enq.visit_date}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <HiOutlineClock /> Visit Time: {enq.visit_time}
              </p>
              <p className="text-sm text-gray-600 mt-2">Message: {enq.message}</p>
              <p className="text-sm text-gray-500 mt-1 italic">
                Status: {enq.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequestList;
