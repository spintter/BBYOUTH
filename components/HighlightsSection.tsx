'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HighlightsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (highlightsRef.current) observer.observe(highlightsRef.current);

    return () => {
      if (highlightsRef.current) observer.unobserve(highlightsRef.current);
    };
  }, []);

  const highlights = [
    {
      icon: '📚',
      title: 'K-12 Resources',
      description: 'Access educational materials to support youth learning and development.',
      link: '/resources',
      linkText: 'Explore Resources'
    },
    {
      icon: '📅',
      title: 'Events',
      description: 'Join us for inspiring community gatherings, workshops, and celebrations.',
      link: '/events',
      linkText: 'View Calendar'
    },
    {
      icon: '❤️',
      title: 'Donate',
      description: 'Support our mission to empower youth through Afrocentric education.',
      link: '/donate',
      linkText: 'Contribute Now'
    },
    {
      icon: '🤝',
      title: 'Volunteer',
      description: 'Share your skills and time to help build a stronger community.',
      link: '/volunteer',
      linkText: 'Get Involved'
    }
  ];

  return (
    <section 
      ref={highlightsRef} 
      className="highlights-section py-20 bg-[#F5F5F5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title text-4xl font-bold mb-4 text-[#1A1A1A] font-['Montserrat']">Discover More</h2>
          <p className="section-subtitle text-lg text-[#4A4A4A] max-w-3xl mx-auto font-medium">
            Explore additional opportunities to engage with our community and mission
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative px-4"
        >
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active bg-[#8B4513]',
              bulletClass: 'swiper-pagination-bullet bg-gray-300 opacity-70 inline-block w-3 h-3 rounded-full mx-1 transition-all duration-300'
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="highlights-swiper !pb-12"
          >
            {highlights.map((item, index) => (
              <SwiperSlide key={index}>
                <div 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] border border-[#F5F5F5] h-full flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">{item.title}</h3>
                    <p className="text-[#4A4A4A] mb-6 min-h-[80px] font-['Open Sans'] flex-grow">{item.description}</p>
                    <Link 
                      href={item.link} 
                      className="inline-block text-[#8B4513] hover:text-[#6D3510] transition-colors duration-200 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#8B4513] rounded mt-auto"
                    >
                      {item.linkText} →
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom navigation buttons */}
          <div className="swiper-button-prev !text-[#8B4513] !w-10 !h-10 !bg-white !rounded-full !shadow-md !flex !items-center !justify-center !left-0 !-translate-y-1/2 !opacity-80 hover:!opacity-100 transition-opacity duration-300">
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="swiper-button-next !text-[#8B4513] !w-10 !h-10 !bg-white !rounded-full !shadow-md !flex !items-center !justify-center !right-0 !-translate-y-1/2 !opacity-80 hover:!opacity-100 transition-opacity duration-300">
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Add custom styles for Swiper */}
      <style jsx global>{`
        .highlights-swiper .swiper-pagination {
          bottom: 0;
        }
        
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HighlightsSection;