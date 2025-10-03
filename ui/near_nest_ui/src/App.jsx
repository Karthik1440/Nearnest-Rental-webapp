import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./component/Home";
import Chat from "./component/Chat";
import Add from "./component/Add";
import Notifications from "./component/Notifications";
import Profile from "./component/Profile";
import PropertyDetail from "./component/PropertyDetails";
import Mypost from "./component/Mypost";
import FilteredProperties from "./component/FilteredProperties";
import 'leaflet/dist/leaflet.css';
import Login from "./component/Login";
import Signup from "./component/Signup";
import EnquiryForm from "./forms/Enquiryform";
import VisitorEnquiryList from "./component/VisitorEnquiryList";
import MyRequestList from "./component/MyRequestList";
import Favorites from "./component/Favorites";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:roomId" element={<Chat />} />
        <Route path="/add" element={<Add />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/mypost" element={<Mypost />} />
        <Route path="/properties/:category" element={<FilteredProperties />} />
        <Route path="/login" element={<Login />} />      {/* Login page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/enquiry/:propertyId" element={<EnquiryForm />} />
        <Route path="/visitor-enquiries" element={<VisitorEnquiryList />} />
        <Route path="/my-enquiries" element={<MyRequestList />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}
