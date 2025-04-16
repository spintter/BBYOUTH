import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StudyResourcesTemplate from '../components/StudyResourcesTemplate';

const StudyResources: React.FC = () => {
  return (
    <StudyResourcesTemplate
      title="K-12 Study Resources"
      description="Find helpful study materials, links, and resources organized by grade level and subject"
    >
      <div className="w-full overflow-hidden rounded-lg mb-8">
        <Image
          src="/images/young_group.jpg"
          alt="Students studying together"
          width={900}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
          priority
          quality={85}
        />
      </div>

      <p className="text-base sm:text-lg font-inter text-gray-300 mb-8">
        Explore educational content tailored for different grade levels and subjects. Select a
        category from the sidebar to find helpful resources from trusted sources to support your
        learning journey.
      </p>

      {/* Grade level cards */}
      <h2 className="text-2xl font-bold mb-6 font-montserrat">Browse by Grade Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/study-resources/grades/k-2"
          className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Grades K-2</h3>
          <p className="text-blue-200 mb-4">
            Foundational learning resources for early elementary students
          </p>
          <span className="inline-flex items-center text-white">
            Explore Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>

        <Link
          href="/study-resources/grades/3-5"
          className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Grades 3-5</h3>
          <p className="text-purple-200 mb-4">
            Interactive resources for upper elementary students
          </p>
          <span className="inline-flex items-center text-white">
            Explore Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>

        <Link
          href="/study-resources/grades/6-8"
          className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Grades 6-8</h3>
          <p className="text-teal-200 mb-4">Comprehensive resources for middle school students</p>
          <span className="inline-flex items-center text-white">
            Explore Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>

        <Link
          href="/study-resources/grades/9-12"
          className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Grades 9-12</h3>
          <p className="text-red-200 mb-4">Advanced resources for high school students</p>
          <span className="inline-flex items-center text-white">
            Explore Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>

        <Link
          href="/study-resources/educators"
          className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold mb-2 text-white">Educators</h3>
          <p className="text-green-200 mb-4">
            Professional resources for teachers and education professionals
          </p>
          <span className="inline-flex items-center text-white">
            Explore Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* Subject cards */}
      <h2 className="text-2xl font-bold mb-6 font-montserrat mt-8">Browse by Subject</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/study-resources/subjects/math"
          className="bg-[#2a2a3e] rounded-lg p-5 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1 text-white">Math</h3>
          <p className="text-sm text-gray-300">Numbers, algebra, geometry & more</p>
        </Link>

        <Link
          href="/study-resources/subjects/ela"
          className="bg-[#2a2a3e] rounded-lg p-5 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="bg-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1 text-white">ELA</h3>
          <p className="text-sm text-gray-300">Reading, writing, grammar & literature</p>
        </Link>

        <Link
          href="/study-resources/subjects/science"
          className="bg-[#2a2a3e] rounded-lg p-5 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="bg-purple-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1 text-white">Science</h3>
          <p className="text-sm text-gray-300">Biology, chemistry, physics & earth science</p>
        </Link>

        <Link
          href="/study-resources/subjects/social-studies"
          className="bg-[#2a2a3e] rounded-lg p-5 text-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="bg-amber-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1 text-white">Social Studies</h3>
          <p className="text-sm text-gray-300">History, civics, geography & economics</p>
        </Link>
      </div>

      {/* Featured resources section */}
      <div className="mt-16 p-6 bg-gradient-to-r from-[#111122] to-[#1a1a2e] rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-montserrat">
            New & Featured Resources
          </h2>
          <Link
            href="/study-resources/featured"
            className="text-[#FFD700] hover:underline mt-2 md:mt-0 inline-flex items-center"
          >
            View All Featured Resources
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#2a2a3e] rounded-lg p-5 shadow relative">
            <span className="absolute top-3 right-3 bg-[#8B0000] text-white text-xs px-2 py-1 rounded-full">
              NEW
            </span>
            <h3 className="text-lg font-semibold text-white mb-2">Khan Academy Kids</h3>
            <p className="text-gray-300 text-sm mb-3">
              Foundational literacy program with interactive stories and activities
            </p>
            <a
              href="https://learn.khanacademy.org/khan-academy-kids/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:text-yellow-400 text-sm font-medium inline-flex items-center"
            >
              Visit Resource
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="bg-[#2a2a3e] rounded-lg p-5 shadow relative">
            <h3 className="text-lg font-semibold text-white mb-2">
              Digital SAT Reading/Writing Prep
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Official SAT practice materials with 4,100+ mastery points
            </p>
            <a
              href="https://www.khanacademy.org/test-prep/sat-reading-and-writing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:text-yellow-400 text-sm font-medium inline-flex items-center"
            >
              Visit Resource
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="bg-[#2a2a3e] rounded-lg p-5 shadow relative">
            <h3 className="text-lg font-semibold text-white mb-2">Khan Academy ELA</h3>
            <p className="text-gray-300 text-sm mb-3">
              Comprehensive resources for middle and high school English
            </p>
            <a
              href="https://www.khanacademy.org/ela/cc-middle-school"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFD700] hover:text-yellow-400 text-sm font-medium inline-flex items-center"
            >
              Visit Resource
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </StudyResourcesTemplate>
  );
};

export default StudyResources;
