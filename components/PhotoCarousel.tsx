'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Updated images with digital humanities visuals
const images = [
  {
    id: 1,
    src: '/images/data_visualization_compressed.webp',
    alt: 'Digital Humanities Data Visualization',
    caption: 'Data visualization helps reveal patterns in cultural and historical datasets'
  },
  {
    id: 2,
    src: '/images/digital_humanities_map_compressed.webp',
    alt: 'Digital Humanities Map',
    caption: 'Digital mapping technologies provide new ways to explore history and culture'
  },
  {
    id: 3,
    src: '/images/dighum1_compressed.webp',
    alt: 'Digital Humanities Research',
    caption: 'Digital tools enable innovative research approaches in the humanities'
  },
  {
    id: 4,
    src: '/images/ai_humanities_compressed.webp',
    alt: 'AI and Humanities',
    caption: 'The intersection of AI and humanities creates new possibilities for cultural study'
  }
];

const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Handle auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset auto-play timer when manually changing slides
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
      }
    }
  };

  // Navigate to previous/next slide
  const prevSlide = () => goToSlide((currentIndex - 1 + images.length) % images.length);
  const nextSlide = () => goToSlide((currentIndex + 1) % images.length);

  return (
    <section className="py-20 bg-gradient-to-b from-[#1A1A2E] to-[#2C2F77]">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">Digital Humanities</h2>
          <p className="text-lg text-[#F5F5F5] max-w-3xl mx-auto font-inter">
            Exploring how digital technologies transform our understanding and preservation of 
            culture, history, and the humanities through innovative research methods.
          </p>
        </motion.div>

        <div 
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main carousel */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  className="object-cover"
                  priority={currentIndex === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.p 
                    className="text-lg md:text-xl font-medium font-inter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {images[currentIndex].caption}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#00C4FF] w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoCarousel;