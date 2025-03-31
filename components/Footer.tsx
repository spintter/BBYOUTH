'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Styled components for the back-to-top button
const BackToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 100,
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Show back-to-top button after scrolling down 50% of the viewport height
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.5;
      setShowBackToTop(window.scrollY > scrollThreshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Footer links organized by section
  const footerLinks = {
    about: [
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'History', href: '/about#history' },
      { name: 'Team', href: '/team' },
      { name: 'Contact', href: '/contact' }
    ],
    programs: [
      { name: 'Youth Programs', href: '/programs' },
      { name: 'Workshops', href: '/programs' },
      { name: 'Mentorship', href: '/programs' },
      { name: 'Study Resources', href: '/study-resources' }
    ],
    resources: [
      { name: 'Study Materials', href: '/study-resources' },
      { name: 'Events Calendar', href: '/events' },
      { name: 'Ministry', href: '/ministry' },
      { name: 'Get Involved', href: '/get-involved' }
    ],
    connect: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'About Us', href: '/about' },
      { name: 'Team', href: '/team' },
      { name: 'Get Involved', href: '/get-involved' }
    ]
  };
  
  // Social media links
  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/youths', icon: 'facebook' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' }
  ];

  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#00C4FF] text-2xl font-bold">B</span>
                </div>
                <span className="ml-3 text-xl font-bold font-montserrat">BBYM</span>
              </div>
            </Link>
            <p className="text-[#F5F5F5] mb-6 font-inter">
              Birmingham Black Youth Ministry is dedicated to empowering young minds through 
              humanities education, fostering critical thinking, cultural awareness, and 
              leadership skills in our community.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F5] hover:text-[#00C4FF] transition-colors duration-300"
                  aria-label={link.name}
                >
                  {link.icon === 'facebook' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  )}
                  {link.icon === 'twitter' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  )}
                  {link.icon === 'instagram' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {link.icon === 'youtube' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#8B0000] font-montserrat">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#F5F5F5] hover:text-[#8B0000] transition-colors duration-300 font-inter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-[#FFD700] font-montserrat">Programs</h3>
            <ul className="space-y-2">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#F5F5F5] hover:text-[#FFD700] transition-colors duration-300 font-inter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-[#8B0000] font-montserrat">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-[#F5F5F5] hover:text-[#8B0000] transition-colors duration-300 font-inter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section with contact and copyright */}
        <div className="mt-12 pt-8 border-t border-[#2C2F77]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-[#F5F5F5] font-inter">
                &copy; {currentYear} Birmingham Black Youth Ministry. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/privacy" 
                className="text-[#F5F5F5] hover:text-[#00C4FF] transition-colors duration-300 font-inter"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-[#F5F5F5] hover:text-[#00C4FF] transition-colors duration-300 font-inter"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button using MUI IconButton */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BackToTopButton
              onClick={scrollToTop}
              size="large"
              aria-label="Scroll back to top"
            >
              <KeyboardArrowUpIcon fontSize="large" />
            </BackToTopButton>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer; 