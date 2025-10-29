import React, { useState, useEffect } from "react";
import {FaChevronRight,FaChevronLeft} from "react-icons/fa";

const images = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative h-64 bg-gray-800 flex justify-center items-center">
      <button onClick={prevSlide} className="absolute left-4 bg-white text-black p-2 rounded" ><FaChevronLeft className="text-gray-400" /></button>
      <img src={images[current]} alt="Crypto" className="w-full h-64 object-cover transition-opacity duration-500 ease-in-out" />
      <button onClick={nextSlide} className="absolute right-4 bg-white text-black p-2 rounded"><FaChevronRight className="text-gray-400" /></button>
    </div>
  );
};

export default Carousel;
