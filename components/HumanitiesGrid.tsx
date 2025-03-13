'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Define the category type
interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  chessPiece: string;
  iconLabel: string;
  image: string;
}

// Categories with semantic chess piece descriptions for accessibility
const categories: Category[] = [
  { name: 'African History', slug: '/topics/african-history', icon: '♔', description: 'Explore Africa\'s rich historical legacy.', chessPiece: 'King', iconLabel: 'King icon', image: '/images/blackhistory.jpeg' },
  { name: 'African Literature', slug: '/topics/african-literature', icon: '♕', description: 'Discover voices of African storytelling.', chessPiece: 'Queen', iconLabel: 'Queen icon', image: '/images/mlk.jpeg' },
  { name: 'Cultural Studies', slug: '/topics/cultural-studies', icon: '♗', description: 'Dive into African cultural diversity.', chessPiece: 'Bishop', iconLabel: 'Bishop icon', image: '/images/16thst_bap.jpg' },
  { name: 'Music & Dance', slug: '/topics/music-dance', icon: '♘', description: 'Experience rhythmic African traditions.', chessPiece: 'Knight', iconLabel: 'Knight icon', image: '/images/urban_youth_optimized.webp' },
  { name: 'African Philosophy', slug: '/topics/african-philosophy', icon: '♖', description: 'Study profound African thought.', chessPiece: 'Rook', iconLabel: 'Rook icon', image: '/images/dad_hig_son_optimized.webp' },
  { name: 'Visual Arts', slug: '/topics/visual-arts', icon: '♙', description: 'Appreciate African artistic heritage.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/group_graduate_optimized.webp' },
  { name: 'Performing Arts', slug: '/topics/performing-arts', icon: '♙', description: 'Engage with theatrical expressions.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/church_optimized.webp' },
  { name: 'Contemporary Issues', slug: '/topics/contemporary-issues', icon: '♙', description: 'Address today\'s African challenges.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/sixth_baptist2_optimized.webp' },
  { name: 'Language Studies', slug: '/topics/language-studies', icon: '♙', description: 'Learn Africa\'s linguistic diversity.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/dad_son_playing_optimized.webp' },
  { name: 'Religion & Spirituality', slug: '/topics/religion-spirituality', icon: '♙', description: 'Explore spiritual traditions.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/ruby_UA_optimized.webp' },
  { name: 'Political Thought', slug: '/topics/political-thought', icon: '♙', description: 'Analyze African governance ideas.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/church3.webp' },
  { name: 'Social Justice', slug: '/topics/social-justice', icon: '♙', description: 'Advocate for equity and rights.', chessPiece: 'Pawn', iconLabel: 'Pawn icon', image: '/images/church4.webp' },
];

const HumanitiesGrid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added for loading state

  // Ensure a full 4x3 grid to complete the chessboard structure
  const grid = Array(4).fill(null).map(() => Array(3).fill(null));
  categories.forEach((cat, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    grid[row][col] = cat;
  });

  // Intersection Observer with fallback for loading state
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsLoading(false);
        }
      },
      { threshold: 0.3 }
    );
    const section = document.querySelector('.humanities-section');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animation variants with further optimization
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="humanities-section py-20 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="section-title text-5xl font-bold text-[#1A1A1A] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Explore the Humanities
          </motion.h2>
          <motion.p
            className="section-subtitle text-xl text-[#4A4A4A] mt-4 max-w-3xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            A strategic journey through Afrocentric disciplines, inspired by the chessboard of intellectual growth.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="text-center text-[#1A1A1A]">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-6xl mx-auto relative"
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            {grid.flat().map((cell, index) => {
              if (!cell) return null;
              const row = Math.floor(index / 3);
              const col = index % 3;
              const isLightSquare = (row + col) % 2 === 0;

              return (
                <motion.div
                  key={`${row}-${col}`}
                  className={`relative flex flex-col rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm ${
                    isLightSquare ? 'bg-[#FFFFFF]' : 'bg-[#F5F5F5]'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px #8B4513' }}
                  data-tooltip-id={`tooltip-${index}`}
                >
                  <div className="aspect-ratio-4-3 overflow-hidden">
                    <img 
                      src={cell.image} 
                      alt={`${cell.name} illustration`}
                      className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <Link
                    href={cell.slug}
                    className="w-full h-full flex flex-col items-center justify-center p-4 focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    aria-label={`Explore ${cell.name}`}
                  >
                    <span
                      className="font-['Montserrat'] font-semibold text-xl text-[#1A1A1A]"
                    >
                      {cell.name}
                    </span>
                    <span className="text-[#4A4A4A] text-sm mt-2 text-center">
                      {cell.description}
                    </span>
                  </Link>
                  <Tooltip
                    id={`tooltip-${index}`}
                    place="top"
                    style={{
                      backgroundColor: '#1A1A1A',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '16px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                      zIndex: 10,
                    }}
                    positionStrategy="fixed"
                  >
                    {cell.description}
                  </Tooltip>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <motion.a
            href="/topics"
            className="inline-block px-8 py-3 bg-[#8B4513] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#6D3510] hover:scale-105 focus:ring-2 focus:ring-[#8B4513] focus:outline-none"
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore All Topics
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;