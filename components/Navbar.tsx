'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from '@headlessui/react';

// Define navLinks with a type
const navLinks: string[] = ['About', 'Ministry', 'Programs', 'Events', 'Team', 'Contact'];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bbym-neutral shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4 md:px-6 md:py-4 lg:px-6 lg:py-4">
        <div className="text-4xl font-bold text-bbym-primary">B</div>
        <nav className="hidden md:flex space-x-6" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <motion.a
              key={link}
              href="#"
              className="text-bbym-light hover:text-bbym-secondary relative"
              whileHover={{ color: '#E55A00' }}
            >
              {link}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-bbym-secondary"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </nav>
        <Menu as="div" className="md:hidden">
          <Menu.Button className="p-2 text-bbym-light">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </Menu.Button>
          <Menu.Items
            as={motion.div}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            className="absolute top-full left-0 w-full bg-bbym-neutral"
          >
            {navLinks.map((link) => (
              <Menu.Item key={link}>
                {({ active }: { active: boolean }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-bbym-light ${active ? 'bg-bbym-secondary' : ''}`}
                  >
                    {link}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </motion.header>
  );
};

export default Navbar;