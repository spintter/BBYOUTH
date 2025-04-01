'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Updated news articles with more relevant content and actual images
const newsArticles = [
  {
    id: 1,
    title: 'Now the Humanities Can Disrupt "AI"',
    excerpt: 'Explore how humanities scholars are becoming key players in the critical examination of artificial intelligence technologies and their impact.',
    imageUrl: '/images/ai_humanities_compressed.webp',
    date: 'February 20, 2023',
    category: 'Technology',
    link: 'https://www.publicbooks.org/now-the-humanities-can-disrupt-ai/'
  },
  {
    id: 2,
    title: 'Harvard Launches Introduction to Digital Humanities Course',
    excerpt: 'New online course teaches students to develop skills in digital research and visualization techniques across humanities disciplines.',
    imageUrl: '/images/data_visualization_.jpg',
    date: 'August 21, 2024',
    category: 'Education',
    link: 'https://pll.harvard.edu/course/introduction-digital-humanities'
  },
  {
    id: 3,
    title: 'Youth Coding Workshop Creates Interactive Literature Map',
    excerpt: 'Participants in our summer program developed an interactive map showcasing Birmingham\'s literary landmarks and history.',
    imageUrl: '/images/world_map.webp',
    date: 'July 3, 2023',
    category: 'Education',
    link: '/news/coding-workshop-map'
  }
];

const projects = [
  {
    title: 'Oral History Archive',
    description: 'Digital collection of community stories and testimonies',
    imageUrl: '/images/blackhistory_logo.jpeg',
    link: '/projects/oral-history'
  },
  {
    title: 'Civil Rights Timeline',
    description: 'Interactive timeline of the Civil Rights Movement',
    imageUrl: '/images/mlk_hitstory.jpeg',
    link: '/projects/civil-rights'
  },
  {
    title: 'Virtual Museum Tours',
    description: 'Digital access to cultural heritage sites',
    imageUrl: '/images/magic_city_sign.jpeg',
    link: '/projects/virtual-tours'
  }
];

const DigitalHumanitiesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 font-montserrat">Digital Humanities</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-inter">
            Exploring the intersection of technology and humanities to create innovative
            educational experiences for our youth community. Historical images from the Library of Congress showcase
            the rich heritage of African American education.
          </p>
          {/* Visual thread element - thin accent line */}
          <div className="w-24 h-1 bg-red-700 mx-auto mt-8 rounded-full"></div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {newsArticles.map((article) => (
            <motion.div
              key={article.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1]
                  } 
                }
              }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.15)",
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 transform transition-all duration-300"
            >
              <Link href={article.link} className="block h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-red-700 text-white rounded-full mb-2">
                      {article.category}
                    </span>
                    <span className="block text-sm text-white font-medium">
                      {article.date}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-800 font-montserrat">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-4 font-inter">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center group">
                    <span className="text-red-700 font-medium text-sm font-inter group-hover:translate-x-1 transition-transform duration-300">
                      Read More
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 text-red-700 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link 
            href="/digital-humanities" 
            className="group relative inline-block px-8 py-3 bg-red-700 text-white font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md font-inter overflow-hidden"
          >
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              Explore All Digital Projects
            </span>
            <div className="absolute inset-0 bg-red-800 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalHumanitiesSection;