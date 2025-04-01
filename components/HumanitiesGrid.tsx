'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define the humanities topics with rich content
const topics = [
  { id: 1, title: 'Religion', link: '/topics/religion', description: 'Explore the role of religion in African American communities, focusing on Birmingham\'s historic Black churches.' },
  { id: 2, title: 'Music', link: '/topics/music', description: 'Celebrate the rich musical heritage of African Americans, from gospel to jazz to hip-hop.' },
  { id: 3, title: 'Theatre Arts', link: '/topics/theatre-arts', description: 'Examine the role of theatre in African American storytelling and cultural expression.' },
  { id: 4, title: 'STEM', link: '/topics/stem', description: 'Explore African American contributions to science, technology, engineering, and mathematics.' },
  { id: 5, title: 'Law & Politics', link: '/topics/law-politics', description: 'Examine the role of African Americans in shaping law and politics, with focus on civil rights.' },
  { id: 6, title: 'Philosophy', link: '/topics/philosophy', description: 'Engage with philosophical questions through African American perspectives, fostering critical thinking.' },
  { id: 7, title: 'Dance', link: '/topics/dance', description: 'Celebrate African American dance traditions and their cultural significance.' },
  { id: 8, title: 'History', link: '/topics/history', description: 'Dive into African American history, focusing on Birmingham\'s role in the Civil Rights Movement.' },
  { id: 9, title: 'Economics', link: '/topics/economics', description: 'Examine economic contributions and challenges faced by African Americans in Birmingham and beyond.' },
  { id: 10, title: 'Digital Humanities', link: '/topics/digital-humanities', description: 'Harness digital tools to explore and preserve African American humanities and culture.' },
  { id: 11, title: 'Literature', link: '/topics/literature', description: 'Dive into African American literature, celebrating Birmingham\'s literary contributions.' },
  { id: 12, title: 'Art', link: '/topics/art', description: 'Discover the impact of African American art on cultural expression and identity.' },
];

const HumanitiesGrid = () => {
  return (
    <section className="py-16 bg-gray-50" aria-labelledby="humanities-heading">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            id="humanities-heading"
            className="text-gray-900 font-['Playfair_Display'] font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            Humanities Topics
          </h2>
          <p className="text-gray-600 font-['Poppins'] text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
            Discover our curated selection of humanities subjects, crafted to inspire critical thinking, cultural awareness, and intellectual growth.
          </p>
          <div 
            className="mx-auto mt-6 mb-2 rounded-full"
            style={{ 
              width: '8rem', 
              height: '0.25rem', 
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.2)'
            }}
          ></div>
        </div>

        {/* 4x3 Chessboard Grid with Gap */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 max-w-5xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
                ease: 'easeOut',
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {topics.map((topic, index) => {
            const isLightSquare = (Math.floor(index / 4) + index) % 2 === 0;

            return (
              <motion.div
                key={topic.id}
                aria-label={`Explore ${topic.title} topic: ${topic.description}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5, ease: 'easeOut' },
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                  borderColor: '#dc2626',
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative aspect-square flex flex-col justify-between p-6 text-center transition-all duration-300 ${
                  isLightSquare ? 'bg-white' : 'bg-gray-900'
                } border border-gray-200 overflow-hidden focus-within:outline-[3px] focus-within:outline-[#dc2626] focus-within:outline-offset-[2px]`}
              >
                {/* Subtle Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isLightSquare ? 'from-red-50 to-transparent' : 'from-red-600/10 to-transparent'} opacity-20 pointer-events-none`}></div>

                {/* Branding Element */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-red-600/40"></div>
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-['Playfair_Display'] font-bold text-xl md:text-2xl mb-3 relative ${
                      isLightSquare ? 'text-gray-800' : 'text-gray-100'
                    } group-hover:after:content-[''] group-hover:after:absolute group-hover:after:bottom-[-4px] group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-[2px] group-hover:after:bg-[#dc2626] group-hover:after:opacity-50`}
                  >
                    {topic.title}
                  </h3>
                  <p
                    className={`font-['Poppins'] text-base line-clamp-2 ${
                      isLightSquare ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  >
                    {topic.description}
                    <span className="sr-only">{topic.description}</span>
                  </p>
                </div>
                <Link
                  href={topic.link}
                  className={`inline-flex items-center font-['Poppins'] text-base font-medium transition-colors duration-300 ${
                    isLightSquare
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-red-300 hover:text-red-200'
                  }`}
                >
                  Explore
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;