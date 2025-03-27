'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MissionSection = () => {
  console.log('Rendering Modern MissionSection'); // Debugging log

  // Consistent animation easing across components
  const animationEasing = [0.25, 0.1, 0.25, 1]; // cubic-bezier(0.25, 0.1, 0.25, 1)

  return (
    <section className="section-container mission-section py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: animationEasing }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-slate-800 font-inter tracking-tight">
            Our Mission
          </h2>
          
          {/* Visual thread element - matching other sections */}
          <div className="w-24 h-1 bg-red-700 mx-auto mb-12 rounded-full"></div>
          
          <motion.div 
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 max-w-3xl mx-auto border border-slate-100"
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.15)"
            }}
            transition={{ duration: 0.3, ease: animationEasing }}
          >
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-inter mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: animationEasing }}
            >
              <span className="text-red-700 font-semibold">
                Birmingham Black Youth Ministry
              </span>{' '}
              is dedicated to empowering young minds through the humanities. We
              create spaces where youth can explore{' '}
              <span className="text-red-700 font-medium">
                literature, history, philosophy, and the arts
              </span>
              , developing critical thinking skills and cultural awareness.
            </motion.p>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-inter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease: animationEasing }}
            >
              Through our programs, we nurture the next generation of thoughtful
              leaders who understand the power of ideas, the importance of diverse
              perspectives, and the value of intellectual curiosity in building a
              more just and compassionate society.
            </motion.p>
            
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6, ease: animationEasing }}
            >
              <a
                href="/about"
                className="group relative inline-block bg-white hover:bg-slate-50 text-red-700 font-semibold py-2 px-6 border border-red-700 rounded-full transition-all duration-300 hover:shadow-md overflow-hidden"
                aria-label="Learn more about Birmingham Black Youth Ministry"
              >
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                  Learn More About Us
                </span>
                <div className="absolute inset-0 bg-red-700 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="absolute inset-0 bg-red-700 transform scale-x-0 origin-left transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-10"></div>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Visual continuity element - subtle gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent opacity-70 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default MissionSection;