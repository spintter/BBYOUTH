import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const MathResources: React.FC = () => {
  const resources = [
    {
      title: 'Early Math Foundations (K-2)',
      subject: 'Math',
      description:
        'Build essential number sense, counting, and basic operations with engaging activities for young learners.',
      externalLinks: [
        { name: 'Khan Academy Kids', url: 'https://learn.khanacademy.org/khan-academy-kids/' },
        { name: 'ABCya!', url: 'https://www.abcya.com/' },
        { name: 'PBS Kids Math', url: 'https://pbskids.org/games/math/' },
      ],
      example:
        'Practice counting and number recognition through interactive games on PBS Kids Math.',
      image: '/images/young_schoolboy.webp',
    },
    {
      title: 'Elementary Math Skills (3-5)',
      subject: 'Math',
      description:
        'Develop multiplication, division, fractions, and problem-solving skills with interactive lessons and practice.',
      externalLinks: [
        {
          name: 'Khan Academy 3rd Grade',
          url: 'https://www.khanacademy.org/math/cc-third-grade-math',
        },
        { name: 'IXL Math', url: 'https://www.ixl.com/math/' },
        { name: 'Prodigy Math', url: 'https://www.prodigygame.com/' },
      ],
      example:
        'Complete the fractions unit on Khan Academy with practice exercises to build strong conceptual understanding.',
      image: '/images/math_problem.webp',
    },
    {
      title: 'Middle School Math (6-8)',
      subject: 'Math',
      description:
        'Master pre-algebra, ratios, proportions, and geometry concepts with interactive lessons and problem sets.',
      externalLinks: [
        {
          name: 'Khan Academy 7th Grade',
          url: 'https://www.khanacademy.org/math/cc-seventh-grade-math',
        },
        { name: 'Desmos', url: 'https://www.desmos.com/' },
        { name: 'Math is Fun', url: 'https://www.mathsisfun.com/' },
      ],
      example:
        'Explore geometric concepts with interactive tools on Desmos to visualize relationships between shapes.',
      image: '/images/studying_group.webp',
    },
    {
      title: 'High School Math (9-12)',
      subject: 'Math',
      description:
        'Build advanced skills in algebra, geometry, trigonometry, and calculus with comprehensive lessons and practice.',
      externalLinks: [
        { name: 'Khan Academy Algebra', url: 'https://www.khanacademy.org/math/algebra' },
        { name: 'Khan Academy Calculus', url: 'https://www.khanacademy.org/math/calculus-1' },
        { name: 'Desmos Classroom', url: 'https://teacher.desmos.com/' },
      ],
      example:
        'Work through a calculus unit on limits and continuity with practice problems from Khan Academy.',
      image: '/images/tuskegee_airmens.webp',
    },
    {
      title: 'Real-World Math Applications',
      subject: 'Math',
      description:
        'Connect math to everyday life with applied problems in finance, engineering, science, and other fields.',
      externalLinks: [
        { name: 'Next Gen Personal Finance', url: 'https://www.ngpf.org/' },
        { name: 'NASA STEM Engagement', url: 'https://www.nasa.gov/stem/' },
        { name: 'NRICH Mathematics', url: 'https://nrich.maths.org/' },
      ],
      example:
        'Use Next Gen Personal Finance calculators to solve real budget scenarios and understand compound interest.',
      image: '/images/student_smiling.webp',
    },
    {
      title: 'Math Test Preparation',
      subject: 'Math',
      description:
        'Prepare for standardized tests with targeted practice in key math concepts and test-taking strategies.',
      externalLinks: [
        {
          name: 'Khan Academy SAT Math',
          url: 'https://www.khanacademy.org/test-prep/sat/sat-math-practice',
        },
        {
          name: 'Khan Academy AP Calculus',
          url: 'https://www.khanacademy.org/math/ap-calculus-ab',
        },
        { name: 'Albert.io', url: 'https://www.albert.io/math' },
      ],
      example:
        'Take a full-length SAT Math practice test on Khan Academy, then review your mistakes to identify areas for improvement.',
      image: '/images/black_graduates.webp',
    },
  ];

  return (
    <StudyResourcesTemplate
      title="Mathematics Resources"
      description="Comprehensive math resources from basic number sense to advanced calculus for all grade levels"
      activeSubject="Mathematics"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">Mathematics Resources</h1>
        <p className="text-gray-300 mb-2">
          Explore our collection of mathematics resources designed to build strong foundational
          skills and problem-solving abilities. From basic number sense to advanced calculus, these
          resources support math education across all grade levels.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can access free learning materials, practice problems, and interactive tools.
        </p>
      </div>

      {/* Grade level filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
          All Grades
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          K-2
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          3-5
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          6-8
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          9-12
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

      {/* Math concepts section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Core Mathematical Concepts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Number Sense & Operations</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Understanding place value and number systems</li>
              <li>Mastering operations (addition, subtraction, multiplication, division)</li>
              <li>Working with fractions, decimals, and percentages</li>
              <li>Applying properties of operations</li>
              <li>Solving multi-step problems</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Algebra & Functions</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Understanding variables and expressions</li>
              <li>Solving equations and inequalities</li>
              <li>Analyzing functions and their representations</li>
              <li>Working with polynomials and rational expressions</li>
              <li>Applying algebraic concepts to real-world situations</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Geometry & Measurement</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Analyzing properties of geometric shapes</li>
              <li>Understanding congruence, similarity, and transformations</li>
              <li>Applying coordinate geometry</li>
              <li>Working with measurements and unit conversions</li>
              <li>Using geometric models to solve problems</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Data Analysis & Probability</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Collecting, organizing, and interpreting data</li>
              <li>Creating and analyzing statistical representations</li>
              <li>Understanding measures of central tendency and dispersion</li>
              <li>Applying probability concepts</li>
              <li>Making predictions based on data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Math tools section */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Recommended Math Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Desmos</h3>
            <p className="text-sm text-gray-400 mb-2">
              Interactive graphing calculator with classroom activities
            </p>
            <a
              href="https://www.desmos.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Visit Site
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">GeoGebra</h3>
            <p className="text-sm text-gray-400 mb-2">
              Dynamic mathematics software for geometry, algebra, and calculus
            </p>
            <a
              href="https://www.geogebra.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Visit Site
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Wolfram Alpha</h3>
            <p className="text-sm text-gray-400 mb-2">
              Computational knowledge engine for higher-level math
            </p>
            <a
              href="https://www.wolframalpha.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Visit Site
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Khan Academy</h3>
            <p className="text-sm text-gray-400 mb-2">
              Comprehensive math lessons, practice, and mastery challenges
            </p>
            <a
              href="https://www.khanacademy.org/math"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Visit Site
            </a>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default MathResources;
