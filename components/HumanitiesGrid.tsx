'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define the humanities topics with rich content - Updated to match new topics in [slug].tsx
const topics = [
  { 
    id: 1, 
    title: 'Religion', 
    link: '/topics/religion',
    description: 'Explore the role of religion in African American communities, focusing on Birmingham\'s historic Black churches.'
  },
  { 
    id: 2, 
    title: 'Music', 
    link: '/topics/music',
    description: 'Celebrate the rich musical heritage of African Americans, from gospel to jazz to hip-hop.'
  },
  { 
    id: 3, 
    title: 'Theatre Arts', 
    link: '/topics/theatre-arts',
    description: 'Examine the role of theatre in African American storytelling and cultural expression.'
  },
  { 
    id: 4, 
    title: 'STEM', 
    link: '/topics/stem',
    description: 'Explore African American contributions to science, technology, engineering, and mathematics.'
  },
  { 
    id: 5, 
    title: 'Law & Politics', 
    link: '/topics/law-politics',
    description: 'Examine the role of African Americans in shaping law and politics, with focus on civil rights.'
  },
  { 
    id: 6, 
    title: 'Philosophy', 
    link: '/topics/philosophy',
    description: 'Engage with philosophical questions through African American perspectives, fostering critical thinking.'
  },
  { 
    id: 7, 
    title: 'Dance', 
    link: '/topics/dance',
    description: 'Celebrate African American dance traditions and their cultural significance.'
  },
  { 
    id: 8, 
    title: 'History', 
    link: '/topics/history',
    description: 'Dive into African American history, focusing on Birmingham\'s role in the Civil Rights Movement.'
  },
  { 
    id: 9, 
    title: 'Economics', 
    link: '/topics/economics',
    description: 'Examine economic contributions and challenges faced by African Americans in Birmingham and beyond.'
  },
  { 
    id: 10, 
    title: 'Digital Humanities', 
    link: '/topics/digital-humanities',
    description: 'Harness digital tools to explore and preserve African American humanities and culture.'
  },
  { 
    id: 11, 
    title: 'Literature', 
    link: '/topics/literature',
    description: 'Dive into African American literature, celebrating Birmingham\'s literary contributions.'
  }
];

const HumanitiesGrid = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-slate-800 font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Humanities Topics
          </h2>
          <p className="text-slate-600 font-['Poppins'] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Explore our diverse range of humanities subjects designed to inspire critical thinking, cultural awareness,
            and intellectual growth in young minds.
          </p>
          <div className="w-24 h-1 bg-red-700 mx-auto mt-8 rounded-full"></div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1]
                  }
                }
              }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg p-6 border border-slate-200 hover:border-red-700 transition-all duration-300"
            >
              <h3 className="text-red-700 font-['Playfair_Display'] font-bold text-xl mb-3">
                {topic.title}
              </h3>
              <p className="text-slate-600 font-['Poppins'] text-sm mb-6 min-h-[2.5rem]">
                {topic.description}
              </p>
              <div className="group">
                <Link 
                  href={topic.link} 
                  className="inline-flex items-center text-red-700 font-['Poppins'] text-sm font-medium hover:underline"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Explore Topic</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent opacity-70"></div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;