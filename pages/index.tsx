//pages/index.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HumanitiesGrid from '../components/HumanitiesGrid';
import HighlightsSection from '../components/HighlightsSection';
import PhotoCarousel from '../components/PhotoCarousel';
import DigitalHumanitiesSection from '../components/DigitalHumanitiesSection';
import { debounce } from 'lodash';

// Dynamically import the KnowledgeIsPowerHero component to avoid SSR issues
const KnowledgeIsPowerHero = dynamic(
  () => import('../components/KnowledgeIsPowerHeroClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading experience...</div>
      </div>
    )
  }
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, -50]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Smooth scroll function
  const scrollTo = debounce((to: number) => {
    window.scrollTo({ top: to, behavior: 'smooth' });
  }, 100);
  
  // Handle scroll to mission section
  const handleScrollToMission = () => {
    if (missionRef.current) {
      const top = missionRef.current.offsetTop;
      scrollTo(top);
    }
  };
  
  return (
    <>
      <Head>
        <title>BBYM - Knowledge Is Our Power</title>
        <meta
          name="description"
          content="Birmingham-Bessemer Youth Ministries (BBYM) empowers youth with Afrocentric wisdom, transforming potential into leadership through the humanities."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navbar />

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="hero-section" ref={heroRef}>
          <motion.div 
            className="hero-background parallax-element"
            style={{ y: heroY }}
          >
            <div className="solid-bg-overlay"></div>
          </motion.div>
          
          <div className="hero-overlay"></div>
          
          <div className="hero-container">
            <div className="text-column">
              <div className="text-content">
                <h1 
                  data-text="Empowering Tomorrow's Leaders"
                  className="hero-title"
                >
                  Empowering Tomorrow's Leaders
                </h1>
                <p className="hero-subtitle">
                  Through Afrocentric wisdom, cultural understanding, and strategic thinking
                </p>
                <a 
                  href="#mission" 
                  className="hero-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToMission();
                  }}
                >
                  Begin Your Journey
                </a>
              </div>
            </div>
            
            <div className="animation-column">
              <div className="animation-container">
                <KnowledgeIsPowerHero />
              </div>
            </div>
          </div>
        </section>

        {/* Transition bridge */}
        <div className="hero-to-content-bridge" />

        {/* Mission Section */}
        <section 
          id="mission" 
          ref={missionRef}
          className="section-container py-20 section-transition mission-section"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <div className="container mx-auto px-4 grid grid-cols-12 gap-8">
            <motion.div 
              className="col-span-12 md:col-span-6 flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title mb-6">Our Mission</h2>
              <p className="section-text mb-8">
                Empowering youth through knowledge, creativity, and cultural understanding. 
                We believe in nurturing young minds to become tomorrow's leaders through our 
                innovative humanities programs and Afrocentric perspective.
              </p>
              <motion.button 
                className="primary-button self-start"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-tooltip="Our mission focuses on empowering youth through education, mentorship, and cultural enrichment"
              >
                Learn More About Our Mission
              </motion.button>
            </motion.div>
            <motion.div 
              className="col-span-12 md:col-span-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <img 
                  src="/images/blackhistory.jpeg" 
                  alt="Youth learning chess" 
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                  style={{ maxHeight: '500px' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-amber-100 p-4 rounded shadow-lg">
                  <p className="text-amber-800 font-semibold">
                    <span className="block text-2xl font-bold">500+</span>
                    Youth Impacted
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className={`section-transition-preview ${showPreview ? 'visible' : ''}`}></div>
        </section>

        {/* Section Divider */}
        <div className="section-divider max-w-4xl mx-auto my-12 h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B4513]"></div>
        </div>

        {/* Photo Carousel Section */}
        <PhotoCarousel />

        {/* Humanities Grid Section - Featured prominently */}
        <HumanitiesGrid />

        {/* Section Divider */}
        <div className="section-divider max-w-4xl mx-auto my-12 h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B4513]"></div>
        </div>

        {/* Digital Humanities Section */}
        <DigitalHumanitiesSection />

        {/* Section Divider */}
        <div className="section-divider max-w-4xl mx-auto my-12 h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B4513]"></div>
        </div>

        {/* Programs Grid Section */}
        <section className="section-container bg-white py-20 section-transition">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-5xl font-bold text-[#1A1A1A] tracking-tight mb-6 font-['Montserrat']">Our Programs</h2>
              <p className="section-subtitle text-xl text-[#4A4A4A] max-w-3xl mx-auto font-medium">
                Discover our transformative educational initiatives
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Chess Mastery Program */}
              <motion.div 
                className="program-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 border border-[#F5F5F5]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-ratio-4-3 rounded-t-lg overflow-hidden">
                  <img 
                    src="/images/16thst_bap.jpg" 
                    alt="Chess Program"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">Chess Mastery</h3>
                  <p className="text-[#4A4A4A] mb-4 font-['Open Sans']">
                    Strategic thinking and problem-solving through the royal game.
                  </p>
                  <div className="border-t border-[#F5F5F5] pt-4 mt-2">
                    <small className="block mb-2 text-[#8B4513] text-sm font-medium">90% Engagement Rate</small>
                    <blockquote className="text-sm italic text-[#4A4A4A]">
                      "Transformative experience" - Participant
                    </blockquote>
                  </div>
                </div>
                <div className="tooltip opacity-0 absolute top-0 left-0 right-0 bg-[#1A1A1A]/80 text-white p-4 transition-opacity duration-300">
                  Learn strategic thinking through our comprehensive chess program
                </div>
              </motion.div>

              {/* Cultural Arts Program */}
              <motion.div 
                className="program-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 border border-[#F5F5F5]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="aspect-ratio-4-3 rounded-t-lg overflow-hidden">
                  <img 
                    src="/images/blackhistory.jpeg" 
                    alt="Cultural Arts"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">Cultural Arts</h3>
                  <p className="text-[#4A4A4A] mb-4 font-['Open Sans']">
                    Exploring heritage through creative expression and storytelling.
                  </p>
                  <div className="border-t border-[#F5F5F5] pt-4 mt-2">
                    <small className="block mb-2 text-[#8B4513] text-sm font-medium">85% Participation Rate</small>
                    <blockquote className="text-sm italic text-[#4A4A4A]">
                      "Life-changing program" - Student
                    </blockquote>
                  </div>
                </div>
                <div className="tooltip opacity-0 absolute top-0 left-0 right-0 bg-[#1A1A1A]/80 text-white p-4 transition-opacity duration-300">
                  Explore cultural heritage through various art forms and storytelling
                </div>
              </motion.div>

              {/* Digital Humanities */}
              <motion.div 
                className="program-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 border border-[#F5F5F5]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="aspect-ratio-4-3 rounded-t-lg overflow-hidden">
                  <img 
                    src="/images/mlk.jpeg" 
                    alt="Digital Humanities"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">Digital Humanities</h3>
                  <p className="text-[#4A4A4A] mb-4 font-['Open Sans']">
                    Bridging tradition with technology for modern learning.
                  </p>
                  <div className="border-t border-[#F5F5F5] pt-4 mt-2">
                    <small className="block mb-2 text-[#8B4513] text-sm font-medium">95% Digital Literacy Rate</small>
                    <blockquote className="text-sm italic text-[#4A4A4A]">
                      "Opened new opportunities" - Graduate
                    </blockquote>
                  </div>
                </div>
                <div className="tooltip opacity-0 absolute top-0 left-0 right-0 bg-[#1A1A1A]/80 text-white p-4 transition-opacity duration-300">
                  Bridge traditional knowledge with modern technology skills
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <HighlightsSection />

        {/* Events Section */}
        <section className="section-container py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-5xl font-bold text-[#1A1A1A] tracking-tight mb-6 font-['Montserrat']">Upcoming Events</h2>
              <p className="section-subtitle text-xl text-[#4A4A4A] max-w-3xl mx-auto font-medium">
                Join us in our upcoming community gatherings and workshops
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="event-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 border border-[#F5F5F5] flex"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="event-date bg-[#8B4513] text-white p-6 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="month text-sm font-semibold uppercase">JUN</span>
                  <span className="day text-3xl font-bold">15</span>
                </div>
                <div className="event-content p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">Chess Tournament</h3>
                  <p className="text-[#4A4A4A] mb-4 font-['Open Sans']">
                    Annual youth chess championship featuring workshops and mentoring sessions.
                  </p>
                  <button className="px-6 py-2 border-2 border-[#8B4513] text-[#8B4513] font-medium rounded-lg hover:bg-[#8B4513] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B4513]">Register Now</button>
                </div>
              </motion.div>

              <motion.div 
                className="event-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 border border-[#F5F5F5] flex"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="event-date bg-[#8B4513] text-white p-6 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="month text-sm font-semibold uppercase">JUL</span>
                  <span className="day text-3xl font-bold">01</span>
                </div>
                <div className="event-content p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A] font-['Montserrat']">Cultural Festival</h3>
                  <p className="text-[#4A4A4A] mb-4 font-['Open Sans']">
                    Celebration of African heritage through art, music, and storytelling.
                  </p>
                  <button className="px-6 py-2 border-2 border-[#8B4513] text-[#8B4513] font-medium rounded-lg hover:bg-[#8B4513] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B4513]">Learn More</button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    </>
  );
}