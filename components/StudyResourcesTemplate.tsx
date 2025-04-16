import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

// Educational subjects for the sidebar
const subjects = [
  { title: 'Math', link: '/study-resources/subjects/math' },
  { title: 'English Language Arts', link: '/study-resources/subjects/ela' },
  { title: 'Science', link: '/study-resources/subjects/science' },
  { title: 'Social Studies', link: '/study-resources/subjects/social-studies' },
  { title: 'Arts', link: '/study-resources/subjects/arts' },
  { title: 'Technology', link: '/study-resources/subjects/technology' },
  { title: 'Health & Physical Education', link: '/study-resources/subjects/health-pe' },
  { title: 'Foreign Languages', link: '/study-resources/subjects/languages' },
];

// Grade levels for the sidebar
const gradeLevels = [
  { title: 'K-2', link: '/study-resources/grades/k-2' },
  { title: '3-5', link: '/study-resources/grades/3-5' },
  { title: '6-8', link: '/study-resources/grades/6-8' },
  { title: '9-12', link: '/study-resources/grades/9-12' },
  { title: 'Educators', link: '/study-resources/educators' },
];

interface StudyResourcesTemplateProps {
  title: string;
  description: string;
  activeSubject?: string;
  activeGradeLevel?: string;
  headerBg?: string;
  headerTextColor?: string;
  mainBg?: string;
  mainTextColor?: string;
  children: React.ReactNode;
}

const StudyResourcesTemplate: React.FC<StudyResourcesTemplateProps> = ({
  title,
  description,
  activeSubject,
  activeGradeLevel,
  headerBg = '#8B0000',
  headerTextColor = 'white',
  mainBg = '#1a1a2e',
  mainTextColor = 'white',
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'grades' | 'subjects'>('grades');
  const router = useRouter();

  // Extract pathname segments for breadcrumbs
  const pathSegments = router.asPath.split('/').filter((segment) => segment);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{`Study Resources | ${title}`}</title>
        <meta
          name="description"
          content={description}
        />
      </Head>

      {/* Navbar */}
      <Navbar />

      {/* Main header */}
      <header
        style={{ backgroundColor: headerBg, color: headerTextColor }}
        className="py-12 px-4 md:px-8 shadow-md relative"
      >
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">{title}</h1>
          <p className="text-lg opacity-90 max-w-3xl font-inter">{description}</p>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex-grow flex flex-col md:flex-row relative">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-[#8B0000] text-white p-3 rounded-full shadow-lg"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Sidebar - always visible on desktop, conditionally on mobile */}
        <aside
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:block bg-[#111122] text-white w-full md:w-64 p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto`}
        >
          <div className="flex mb-6 border-b border-gray-700 pb-4">
            <button
              onClick={() => setActiveSidebar('grades')}
              className={`flex-1 py-2 text-center font-medium ${
                activeSidebar === 'grades'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                  : 'text-gray-300'
              }`}
            >
              Grade Levels
            </button>
            <button
              onClick={() => setActiveSidebar('subjects')}
              className={`flex-1 py-2 text-center font-medium ${
                activeSidebar === 'subjects'
                  ? 'text-[#FFD700] border-b-2 border-[#FFD700]'
                  : 'text-gray-300'
              }`}
            >
              Subjects
            </button>
          </div>

          {activeSidebar === 'grades' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 font-montserrat">Grade Levels</h2>
              <ul className="space-y-3">
                {gradeLevels.map((grade) => (
                  <li key={grade.title}>
                    <Link
                      href={grade.link}
                      className={`block py-2 px-3 rounded transition-colors ${
                        activeGradeLevel === grade.title
                          ? 'bg-[#8B0000] text-white'
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                    >
                      {grade.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSidebar === 'subjects' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 font-montserrat">Subjects</h2>
              <ul className="space-y-3">
                {subjects.map((subject) => (
                  <li key={subject.title}>
                    <Link
                      href={subject.link}
                      className={`block py-2 px-3 rounded transition-colors ${
                        activeSubject === subject.title
                          ? 'bg-[#8B0000] text-white'
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                    >
                      {subject.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick help section */}
          <div className="mt-10 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-[#FFD700] mb-2">Need Help?</h3>
            <p className="text-sm text-gray-300 mb-3">
              Not sure where to start? Check out our guide on how to use these resources
              effectively.
            </p>
            <Link
              href="/study-resources/guide"
              className="text-sm text-white bg-[#8B0000] hover:bg-[#a00000] px-3 py-2 rounded inline-block transition-colors"
            >
              Resource Guide →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main
          style={{ backgroundColor: mainBg, color: mainTextColor }}
          className="flex-grow p-6 md:p-8"
        >
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6 text-gray-400">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link
                  href="/"
                  className="hover:text-white"
                >
                  Home
                </Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mx-2"
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
              </li>
              <li className="flex items-center">
                <Link
                  href="/study-resources"
                  className="hover:text-white"
                >
                  Study Resources
                </Link>
                {pathSegments.length > 1 && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mx-2"
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
                    <span className="text-white">{title}</span>
                  </>
                )}
              </li>
            </ol>
          </nav>

          {/* Content */}
          <div className="print-content">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StudyResourcesTemplate;
