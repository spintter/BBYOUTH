import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const MathematicsResources: React.FC = () => {
  const resources = [
    {
      title: 'Early Math Foundations (K-2)',
      subject: 'Mathematics',
      description:
        'Build a strong foundation in numbers, counting, basic operations, and shapes through fun, interactive activities.',
      externalLinks: [
        { name: 'Khan Academy Kids', url: 'https://learn.khanacademy.org/khan-academy-kids/' },
        { name: 'PBS Kids Math', url: 'https://pbskids.org/games/math/' },
        { name: 'NCTM Illuminations', url: 'https://illuminations.nctm.org/' },
      ],
      example: 'Practice counting and number recognition with PBS Kids interactive games.',
      image: '/images/student_smiling.webp',
    },
    {
      title: 'Elementary Math (3-5)',
      subject: 'Mathematics',
      description:
        'Develop skills in multiplication, division, fractions, decimals, and basic geometry through structured learning resources.',
      externalLinks: [
        { name: 'Khan Academy', url: 'https://www.khanacademy.org/math/cc-3rd-grade-math' },
        { name: 'Math Playground', url: 'https://www.mathplayground.com/' },
        { name: 'IXL Math', url: 'https://www.ixl.com/math/' },
      ],
      example:
        'Complete the multiplication and division section on Khan Academy with interactive practice.',
      image: '/images/young_schoolboy.webp',
    },
    {
      title: 'Middle School Math (6-8)',
      subject: 'Mathematics',
      description:
        'Master ratios, proportions, expressions, equations, statistics, and probability through comprehensive resources.',
      externalLinks: [
        {
          name: 'Khan Academy Middle School',
          url: 'https://www.khanacademy.org/math/cc-sixth-grade-math',
        },
        { name: 'Desmos Activities', url: 'https://teacher.desmos.com/' },
        { name: 'Math is Fun', url: 'https://www.mathsisfun.com/' },
      ],
      example: 'Use Desmos to create and visualize linear equations with interactive graphs.',
      image: '/images/studying_group.webp',
    },
    {
      title: 'Algebra (8-10)',
      subject: 'Mathematics',
      description:
        'Learn to solve equations, work with variables, understand functions, and analyze relationships between quantities.',
      externalLinks: [
        { name: 'Khan Academy Algebra', url: 'https://www.khanacademy.org/math/algebra' },
        { name: 'Desmos Graphing Calculator', url: 'https://www.desmos.com/calculator' },
        { name: 'Algebra.com', url: 'http://www.algebra.com/' },
      ],
      example:
        'Practice solving systems of equations using the Khan Academy interactive exercises.',
      image: '/images/students_excited.webp',
    },
    {
      title: 'Geometry (9-11)',
      subject: 'Mathematics',
      description:
        'Explore shapes, angles, transformations, proofs, and spatial relationships in both 2D and 3D contexts.',
      externalLinks: [
        { name: 'Khan Academy Geometry', url: 'https://www.khanacademy.org/math/geometry' },
        { name: 'GeoGebra', url: 'https://www.geogebra.org/' },
        { name: 'Math Open Reference', url: 'https://www.mathopenref.com/' },
      ],
      example: 'Use GeoGebra to construct geometric figures and explore their properties.',
      image: '/images/graduation_smiles.webp',
    },
    {
      title: 'Advanced Math (11-12)',
      subject: 'Mathematics',
      description:
        'Tackle pre-calculus, calculus, and statistics through comprehensive resources designed for college preparation.',
      externalLinks: [
        { name: 'Khan Academy Calculus', url: 'https://www.khanacademy.org/math/calculus-1' },
        { name: "Paul's Online Math Notes", url: 'https://tutorial.math.lamar.edu/' },
        { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/mathematics/' },
      ],
      example:
        "Study derivatives and integrals using Paul's Online Math Notes with step-by-step explanations.",
      image: '/images/tuskegee_airmens.webp',
    },
    {
      title: 'Applied Mathematics',
      subject: 'Mathematics',
      description:
        'See how math applies to real-world situations in fields like finance, engineering, coding, and data analysis.',
      externalLinks: [
        { name: 'Brilliant', url: 'https://brilliant.org/' },
        { name: 'Mathigon', url: 'https://mathigon.org/' },
        { name: 'Numberphile', url: 'https://www.numberphile.com/' },
      ],
      example: 'Explore interactive lessons on cryptography and coding on Brilliant.',
      image: '/images/black_graduates.webp',
    },
  ];

  return (
    <StudyResourcesTemplate
      title="Mathematics Resources"
      description="Explore resources for building strong foundations in math concepts from arithmetic to calculus"
      activeSubject="Mathematics"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">Mathematics Resources</h1>
        <p className="text-gray-300 mb-2">
          Our collection of mathematics resources is designed to build confidence and competence at
          every level. From basic counting to advanced calculus, we've curated engaging, interactive
          resources that make mathematical concepts clear and accessible.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites
          where you can find practice problems, visual demonstrations, video lessons, and
          comprehensive learning materials.
        </p>
      </div>

      {/* Level filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
          All Levels
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
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Algebra
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Geometry
        </button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          Calculus
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

      {/* Mathematical thinking section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Mathematical Thinking Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Problem Solving</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Understand the problem before attempting to solve it</li>
              <li>Break complex problems into simpler parts</li>
              <li>Try different strategies and approaches</li>
              <li>Look for patterns and relationships</li>
              <li>Work backwards from what you need to find</li>
              <li>Use visual representations when helpful</li>
              <li>Check answers for reasonableness</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Logical Reasoning</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Make conjectures and test them</li>
              <li>Use deductive reasoning to draw conclusions</li>
              <li>Form valid arguments based on axioms and definitions</li>
              <li>Identify flaws in reasoning and counterexamples</li>
              <li>Understand the difference between necessary and sufficient conditions</li>
              <li>Analyze the logical structure of mathematical statements</li>
              <li>Apply principles of formal logic</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Mathematical Modeling</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Translate real-world situations into mathematical expressions</li>
              <li>Identify relevant variables and relationships</li>
              <li>Use appropriate mathematical tools and representations</li>
              <li>Make reasonable simplifications and assumptions</li>
              <li>Interpret mathematical results in real-world context</li>
              <li>Analyze the limitations of mathematical models</li>
              <li>Refine models based on additional information</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-[#F9A826]">Pattern Recognition</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Identify recurring patterns in sequences and data</li>
              <li>Extend patterns to make predictions</li>
              <li>Express patterns using mathematical notation</li>
              <li>Recognize structural similarities across different contexts</li>
              <li>Use patterns to develop generalizations</li>
              <li>Apply pattern recognition to problem-solving</li>
              <li>Connect patterns to mathematical concepts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mathematical tools section */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Mathematical Tools & Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Desmos</h3>
            <p className="text-sm text-gray-400 mb-2">
              Powerful graphing calculator with advanced visualization capabilities
            </p>
            <a
              href="https://www.desmos.com/calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Open Calculator
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">GeoGebra</h3>
            <p className="text-sm text-gray-400 mb-2">
              Interactive software for geometry, algebra, statistics, and calculus
            </p>
            <a
              href="https://www.geogebra.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Try GeoGebra
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Wolfram Alpha</h3>
            <p className="text-sm text-gray-400 mb-2">
              Computational knowledge engine that can solve complex math problems
            </p>
            <a
              href="https://www.wolframalpha.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Solve Problems
            </a>
          </div>

          <div className="bg-[#2a2a3e] p-4 rounded-lg text-center">
            <h3 className="font-medium mb-2">Mathway</h3>
            <p className="text-sm text-gray-400 mb-2">
              Step-by-step problem solver for various math topics
            </p>
            <a
              href="https://www.mathway.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Get Solutions
            </a>
          </div>
        </div>
      </div>

      {/* Math practice section */}
      <div className="mt-8 mb-4 p-6 bg-[#2a2a3e] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">
          Effective Math Practice Strategies
        </h2>
        <p className="text-gray-300 mb-4">
          Regular practice is essential for developing mathematical fluency. These strategies can
          help make your practice sessions more effective and productive.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Spaced Repetition</h3>
            <p className="text-sm text-gray-400">
              Instead of cramming, spread out your practice over time. Review concepts at increasing
              intervals to strengthen your long-term memory and understanding.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Interleaved Practice</h3>
            <p className="text-sm text-gray-400">
              Mix different types of problems rather than focusing on just one topic at a time. This
              helps you learn to identify which strategies to apply to different problem types.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Teach to Learn</h3>
            <p className="text-sm text-gray-400">
              Explaining concepts to others (even if just imaginary) forces you to clarify your
              thinking and identify gaps in your understanding.
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Work Backwards</h3>
            <p className="text-sm text-gray-400">
              Practice with solved examples by covering up the solution and trying to solve it
              yourself, then comparing your approach to the given solution.
            </p>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default MathematicsResources;
