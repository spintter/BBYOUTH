'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MissionSection = () => {
  const animationEasing = [0.25, 0.1, 0.25, 1]; // cubic-bezier(0.25, 0.1, 0.25, 1)

  return (
    <section className="relative py-16 bg-gray-50 overflow-hidden" role="region" aria-labelledby="mission-heading">
      {/* Refined Chessboard-inspired Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/5 to-gray-50/5 opacity-10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #ffffff 25%, transparent 25%),
              linear-gradient(-45deg, #ffffff 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ffffff 75%),
              linear-gradient(-45deg, transparent 75%, #ffffff 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
            opacity: 0.05,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 1, ease: animationEasing }}
        >
          <h2 
            id="mission-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 font-['Playfair_Display'] tracking-tight"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            Our Mission
          </h2>

          {/* Enhanced Underline with Gradient and Shadow */}
          <div 
            className="mx-auto mb-12 rounded-full"
            style={{ 
              width: '8rem', 
              height: '0.25rem', 
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.2)'
            }}
          ></div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto border border-gray-100 relative overflow-hidden"
            whileHover={{
              y: -5,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.4, ease: animationEasing }}
          >
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-20 pointer-events-none"></div>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-['Poppins'] mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: animationEasing }}
            >
              <span className="text-[#b91c1c] font-semibold">
                Birmingham Black Youth Ministry
              </span>{' '}
              is dedicated to <span className="text-[#b91c1c] font-semibold">empowering young minds</span> through the humanities. We create spaces where youth can explore{' '}
              <span className="text-[#b91c1c] font-medium">
                literature, history, philosophy, and the arts
              </span>
              , fostering <span className="text-[#b91c1c] font-medium">critical thinking</span> and cultural awareness.
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-['Poppins'] mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: animationEasing }}
            >
              Through our programs, we nurture the next generation of thoughtful leaders who understand the power of ideas, the importance of diverse perspectives, and the value of intellectual curiosity in building a more just and compassionate society.
            </motion.p>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: animationEasing }}
            >
              <a
                href="/about"
                className="relative inline-block bg-red-600 text-white font-['Poppins'] font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-[#b91c1c] hover:shadow-[0_4px_15px_rgba(220,38,38,0.3)]"
                aria-label="Learn more about Birmingham Black Youth Ministry"
                style={{ 
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '3px solid #b91c1c';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Learn More About Us
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;