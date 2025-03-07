'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdaptiveRenderer } from './AdaptiveRenderer';
import { AfrocentricChessScene } from './AfrocentricChessScene';

interface KnowledgeIsPowerHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onExplore?: () => void;
}

export function KnowledgeIsPowerHero({
  title = 'Knowledge is Power',
  subtitle = 'From Potential to Wisdom',
  ctaText = 'Explore Our Programs',
  onExplore = () => {}
}: KnowledgeIsPowerHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [transformationActive, setTransformationActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Start transformation after a delay
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setTransformationActive(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);
  
  // Handle scene loaded
  const handleSceneLoaded = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className="relative w-full h-screen" ref={containerRef}>
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <AdaptiveRenderer>
          <AfrocentricChessScene 
            onLoaded={handleSceneLoaded}
            transformationActive={transformationActive}
          />
        </AdaptiveRenderer>
      </div>
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 text-white max-w-xl z-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="inline-block bg-gradient-to-r from-orange-500 via-orange-400 to-red-600 
                         bg-clip-text text-transparent 
                         filter drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]
                         hover:scale-[1.02] transition-transform duration-300">
            {title.split(' ').map((word, i) => (
              <span 
                key={i}
                className="inline-block hover:translate-y-[-2px] transition-transform duration-200"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {word}{' '}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-normal mb-6 animate-fade-in">
          {subtitle}
        </p>
        <button
          onClick={onExplore}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 animate-fade-in"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
} 