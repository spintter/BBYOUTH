import React from 'react';
import StudyResourcesTemplate from '../../../components/StudyResourcesTemplate';
import StudyResourceCard from '../../../components/StudyResourceCard';

const K2Resources: React.FC = () => {
  const resources = [
    {
      title: 'Early Reading & Phonics',
      subject: 'ELA',
      description: 'Fun stories, games, and activities to build foundational reading skills for young learners.',
      externalLinks: [
        { name: 'Khan Academy Kids', url: 'https://learn.khanacademy.org/khan-academy-kids/' },
        { name: 'Storynory', url: 'https://www.storynory.com/' },
        { name: 'PBS Kids', url: 'https://pbskids.org/' },
        { name: 'Fun Brain', url: 'https://www.funbrain.com/' }
      ],
      example: 'Listen to "The Three Billy Goats Gruff" on Storynory and discuss the story's sequence to build comprehension skills.',
      image: '/images/young_schoolboy.webp'
    },
    {
      title: 'Early Math Concepts',
      subject: 'Math',
      description: 'Learn counting, shapes, addition, and subtraction with interactive lessons designed for young learners.',
      externalLinks: [
        { name: 'Khan Academy Kids', url: 'https://learn.khanacademy.org/khan-academy-kids/' },
        { name: 'Coolmath4Kids', url: 'https://www.coolmath4kids.com/' },
        { name: 'PBS Kids Math', url: 'https://pbskids.org/games/math/' }
      ],
      example: 'Play interactive counting games on PBS Kids Math to strengthen number recognition skills.',
      image: '/images/mlk_hitstory.jpeg'
    },
    {
      title: 'Science Exploration',
      subject: 'Science',
      description: 'Discover the natural world through interactive activities and simple experiments suitable for young scientists.',
      externalLinks: [
        { name: 'National Geographic Kids', url: 'https://kids.nationalgeographic.com/' },
        { name: 'PBS Kids Science', url: 'https://pbskids.org/games/science/' },
        { name: 'Science Fun', url: 'https://www.sciencefun.org/kidszone/experiments/' }
      ],
      example: 'Explore a virtual map on National Geographic Kids to learn about different animals and their habitats.',
      image: '/images/dad_hug_son_optimized.webp'
    },
    {
      title: 'Social Studies for Little Learners',
      subject: 'Social Studies',
      description: 'Age-appropriate lessons on communities, geography, and history for young students.',
      externalLinks: [
        { name: 'PBS LearningMedia Social Studies', url: 'https://www.pbslearningmedia.org/subjects/social-studies/' },
        { name: 'Time for Kids', url: 'https://www.timeforkids.com/' },
        { name: 'National Geographic Kids', url: 'https://kids.nationalgeographic.com/geography/' }
      ],
      example: 'Watch a video on community helpers on PBS LearningMedia to understand different roles in society.',
      image: '/images/blackhistory_logo.jpeg'
    },
    {
      title: 'Art & Music Basics',
      subject: 'Arts',
      description: 'Creative activities to explore colors, shapes, sounds, and music fundamentals.',
      externalLinks: [
        { name: 'The Art of Education', url: 'https://theartofeducation.edu/k-12-resources/' },
        { name: 'PBS Kids Art & Music', url: 'https://pbskids.org/games/arts-crafts/' },
        { name: 'Chrome Music Lab', url: 'https://musiclab.chromeexperiments.com/' }
      ],
      example: 'Use Chrome Music Lab to experiment with different sounds and create simple melodies.',
      image: '/images/church3_optimized.webp'
    },
    {
      title: 'Money & Economics Basics',
      subject: 'Economics',
      description: 'Introduction to needs, wants, and basic economic concepts for young children.',
      externalLinks: [
        { name: 'EconEdLink', url: 'https://www.econedlink.org/' },
        { name: 'Kiddynomics', url: 'https://www.stlouisfed.org/education/kiddynomics' },
        { name: 'Money Instructor', url: 'https://www.moneyinstructor.com/elementary.asp' }
      ],
      example: 'Play the "Needs vs. Wants" sorting game on EconEdLink to understand basic budgeting concepts.',
      image: '/images/random_education.jpg'
    }
  ];

  return (
    <StudyResourcesTemplate
      title="Grades K-2 Resources"
      description="Educational resources designed specifically for kindergarten through second grade students"
      activeGradeLevel="K-2"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-montserrat">K-2 Learning Resources</h1>
        <p className="text-gray-300 mb-2">
          Explore our collection of educational resources specifically designed for kindergarten through second grade students.
          These materials focus on building foundational skills across all core subjects through engaging, interactive activities.
        </p>
        <p className="text-gray-300 mb-6">
          Each resource includes example activities and direct links to trusted educational websites where you can access free learning materials.
        </p>
      </div>

      {/* Subject filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">All Subjects</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">ELA</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Math</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Science</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Social Studies</button>
        <button className="bg-[#2a2a3e] text-gray-300 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Arts</button>
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

      {/* Teacher tips section */}
      <div className="mt-12 bg-[#2a2a3e] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white font-montserrat">Teacher & Parent Tips</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Supporting Early Literacy</h3>
          <p className="text-gray-300 mb-3">
            Read aloud daily with your child or students. Ask questions about the story and encourage them to make predictions. 
            Point to words as you read to help children make connections between spoken and written language.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Math Foundations</h3>
          <p className="text-gray-300 mb-3">
            Use everyday objects to practice counting, sorting, and basic addition. 
            Connect math concepts to real-life situations, like counting items at the grocery store or measuring ingredients while cooking.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 text-[#FFD700]">Making Learning Fun</h3>
          <p className="text-gray-300">
            Young children learn best through play. Incorporate games, songs, and hands-on activities into learning. 
            Allow for movement breaks and vary activities to keep young learners engaged.
          </p>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default K2Resources; 