import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#222222] shadow-md">
      <nav className="container flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#D4A017] rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-[#222222] font-inter">B</span>
          </div>
          <span className="text-xl font-bold text-white font-inter">BBYM</span>
        </div>
        <ul className="flex items-center space-x-6 font-inter">
          <li><Link href="/about" className="text-white hover:text-[#D4A017] transition-colors">About</Link></li>
          <li><Link href="/ministry" className="text-white hover:text-[#D4A017] transition-colors">Ministry</Link></li>
          <li><Link href="/programs" className="text-white hover:text-[#D4A017] transition-colors">Programs</Link></li>
          <li><Link href="/events" className="text-white hover:text-[#D4A017] transition-colors">Events</Link></li>
          <li><Link href="/team" className="text-white hover:text-[#D4A017] transition-colors">Team</Link></li>
          <li><Link href="/contact" className="text-white hover:text-[#D4A017] transition-colors">Contact</Link></li>
          <li>
            <Link href="/get-involved" className="button button--primary">
              Get Involved
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;