'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface PhotoItem {
  src: string;
  alt: string;
  caption: string;
  description: string;
}

const PhotoCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const carouselPhotos: PhotoItem[] = [
    { src: "/images/blackhistory.jpeg", alt: "Youth engaged in learning", caption: "Empowering Youth", description: "Programs shaping future leaders through knowledge." },
    { src: "/images/16th_Street_Baptist_Church.jpg", alt: "Historic 16th Street Baptist Church", caption: "Community Roots", description: "Honoring our heritage with historic institutions." },
    { src: "/images/mlk.jpeg", alt: "MLK Legacy", caption: "Academic Triumph", description: "Celebrating youth success in education." },
    { src: "/images/16thst_bap.jpg", alt: "16th Street Baptist Church", caption: "Family Bonds", description: "Strengthening ties through shared learning." },
    { src: "/images/Church.jpg", alt: "Church", caption: "Faith & Learning", description: "Nurturing the whole person with faith-based education." },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const renderIndicator = (
    clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
    isSelected: boolean,
    index: number,
    label: string
  ) => (
    <button
      type="button"
      onClick={clickHandler}
      onKeyDown={clickHandler}
      value={index}
      key={index}
      role="button"
      tabIndex={0}
      aria-label={`${label} ${index + 1}`}
      className={`h-2 w-12 mx-1 rounded-full transition-all duration-300 ease-out-cubic ${
        isSelected ? 'bg-[#8B4513] scale-125' : 'bg-[#8B4513]/40'
      } hover:bg-[#8B4513]/80`}
    />
  );

  return (
    <section
      ref={sectionRef}
      className="photo-carousel-section py-32 px-4 sm:px-6 lg:px-12 bg-white"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-32 bg-[#8B4513] mb-6 mx-auto transform scale-x-150 origin-center transition-transform duration-300 hover:scale-x-175"></div>
            <motion.h2
              className="section-title text-5xl font-bold text-[#1A1A1A] tracking-tight mb-6 font-['Playfair Display']"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              Our Community Journey
            </motion.h2>
          </div>
          <motion.p
            className="section-subtitle text-xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Witness the transformative path of growth, learning, and unity that fuels our mission.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: parallaxY }}
          className="carousel-container relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[#F5F5F5]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            autoPlay={!isPaused}
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={8000}
            transitionTime={1200}
            renderIndicator={renderIndicator}
            className="cursor-grab active:cursor-grabbing"
          >
            {carouselPhotos.map((photo, index) => (
              <div key={index} className="relative h-[450px] md:h-[550px] lg:h-[650px]">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="absolute inset-0"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    className="brightness-90 contrast-105"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60"></div>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute bottom-6 left-6 right-6 p-6 text-left bg-white/90 backdrop-blur-md rounded-lg border border-[#F5F5F5] shadow-md"
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 text-[#1A1A1A] tracking-tight font-['Montserrat']">
                    {photo.caption}
                  </h3>
                  <p className="text-lg md:text-xl text-[#4A4A4A] leading-snug font-['Open Sans']">
                    {photo.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoCarousel;