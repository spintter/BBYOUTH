import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <PageTemplate
      title="About Us"
      description="Learn about Birmingham Black Youth Ministry and our mission"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/digital_humanities_map_compressed.webp"
          alt="Digital Humanities Map"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        Birmingham Black Youth Ministry (BBYM) is dedicated to empowering young minds through 
        humanities education, fostering critical thinking, cultural awareness, and leadership skills 
        within our community. Founded with a vision to preserve and celebrate Black history and culture, 
        we create opportunities for youth to engage with their heritage while developing the skills
        needed for future success.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card
          title="Our Mission"
          description="We support informal occasions for the exchange of ideas and the sharing of scholarly and artistic work, advancing the humanities in Birmingham's Black community and beyond."
          isDark={false}
          image="/images/dighum1_compressed.webp"
          imageAlt="Mission"
        />
        
        <Card
          title="Our Vision"
          description="To cultivate the next generation of leaders, thinkers, and innovators grounded in a strong understanding of Black history, culture, and contributions to society."
          isDark={false}
          image="/images/ai_humanities_compressed.webp"
          imageAlt="Vision"
        />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-4">Our Values</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Cultural Pride</h3>
          <p className="text-base font-inter">Celebrating and preserving our rich cultural heritage and traditions.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Academic Excellence</h3>
          <p className="text-base font-inter">Fostering a passion for learning, critical thinking, and intellectual growth.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Community Empowerment</h3>
          <p className="text-base font-inter">Building strong community ties through service, engagement, and mutual support.</p>
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-4">Our History</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-base font-inter mb-4">
          Founded in 2010, Birmingham Black Youth Ministry began as a small community initiative to connect
          youth with their cultural heritage. Over the years, we have grown into a comprehensive organization
          offering educational programs, cultural events, and youth leadership opportunities.
        </p>
        <p className="text-base font-inter">
          Our roots are deeply connected to Birmingham's civil rights history, and we strive to honor that
          legacy by empowering the next generation to create positive change in their communities.
        </p>
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Join Our Community</h2>
        <p className="text-base font-inter mb-6">
          We welcome volunteers, mentors, and community partners who share our vision of empowering youth
          through humanities education.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-[#FFD700] text-[#1a1a2e] rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
        >
          Get Involved
        </a>
      </div>
    </PageTemplate>
  );
};

export default About; 