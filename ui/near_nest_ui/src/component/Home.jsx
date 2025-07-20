import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoryTabs from "./CategoryTabs";
import PropertyCard from "./Product";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Navbar/>
      <CategoryTabs/>
      <PropertyCard/>
      <div className="flex-grow"></div>
      <Footer/>
    </div>
  );
}
