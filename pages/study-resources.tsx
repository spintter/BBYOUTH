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
        link: '/topics/literature',
        image: '/images/young_schoolboy.webp'
      },
      { 
        title: 'Black History Heroes', 
        description: 'Age-appropriate stories about important figures in Black history.',
        link: '/topics/history',
        image: '/images/mlk_hitstory.jpeg'
      },
      { 
        title: 'Community Helpers', 
        description: 'Learn about important roles in our community through interactive activities.',
        link: '/topics/economics',
        image: '/images/dad_hug_son_optimized.webp'
      },
    ],
    '3-5': [
      { 
        title: 'Cultural Heritage', 
        description: 'Explore African and African American culture through stories and art.',
        link: '/topics/dance',
        image: '/images/blackhistory_logo.jpeg'
      },
      { 
        title: 'Civil Rights for Kids', 
        description: 'Age-appropriate introduction to civil rights history and concepts.',
        link: '/topics/law-politics',
        image: '/images/ruby_UA_history.webp'
      },
      { 
        title: 'Music & Movement', 
        description: 'Explore the rich tradition of music in Black culture through activities.',
        link: '/topics/music',
        image: '/images/church3_optimized.webp'
      },
    ],
    '6-8': [
      { 
        title: 'African American Literature', 
        description: 'Age-appropriate literature selections from prominent Black authors.',
        link: '/topics/literature',
        image: '/images/tuskegee_library.jpg'
      },
      { 
        title: 'Civil Rights Movement', 
        description: 'In-depth resources about the Civil Rights Movement in America.',
        link: '/topics/history',
        image: '/images/16th_Street_Baptist_Church_whiteanblack.jpg'
      },
      { 
        title: 'Community Leadership', 
        description: 'Resources to develop leadership skills and civic engagement.',
        link: '/topics/philosophy',
        image: '/images/black_graduates.webp'
      },
    ],
    '9-12': [
      { 
        title: 'Advanced Black Literature', 
        description: 'Study guides and analysis of works by influential Black authors.',
        link: '/topics/literature',
        image: '/images/studying_group.webp'
      },
      { 
        title: 'Social Justice Research', 
        description: 'Resources for conducting research on social justice topics.',
        link: '/topics/law-politics',
        image: '/images/soldier_history.jpg'
      },
      { 
        title: 'Digital Storytelling', 
        description: 'Tools and guides for creating digital media projects about cultural topics.',
        link: '/topics/digital-humanities',
        image: '/images/data_visualization_.jpg'
      },
    ],
    'Educators': [
      { 
        title: 'Curriculum Resources', 
        description: 'Lesson plans and teaching materials for incorporating Black history into the classroom.',
        link: '/topics/history',
        image: '/images/random_education.jpg'
      },
      { 
        title: 'Professional Development', 
        description: 'Training resources for culturally responsive teaching methods.',
        link: '/get-involved',
        image: '/images/young_adults.webp'
      },
      { 
        title: 'Community Engagement', 
        description: 'Resources for connecting classroom learning with community involvement.',
        link: '/contact',
        image: '/images/urban_youth_relaxing.webp'
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
          src="/images/young_group.jpg"
          alt="Students studying together"
          width={900}
          height={500}
          className="w-full h-auto object-cover"
          priority
          quality={85}
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