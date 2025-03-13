'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbsProps {
  className?: string;
}

// Custom function to format breadcrumb labels
const formatLabel = (segment: string): string => {
  // Convert kebab-case or snake_case to Title Case with spaces
  return segment
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const pathname = usePathname();
  
  // Handle case where pathname is null or home page
  if (!pathname || pathname === '/') {
    return null;
  }

  // Split the pathname into segments and remove empty segments
  const segments = pathname.split('/').filter(Boolean);
  
  // If there are no segments, don't render breadcrumbs
  if (segments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`max-w-7xl mx-auto px-4 py-3 ${className}`}>
      <ol className="flex items-center text-sm text-[#F5E6CC]/70">
        {/* Home link */}
        <li>
          <Link 
            href="/" 
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        
        {/* Separator after Home */}
        <li className="mx-2 text-[#F5E6CC]/50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
        
        {/* Generate breadcrumb items for each segment */}
        {segments.map((segment, index) => {
          // Build the href for this segment
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          
          return (
            <React.Fragment key={segment}>
              <li>
                {isLast ? (
                  // Current page (not a link)
                  <span className="text-[#D4AF37] font-medium">
                    {formatLabel(segment)}
                  </span>
                ) : (
                  // Link to previous level
                  <Link 
                    href={href}
                    className="hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {formatLabel(segment)}
                  </Link>
                )}
              </li>
              
              {/* Add separator if not the last item */}
              {!isLast && (
                <li className="mx-2 text-[#F5E6CC]/50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 