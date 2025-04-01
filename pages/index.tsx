//pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HumanitiesGrid from '../components/HumanitiesGrid';
import HighlightsSection from '../components/HighlightsSection';
import PhotoCarousel from '../components/PhotoCarousel';
import DigitalHumanitiesSection from '../components/DigitalHumanitiesSection';
import MissionSection from '../components/MissionSection';
import FeaturedEvents from '../components/FeaturedEvents';
import SectionTransition from '../components/SectionTransition';

// Import the KnowledgeIsPowerHero component with SSR disabled
const KnowledgeIsPowerHeroClient = dynamic(
  () => import('../components/KnowledgeIsPowerHeroClient'),
  { ssr: false }
);

export default function Home() {
  // State to hold section previews
  const [sectionPreviews, setSectionPreviews] = useState({
    mission: null as React.ReactNode,
    humanities: null as React.ReactNode,
    digital: null as React.ReactNode,
    events: null as React.ReactNode,
    photos: null as React.ReactNode,
    highlights: null as React.ReactNode,
  });

  // Generate section previews after initial render
  useEffect(() => {
    setSectionPreviews({
      mission: <div className="preview-content"><MissionSection /></div>,
      humanities: <div className="preview-content"><HumanitiesGrid /></div>,
      photos: <div className="preview-content"><PhotoCarousel /></div>,
      digital: <div className="preview-content"><DigitalHumanitiesSection /></div>,
      events: <div className="preview-content"><FeaturedEvents /></div>,
      highlights: <div className="preview-content"><HighlightsSection /></div>,
    });
  }, []);

  return (
    <div className="page-container bg-[#F9F9F9] relative">
      <Head>
        <title>Birmingham Black Youth Ministry | Empowering Through Humanities</title>
        <meta name="description" content="Birmingham Black Youth Ministry empowers young minds through humanities education, fostering critical thinking, cultural awareness, and leadership skills." />
      </Head>

      {/* Add global styles for consistent transitions */}
      <style jsx global>{`
        /* Consistent animation curve across components */
        .section-container {
          position: relative;
        }
        
        /* Subtle background pattern for visual texture */
        .page-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(#8B0000 0.5px, transparent 0.5px);
          background-size: 50px 50px;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Enhanced focus styles for accessibility */
        a:focus, button:focus {
          outline: 2px solid #8B0000;
          outline-offset: 2px;
        }
        
        /* Consistent micro-interactions */
        a, button {
          transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                      box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                      opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        
        /* Improved scrolling behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Added position-relative class to fix Framer Motion warning */}
      <section className="hero-section relative">
        <KnowledgeIsPowerHeroClient />
      </section>

      {/* Mission Section with SectionTransition */}
      <SectionTransition 
        transitionType="curtain" 
        accentColor="#8B0000"
        nextSectionPreview={sectionPreviews.humanities}
      >
        <MissionSection />
      </SectionTransition>

      {/* Humanities Grid with SectionTransition */}
      <SectionTransition 
        transitionType="overlap" 
        accentColor="#8B0000"
        themePattern="lines"
        nextSectionPreview={sectionPreviews.photos}
      >
        <HumanitiesGrid />
      </SectionTransition>

      {/* Photo Carousel with SectionTransition */}
      <SectionTransition 
        transitionType="slide" 
        accentColor="#8B0000"
        themePattern="dots"
        nextSectionPreview={sectionPreviews.digital}
      >
        <PhotoCarousel />
      </SectionTransition>

      {/* Digital Humanities Section with SectionTransition */}
      <SectionTransition 
        transitionType="fade" 
        accentColor="#8B0000"
        themePattern="dots"
        nextSectionPreview={sectionPreviews.events}
      >
        <DigitalHumanitiesSection />
      </SectionTransition>

      {/* Featured Events with SectionTransition */}
      <SectionTransition 
        transitionType="dissolve" 
        accentColor="#8B0000"
        themePattern="lines"
        nextSectionPreview={sectionPreviews.highlights}
      >
        <FeaturedEvents />
      </SectionTransition>

      {/* Highlights Section with SectionTransition */}
      <SectionTransition 
        transitionType="curtain" 
        accentColor="#8B0000"
      >
        <HighlightsSection />
      </SectionTransition>

      {/* Footer */}
      <Footer />
    </div>
  );
}