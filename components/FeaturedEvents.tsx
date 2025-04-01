'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedEvents = () => {
  // Consistent animation easing across components
  const animationEasing = [0.25, 0.1, 0.25, 1]; // cubic-bezier(0.25, 0.1, 0.25, 1)
  
  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        {/* Section header with visual thread element */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: animationEasing }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 font-montserrat">Community Events</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-inter mb-8">
            Discover workshops, lectures, performances, and gatherings that celebrate 
            the humanities and foster connections within our community.
          </p>
          {/* Visual thread element - matching other sections */}
          <div className="w-24 h-1 bg-red-700 mx-auto mb-4 rounded-full"></div>
        </motion.div>
        
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: animationEasing }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="relative h-[400px] md:h-[500px] w-full">
            <Image 
              className="rounded-lg object-cover w-full h-full absolute inset-0 transform transition-transform duration-500 group-hover:scale-110"
              src="/images/young_group.jpg"
              alt="Featured event - Group of Young African American Students"
              width={600}
              height={400}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/70 via-slate-800/40 to-transparent"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: animationEasing }}
            >
              <span className="inline-block px-4 py-1 bg-red-700 text-white text-sm font-medium rounded-full mb-4 font-inter">
                Upcoming
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">
                Join Our Community Events
              </h2>
              <p className="text-lg text-white mb-8 font-inter">
                Discover workshops, lectures, performances, and gatherings that celebrate 
                the humanities and foster connections within our community.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/events" 
                  className="group relative inline-block px-8 py-3 bg-white text-slate-800 font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md font-inter overflow-hidden"
                >
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    View All Events
                  </span>
                  <div className="absolute inset-0 bg-slate-100 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Decorative elements with consistent animation */}
          <motion.div 
            className="absolute top-10 right-10 w-20 h-20 rounded-full bg-red-700 opacity-10 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: animationEasing
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-green-700 opacity-5 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
              ease: animationEasing
            }}
          />
        </motion.div>
        
        {/* Visual continuity elements */}
        <div className="flex justify-center mt-12">
          <div className="w-24 h-1 bg-red-700/30 rounded-full"></div>
        </div>
        
        {/* Visual continuity element - subtle gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent opacity-70 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default FeaturedEvents; 