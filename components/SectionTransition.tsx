'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface SectionTransitionProps {
  children: React.ReactNode;
  nextSectionPreview?: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'dissolve';
  className?: string;
}

export default function SectionTransition({
  children,
  nextSectionPreview,
  transitionType = 'fade',
  className = '',
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Transform values for parallax and fade effects
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.98, 1, 1, 0.98]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [20, 0, 0, -20]);

  // Intersection Observer for initial visibility
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Define transition variants based on type
  const variants = {
    fade: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slide: {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
    dissolve: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      className={`relative ${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
      variants={variants[transitionType]}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{ opacity, scale }}
    >
      {/* Main content */}
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>

      {/* Next section preview */}
      {nextSectionPreview && (
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
          <motion.div
            className="w-full h-full opacity-30 blur-sm"
            style={{
              y: useTransform(scrollYProgress, [0.8, 1], ['100%', '0%']),
            }}
          >
            {nextSectionPreview}
          </motion.div>
        </div>
      )}

      {/* Persistent element (thin colored bar) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 h-0.5 bg-[#D4AF37] w-24"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
          width: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], ['0%', '100%', '100%', '0%']),
        }}
      />
    </motion.div>
  );
} 