'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedEvents = () => {
  return (
    <section className="py-20 bg-[#1A1A2E]">
      <div className="container mx-auto px-6">
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              src="/images/optimized/16thst_bap_optimized.jpg"
              alt="Featured Events Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E] via-[#1A1A2E80] to-transparent"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="inline-block px-4 py-1 bg-[#00C4FF] text-white text-sm font-medium rounded-full mb-4 font-poppins">
                Upcoming
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
                Join Our Community Events
              </h2>
              <p className="text-lg text-[#F5F5F5] mb-8 font-poppins">
                Discover workshops, lectures, performances, and gatherings that celebrate 
                the humanities and foster connections within our community.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/events" 
                  className="inline-block px-8 py-3 bg-[#FFD700] text-[#1A1A2E] font-medium rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-poppins"
                >
                  View All Events
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-10 right-10 w-20 h-20 rounded-full bg-[#00C4FF] opacity-20 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#FFD700] opacity-10 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents; 