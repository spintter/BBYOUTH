import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const ScienceResources: React.FC = () => {
  const resources = [
    {
      title: 'Early Science Exploration (K-2)',
      subject: 'Science',
      description:
        'Develop curiosity about the natural world through hands-on activities and basic science concepts.',
      externalLinks: [
        { name: 'Mystery Science', url: 'https://mysteryscience.com/' },
        { name: 'National Geographic Kids', url: 'https://kids.nationalgeographic.com/' },
        { name: 'PBS Kids Science', url: 'https://pbskids.org/games/science/' },
      ],
      example:
        'Explore animal adaptations through interactive games and videos on National Geographic Kids.',
      image: '/images/young_schoolboy.webp',
    },
    {
      title: 'Elementary Science (3-5)',
      subject: 'Science',
      description:
        'Build foundational understanding of scientific inquiry, earth science, life science, and physical science.',
      externalLinks: [
        { name: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/' },
        { name: 'Science Kids', url: 'https://www.sciencekids.co.nz/' },
        { name: 'BrainPOP Science', url: 'https://www.brainpop.com/science/' },
      ],
      example:
        'Complete a weather patterns investigation using NASA Space Place interactive tools.',
      image: '/images/science_experiment.webp',
    },
    {
      title: 'Middle School Science (6-8)',
      subject: 'Science',
      description:
        'Develop deeper understanding of scientific concepts and processes through inquiry-based learning.',
      externalLinks: [
        { name: 'Khan Academy Science', url: 'https://www.khanacademy.org/science' },
        { name: 'CK-12', url: 'https://www.ck12.org/science/' },
        { name: 'NOVA Labs', url: 'https://www.pbs.org/wgbh/nova/labs/' },
      ],
      example:
        'Conduct a virtual lab experiment on cell biology using interactive simulations from CK-12.',
      image: '/images/studying_group.webp',
    },
    {
      title: 'High School Biology',
      subject: 'Science',
      description:
        'Explore cellular processes, genetics, evolution, ecology, and human body systems in depth.',
      externalLinks: [
        { name: 'Khan Academy Biology', url: 'https://www.khanacademy.org/science/biology' },
        { name: 'Crash Course Biology', url: 'https://thecrashcourse.com/topic/biology/' },
        { name: 'Howard Hughes Medical Institute', url: 'https://www.biointeractive.org/' },
      ],
      example:
        'Complete the DNA replication unit on Khan Academy with interactive diagrams and practice questions.',
      image: '/images/tuskegee_airmens.webp',
    },
    {
      title: 'High School Chemistry',
      subject: 'Science',
      description:
        'Master atomic structure, chemical bonding, reactions, stoichiometry, and thermodynamics.',
      externalLinks: [
        { name: 'Khan Academy Chemistry', url: 'https://www.khanacademy.org/science/chemistry' },
        {
          name: 'PhET Chemistry Simulations',
          url: 'https://phet.colorado.edu/en/simulations/category/chemistry',
        },
        { name: 'Crash Course Chemistry', url: 'https://thecrashcourse.com/topic/chemistry/' },
      ],
      example: 'Use PhET simulations to visualize chemical reactions and molecular structures.',
      image: '/images/laboratory.webp',
    },
    {
      title: 'High School Physics',
      subject: 'Science',
      description:
        'Understand mechanics, electricity, magnetism, waves, and modern physics concepts.',
      externalLinks: [
        { name: 'Khan Academy Physics', url: 'https://www.khanacademy.org/science/physics' },
        {
          name: 'PhET Physics Simulations',
          url: 'https://phet.colorado.edu/en/simulations/category/physics',
        },
        { name: 'The Physics Classroom', url: 'https://www.physicsclassroom.com/' },
      ],
      example:
        'Analyze motion and forces using interactive simulations from The Physics Classroom.',
      image: '/images/student_smiling.webp',
    },
    {
      title: 'Earth & Environmental Science',
      subject: 'Science',
      description:
        'Explore Earth systems, climate, geology, oceanography, and human environmental impacts.',
      externalLinks: [
        { name: 'NASA Climate Kids', url: 'https://climatekids.nasa.gov/' },
        { name: 'NOAA Education', url: 'https://www.noaa.gov/education' },
        {
          name: 'National Geographic Environment',
          url: 'https://www.nationalgeographic.com/environment/',
        },
      ],
      example:
        'Use NOAA data visualizations to track climate patterns and discuss environmental impacts.',
      image: '/images/black_graduates.webp',
    },
  ];

  return (
    <StudyResourcesTemplate
      title="Science Resources"
      description="Comprehensive science resources from basic concepts to advanced topics across biology, chemistry, physics and earth sciences"
      activeSubject="Science"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">Science Resources</h1>
        <p className="text-gray-300 mb-2">
          Explore our collection of science resources designed to foster curiosity, critical
          thinking, and scientific literacy. From basic natural world exploration to advanced
          scientific concepts, these resources support science education across all grade levels.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can access free experiments, simulations, videos, and interactive learning
          tools.
        </p>
      </div>

      {/* Grade level filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
          All Topics
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          K-5
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          6-8
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Biology
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Chemistry
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Physics
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Earth Science
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

      {/* Scientific method section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Scientific Method & Inquiry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#4CAF50]">Scientific Method Steps</h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Ask a question based on observations</li>
              <li>Research existing information on the topic</li>
              <li>Formulate a hypothesis - a testable explanation</li>
              <li>Design and conduct an experiment to test the hypothesis</li>
              <li>Analyze data and draw conclusions</li>
              <li>Communicate results and invite peer review</li>
              <li>Refine, revise, and repeat if necessary</li>
            </ol>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#4CAF50]">Scientific Inquiry Skills</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Making detailed observations</li>
              <li>Asking testable questions</li>
              <li>Designing controlled experiments</li>
              <li>Collecting and recording accurate data</li>
              <li>Analyzing and interpreting results</li>
              <li>Drawing evidence-based conclusions</li>
              <li>Communicating scientific findings effectively</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#4CAF50]">Laboratory Safety</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Always wear appropriate safety equipment</li>
              <li>Know the location of safety equipment</li>
              <li>Follow all written and verbal instructions</li>
              <li>Never eat or drink in the laboratory</li>
              <li>Report all accidents and spills immediately</li>
              <li>Dispose of materials properly</li>
              <li>Clean and organize your workspace after use</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#4CAF50]">Scientific Literacy</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Evaluating the credibility of scientific information</li>
              <li>Understanding the difference between correlation and causation</li>
              <li>Recognizing scientific consensus vs. isolated claims</li>
              <li>Interpreting scientific data and visualizations</li>
              <li>Applying scientific knowledge to everyday decisions</li>
              <li>Appreciating both the potential and limitations of science</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Science tools section */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Virtual Science Labs & Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">PhET Interactive Simulations</h3>
            <p className="text-sm text-gray-400 mb-2">
              Free science and math simulations for virtual experiments
            </p>
            <a
              href="https://phet.colorado.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Try Simulations
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Labster</h3>
            <p className="text-sm text-gray-400 mb-2">
              Virtual lab simulations for science education
            </p>
            <a
              href="https://www.labster.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Explore Labs
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">HHMI BioInteractive</h3>
            <p className="text-sm text-gray-400 mb-2">
              Free resources for teaching and learning biology
            </p>
            <a
              href="https://www.biointeractive.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Resources
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">NASA Visualization Explorer</h3>
            <p className="text-sm text-gray-400 mb-2">
              Space and Earth science visualizations and data
            </p>
            <a
              href="https://www.nasa.gov/connect/apps.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Explore Data
            </a>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default ScienceResources;
