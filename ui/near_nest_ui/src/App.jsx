import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Chat from "./component/Chat";
import Add from "./component/Add";
import Notifications from "./component/Notifications";
import Profile from "./component/Profile";
import PropertyDetail from "./component/PropertyDetails";
import 'leaflet/dist/leaflet.css';
import Mypost from "./component/Mypost";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/add" element={<Add />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/mypost" element={<Mypost/>}/>
      </Routes>
    </Router>
  );
}
