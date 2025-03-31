import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import FilterButton from '../components/FilterButton';
import Card from '../components/Card';
import Image from 'next/image';

interface Resource {
  title: string;
  description: string;
  link: string;
  image?: string;
}

type ResourceGroups = {
  [key: string]: Resource[];
};

const StudyResources: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('K-2');
  const filters = ['K-2', '3-5', '6-8', '9-12', 'Educators'];

  // Resource data organized by grade level
  const resources: ResourceGroups = {
    'K-2': [
      { 
        title: 'Early Reader Stories', 
        description: 'Interactive stories introducing cultural awareness for young readers.',
        link: '#early-readers',
        image: '/images/dad_son_playing_optimized.webp'
      },
      { 
        title: 'Black History Heroes', 
        description: 'Age-appropriate stories about important figures in Black history.',
        link: '#history-heroes',
        image: '/images/mlk_optimized.jpeg'
      },
      { 
        title: 'Community Helpers', 
        description: 'Learn about important roles in our community through interactive activities.',
        link: '#community-helpers',
        image: '/images/urban_youth_optimized.webp'
      },
    ],
    '3-5': [
      { 
        title: 'Cultural Heritage', 
        description: 'Explore African and African American culture through stories and art.',
        link: '#cultural-heritage',
        image: '/images/blackhistory_optimized.jpeg'
      },
      { 
        title: 'Civil Rights for Kids', 
        description: 'Age-appropriate introduction to civil rights history and concepts.',
        link: '#civil-rights-kids',
        image: '/images/ai_humanities_compressed.webp'
      },
      { 
        title: 'Music & Movement', 
        description: 'Explore the rich tradition of music in Black culture through activities.',
        link: '#music-movement',
        image: '/images/church3_optimized.webp'
      },
    ],
    '6-8': [
      { 
        title: 'African American Literature', 
        description: 'Age-appropriate literature selections from prominent Black authors.',
        link: '#aa-literature',
        image: '/images/ruby_UA_optimized.webp'
      },
      { 
        title: 'Civil Rights Movement', 
        description: 'In-depth resources about the Civil Rights Movement in America.',
        link: '#civil-rights',
        image: '/images/digital_humanities_map_compressed.webp'
      },
      { 
        title: 'Community Leadership', 
        description: 'Resources to develop leadership skills and civic engagement.',
        link: '#leadership',
        image: '/images/group_graduate_optimized.webp'
      },
    ],
    '9-12': [
      { 
        title: 'Advanced Black Literature', 
        description: 'Study guides and analysis of works by influential Black authors.',
        link: '#advanced-literature',
        image: '/images/church4_optimized.webp'
      },
      { 
        title: 'Social Justice Research', 
        description: 'Resources for conducting research on social justice topics.',
        link: '#social-justice',
        image: '/images/download_optimized.jpeg'
      },
      { 
        title: 'Digital Storytelling', 
        description: 'Tools and guides for creating digital media projects about cultural topics.',
        link: '#digital-storytelling',
        image: '/images/church5_optimized.webp'
      },
    ],
    'Educators': [
      { 
        title: 'Curriculum Resources', 
        description: 'Lesson plans and teaching materials for incorporating Black history into the classroom.',
        link: '#curriculum',
        image: '/images/sixth_baptist2_optimized.webp'
      },
      { 
        title: 'Professional Development', 
        description: 'Training resources for culturally responsive teaching methods.',
        link: '#professional-dev',
        image: '/images/group_graduate_optimized.webp'
      },
      { 
        title: 'Community Engagement', 
        description: 'Resources for connecting classroom learning with community involvement.',
        link: '#community-engagement',
        image: '/images/dad_hig_son_optimized.webp'
      },
    ],
  };

  return (
    <PageTemplate
      title="K-12 Study Resources"
      description="Access curated humanities resources for K-12 students and educators"
      headerBg="#8B0000"
      headerTextColor="white"
      mainBg="#1a1a2e"
      mainTextColor="white"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/group_graduate_optimized.webp"
          alt="Students studying together"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <p className="text-base sm:text-lg font-inter text-[#cccccc] mb-8">
        Explore educational content tailored for different grade levels and educators. 
        Our resources are designed to help students understand and appreciate Black 
        history, literature, and culture.
      </p>
      
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {filters.map((filter) => (
          <FilterButton
            key={filter}
            label={filter}
            isActive={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources[activeFilter].map((resource, index) => (
          <Card
            key={index}
            title={resource.title}
            description={resource.description}
            link={resource.link}
            linkText="View Resource →"
            isDark={true}
            image={resource.image}
            imageAlt={resource.title}
          />
        ))}
      </div>
    </PageTemplate>
  );
};

export default StudyResources; 