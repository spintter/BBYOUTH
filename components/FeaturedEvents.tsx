'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';

const FeaturedEvents = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Embla carousel configuration
  const options: EmblaOptionsType = { 
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
  };
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const events = [
    {
      id: 1,
      title: "Afrocentric Literature Workshop",
      date: "March 25, 2025",
      location: "Birmingham Community Center",
      image: "/images/mlk.jpeg",
      description: "Explore the rich tradition of African literature with renowned authors and scholars. This interactive workshop will cover classic and contemporary works.",
      link: "/events/afrocentric-literature-workshop",
      category: "Workshop"
    },
    {
      id: 2,
      title: "Youth Leadership Summit",
      date: "April 15-17, 2025",
      location: "Bessemer Cultural Center",
      image: "/images/group_graduate_optimized.webp",
      description: "A three-day immersive experience designed to cultivate leadership skills in young people through an Afrocentric lens.",
      link: "/events/youth-leadership-summit",
      category: "Summit"
    },
    {
      id: 3,
      title: "African Arts Festival",
      date: "May 8, 2025",
      location: "Kelly Ingram Park",
      image: "/images/urban_youth_optimized.webp",
      description: "Celebrate the diverse artistic expressions of African cultures through music, dance, visual arts, and culinary experiences.",
      link: "/events/african-arts-festival",
      category: "Festival"
    },
    {
      id: 4,
      title: "History Through Storytelling",
      date: "June 12, 2025",
      location: "Birmingham Civil Rights Institute",
      image: "/images/ruby_UA_optimized.webp",
      description: "Learn about African and African American history through the powerful tradition of oral storytelling.",
      link: "/events/history-through-storytelling",
      category: "Cultural"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 bg-gradient-to-b from-[#121212] via-[#1c1c1c] to-[#202020]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider uppercase rounded-full mb-4">
            Community Engagement
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            <span className="relative">
              Featured Events
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#D4AF37]"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-300/90 max-w-2xl mx-auto leading-relaxed">
            Join us for these upcoming opportunities to engage with Afrocentric knowledge, 
            celebrate our heritage, and strengthen our community bonds
          </p>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] px-4"
                >
                  <div 
                    className="group bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-gray-800 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image 
                        src={event.image} 
                        alt={event.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70"></div>
                      <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        {event.category}
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center text-gray-400 mb-4 text-sm">
                        <svg className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-400 mb-5 text-sm">
                        <svg className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <p className="text-gray-300/80 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {event.description}
                      </p>
                      <Link 
                        href={event.link} 
                        className="inline-flex items-center justify-center text-white bg-[#D4AF37] hover:bg-[#C9A227] transition-all duration-300 font-medium py-3 px-6 rounded-md"
                      >
                        <span>Register</span>
                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              className={`embla__prev w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                prevBtnEnabled 
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30' 
                  : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
              }`}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="embla__dots flex space-x-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`embla__dot w-3 h-3 rounded-full transition-all duration-300 ${
                    index === selectedIndex 
                      ? 'bg-[#D4AF37]' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
            
            <button
              className={`embla__next w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                nextBtnEnabled 
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30' 
                  : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
              }`}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link 
            href="/events" 
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#D4AF37] font-medium rounded-md border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
          >
            <span>View All Events</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
      
      <style jsx>{`
        .embla {
          --slide-spacing: 1rem;
          --slide-size: 100%;
          --slide-height: auto;
        }
        
        @media (min-width: 768px) {
          .embla {
            --slide-size: 50%;
          }
        }
        
        .embla__container {
          backface-visibility: hidden;
          display: flex;
          touch-action: pan-y;
          margin-left: calc(var(--slide-spacing) * -1);
        }
      `}</style>
    </section>
  );
};

export default FeaturedEvents; 