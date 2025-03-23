'use client';

import { useEffect, useRef } from 'react';

const ChurchPhotoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="church-photo-section py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src="/images/optimized/16th_Street_Baptist_Church_optimized.jpg"
            alt="16th Street Baptist Church"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="text-center text-white p-4">
              <h2 className="text-3xl font-bold mb-2">Honoring Our Heritage</h2>
              <p className="text-lg mb-4">We pay respect to the legacy of black churches, a cornerstone of faith and community.</p>
              <a href="/heritage" className="text-red-500 hover:underline font-semibold text-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChurchPhotoSection;