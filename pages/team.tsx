import React from 'react';
import PageTemplate from '../components/PageTemplate';
import Image from 'next/image';

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
}

const Team: React.FC = () => {
  const leadershipTeam: TeamMember[] = [
    {
      name: "Aldord Hunt",
      title: "President",
      bio: "As President of Birmingham-Bessemer Youth Ministries, Aldord Hunt brings years of experience in youth education and community development. He is passionate about empowering young people through humanities education and cultural awareness.",
      image: "/images/dad_hig_son_optimized.webp"
    }
  ];

  return (
    <PageTemplate
      title="Our Team"
      description="Meet the dedicated professionals behind Birmingham Black Youth Ministry"
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      <p className="text-base sm:text-lg font-inter text-[#555555] mb-8">
        Our team brings together diverse expertise in education, ministry, community development, 
        and the humanities. United by a shared passion for empowering youth through cultural education,
        we work collaboratively to create meaningful learning experiences and foster the next generation
        of leaders and thinkers.
      </p>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Leadership Team</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
        {leadershipTeam.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 relative">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold font-montserrat mb-1 text-[#333333]">{member.name}</h3>
              <p className="text-[#8B0000] font-medium mb-3">{member.title}</p>
              <p className="text-base font-inter text-[#555555]">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-[#333333] mb-6">Board of Directors</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <p className="text-base font-inter text-[#555555] mb-4">
          Our volunteer Board of Directors provides governance, strategic direction, and fiscal oversight
          for BBYM. Board members include community leaders, educators, business professionals, and parents
          who share our commitment to youth education and cultural empowerment.
        </p>
      </div>
      
      <div className="bg-[#1a1a2e] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold font-montserrat mb-4">Join Our Team</h2>
        <p className="text-base font-inter mb-6">
          Interested in making a difference in the lives of youth through humanities education?
          We are always looking for passionate educators, mentors, and volunteers.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-[#FFD700] text-[#1a1a2e] rounded-full font-medium hover:bg-opacity-90 transition-colors duration-300"
        >
          See Open Positions
        </a>
      </div>
    </PageTemplate>
  );
};

export default Team; 