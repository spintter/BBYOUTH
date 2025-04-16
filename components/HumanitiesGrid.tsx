'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { topics, Topic, chessPieceIcons } from '../data/topics';

interface ChessCoordinate {
  file: string;
  rank: number;
}

const HumanitiesGrid: React.FC = () => {
  const [activeSquare, setActiveSquare] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'az' | 'za'>('default');
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(topics);
  const chessboardRef = useRef<HTMLDivElement>(null);

  // Custom cursor state
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // For keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Generate chess board coordinates
  const columns = ['A', 'B', 'C', 'D'];
  const rows = ['1', '2', '3'];

  // Handle custom cursor movement
  const handleMouseMove = (e: React.MouseEvent): void => {
    if (chessboardRef.current) {
      const boardRect = chessboardRef.current.getBoundingClientRect();
      if (
        e.clientX >= boardRect.left &&
        e.clientX <= boardRect.right &&
        e.clientY >= boardRect.top &&
        e.clientY <= boardRect.bottom
      ) {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        setCursorVisible(true);
      } else {
        setCursorVisible(false);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (!chessboardRef.current) return;

    // Only handle keyboard events when the board is in focus
    if (
      document.activeElement === chessboardRef.current ||
      chessboardRef.current.contains(document.activeElement)
    ) {
      let newIndex = focusedIndex;
      const totalSquares = filteredTopics.length;
      const gridColumns = window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : 4;

      switch (e.key) {
        case 'ArrowRight':
          newIndex = focusedIndex + 1;
          if (newIndex >= totalSquares) newIndex = 0;
          break;
        case 'ArrowLeft':
          newIndex = focusedIndex - 1;
          if (newIndex < 0) newIndex = totalSquares - 1;
          break;
        case 'ArrowDown':
          newIndex = focusedIndex + gridColumns;
          if (newIndex >= totalSquares) newIndex = focusedIndex % gridColumns;
          break;
        case 'ArrowUp':
          newIndex = focusedIndex - gridColumns;
          if (newIndex < 0) newIndex = totalSquares - (gridColumns - (focusedIndex % gridColumns));
          if (newIndex >= totalSquares) newIndex = totalSquares - 1;
          break;
        default:
          return; // Don't handle other keys
      }

      setFocusedIndex(newIndex);

      // Find and focus the element
      const squareElement = document.getElementById(`topic-square-${newIndex}`);
      if (squareElement) {
        squareElement.focus();
        e.preventDefault(); // Prevent scrolling
      }
    }
  };

  // Sort topics based on selected order
  useEffect(() => {
    let sorted = [...topics];

    if (sortOrder === 'az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'za') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredTopics(sorted);
  }, [sortOrder]);

  // Add event listeners for keyboard navigation and cursor
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex]);

  // Handle sorting change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortOrder(e.target.value as 'default' | 'az' | 'za');
  };

  return (
    <section
      className="py-16 bg-gray-50 relative"
      aria-labelledby="humanities-heading"
      onMouseMove={handleMouseMove}
    >
      {/* Custom Chess Cursor */}
      {cursorVisible && (
        <div
          className="fixed w-8 h-8 pointer-events-none z-50 flex items-center justify-center text-red-600"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
          }}
        >
          ♕
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            id="humanities-heading"
            className="text-gray-900 font-['Playfair_Display'] font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            Humanities Topics
          </h2>
          <p className="text-gray-600 font-['Poppins'] text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
            Discover our curated selection of humanities subjects, crafted to inspire critical
            thinking, cultural awareness, and intellectual growth.
          </p>
          <div
            className="mx-auto mt-6 mb-2 rounded-full"
            style={{
              width: '8rem',
              height: '0.25rem',
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.2)',
            }}
          ></div>
        </div>

        {/* Sort Options */}
        <div className="max-w-5xl mx-auto mb-6 flex justify-end">
          <div className="inline-flex items-center bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <label
              htmlFor="sort-topics"
              className="px-3 py-2 text-gray-700 font-medium"
            >
              Sort:
            </label>
            <select
              id="sort-topics"
              value={sortOrder}
              onChange={handleSortChange}
              className="px-3 py-2 text-gray-700 outline-none border-l border-gray-200 focus:ring-2 focus:ring-red-500"
            >
              <option value="default">Default</option>
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
            </select>
          </div>
        </div>

        {/* Chessboard Container with Border Frame */}
        <div
          className="max-w-5xl mx-auto p-4 rounded-lg shadow-xl relative"
          style={{
            background: 'linear-gradient(45deg, #8B4513, #A0522D)',
            border: '12px solid #5D4037',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.3)',
            transform: 'perspective(1000px) rotateX(2deg)',
            transformStyle: 'preserve-3d',
          }}
          ref={chessboardRef}
          tabIndex={0}
          aria-label="Interactive chessboard-style humanities topics grid"
        >
          {/* Chess Board Coordinates - Top */}
          <div className="absolute top-0 left-0 right-0 flex justify-around px-8 -mt-8">
            {columns.map((column) => (
              <div
                key={column}
                className="w-6 h-6 bg-amber-800 rounded-full flex items-center justify-center text-amber-100 font-bold"
              >
                {column}
              </div>
            ))}
          </div>

          {/* Chess Board Coordinates - Left */}
          <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-around py-4 -ml-8">
            {rows.map((row) => (
              <div
                key={row}
                className="w-6 h-6 bg-amber-800 rounded-full flex items-center justify-center text-amber-100 font-bold"
              >
                {row}
              </div>
            ))}
          </div>

          {/* Chessboard Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                  ease: 'easeOut',
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {filteredTopics.map((topic, index) => {
              // True chessboard pattern - alternating light and dark squares
              const row = Math.floor(index / 4);
              const col = index % 4;
              const isLightSquare = (row + col) % 2 === 0;

              // Get topic path for chess piece icon
              const topicPath = topic.link.split('/').pop() || '';
              const chessPiece = chessPieceIcons[topicPath] || '♟';

              // Get coordinate label
              const coordinateLabel = columns[col % 4] + rows[Math.min(row, 2)];

              // Determine if this is the focused square
              const isFocused = index === focusedIndex;

              return (
                <motion.div
                  id={`topic-square-${index}`}
                  key={topic.id}
                  aria-label={`${coordinateLabel}: ${topic.title} topic: ${topic.description}`}
                  tabIndex={0}
                  onFocus={() => setFocusedIndex(index)}
                  onMouseEnter={() => setActiveSquare(topic.id)}
                  onMouseLeave={() => setActiveSquare(null)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, rotateY: -15 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.23, 1, 0.32, 1],
                        delay: index * 0.05,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                    borderColor: '#dc2626',
                    z: 30,
                    transition: {
                      duration: 0.4,
                      ease: [0.19, 1, 0.22, 1],
                      scale: { duration: 0.4, type: 'spring', stiffness: 300 },
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                    rotateY: 5,
                    transition: { duration: 0.2 },
                  }}
                  className={`group relative aspect-square flex flex-col justify-between p-6 text-center ${
                    isLightSquare ? 'bg-amber-50' : 'bg-gray-900'
                  } border-2 ${isFocused ? 'border-red-500' : isLightSquare ? 'border-amber-200' : 'border-gray-800'} 
                  overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  transition-all duration-300 transform-gpu`}
                  style={{
                    boxShadow: isLightSquare
                      ? 'inset 0 0 10px rgba(251, 191, 36, 0.1)'
                      : 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Coordinate Label */}
                  <div className="absolute top-1 left-1 text-xs font-mono opacity-50 pointer-events-none">
                    {coordinateLabel}
                  </div>

                  {/* Chess Piece Icon */}
                  <div
                    className={`absolute top-3 right-3 text-2xl ${
                      isLightSquare ? 'text-red-500/70' : 'text-red-300/70'
                    } transform transition-transform duration-500 group-hover:rotate-[360deg]`}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  >
                    {chessPiece}
                  </div>

                  {/* Chess-piece inspired corner decorations */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600 opacity-50"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-600 opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-600 opacity-50"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-600 opacity-50"></div>

                  {/* Enhanced 3D Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(220, 38, 38, 0.1)',
                      background: `radial-gradient(circle at 50% 50%, ${isLightSquare ? 'rgba(255, 255, 255, 0.8)' : 'rgba(220, 38, 38, 0.1)'}, transparent 70%)`,
                    }}
                  ></div>

                  {/* Subtle Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${isLightSquare ? 'from-amber-100/50 to-transparent' : 'from-red-900/20 to-transparent'} opacity-20 pointer-events-none`}
                  ></div>

                  <div>
                    <h3
                      className={`font-['Playfair_Display'] font-bold text-xl md:text-2xl mb-3 relative transition-all duration-300`}
                      style={{
                        color: isLightSquare ? '#d00' : '#ff3333',
                        textShadow: isLightSquare
                          ? '0 1px 2px rgba(0,0,0,0.1)'
                          : '0 1px 3px rgba(255,0,0,0.2)',
                      }}
                    >
                      {topic.title}
                      <span className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-red-600 group-hover:w-3/4 transition-all duration-300"></span>
                    </h3>
                    <p
                      className={`font-['Poppins'] text-base line-clamp-2 ${
                        isLightSquare ? 'text-gray-700' : 'text-gray-300'
                      }`}
                    >
                      {topic.description}
                      <span className="sr-only">{topic.description}</span>
                    </p>
                  </div>
                  <Link
                    href={topic.link}
                    className={`inline-flex items-center font-['Poppins'] text-base font-medium transition-colors duration-300 ${
                      isLightSquare
                        ? 'text-red-600 hover:text-red-800'
                        : 'text-red-400 hover:text-red-300'
                    }`}
                  >
                    Explore
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>

                  {/* Topic Preview Tooltip */}
                  <AnimatePresence>
                    {activeSquare === topic.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-0 right-0 bottom-[-108px] sm:left-auto sm:right-[-190px] sm:top-0 sm:bottom-auto z-50 w-full sm:w-64 p-3 rounded-lg shadow-xl ${
                          isLightSquare ? 'bg-white' : 'bg-gray-800'
                        } border border-red-200 text-left`}
                        style={{
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                          pointerEvents: 'none',
                        }}
                      >
                        <div className="flex items-start mb-2">
                          <span className="text-red-500 text-2xl mr-2">{chessPiece}</span>
                          <h4
                            className="text-base font-bold"
                            style={{ color: isLightSquare ? '#d00' : '#ff3333' }}
                          >
                            {topic.title}
                          </h4>
                        </div>
                        <p
                          className={`text-sm ${isLightSquare ? 'text-gray-700' : 'text-gray-300'}`}
                        >
                          {topic.description}
                        </p>
                        <div className="text-xs mt-2 text-gray-500">Press Enter to explore</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Chess Board Coordinates - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-8 -mb-8">
            {columns.map((column) => (
              <div
                key={`bottom-${column}`}
                className="w-6 h-6 bg-amber-800 rounded-full flex items-center justify-center text-amber-100 font-bold"
              >
                {column}
              </div>
            ))}
          </div>

          {/* Chess Board Coordinates - Right */}
          <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around py-4 -mr-8">
            {rows.map((row) => (
              <div
                key={`right-${row}`}
                className="w-6 h-6 bg-amber-800 rounded-full flex items-center justify-center text-amber-100 font-bold"
              >
                {row}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div
          className="max-w-5xl mx-auto mt-4 h-4 rounded-b-lg"
          style={{
            background: 'linear-gradient(to right, #8B4513, #A0522D, #8B4513)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
        ></div>

        {/* Keyboard Navigation Instructions */}
        <div className="max-w-5xl mx-auto mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
            <span className="text-gray-700 text-sm mr-2">Keyboard Navigation:</span>
            <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
              ↑
            </kbd>
            <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
              ↓
            </kbd>
            <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
              ←
            </kbd>
            <kbd className="mx-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
              →
            </kbd>
            <span className="ml-2 text-gray-700 text-sm">
              to navigate,{' '}
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                Enter
              </kbd>{' '}
              to select
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanitiesGrid;
