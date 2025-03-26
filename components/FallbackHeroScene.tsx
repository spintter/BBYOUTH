'use client';

import React, { useState, useEffect } from 'react';

// Fallback Hero Scene that just renders a dark background and chess imagery
export default function FallbackHeroScene() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <div className="relative w-full h-[90vh] md:h-screen">
      {/* Dark background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#030315] to-[#0A0A20]"
      />
      
      {/* Chess grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const isBlack = (row + col) % 2 === 1;
            
            return (
              <div 
                key={index} 
                className={`
                  ${isBlack ? 'bg-slate-800' : 'bg-transparent'} 
                  transition-opacity duration-300
                  ${loaded ? 'opacity-100' : 'opacity-0'}
                `}
                style={{ transitionDelay: `${index * 5}ms` }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Chess piece silhouettes */}
      <div className="absolute bottom-0 right-0 opacity-20 h-1/2 w-1/3">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path 
            d="M30,80 L70,80 L65,75 L35,75 L30,80 Z M40,75 L60,75 L58,70 L42,70 L40,75 Z M45,70 L55,70 L55,40 L45,40 L45,70 Z M40,40 L60,40 L60,35 C60,25 50,20 50,20 C50,20 40,25 40,35 L40,40 Z" 
            fill="#FFD700"
          />
        </svg>
      </div>
      
      {/* Gold shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-300"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.7)',
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, 10px); }
            50% { transform: translate(0, 20px); }
            75% { transform: translate(-10px, 10px); }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight">
            <span className="block" style={{ animation: 'fadeInUp 1s ease-out', animationDelay: '0s', opacity: loaded ? 1 : 0 }}>Empowerment</span>
            <span className="block" style={{ animation: 'fadeInUp 1s ease-out', animationDelay: '0.2s', opacity: loaded ? 1 : 0 }}>through</span>
            <span className="block text-yellow-400" style={{ animation: 'fadeInUp 1s ease-out', animationDelay: '0.4s', opacity: loaded ? 1 : 0 }}>strategy</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg" 
            style={{ animation: 'fadeInUp 1s ease-out', animationDelay: '0.6s', opacity: loaded ? 1 : 0 }}
          >
            Guiding Birmingham's youth through <span className="text-cyan-400">critical thinking</span>, <span className="text-purple-400">cultural heritage</span>, and <span className="text-pink-400">creative expression</span> to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
          </p>
          <div style={{ animation: 'fadeInUp 1s ease-out', animationDelay: '0.8s', opacity: loaded ? 1 : 0 }}>
            <a 
              href="#mission" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            >
              Join Our Program
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
