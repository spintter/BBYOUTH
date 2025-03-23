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
      digital: <div className="preview-content"><DigitalHumanitiesSection /></div>,
      events: <div className="preview-content"><FeaturedEvents /></div>,
      photos: <div className="preview-content"><PhotoCarousel /></div>,
      highlights: <div className="preview-content"><HighlightsSection /></div>,
    });
  }, []);

  return (
    <div className="page-container bg-[#1A1A2E]">
      <Head>
        <title>Birmingham Black Youth Ministry | Empowering Through Humanities</title>
        <meta name="description" content="Birmingham Black Youth Ministry empowers young minds through humanities education, fostering critical thinking, cultural awareness, and leadership skills." />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Added position-relative class to fix Framer Motion warning */}
      <section className="hero-section relative">
        <KnowledgeIsPowerHeroClient />
      </section>

      {/* Mission Section with SectionTransition */}
      <SectionTransition 
        transitionType="curtain" 
        accentColor="#FFD700"
        nextSectionPreview={sectionPreviews.humanities}
      >
        <MissionSection />
      </SectionTransition>

      {/* Humanities Grid with SectionTransition */}
      <SectionTransition 
        transitionType="overlap" 
        accentColor="#00C4FF"
        themePattern="kente"
        nextSectionPreview={sectionPreviews.digital}
      >
        <HumanitiesGrid />
      </SectionTransition>

      {/* Digital Humanities Section with SectionTransition */}
      <SectionTransition 
        transitionType="fade" 
        accentColor="#A78BFA"
        themePattern="dots"
        nextSectionPreview={sectionPreviews.events}
      >
        <DigitalHumanitiesSection />
      </SectionTransition>

      {/* Featured Events with SectionTransition */}
      <SectionTransition 
        transitionType="dissolve" 
        accentColor="#F5A623"
        themePattern="lines"
        nextSectionPreview={sectionPreviews.photos}
      >
        <FeaturedEvents />
      </SectionTransition>

      {/* Photo Carousel with SectionTransition */}
      <SectionTransition 
        transitionType="slide" 
        accentColor="#FF6F61"
        themePattern="kente"
        nextSectionPreview={sectionPreviews.highlights}
      >
        <PhotoCarousel />
      </SectionTransition>

      {/* Highlights Section with SectionTransition */}
      <SectionTransition 
        transitionType="curtain" 
        accentColor="#D4AF37"
      >
        <HighlightsSection />
      </SectionTransition>

      {/* Footer */}
      <Footer />
    </div>
  );
}