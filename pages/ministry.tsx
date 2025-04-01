import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';

const Ministry: React.FC = () => {
  return (
    <PageTemplate
      title="Ministry"
      description="Discover our ministry's role in supporting the humanities and youth development"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/16thst_bap_color.jpg"
          alt="16th Street Baptist Church in Birmingham"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        Our ministry connects youth with the humanities through faith-based programs that emphasize 
        cultural awareness, historical understanding, and personal growth. We believe in nurturing 
        the whole person—mind, body, and spirit—while celebrating the rich traditions and contributions
        of Black culture to our society.
      </p>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Our Approach</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Faith-Based Learning"
          description="Integrating spiritual principles with humanities education to provide a foundation for moral and ethical development."
          isDark={false}
          image="/images/church3_optimized.webp"
          imageAlt="Faith-Based Learning"
        />
        
        <Card
          title="Cultural Heritage"
          description="Celebrating and preserving Black history, traditions, and contributions through immersive educational experiences."
          isDark={false}
          image="/images/blackhistory_logo.jpeg"
          imageAlt="Cultural Heritage"
        />
        
        <Card
          title="Community Service"
          description="Engaging youth in service projects that apply humanities knowledge to address community needs and foster civic responsibility."
          isDark={false}
          image="/images/youth_group.webp"
          imageAlt="Community Service"
        />
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Ministry Programs</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Sunday Youth Humanities</h3>
        <p className="text-base font-inter mb-4">
          Weekly sessions that explore Black history, literature, and culture through the lens of faith.
          Youth engage with historical texts, discuss cultural contributions, and connect these learnings
          to their spiritual development.
        </p>
        <ul className="list-disc pl-5 mb-4 text-base font-inter text-[#555555]">
          <li>Ages 10-18</li>
          <li>Sundays, 10:00 AM - 11:30 AM</li>
          <li>Location: Main Ministry Building</li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Mentorship Program</h3>
        <p className="text-base font-inter mb-4">
          Pairing youth with adult mentors who provide guidance in academic, spiritual, and cultural development.
          Mentors help youth navigate challenges, set goals, and connect with educational and career opportunities.
        </p>
        <ul className="list-disc pl-5 mb-4 text-base font-inter text-[#555555]">
          <li>Monthly one-on-one meetings</li>
          <li>Quarterly group activities</li>
          <li>Annual mentorship retreat</li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Community Outreach</h3>
        <p className="text-base font-inter mb-4">
          Regular service initiatives that allow youth to apply their humanities education to address
          community needs. Projects include historical preservation efforts, cultural education programs,
          and intergenerational learning opportunities.
        </p>
        <ul className="list-disc pl-5 mb-4 text-base font-inter text-[#555555]">
          <li>Bi-monthly service projects</li>
          <li>Annual community humanities festival</li>
          <li>Holiday-themed educational events</li>
        </ul>
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Join Our Ministry</h2>
        <p className="text-base font-inter mb-6">
          We welcome youth, families, mentors, and volunteers who wish to connect faith, humanities,
          and community service for personal and collective growth.
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

export default Ministry; 