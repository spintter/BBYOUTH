'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define the humanities topics with updated content
const topics = [
  {
    id: 1,
    title: 'History & Heritage',
    description: 'Exploring African American history and cultural heritage',
    icon: 'fas fa-landmark',
    link: '/topics/history'
  },
  {
    id: 2,
    title: 'Literature & Arts',
    description: 'Celebrating Black literature, music, and visual arts',
    icon: 'fas fa-book-open',
    link: '/topics/literature'
  },
  {
    id: 3,
    title: 'Social Justice',
    description: 'Understanding civil rights and social movements',
    icon: 'fas fa-balance-scale',
    link: '/topics/social-justice'
  },
  {
    id: 4,
    title: 'Community Leadership',
    description: 'Developing leadership skills and civic engagement',
    icon: 'fas fa-users',
    link: '/topics/leadership'
  },
  {
    id: 5,
    title: 'Cultural Identity',
    description: 'Exploring and celebrating Black identity and culture',
    icon: 'fas fa-heart',
    link: '/topics/identity'
  },
  {
    id: 6,
    title: 'Digital Storytelling',
    description: 'Creating and sharing our stories digitally',
    icon: 'fas fa-video',
    link: '/topics/storytelling'
  },
  {
    id: 7,
    title: 'Research Methods',
    description: 'Learning scholarly research techniques',
    icon: 'fas fa-search',
    link: '/topics/research'
  },
  {
    id: 8,
    title: 'Community Archives',
    description: 'Preserving and sharing community history',
    icon: 'fas fa-archive',
    link: '/topics/archives'
  },
  {
    id: 9,
    title: 'Oral Traditions',
    description: 'Understanding and preserving oral histories',
    icon: 'fas fa-microphone',
    link: '/topics/oral-history'
  },
  {
    id: 10,
    title: 'Ethics & Philosophy',
    description: 'Exploring moral and philosophical questions',
    icon: 'fas fa-brain',
    link: '/topics/ethics'
  },
  {
    id: 11,
    title: 'Media Studies',
    description: 'Analyzing and creating media content',
    icon: 'fas fa-photo-video',
    link: '/topics/media'
  },
  {
    id: 12,
    title: 'Cultural Exchange',
    description: 'Building bridges between communities',
    icon: 'fas fa-handshake',
    link: '/topics/exchange'
  }
];

const HumanitiesGrid = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      } 
    },
  };

  // Function to handle card click with ripple effect
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    // Create ripple element
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    
    // Calculate ripple position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Style the ripple
    ripple.style.width = ripple.style.height = '1px';
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    
    // Add and remove ripple
    card.appendChild(ripple);
    setTimeout(() => {
      card.removeChild(ripple);
    }, 700);
  };

  return (
    <section className="py-20 bg-bbym-black">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">Humanities Topics</h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto font-sans">
            Explore our diverse range of humanities subjects designed to inspire critical thinking,
            cultural awareness, and intellectual growth in young minds.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" 
              }}
              className="bg-medium-blue rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 relative"
              onClick={handleCardClick}
            >
              <Link href={topic.link} className="block h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#00C4FF20' }}
                    >
                      <i 
                        className={`${topic.icon} text-3xl`} 
                        style={{ color: '#00C4FF' }}
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3 text-white text-center font-display"
                    style={{ color: '#00C4FF' }}
                  >
                    {topic.title}
                  </h3>
                  <p className="text-gray-200 text-center flex-grow font-sans">
                    {topic.description}
                  </p>
                  <div className="mt-4 text-center">
                    <span 
                      className="inline-block text-sm font-medium transition-colors duration-300 cta-text relative overflow-hidden px-4 py-2"
                      style={{ color: '#00C4FF' }}
                    >
                      Explore Topic <span className="ml-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;