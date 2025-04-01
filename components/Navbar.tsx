import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white font-inter">B</span>
          </div>
          <span className="text-xl font-bold text-slate-800 font-inter">BBYM</span>
        </Link>
        <ul className="flex items-center space-x-6 font-inter">
          <li><Link href="/about" className="text-slate-700 hover:text-[#8B0000] transition-colors">About</Link></li>
          <li><Link href="/ministry" className="text-slate-700 hover:text-[#8B0000] transition-colors">Ministry</Link></li>
          <li><Link href="/programs" className="text-slate-700 hover:text-[#8B0000] transition-colors">Programs</Link></li>
          <li><Link href="/events" className="text-slate-700 hover:text-[#8B0000] transition-colors">Events</Link></li>
          <li><Link href="/team" className="text-slate-700 hover:text-[#8B0000] transition-colors">Team</Link></li>
          <li><Link href="/study-resources" className="text-slate-700 hover:text-[#8B0000] transition-colors">School Resources</Link></li>
          <li><Link href="/contact" className="text-slate-700 hover:text-[#8B0000] transition-colors">Contact</Link></li>
          <li>
            <Link href="/get-involved" className="inline-block px-5 py-2 bg-[#8B0000] text-white font-medium rounded-full hover:bg-[#700000] transition-all duration-300">
              Get Involved
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;