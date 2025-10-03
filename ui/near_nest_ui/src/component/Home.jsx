import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoryTabs from "./CategoryTabs";
import PropertyCard from "./Product";
import Banner from "./Banner";
import Poster from "./Poster";
import Webfooter from "./Webfooter";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Navbar/>
      <CategoryTabs/>
      <Banner/>
      <PropertyCard/>
      <div className="flex-grow"></div>
      <Poster/>
      <Webfooter/>
      <Footer/>
    </div>
  );
}
