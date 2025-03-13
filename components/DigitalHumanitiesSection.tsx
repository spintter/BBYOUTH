'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';

const DigitalHumanitiesSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] } },
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section className="digital-humanities-section py-32 px-4 sm:px-6 lg:px-12 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="h-1 w-32 bg-[#8B4513] mb-6 mx-auto transform scale-x-150 origin-center transition-transform duration-300 hover:scale-x-175"></div>
            <motion.h2
              className="section-title text-5xl font-bold mb-6 text-[#1A1A1A] tracking-tight font-['Montserrat']"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Digital Humanities
            </motion.h2>
          </div>
          <motion.p
            className="section-subtitle text-xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Unlock Afrocentric insights with cutting-edge digital tools and immersive experiences.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}>
          {[
            { icon: '🖥️', title: 'Virtual Exhibits', desc: 'Immersive 3D artifacts and cultural environments.' },
            { icon: '📚', title: 'Digital Archives', desc: 'Preserve heritage with rare documents and media.' },
            { icon: '🧠', title: 'AI Analysis', desc: 'Uncover patterns with AI-driven cultural insights.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="relative bg-white p-8 rounded-lg shadow-sm hover:shadow-md border border-[#F5F5F5] overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <div className="text-[#8B4513] text-5xl mb-6 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1A1A1A] tracking-tight font-['Montserrat']">
                {item.title}
              </h3>
              <p className="text-lg text-[#4A4A4A] leading-relaxed font-['Open Sans']">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <motion.a
            href="/digital-resources"
            className="inline-block px-8 py-3 bg-[#8B4513] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#6D3510] hover:scale-105 focus:ring-2 focus:ring-[#8B4513] focus:outline-none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Explore Digital Resources
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default DigitalHumanitiesSection;