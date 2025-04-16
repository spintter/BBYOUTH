import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const ELAResources: React.FC = () => {
  const resources = [
    {
      title: 'Early Reading & Phonics (K-2)',
      subject: 'ELA',
      description: 'Fun stories, games, and activities to build foundational reading skills for young learners.',
      externalLinks: [
        { name: 'Khan Academy Kids', url: 'https://learn.khanacademy.org/khan-academy-kids/' },
        { name: 'Storynory', url: 'https://www.storynory.com/' },
        { name: 'PBS Kids', url: 'https://pbskids.org/' }
      ],
      example: 'Listen to "The Three Billy Goats Gruff" on Storynory and discuss the story's sequence to build comprehension skills.',
      image: '/images/young_schoolboy.webp'
    },
    {
      title: 'Reading Comprehension & Vocabulary (3-5)',
      subject: 'ELA',
      description: 'Build reading skills and expand vocabulary with engaging texts and exercises for elementary students.',
      externalLinks: [
        { name: 'Khan Academy ELA Grades 2-5', url: 'https://www.khanacademy.org/ela/cc-2nd-reading-vocab' },
        { name: 'ReadWorks', url: 'https://www.readworks.org/' },
        { name: 'CommonLit', url: 'https://www.commonlit.org/' }
      ],
      example: 'Complete a thematic reading unit on Khan Academy ELA to build comprehension and vocabulary skills.',
      image: '/images/blackhistory_logo.jpeg'
    },
    {
      title: 'Middle School Literature (6-8)',
      subject: 'ELA',
      description: 'Analyze texts, develop writing skills, and build critical thinking capabilities for middle school students.',
      externalLinks: [
        { name: 'Khan Academy Middle School ELA', url: 'https://www.khanacademy.org/ela/cc-middle-school' },
        { name: 'ReadWriteThink', url: 'https://www.readwritethink.org/' },
        { name: 'CommonLit', url: 'https://www.commonlit.org/' }
      ],
      example: 'Analyze a short story on CommonLit and complete the discussion questions to enhance literary analysis skills.',
      image: '/images/tuskegee_library.jpg'
    },
    {
      title: 'Advanced Literature & Writing (9-12)',
      subject: 'ELA',
      description: 'Develop college-level literary analysis and academic writing skills for high school students.',
      externalLinks: [
        { name: 'High School ELA', url: 'https://www.khanacademy.org/ela/high-school-ela' },
        { name: 'Digital SAT Reading/Writing Prep', url: 'https://www.khanacademy.org/test-prep/sat-reading-and-writing' },
        { name: 'ReadWriteThink', url: 'https://www.readwritethink.org/' }
      ],
      example: 'Create a poetry analysis project using the interactive tools available on ReadWriteThink.',
      image: '/images/studying_group.webp'
    },
    {
      title: 'Grammar & Language Conventions',
      subject: 'ELA',
      description: 'Resources for mastering grammar, punctuation, syntax, and language conventions for all grade levels.',
      externalLinks: [
        { name: 'Purdue OWL', url: 'https://owl.purdue.edu/owl/general_writing/index.html' },
        { name: 'Grammar Bytes', url: 'https://www.chompchomp.com/' },
        { name: 'No Red Ink', url: 'https://www.noredink.com/' }
      ],
      example: 'Practice identifying and correcting common grammar errors through interactive exercises on Grammar Bytes.',
      image: '/images/ruby_UA_history.webp'
    },
    {
      title: 'Creative Writing & Expression',
      subject: 'ELA',
      description: 'Tools and prompts to inspire creative writing, poetry, narratives, and personal expression across grade levels.',
      externalLinks: [
        { name: 'ReadWriteThink Writing Prompts', url: 'https://www.readwritethink.org/classroom-resources/student-interactives' },
        { name: 'Storybird', url: 'https://storybird.com/' },
        { name: 'Poetry Foundation', url: 'https://www.poetryfoundation.org/learn' }
      ],
      example: 'Use Storybird to create an illustrated short story with visual prompts to spark creativity.',
      image: '/images/black_graduates.webp'
    }
  ];

  return (
    <StudyResourcesTemplate
      title="English Language Arts (ELA) Resources"
      description="Comprehensive resources for reading, writing, grammar, and literature across all grade levels"
      activeSubject="English Language Arts"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">English Language Arts Resources</h1>
        <p className="text-gray-300 mb-2">
          Explore our collection of English Language Arts (ELA) resources designed to help students
          of all ages develop essential literacy skills. From early reading foundations to 
          advanced literary analysis, these resources support the full spectrum of language arts education.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can access free learning materials appropriate for different grade levels.
        </p>
      </div>

      {/* Grade level filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">All Grades</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">K-2</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">3-5</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">6-8</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">9-12</button>
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

      {/* ELA literacy skills section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">Core ELA Literacy Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Reading Comprehension</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Understanding main ideas and supporting details</li>
              <li>Making inferences and drawing conclusions</li>
              <li>Identifying author's purpose and perspective</li>
              <li>Analyzing text structure and organization</li>
              <li>Connecting texts to personal experiences and other sources</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Writing Skills</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Developing clear and coherent arguments</li>
              <li>Organizing ideas logically with supporting evidence</li>
              <li>Using precise language and vocabulary</li>
              <li>Applying correct grammar and mechanics</li>
              <li>Revising and editing for clarity and effectiveness</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Speaking & Listening</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Participating effectively in discussions</li>
              <li>Presenting information clearly and persuasively</li>
              <li>Listening critically to evaluate information</li>
              <li>Responding thoughtfully to diverse perspectives</li>
              <li>Adapting speech to various contexts and tasks</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Language & Vocabulary</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Building strong vocabulary through multiple strategies</li>
              <li>Understanding word relationships and nuances</li>
              <li>Applying conventions of standard English</li>
              <li>Analyzing figurative language and word choice</li>
              <li>Using reference materials effectively</li>
            </ul>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default ELAResources; 