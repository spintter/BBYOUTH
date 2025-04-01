'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Define study materials by grade level
const studyMaterials = [
  {
    id: 'elementary',
    title: 'Elementary School',
    description: 'Interactive learning resources designed to introduce young minds to humanities concepts through engaging activities and stories.',
    image: '/images/young_schoolboy.webp',
    link: '/resources/elementary',
    color: '#00C4FF'
  },
  {
    id: 'middle',
    title: 'Middle School',
    description: 'Curriculum materials that build critical thinking skills and cultural awareness through age-appropriate humanities exploration.',
    image: '/images/black_graduates.webp',
    link: '/resources/middle',
    color: '#FFD700'
  },
  {
    id: 'high',
    title: 'High School',
    description: 'Advanced resources that prepare students for college-level humanities studies while connecting to contemporary issues.',
    image: '/images/studying_group.webp',
    link: '/resources/high',
    color: '#00C4FF'
  },
  {
    id: 'educators',
    title: 'For Educators',
    description: 'Professional development materials and lesson plans to effectively integrate humanities into diverse learning environments.',
    image: '/images/young_adults.webp',
    link: '/resources/educators',
    color: '#FFD700'
  }
];

const featuredItems = [
  {
    title: 'Youth Leadership Development',
    description: 'Programs that equip young people with leadership skills, critical thinking abilities, and cultural awareness.',
    link: '/programs',
    image: '/images/urban_youth_relaxing.webp',
  },
  {
    title: 'Cultural Education',
    description: 'Enriching experiences that explore Black history, arts, and cultural contributions to society.',
    link: '/topics/history',
    image: '/images/black_graduates.webp',
  },
  {
    title: 'Spiritual Growth',
    description: 'Guidance that helps youth explore their faith journey while embracing their cultural identity.',
    link: '/topics/religion',
    image: '/images/church3_optimized.webp',
  },
  {
    title: 'Community Service',
    description: 'Opportunities for youth to engage with and make meaningful contributions to their community.',
    link: '/get-involved',
    image: '/images/youth_group.webp',
  },
];

const HighlightsSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      } 
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#2C2F77] to-[#1A1A2E]">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">Study Materials</h2>
          <p className="text-lg text-[#F5F5F5] max-w-3xl mx-auto font-inter">
            Access our curated collection of humanities resources designed for different age groups,
            supporting both students and educators in their learning journey.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {studyMaterials.map((material) => (
            <motion.div
              key={material.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
              }}
              className="bg-[#2C2F77] rounded-lg overflow-hidden shadow-lg transform transition-all duration-300"
            >
              <Link href={material.link} className="block h-full">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="relative h-60 md:h-auto md:w-2/5">
                    <Image
                      src={material.image}
                      alt={material.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-3/5 flex flex-col justify-center">
                    <h3 
                      className="text-xl font-bold mb-3 font-montserrat"
                      style={{ color: material.color }}
                    >
                      {material.title}
                    </h3>
                    <p className="text-[#F5F5F5] mb-4 font-inter">
                      {material.description}
                    </p>
                    <div className="mt-auto">
                      <span 
                        className="inline-flex items-center text-sm font-medium transition-colors duration-300"
                        style={{ color: material.color }}
                      >
                        Access Materials
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            href="/resources" 
            className="inline-block px-8 py-3 bg-[#00C4FF] text-white font-medium rounded-full hover:bg-[#FFD700] hover:text-[#1A1A2E] transition-all duration-300 shadow-lg hover:shadow-xl font-inter"
          >
            Browse All Resources
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HighlightsSection;