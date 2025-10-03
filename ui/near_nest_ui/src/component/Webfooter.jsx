// src/components/Footer.jsx
import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';

const Webfooter=() => {
  return (
    <footer className="hidden sm:block bg-[#2c2a58] text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Branding and description */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-white">Nearnest</h2>
          <p className="text-sm mb-4 text-gray-300">
            Nearnest is India’s leading home rental and property management
            platform, revolutionizing the way people find, rent, buy, or sell
            homes through innovative design and technology.
          </p>
          <p className="text-sm text-gray-300">
            From budget-friendly rentals to premium homes for purchase,
            Nearnest has something for everyone—your dream home is just a step
            away.
          </p>
        </div>

        {/* Navigation sections */}
        <div>
          <h3 className="font-semibold text-white border-b border-white mb-2 pb-1">
            Nearnest
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>About us</li>
            <li>Work with us</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white border-b border-white mb-2 pb-1">
            For owners & tenants
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>List Your Property</li>
            <li>Refer an Owner</li>
            <li>Refer a Tenant</li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-10 border-t border-gray-500 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-400 text-center md:text-left mb-4 md:mb-0">
          © 2023 Nearnest Technologies Pvt Ltd. All rights reserved.
        </p>

        <div className="flex space-x-4 text-white">
          <FaFacebookF className="hover:text-gray-300 cursor-pointer" />
          <FaInstagram className="hover:text-gray-300 cursor-pointer" />
          <FaYoutube className="hover:text-gray-300 cursor-pointer" />
          <FaLinkedinIn className="hover:text-gray-300 cursor-pointer" />
          <FaXTwitter className="hover:text-gray-300 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Webfooter;
