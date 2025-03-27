// components/SectionTransition.tsx
'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SectionTransitionProps {
  children: React.ReactNode;
  nextSectionPreview?: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'dissolve' | 'curtain' | 'overlap';
  className?: string;
  accentColor?: string;
  themePattern?: 'dots' | 'lines' | 'kente' | 'none';
}

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="text-red-500 p-4">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function SectionTransition({
  children,
  nextSectionPreview,
  transitionType = 'fade',
  className = '',
  accentColor = '#8B0000',
  themePattern = 'kente',
}: SectionTransitionProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SectionTransitionContent 
        children={children}
        nextSectionPreview={nextSectionPreview}
        transitionType={transitionType}
        className={className}
        accentColor={accentColor}
        themePattern={themePattern}
      />
    </ErrorBoundary>
  );
}

function SectionTransitionContent({
  children,
  nextSectionPreview,
  transitionType = 'fade',
  className = '',
  accentColor = '#8B0000',
  themePattern = 'kente',
}: SectionTransitionProps): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Base transforms
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.98, 1, 1, 0.98]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [20, 0, 0, -20]);

  // Special transforms for curtain effect
  const curtainHeight = useTransform(scrollYProgress, [0.7, 1], ['0%', '100%']);
  const curtainOpacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 0.7, 1]);
  
  // Special transforms for overlap effect
  const overlayOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 0.8, 1]);
  const peekHeight = useTransform(scrollYProgress, [0.7, 0.9, 1], ['0%', '10%', '20%']);
  
  // Preview transforms
  const previewY = useTransform(scrollYProgress, [0.8, 1], ['100%', '0%']);
  
  // Pattern overlay transform
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.1, 0]);

  // Calculate section height for proper animations
  useEffect(() => {
    if (sectionRef.current) {
      const updateHeight = () => {
        setSectionHeight(sectionRef.current?.offsetHeight || 0);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

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
    curtain: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    overlap: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    },
  };
  
  // Pattern background based on theme
  const getPatternStyle = () => {
    switch (themePattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${accentColor}22 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(90deg, ${accentColor}22 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'kente':
        return {
          backgroundImage: `
            linear-gradient(45deg, ${accentColor}22 25%, transparent 25%), 
            linear-gradient(-45deg, ${accentColor}22 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, ${accentColor}22 75%), 
            linear-gradient(-45deg, transparent 75%, ${accentColor}22 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        };
      default:
        return {};
    }
  };

  // Render patterns based on transition type
  const renderPatternOverlay = () => {
    if (themePattern === 'none') return null;
    
    const patternStyle = getPatternStyle();
    
    if (transitionType === 'curtain') {
      return (
        <motion.div 
          className="absolute left-0 right-0 bottom-0 z-5"
          style={{ 
            height: curtainHeight,
            ...patternStyle,
          }}
        />
      );
    }
    
    if (transitionType === 'overlap') {
      return (
        <motion.div 
          className="absolute left-0 right-0 bottom-0 opacity-20 z-5"
          style={{ 
            height: '100%',
            ...patternStyle,
          }}
        />
      );
    }
    
    return (
      <motion.div 
        className="absolute inset-0 opacity-10 z-0"
        style={{ 
          ...patternStyle,
          opacity: patternOpacity
        }}
      />
    );
  };

  // Render the content with appropriate transition effects
  const renderContent = (): JSX.Element => {
    if (transitionType === 'curtain') {
      return (
        <>
          <motion.div style={{ y }} className="relative z-10">
            {children}
          </motion.div>
          
          {/* Curtain effect - Updated for light theme */}
          <motion.div 
            className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-slate-50 to-transparent z-20"
            style={{ 
              height: curtainHeight,
              opacity: curtainOpacity
            }}
          />
        </>
      );
    }
    
    if (transitionType === 'overlap') {
      return (
        <>
          <motion.div style={{ y }} className="relative z-10">
            {children}
          </motion.div>
          
          {/* Overlap preview of next section */}
          {nextSectionPreview && (
            <motion.div
              className="absolute left-0 right-0 bottom-0 overflow-hidden z-20"
              style={{ 
                height: peekHeight,
                opacity: overlayOpacity
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-40 z-10"></div>
              {nextSectionPreview}
            </motion.div>
          )}
          
          {renderPatternOverlay()}
        </>
      );
    }
    
    // Default content rendering
    return (
      <>
        <motion.div style={{ y }} className="relative z-10">
          {children}
        </motion.div>

        {/* Next section preview for other transition types */}
        {nextSectionPreview && (
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none z-20">
            <motion.div
              className="w-full h-full opacity-30 blur-sm"
              style={{
                y: previewY
              }}
            >
              {nextSectionPreview}
            </motion.div>
          </div>
        )}
      </>
    );
  };

  return (
    <motion.section
      ref={sectionRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{ 
        opacity,
        scale,
        y,
        position: 'relative'
      }}
    >
      {renderPatternOverlay()}
      {renderContent()}
    </motion.section>
  );
}