import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Card from '../components/Card';
import Image from 'next/image';

const GetInvolved: React.FC = () => {
  return (
    <PageTemplate
      title="Get Involved"
      description="Join the Birmingham Black Youth Ministry and make a difference in our community"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/group_graduate_optimized.webp"
          alt="Community involvement"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        There are many ways to get involved with Birmingham Black Youth Ministry. Whether you're interested 
        in volunteering, donating, or participating in our programs, your support helps us empower youth 
        through humanities education and cultural awareness.
      </p>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Ways to Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Volunteer"
          description="Share your time and talents to support our youth programs and events. We have opportunities for all skill sets."
          isDark={false}
          image="/images/urban_youth_optimized.webp"
          imageAlt="Volunteers working with youth"
          link="/contact"
          linkText="Become a Volunteer →"
        />
        
        <Card
          title="Donate"
          description="Your financial support helps fund our educational programs, cultural events, and community initiatives."
          isDark={false}
          image="/images/church5_optimized.webp"
          imageAlt="Community support"
          link="/contact"
          linkText="Make a Donation →"
        />
        
        <Card
          title="Partner"
          description="Organizations can partner with us through sponsorships, shared programming, or resource contributions."
          isDark={false}
          image="/images/group_graduate_optimized.webp"
          imageAlt="Community partnership"
          link="/contact"
          linkText="Become a Partner →"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-bold font-montserrat text-[#333333] mb-4">Volunteer Opportunities</h2>
        <p className="text-base font-inter mb-4">
          We're currently seeking volunteers for the following roles:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4 font-inter text-[#555555]">
          <li><strong>Program Mentors:</strong> Work directly with youth in our educational programs</li>
          <li><strong>Event Coordinators:</strong> Help plan and execute community events</li>
          <li><strong>Administrative Support:</strong> Assist with office tasks and organization</li>
          <li><strong>Communications Team:</strong> Help with social media, website, and outreach</li>
          <li><strong>Skills Instructors:</strong> Share specialized knowledge in humanities subjects</li>
        </ul>
        <p className="text-base font-inter mb-4">
          All volunteer positions are currently accepting applications. Contact us for more information
          about specific roles and requirements.
        </p>
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Ready to Get Involved?</h2>
        <p className="text-base font-inter mb-6">
          Contact us today to learn more about how you can support our mission and make
          a difference in the lives of Birmingham's youth.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-[#FFD700] text-[#1a1a2e] rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
        >
          Contact Us
        </a>
      </div>
    </PageTemplate>
  );
};

export default GetInvolved; 