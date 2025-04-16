import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const HistoryResources: React.FC = () => {
  const resources = [
    {
      title: 'Early American History (K-5)',
      subject: 'History',
      description:
        'Introduce young students to foundational concepts in American history through age-appropriate stories and activities.',
      externalLinks: [
        {
          name: 'PBS Learning Media',
          url: 'https://www.pbslearningmedia.org/subjects/social-studies/us-history/',
        },
        { name: 'Smithsonian Learning Lab', url: 'https://learninglab.si.edu/' },
        { name: 'iCivics', url: 'https://www.icivics.org/' },
      ],
      example:
        'Explore interactive timelines of important historical events on PBS Learning Media.',
      image: '/images/young_schoolboy.webp',
    },
    {
      title: 'Ancient Civilizations (3-8)',
      subject: 'History',
      description:
        'Discover the achievements, cultures, and legacies of ancient Egypt, Greece, Rome, China, and other early societies.',
      externalLinks: [
        {
          name: 'Khan Academy Ancient History',
          url: 'https://www.khanacademy.org/humanities/world-history/world-history-beginnings',
        },
        { name: 'British Museum Learning', url: 'https://www.britishmuseum.org/learn' },
        { name: 'World History Encyclopedia', url: 'https://www.worldhistory.org/' },
      ],
      example:
        'Complete the Ancient Egypt module on Khan Academy with interactive quizzes and primary sources.',
      image: '/images/museum_trip.webp',
    },
    {
      title: 'Civil Rights Movement (6-12)',
      subject: 'History',
      description:
        'Examine the struggle for equality and justice in America through primary sources, testimonies, and multimedia resources.',
      externalLinks: [
        {
          name: 'National Civil Rights Museum',
          url: 'https://www.civilrightsmuseum.org/education',
        },
        { name: 'Civil Rights Teaching', url: 'https://www.civilrightsteaching.org/' },
        {
          name: 'King Institute Resources',
          url: 'https://kinginstitute.stanford.edu/liberation-curriculum',
        },
      ],
      example:
        'Analyze Dr. King\'s "Letter from Birmingham Jail" using the King Institute\'s guided reading resources.',
      image: '/images/tuskegee_airmens.webp',
    },
    {
      title: 'World War II (8-12)',
      subject: 'History',
      description:
        'Study the causes, events, and consequences of World War II through multiple perspectives and reliable sources.',
      externalLinks: [
        {
          name: 'National WWII Museum',
          url: 'https://www.nationalww2museum.org/programs/distance-learning',
        },
        { name: 'Holocaust Encyclopedia', url: 'https://encyclopedia.ushmm.org/' },
        {
          name: 'WWII Primary Sources Archive',
          url: 'https://www.archives.gov/research/military/ww2',
        },
      ],
      example:
        'Explore interactive maps and timelines of WWII battles on the National WWII Museum site.',
      image: '/images/studying_group.webp',
    },
    {
      title: 'African American History (7-12)',
      subject: 'History',
      description:
        'Explore the rich history, contributions, struggles, and achievements of African Americans throughout U.S. history.',
      externalLinks: [
        {
          name: 'National Museum of African American History',
          url: 'https://nmaahc.si.edu/learn/educators',
        },
        {
          name: 'Black History Month Resources',
          url: 'https://www.africanamericanhistorymonth.gov/teachers.html',
        },
        { name: 'Teaching Tolerance', url: 'https://www.tolerance.org/classroom-resources' },
      ],
      example:
        'Use the NMAAHC digital resources to study the Harlem Renaissance and its impact on American culture.',
      image: '/images/black_graduates.webp',
    },
    {
      title: 'U.S. Government & Civics (8-12)',
      subject: 'History',
      description:
        'Understand the principles, structure, and functions of American government and the rights and responsibilities of citizenship.',
      externalLinks: [
        { name: 'National Constitution Center', url: 'https://constitutioncenter.org/learn' },
        { name: 'iCivics', url: 'https://www.icivics.org/' },
        { name: 'Congress.gov Resources', url: 'https://www.congress.gov/resources' },
      ],
      example:
        'Use interactive games from iCivics to simulate government processes and civic participation.',
      image: '/images/student_smiling.webp',
    },
    {
      title: 'Global History & Geography (9-12)',
      subject: 'History',
      description:
        'Examine patterns of global interaction, cultural diffusion, and political developments throughout world history.',
      externalLinks: [
        { name: 'World History Digital Education', url: 'https://worldhistory.org/' },
        {
          name: 'National Geographic Education',
          url: 'https://www.nationalgeographic.org/education/',
        },
        {
          name: 'AP World History Resources',
          url: 'https://apcentral.collegeboard.org/courses/ap-world-history',
        },
      ],
      example:
        'Study the Silk Road trade networks using interactive maps and primary sources from World History Digital Education.',
      image: '/images/graduation_smiles.webp',
    },
  ];

  return (
    <StudyResourcesTemplate
      title="History Resources"
      description="Explore resources for understanding historical events, cultures, and perspectives from U.S. and world history"
      activeSubject="History"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">History Resources</h1>
        <p className="text-gray-300 mb-2">
          Explore our collection of history resources designed to help students understand past
          events, cultures, and movements that have shaped our world. These carefully selected
          resources support critical thinking about historical contexts and perspectives.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can access primary sources, interactive timelines, engaging videos, and
          comprehensive study materials.
        </p>
      </div>

      {/* Topic filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
          All Topics
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          U.S. History
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          World History
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Civil Rights
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Elementary
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Middle School
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          High School
        </button>
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <StudyResourceCard
            key={index}
            title={resource.title}
            subject={resource.subject}
            description={resource.description}
            externalLinks={resource.externalLinks}
            example={resource.example}
            image={resource.image}
            imageAlt={resource.title}
          />
        ))}
      </div>

      {/* Historical thinking section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Historical Thinking Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Chronological Thinking</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Distinguish between past, present, and future</li>
              <li>Identify the temporal structure of historical narratives</li>
              <li>Establish temporal order in constructing historical narratives</li>
              <li>Measure and calculate calendar time</li>
              <li>Interpret data presented in timelines</li>
              <li>Create timelines to record events</li>
              <li>Explain patterns of historical continuity and change</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Historical Comprehension</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Reconstruct the literal meaning of historical passages</li>
              <li>Identify the central questions addressed in historical narratives</li>
              <li>Read historical narratives imaginatively</li>
              <li>Evidence historical perspectives</li>
              <li>Draw upon visual, literary, and musical sources</li>
              <li>Use maps, charts, and other visual data</li>
              <li>Draw upon data in historical maps</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">
              Historical Analysis & Interpretation
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Compare and contrast differing interpretations</li>
              <li>Consider multiple perspectives</li>
              <li>Analyze cause-and-effect relationships</li>
              <li>Compare competing historical narratives</li>
              <li>Draw comparisons across eras and regions</li>
              <li>Distinguish between fact and fiction</li>
              <li>Consider multiple causes</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">
              Historical Research Capabilities
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Formulate historical questions</li>
              <li>Obtain historical data from a variety of sources</li>
              <li>Interrogate historical data</li>
              <li>Identify the gaps in the historical record</li>
              <li>Evaluate primary and secondary sources</li>
              <li>Support interpretations with historical evidence</li>
              <li>Analyze conflicting evidence</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Primary sources section */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Primary Source Archives & Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Library of Congress</h3>
            <p className="text-sm text-gray-400 mb-2">
              Digital collections of American historical documents, photos, and recordings
            </p>
            <a
              href="https://www.loc.gov/collections/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Explore Collection
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">National Archives</h3>
            <p className="text-sm text-gray-400 mb-2">
              Official documents, records, and materials from U.S. government
            </p>
            <a
              href="https://www.archives.gov/education"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Archives
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Digital Public Library of America</h3>
            <p className="text-sm text-gray-400 mb-2">
              Free access to millions of cultural heritage materials
            </p>
            <a
              href="https://dp.la/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Search Resources
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Smithsonian Learning Lab</h3>
            <p className="text-sm text-gray-400 mb-2">
              Discover, create, and share resources from the Smithsonian's collections
            </p>
            <a
              href="https://learninglab.si.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Access Lab
            </a>
          </div>
        </div>
      </div>

      {/* Timeline tools section */}
      <div className="mt-8 mb-4 p-6 bg-[#2a2a3e] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Interactive Timeline Tools
        </h2>
        <p className="text-gray-300 mb-4">
          These digital tools help visualize historical events in chronological order, making it
          easier to understand cause and effect relationships and the progression of historical
          developments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">TimelineJS</h3>
            <p className="text-sm text-gray-400 mb-2">
              Create interactive timelines with multimedia content
            </p>
            <a
              href="https://timeline.knightlab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Try Timeline Tool
            </a>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Sutori</h3>
            <p className="text-sm text-gray-400 mb-2">
              Build collaborative timelines with images, videos, and text
            </p>
            <a
              href="https://www.sutori.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Create Timeline
            </a>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default HistoryResources;
