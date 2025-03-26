'use client';

import React from 'react';

const MissionSection = () => {
  console.log('Rendering Modern MissionSection'); // Debugging log

  return (
    <section className="section-container mission-section">
      <div className="container text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-[var(--bbym-text-light)] font-inter tracking-tight">
          Our Mission
        </h2>
        <div className="bg-[var(--bbym-gray-dark)]/50 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-3xl mx-auto">
          <p className="text-base sm:text-lg lg:text-xl text-[var(--bbym-text-light)] leading-relaxed font-inter mb-4">
            <span className="text-[var(--bbym-gold-primary)] font-semibold">
              Birmingham Black Youth Ministry
            </span>{' '}
            is dedicated to empowering young minds through the humanities. We
            create spaces where youth can explore{' '}
            <span className="text-[var(--bbym-gold-primary)] font-medium">
              literature, history, philosophy, and the arts
            </span>
            , developing critical thinking skills and cultural awareness.
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--bbym-text-light)] leading-relaxed font-inter">
            Through our programs, we nurture the next generation of thoughtful
            leaders who understand the power of ideas, the importance of diverse
            perspectives, and the value of intellectual curiosity in building a
            more just and compassionate society.
          </p>
          <div className="mt-8">
            <a
              href="/about"
              className="button button--secondary"
              aria-label="Learn more about Birmingham Black Youth Ministry"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;