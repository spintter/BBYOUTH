'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MissionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1A1A2E] to-[#2C2F77]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-white font-playfair"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Our Mission
          </motion.h2>
          
          <motion.div 
            className="mission-card bg-[#2C2F77] p-8 md:p-10 rounded-lg shadow-xl border-2 border-[#00C4FF] hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 196, 255, 0.25)" }}
          >
            <p className="text-lg md:text-xl text-[#F5F5F5] leading-relaxed font-poppins mb-6">
              Birmingham Black Youth Ministry is dedicated to empowering young minds through the humanities. 
              We believe in creating spaces where youth can explore literature, history, philosophy, and the arts 
              while developing critical thinking skills and cultural awareness.
            </p>
            
            <p className="text-lg md:text-xl text-[#F5F5F5] leading-relaxed font-poppins">
              Through our programs, we aim to nurture the next generation of thoughtful leaders who understand 
              the power of ideas, the importance of diverse perspectives, and the value of intellectual curiosity 
              in building a more just and compassionate society.
            </p>
            
            <div className="mt-8 flex justify-center">
              <motion.a 
                href="/about" 
                className="inline-block px-8 py-3 bg-[#00C4FF] text-white font-medium rounded-full hover:bg-[#FFD700] hover:text-[#1A1A2E] transition-all duration-300 shadow-lg hover:shadow-xl font-poppins"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;