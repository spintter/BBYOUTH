//navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import Image from 'next/image';

// Define dropdown options for main categories
const k12GuidesOptions = [
  { value: 'elementary', label: 'Elementary (K-5)' },
  { value: 'middle', label: 'Middle School (6-8)' },
  { value: 'high', label: 'High School (9-12)' }
];

const topicsOptions = [
  { value: 'african-history', label: 'African History' },
  { value: 'diaspora', label: 'African Diaspora' },
  { value: 'culture', label: 'Culture & Arts' },
  { value: 'leaders', label: 'Historical Leaders' }
];

const programsOptions = [
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'summer', label: 'Summer Programs' },
  { value: 'scholarships', label: 'Scholarships' }
];

// Custom styles for react-select
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    minWidth: '150px',
    color: '#FFFFFF',
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '0.1em',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#D4AF37' : state.isFocused ? '#1A1A1A' : '#1A1A1A',
    color: '#F5E6CC',
    cursor: 'pointer',
    padding: '10px 15px',
    fontSize: '16px',
    lineHeight: '1.5',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    overflow: 'hidden',
    maxHeight: '0',
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.menu-open': {
      maxHeight: '200px',
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#F5E6CC',
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '0.1em',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#F5E6CC'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  })
};

// SVG Logo Component
const ChessPawnLogo = () => (
  <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.5))' }}>
    <path d="M30 10C26.7 10 24 12.7 24 16C24 17.3 24.4 18.6 25.1 19.6L23 24H37L34.9 19.6C35.6 18.6 36 17.3 36 16C36 12.7 33.3 10 30 10ZM30 12C32.2 12 34 13.8 34 16C34 18.2 32.2 20 30 20C27.8 20 26 18.2 26 16C26 13.8 27.8 12 30 12ZM25.5 26L24 30H36L34.5 26H25.5Z" fill="#D4AF37"/>
    <path d="M22 32V34H38V32H22Z" fill="#D4AF37"/>
    <path d="M20 36V38H40V36H20Z" fill="#D4AF37"/>
    <path d="M50 20L54 16H58L62 20L58 24H54L50 20Z" fill="#D4AF37"/>
    <path d="M54 16L50 12H58L54 16Z" fill="#D4AF37"/>
    <path d="M58 24L62 28H54L58 24Z" fill="#D4AF37"/>
    <text x="70" y="25" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#F5E6CC">BB Youths</text>
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const k12Ref = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown selection
  const handleSelectChange = (option: any, actionMeta: any) => {
    if (option && option.value) {
      // Navigate based on the selected option
      // This would typically use router.push in a real implementation
      console.log(`Navigate to: ${actionMeta.name}/${option.value}`);
      // router.push(`/${actionMeta.name}/${option.value}`);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdowns if clicked outside
      if (activeDropdown === 'k12' && 
          k12Ref.current && 
          !k12Ref.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      
      if (activeDropdown === 'topics' && 
          topicsRef.current && 
          !topicsRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      
      if (activeDropdown === 'programs' && 
          programsRef.current && 
          !programsRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      
      // Close mobile menu if clicked outside
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, isMobileMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, name: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(name);
    } else if (e.key === 'Escape' && activeDropdown) {
      setActiveDropdown(null);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-sm py-2' 
            : 'bg-white py-4'
        }`}
        style={{ position: 'sticky', top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <ChessPawnLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Standard navigation links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative font-['Montserrat'] font-medium text-[#1A1A1A] hover:text-[#8B4513] transition-colors duration-200 text-base leading-normal tracking-wide mr-7 group focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  tabIndex={0}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              
              {/* Dropdown for K-12 Guides */}
              <div 
                className="relative" 
                ref={k12Ref}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 'k12')}
                aria-expanded={activeDropdown === 'k12'}
              >
                <button 
                  className="relative font-['Montserrat'] font-medium text-[#1A1A1A] hover:text-[#8B4513] transition-colors duration-200 text-base leading-normal tracking-wide mr-7 group focus:outline-2 focus:outline-[#8B4513]"
                  onClick={() => toggleDropdown('k12')}
                >
                  K-12 Guides
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'k12' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, maxHeight: 0 }}
                      animate={{ opacity: 1, y: 0, maxHeight: 200 }}
                      exit={{ opacity: 0, y: -10, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {k12GuidesOptions.map(option => (
                          <Link
                            key={option.value}
                            href={`/guides/${option.value}`}
                            className="block px-4 py-2 text-[#F5E6CC] hover:bg-[#333] transition-colors duration-200 text-base leading-normal focus:outline-2 focus:outline-[#D4AF37]"
                            tabIndex={0}
                          >
                            {option.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Dropdown for Topics */}
              <div 
                className="relative"
                ref={topicsRef}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 'topics')}
                aria-expanded={activeDropdown === 'topics'}
              >
                <button 
                  className="relative font-['Montserrat'] font-medium text-[#1A1A1A] hover:text-[#8B4513] transition-colors duration-200 text-base leading-normal tracking-wide mr-7 group focus:outline-2 focus:outline-[#8B4513]"
                  onClick={() => toggleDropdown('topics')}
                >
                  Topics
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'topics' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, maxHeight: 0 }}
                      animate={{ opacity: 1, y: 0, maxHeight: 200 }}
                      exit={{ opacity: 0, y: -10, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {topicsOptions.map(option => (
                          <Link
                            key={option.value}
                            href={`/topics/${option.value}`}
                            className="block px-4 py-2 text-[#F5E6CC] hover:bg-[#333] transition-colors duration-200 text-base leading-normal focus:outline-2 focus:outline-[#D4AF37]"
                            tabIndex={0}
                          >
                            {option.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Dropdown for Programs */}
              <div 
                className="relative"
                ref={programsRef}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 'programs')}
                aria-expanded={activeDropdown === 'programs'}
              >
                <button 
                  className="relative font-['Montserrat'] font-medium text-[#1A1A1A] hover:text-[#8B4513] transition-colors duration-200 text-base leading-normal tracking-wide mr-7 group focus:outline-2 focus:outline-[#8B4513]"
                  onClick={() => toggleDropdown('programs')}
                >
                  Programs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B4513] transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'programs' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, maxHeight: 0 }}
                      animate={{ opacity: 1, y: 0, maxHeight: 200 }}
                      exit={{ opacity: 0, y: -10, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {programsOptions.map(option => (
                          <Link
                            key={option.value}
                            href={`/programs/${option.value}`}
                            className="block px-4 py-2 text-[#F5E6CC] hover:bg-[#333] transition-colors duration-200 text-base leading-normal focus:outline-2 focus:outline-[#D4AF37]"
                            tabIndex={0}
                          >
                            {option.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Donate Button */}
              <Link
                href="/donate"
                className="hidden md:inline-block px-6 py-2 bg-[#8B4513] text-white font-['Montserrat'] font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#6D3510] hover:scale-105 focus:ring-2 focus:ring-[#8B4513] focus:outline-none"
              >
                Donate
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2 focus:ring-offset-white rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, translateX: '-100%' }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-[60px] left-0 right-0 bottom-0 z-40 bg-white shadow-lg md:hidden overflow-y-auto"
            aria-live="polite"
          >
            <div className="px-4 py-4 space-y-3 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-[#1A1A1A] hover:text-[#8B4513] transition-colors duration-200 text-base leading-normal tracking-wide focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  tabIndex={0}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile dropdown sections */}
              <div className="py-2 border-t border-[#F5F5F5] mt-2">
                <p className="text-[#8B4513] font-medium mb-2 text-base leading-normal tracking-wide">K-12 Guides</p>
                {k12GuidesOptions.map(option => (
                  <Link
                    key={option.value}
                    href={`/guides/${option.value}`}
                    className="block py-1 pl-2 text-[#4A4A4A] hover:text-[#8B4513] text-base leading-normal focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    onClick={() => setIsMobileMenuOpen(false)}
                    tabIndex={0}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
              
              <div className="py-2 border-t border-[#F5F5F5]">
                <p className="text-[#8B4513] font-medium mb-2 text-base leading-normal tracking-wide">Topics</p>
                {topicsOptions.map(option => (
                  <Link
                    key={option.value}
                    href={`/topics/${option.value}`}
                    className="block py-1 pl-2 text-[#4A4A4A] hover:text-[#8B4513] text-base leading-normal focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    onClick={() => setIsMobileMenuOpen(false)}
                    tabIndex={0}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
              
              <div className="py-2 border-t border-[#F5F5F5]">
                <p className="text-[#8B4513] font-medium mb-2 text-base leading-normal tracking-wide">Programs</p>
                {programsOptions.map(option => (
                  <Link
                    key={option.value}
                    href={`/programs/${option.value}`}
                    className="block py-1 pl-2 text-[#4A4A4A] hover:text-[#8B4513] text-base leading-normal focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    onClick={() => setIsMobileMenuOpen(false)}
                    tabIndex={0}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
              
              <Link
                href="/donate"
                className="block py-3 mt-4 text-center rounded-full bg-[#8B4513] text-white font-medium text-base leading-normal tracking-wide focus:outline-none focus:ring-2 focus:ring-[#8B4513] hover:bg-[#6D3510]"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={0}
              >
                Donate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add keyframes for underline animation */}
      <style jsx global>{`
        @keyframes underline-expand {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .group:hover span {
          animation: underline-expand 0.3s forwards;
        }
        
        /* Focus styles for accessibility */
        a:focus, button:focus {
          outline: 2px solid #D4AF37;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default Navbar;