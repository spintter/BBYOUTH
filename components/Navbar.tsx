//navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Logo component with updated styling
const ChessPawnLogo = () => (
  <div className="logo-container flex items-center">
    <div className="logo-wrapper h-[50px] w-[50px] relative">
      <div className="logo-bg absolute inset-0 bg-white rounded-full opacity-90"></div>
      <div className="logo-letter text-bbym-orange font-bold text-3xl absolute inset-0 flex items-center justify-center">
        B
      </div>
    </div>
    <span className="logo-text ml-2 text-lg font-semibold tracking-wide font-subheading">BBYM</span>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll event to change navbar background
  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Add ripple effect for nav links
  const addRippleEffect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const link = e.currentTarget;
    
    // Create ripple element
    const ripple = document.createElement('span');
    const rect = link.getBoundingClientRect();
    
    // Calculate position relative to the clicked element
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
    link.appendChild(ripple);
    setTimeout(() => {
      link.removeChild(ripple);
    }, 700);
  };

  // Navigation links based on guide.md
  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Ministry', href: '/ministry' },
    { name: 'Programs', href: '/programs' },
    { name: 'Events', href: '/events' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' }
  ];

  if (!isMounted) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-medium-blue bg-opacity-90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4 lg:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ChessPawnLogo />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="nav-link text-base font-medium text-gray-200 hover:text-primary-gold relative transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <button className="cta-primary">Get Involved</button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-medium-blue bg-opacity-90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 py-4 lg:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <ChessPawnLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="nav-link text-base font-medium text-gray-200 hover:text-primary-gold relative transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
          <button className="cta-primary">Get Involved</button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="lg:hidden bg-medium-blue shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="text-gray-200 text-lg font-medium py-2 hover:text-primary-gold transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <button className="cta-primary mt-4">Get Involved</button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;