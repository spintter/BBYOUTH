'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define the humanities topics with rich content - EXACT content from Image 2
const topics = [
  { 
    id: 1, 
    title: 'History & Heritage', 
    link: '/topics/history-heritage',
    description: 'Exploring African American history and cultural contributions throughout time.'
  },
  { 
    id: 2, 
    title: 'Literature & Arts', 
    link: '/topics/literature-arts',
    description: 'Celebrating Black literature, music, and artistic expression across generations.'
  },
  { 
    id: 3, 
    title: 'Social Justice', 
    link: '/topics/social-justice',
    description: 'Understanding civil rights and social movements for equality and fairness.'
  },
  { 
    id: 4, 
    title: 'Community Leadership', 
    link: '/topics/community-leadership',
    description: 'Developing leadership skills and civic engagement.'
  },
  { 
    id: 5, 
    title: 'Cultural Identity', 
    link: '/topics/cultural-identity',
    description: 'Exploring and celebrating Black identity and culture.'
  },
  { 
    id: 6, 
    title: 'Digital Storytelling', 
    link: '/topics/digital-storytelling',
    description: 'Creating and sharing our stories digitally.'
  },
  { 
    id: 7, 
    title: 'Research Methods', 
    link: '/topics/research-methods',
    description: 'Learning scholarly research techniques.'
  },
  { 
    id: 8, 
    title: 'Community Archives', 
    link: '/topics/community-archives',
    description: 'Preserving and sharing community histories.'
  },
  { 
    id: 9, 
    title: 'Oral Traditions', 
    link: '/topics/oral-traditions',
    description: 'Understanding and preserving oral histories.'
  },
  { 
    id: 10, 
    title: 'Ethics & Philosophy', 
    link: '/topics/ethics-philosophy',
    description: 'Exploring moral and philosophical questions.'
  },
  { 
    id: 11, 
    title: 'Media Studies', 
    link: '/topics/media-studies',
    description: 'Analyzing and creating media content.'
  },
  { 
    id: 12, 
    title: 'Cultural Exchange', 
    link: '/topics/cultural-exchange',
    description: 'Building bridges between communities.'
  }
];

const HumanitiesGrid = () => {
  // Animation variants - simplified for reliability
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section className="py-20 bg-[#141429] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#F5F5F5] font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Humanities Topics
          </h2>
          <p className="text-[#F5F5F5] font-['Poppins'] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Explore our diverse range of humanities subjects designed to inspire critical thinking, cultural awareness,
            and intellectual growth in young minds.
          </p>
        </div>

        {/* EXACTLY matching the card grid layout in Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-[#1A1F35] rounded-lg p-6 border border-[#252A40] hover:border-[#D4A017] transition-all duration-300"
            >
              <h3 className="text-[#D4A017] font-['Playfair_Display'] font-bold text-xl mb-3">
                {topic.title}
              </h3>
              <p className="text-[#F5F5F5] opacity-80 font-['Poppins'] text-sm mb-6 min-h-[2.5rem]">
                {topic.description}
              </p>
              <Link 
                href={topic.link} 
                className="inline-flex items-center text-[#D4A017] font-['Poppins'] text-sm font-medium hover:underline"
              >
                Explore Topic {' '}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;