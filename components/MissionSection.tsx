'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const MissionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } },
  };

  return (
    <section
      ref={sectionRef}
      className="mission-section py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-[#252525] to-[#1A1A1A] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(212,175,55,0.1)_0%,transparent_70%)] opacity-50"></div>
      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row gap-16 items-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Text Content */}
          <motion.div className="text-content w-full lg:w-[45%]" variants={childVariants}>
            <motion.div className="mb-10 inline-block" variants={childVariants}>
              <div className="h-1 w-32 bg-[var(--accent)] mb-6 transform scale-x-150 origin-left transition-transform duration-300 hover:scale-x-175"></div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-[var(--font-abril)] font-bold mb-6 text-[var(--accent)] tracking-tight">
                Our Mission
              </h2>
            </motion.div>
            <motion.p
              className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-montserrat)] font-semibold mb-8 leading-tight text-[var(--secondary)]"
              variants={childVariants}
            >
              Empower. Educate. Elevate.
            </motion.p>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl font-[var(--font-open-sans)] mb-10 leading-relaxed text-[var(--text-primary)]/90"
              variants={childVariants}
            >
              BBYM fosters Afrocentric knowledge, uniting youth and leaders to explore humanities and inspire tomorrow's leaders through cultural understanding and academic excellence.
            </motion.p>
            <motion.div
              className="text-xl md:text-2xl lg:text-3xl italic font-[var(--font-open-sans)]"
              style={{
                background: 'linear-gradient(90deg, #F5E6CC 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              variants={childVariants}
            >
              "Education is the most powerful weapon which you can use to change the world." — Nelson Mandela
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="image-content w-full lg:w-[55%] relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[var(--accent)]/15"
            style={{ y: imageParallax }}
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            whileHover={{ scale: 1.02, boxShadow: '0 25px 60px rgba(212, 175, 55, 0.3)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variants={childVariants}
          >
            <Image
              src="/images/blackhistory.jpeg"
              alt="Youth engaged in Afrocentric education"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl brightness-90 contrast-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-70"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)] opacity-30 pointer-events-none"></div>
          </motion.div>
        </motion.div>
      </div>
      {/* Custom Cursor */}
      <div className={`custom-cursor ${isHovered ? 'visible' : 'hidden'}`} />
    </section>
  );
};

export default MissionSection;