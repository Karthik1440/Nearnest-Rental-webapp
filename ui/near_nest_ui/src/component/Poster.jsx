// src/components/poster.jsx
import React from 'react';
import PosterImage from '../assets/posterimage.jpg';


const Poster = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Text Section */}
      <div className="md:w-1/2 w-full text-center md:text-left mb-10 md:mb-0 px-2">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          A lifestyle tailor-<br className="hidden md:block" />
          made for you
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          With diverse housing options, you're not just choosing a home; you're
          crafting a lifestyle that reflects your individuality. Beyond mere
          renting, we're here to support your everyday living, hassle-free.
        </p>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={PosterImage}
          alt="Couple sitting with laptop"
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </section>
  );
};

export default Poster;
