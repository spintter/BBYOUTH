import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';

const Programs: React.FC = () => {
  return (
    <PageTemplate
      title="Programs"
      description="Explore our educational and enrichment programs for youth in the humanities"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/group_graduate_optimized.webp"
          alt="Youth in Programs"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        BBYM offers a variety of programs designed to engage youth in humanities education through
        interactive workshops, immersive experiences, and collaborative projects. Our programs focus
        on developing critical thinking, cultural awareness, and leadership skills while celebrating
        Black history and culture.
      </p>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Featured Programs</h2>
      
      <div className="mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/urban_youth_optimized.webp"
                  alt="Youth Humanities Academy"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Youth Humanities Academy</h3>
              <p className="text-base font-inter mb-4">
                Our flagship program provides comprehensive humanities education through weekly workshops, 
                field trips, and project-based learning. Students explore history, literature, arts, and 
                critical cultural topics while developing research and presentation skills.
              </p>
              <div className="mb-4">
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Ages 13-18</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">After School</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Year-Round</span>
              </div>
              <a 
                href="/programs/academy" 
                className="text-[#8B0000] font-medium font-inter hover:underline flex items-center gap-1 group"
              >
                <span>Learn More</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/dad_son_playing_optimized.webp"
                  alt="Digital Storytelling Workshop"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Digital Storytelling Workshop</h3>
              <p className="text-base font-inter mb-4">
                Students learn to create compelling digital content that tells their stories and preserves 
                community narratives. Using modern technology, they develop skills in video production, 
                podcasting, and interactive media while exploring cultural themes.
              </p>
              <div className="mb-4">
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Ages 12-18</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Weekend Sessions</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Quarterly</span>
              </div>
              <a 
                href="/programs/storytelling" 
                className="text-[#8B0000] font-medium font-inter hover:underline flex items-center gap-1 group"
              >
                <span>Learn More</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/digital_humanities_map_compressed.webp"
                  alt="Cultural Heritage Tours"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold font-montserrat mb-3 text-[#8B0000]">Cultural Heritage Tours</h3>
              <p className="text-base font-inter mb-4">
                Guided educational tours of historical sites in Birmingham and beyond, focusing on civil 
                rights history, Black cultural landmarks, and community heritage. Students engage with 
                local history through immersive experiences and interactive activities.
              </p>
              <div className="mb-4">
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">All Ages</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Day Trips</span>
                <span className="inline-block bg-[#1a1a2e] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">Monthly</span>
              </div>
              <a 
                href="/programs/tours" 
                className="text-[#8B0000] font-medium font-inter hover:underline flex items-center gap-1 group"
              >
                <span>Learn More</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Additional Opportunities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Summer Humanities Institute"
          description="A two-week intensive program for high school students exploring advanced topics in Black history, literature, and cultural studies."
          isDark={false}
          link="/programs/summer-institute"
        />
        
        <Card
          title="Youth Leadership Council"
          description="A selective program that develops leadership skills through community projects, advocacy, and peer education initiatives."
          isDark={false}
          link="/programs/leadership"
        />
        
        <Card
          title="Family Learning Workshops"
          description="Monthly sessions that engage the whole family in humanities activities, cultural celebrations, and intergenerational learning."
          isDark={false}
          link="/programs/family"
        />
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Enroll in Our Programs</h2>
        <p className="text-base font-inter mb-6">
          Our programs are open to youth from all backgrounds who are interested in exploring
          humanities and cultural education. Financial assistance is available.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-[#FFD700] text-[#1a1a2e] rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
        >
          Register Now
        </a>
      </div>

      <Image
        width={600}
        height={400}
        className="w-full h-auto rounded-lg shadow-lg"
        src="/images/ai_humanities_compressed.webp"
        alt="Digital Humanities Research"
      />
    </PageTemplate>
  );
};

export default Programs; 