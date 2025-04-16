import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const LanguageArtsResources: React.FC = () => {
  const resources = [
    {
      title: 'Early Literacy (K-2)',
      subject: 'Language Arts',
      description:
        'Develop foundational reading and writing skills through phonics, sight words, and beginning reading comprehension activities.',
      externalLinks: [
        { name: 'Starfall', url: 'https://www.starfall.com/' },
        { name: 'ReadWorks', url: 'https://www.readworks.org/' },
        { name: 'PBS Kids Reading', url: 'https://pbskids.org/games/reading/' },
      ],
      example:
        'Practice letter sounds and basic word formation with interactive Starfall activities.',
      image: '/images/young_schoolboy.webp',
    },
    {
      title: 'Reading Comprehension (3-5)',
      subject: 'Language Arts',
      description:
        'Build reading skills with grade-appropriate texts, comprehension strategies, and vocabulary development resources.',
      externalLinks: [
        { name: 'CommonLit', url: 'https://www.commonlit.org/' },
        { name: 'ReadWorks', url: 'https://www.readworks.org/' },
        { name: 'Epic Books', url: 'https://www.getepic.com/' },
      ],
      example:
        'Complete a CommonLit reading passage with guided comprehension questions and vocabulary support.',
      image: '/images/student_smiling.webp',
    },
    {
      title: 'Writing Development (3-8)',
      subject: 'Language Arts',
      description:
        'Learn the writing process from brainstorming to publishing through structured guidance, examples, and feedback tools.',
      externalLinks: [
        { name: 'Writing Fix', url: 'http://www.writingfix.com/' },
        { name: 'ReadWriteThink', url: 'http://www.readwritethink.org/' },
        { name: 'Time4Writing', url: 'https://www.time4writing.com/free-writing-resources/' },
      ],
      example:
        "Use ReadWriteThink's interactive tools to plan, draft, and revise a personal narrative.",
      image: '/images/students_excited.webp',
    },
    {
      title: 'Middle School Literature (6-8)',
      subject: 'Language Arts',
      description:
        'Explore grade-appropriate novels, short stories, and poetry with supporting analysis tools and discussion guides.',
      externalLinks: [
        { name: 'CommonLit', url: 'https://www.commonlit.org/' },
        { name: 'Actively Learn', url: 'https://www.activelylearn.com/' },
        { name: 'Facing History', url: 'https://www.facinghistory.org/resource-library' },
      ],
      example:
        'Read short stories on CommonLit with integrated questions, annotations, and discussion prompts.',
      image: '/images/studying_group.webp',
    },
    {
      title: 'Grammar & Language Usage (6-12)',
      subject: 'Language Arts',
      description:
        'Master grammar concepts, sentence structure, punctuation, and effective language use through targeted practice.',
      externalLinks: [
        { name: 'Purdue OWL', url: 'https://owl.purdue.edu/owl/general_writing/grammar/' },
        { name: 'NoRedInk', url: 'https://www.noredink.com/' },
        { name: 'Quill', url: 'https://www.quill.org/' },
      ],
      example:
        'Practice identifying and correcting common grammatical errors using interactive NoRedInk exercises.',
      image: '/images/graduation_smiles.webp',
    },
    {
      title: 'Essay Writing & Research (9-12)',
      subject: 'Language Arts',
      description:
        'Develop research skills, thesis development, argumentation, and academic writing techniques for high school and college preparation.',
      externalLinks: [
        { name: 'Purdue OWL', url: 'https://owl.purdue.edu/owl/research_and_citation/' },
        { name: 'ThoughtCo Essay Writing', url: 'https://www.thoughtco.com/essay-writing-4132582' },
        {
          name: 'Harvard Writing Center',
          url: 'https://writingcenter.fas.harvard.edu/pages/resources',
        },
      ],
      example:
        'Use Purdue OWL resources to learn proper citation methods and research paper structure.',
      image: '/images/black_graduates.webp',
    },
    {
      title: 'Classic & Contemporary Literature (9-12)',
      subject: 'Language Arts',
      description:
        'Study significant works of literature with critical analysis guides, historical context, and interpretive resources.',
      externalLinks: [
        { name: 'SparkNotes', url: 'https://www.sparknotes.com/' },
        { name: 'Shmoop Literature', url: 'https://www.shmoop.com/literature/' },
        { name: 'LitCharts', url: 'https://www.litcharts.com/' },
      ],
      example:
        'Analyze themes, characters, and symbolism in "To Kill a Mockingbird" using LitCharts guides.',
      image: '/images/tuskegee_airmens.webp',
    },
  ];

  return (
    <StudyResourcesTemplate
      title="Language Arts Resources"
      description="Explore resources for developing strong reading, writing, and literature analysis skills"
      activeSubject="Language Arts"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">Language Arts Resources</h1>
        <p className="text-gray-300 mb-2">
          Our language arts resources support the development of strong communication skills through
          reading, writing, speaking, and listening. From early literacy to advanced literary
          analysis, these carefully selected materials help students engage with language in
          meaningful ways.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can find reading passages, writing prompts, grammar practice, and literature
          guides appropriate for different grade levels.
        </p>
      </div>

      {/* Skill filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
          All Skills
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Reading
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Writing
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Grammar
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Literature
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

      {/* Reading strategies section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Effective Reading Strategies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Before Reading</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Preview the text (title, headings, images)</li>
              <li>Activate prior knowledge on the topic</li>
              <li>Set a purpose for reading</li>
              <li>Make predictions about the content</li>
              <li>Review vocabulary or difficult terms</li>
              <li>Generate questions you hope to answer</li>
              <li>Choose an appropriate reading environment</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">During Reading</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Visualize what's being described</li>
              <li>Make connections (text-to-self, text-to-text, text-to-world)</li>
              <li>Monitor comprehension and clarify confusions</li>
              <li>Ask questions while reading</li>
              <li>Make inferences about unstated information</li>
              <li>Identify main ideas and supporting details</li>
              <li>Annotate or take notes on key points</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">After Reading</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Summarize what you've read</li>
              <li>Evaluate and reflect on the content</li>
              <li>Discuss or write about your interpretations</li>
              <li>Review and clarify any confusions</li>
              <li>Connect what you've learned to other knowledge</li>
              <li>Consider the author's purpose and perspective</li>
              <li>Apply what you've learned in meaningful ways</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">For Different Text Types</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <span className="font-semibold">Fiction:</span> Focus on characters, plot, setting,
                themes
              </li>
              <li>
                <span className="font-semibold">Non-fiction:</span> Identify main ideas, evidence,
                arguments
              </li>
              <li>
                <span className="font-semibold">Poetry:</span> Consider rhythm, imagery, figurative
                language
              </li>
              <li>
                <span className="font-semibold">Textbooks:</span> Use headings, summaries, and
                review questions
              </li>
              <li>
                <span className="font-semibold">Digital texts:</span> Be strategic about hyperlinks
                and distractions
              </li>
              <li>
                <span className="font-semibold">Primary sources:</span> Consider historical context
                and perspective
              </li>
              <li>
                <span className="font-semibold">Visual texts:</span> Analyze both images and
                accompanying text
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Writing process section */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          The Writing Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-[#2a2a3e] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-center">1. Prewriting</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Brainstorm ideas</li>
              <li>Research the topic</li>
              <li>Consider audience</li>
              <li>Create an outline</li>
              <li>Organize thoughts</li>
            </ul>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-center">2. Drafting</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Write freely</li>
              <li>Focus on content</li>
              <li>Develop ideas</li>
              <li>Don't worry about errors</li>
              <li>Follow your outline</li>
            </ul>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-center">3. Revising</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Reorganize if needed</li>
              <li>Add or remove content</li>
              <li>Clarify meaning</li>
              <li>Strengthen arguments</li>
              <li>Improve flow</li>
            </ul>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-center">4. Editing</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Fix grammar errors</li>
              <li>Check spelling</li>
              <li>Refine word choice</li>
              <li>Verify formatting</li>
              <li>Ensure clarity</li>
            </ul>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-center">5. Publishing</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Final formatting</li>
              <li>Create final copy</li>
              <li>Share with audience</li>
              <li>Collect feedback</li>
              <li>Reflect on process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Literary elements section */}
      <div className="mt-8 mb-4 p-6 bg-[#2a2a3e] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Literary Elements & Analysis
        </h2>
        <p className="text-gray-300 mb-4">
          Understanding these key literary elements helps readers analyze and interpret literature
          more deeply, revealing how authors craft meaning through various techniques and
          structures.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Character</h3>
            <p className="text-sm text-gray-400">
              The individuals who take part in the story. Analysis examines their traits,
              motivations, development, relationships, and roles (protagonist, antagonist, etc.).
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Plot</h3>
            <p className="text-sm text-gray-400">
              The sequence of events in a story, including exposition, rising action, climax,
              falling action, and resolution. Analysis considers causality, pacing, and structure.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Setting</h3>
            <p className="text-sm text-gray-400">
              The time, place, and environment where events occur. Analysis explores how setting
              influences characters, creates atmosphere, and contributes to themes.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Theme</h3>
            <p className="text-sm text-gray-400">
              The central ideas, messages, or insights about life and human nature expressed in the
              work. Analysis identifies explicit and implicit themes and their development.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Point of View</h3>
            <p className="text-sm text-gray-400">
              The perspective through which the story is told (first person, third person limited,
              omniscient, etc.). Analysis considers how this affects the reader's access to
              information.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Symbolism & Imagery</h3>
            <p className="text-sm text-gray-400">
              Objects, actions, or characters that represent something beyond their literal meaning,
              and descriptive language that appeals to the senses to create vivid mental pictures.
            </p>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default LanguageArtsResources;
