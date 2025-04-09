import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import SectionTransition from './SectionTransition';
import { useRouter } from 'next/router';

// Humanities topics for the sidebar
const topics = [
  { title: 'Religion', link: '/topics/religion' },
  { title: 'Music', link: '/topics/music' },
  { title: 'Theatre Arts', link: '/topics/theatre-arts' },
  { title: 'STEM', link: '/topics/stem' },
  { title: 'Law & Politics', link: '/topics/law-politics' },
  { title: 'Philosophy', link: '/topics/philosophy' },
  { title: 'Dance', link: '/topics/dance' },
  { title: 'History', link: '/topics/history' },
  { title: 'Economics', link: '/topics/economics' },
  { title: 'Digital Humanities', link: '/topics/digital-humanities' },
  { title: 'Literature', link: '/topics/literature' },
  { title: 'Art', link: '/topics/art' },
];

// Social sharing options
const socialSharing = [
  {
    platform: 'Twitter',
    icon: 'twitter',
    link: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    platform: 'Facebook',
    icon: 'facebook',
    link: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    platform: 'LinkedIn',
    icon: 'linkedin',
    link: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    platform: 'Email',
    icon: 'mail',
    link: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`I thought you might be interested in this: ${url}`)}`,
  },
];

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface PageTemplateProps {
  title: string;
  description: string;
  headerBg?: string;
  headerTextColor?: string;
  mainBg?: string;
  mainTextColor?: string;
  readingTime?: number; // in minutes
  glossary?: { [key: string]: string };
  relatedTopics?: Array<{ title: string; link: string; image?: string }>;
  featuredResources?: Array<{ title: string; description: string; link: string; image?: string }>;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  headerBg = '#1a1a2e',
  headerTextColor = 'white',
  mainBg = '#F9F9F9',
  mainTextColor = '#333333',
  readingTime,
  glossary = {},
  relatedTopics = [],
  featuredResources = [],
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeTocItem, setActiveTocItem] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Extract pathname segments for breadcrumbs
  const pathSegments = router.asPath.split('/').filter((segment) => segment);

  // Generate TOC from headings in the content
  useEffect(() => {
    if (mainRef.current) {
      const headings = mainRef.current.querySelectorAll('h2, h3, h4');
      const tocItems: TableOfContentsItem[] = [];

      headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) {
          heading.id = id;
        }
        tocItems.push({
          id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName.slice(1)) - 1, // H2 -> level 1, H3 -> level 2, etc.
        });
      });

      setTableOfContents(tocItems);
    }
  }, [children]);

  // Handle scroll events for Back to Top button and TOC highlighting
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Update active TOC item
      if (mainRef.current && tableOfContents.length) {
        const headingElements = tableOfContents.map((item) => document.getElementById(item.id));

        // Find the currently visible heading
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const element = headingElements[i];
          if (element && element.getBoundingClientRect().top <= 100) {
            setActiveTocItem(tableOfContents[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Handle theme toggle
  useEffect(() => {
    const bodyElement = document.body;
    if (isDarkMode) {
      bodyElement.classList.add('dark-mode');
      bodyElement.style.setProperty('--main-bg', '#121212');
      bodyElement.style.setProperty('--main-text', '#E0E0E0');
    } else {
      bodyElement.classList.remove('dark-mode');
      bodyElement.style.setProperty('--main-bg', mainBg);
      bodyElement.style.setProperty('--main-text', mainTextColor);
    }
  }, [isDarkMode, mainBg, mainTextColor]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  // Calculate current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}
      style={{
        backgroundColor: isDarkMode ? '#121212' : mainBg,
        color: isDarkMode ? '#E0E0E0' : mainTextColor,
        backgroundImage: isDarkMode ? 'url("/dark-texture.png")' : 'url("/light-texture.png")',
        backgroundAttachment: 'fixed',
        backgroundSize: '200px',
        opacity: 0.95,
      }}
    >
      <Head>
        <title>{`BBYM | ${title}`}</title>
        <meta
          name="description"
          content={description}
        />
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={
            {
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: title,
                description: description,
                publisher: {
                  '@type': 'Organization',
                  name: 'BBYM',
                  logo: {
                    '@type': 'ImageObject',
                    url: '/logo.png',
                  },
                },
              }),
            } as any
          }
        />
        {/* Print styles */}
        <style>{`
          @media print {
            nav, aside, footer, button, .no-print {
              display: none !important;
            }
            body, main, .print-content {
              background: white !important;
              color: black !important;
              font-size: 12pt !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            h1, h2, h3, h4 {
              page-break-after: avoid;
            }
            p, li {
              page-break-inside: avoid;
            }
            a {
              text-decoration: none !important;
              color: black !important;
            }
            a[href]:after {
              content: " (" attr(href) ")";
              font-size: 90%;
            }
          }
        `}</style>
      </Head>
      <Navbar />
      <div className="pt-20 flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-20 bottom-0 w-[20%] md:w-[15%] transition-transform duration-300 ease-in-out z-20 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
          style={{ backgroundColor: isDarkMode ? '#1E1E1E' : headerBg, color: headerTextColor }}
        >
          <div className="h-full overflow-y-auto p-4">
            <h2 className="text-xl font-bold font-montserrat mb-4">Topics</h2>
            <ul className="space-y-2">
              {topics.map((topic) => (
                <li key={topic.title}>
                  <Link
                    href={topic.link}
                    className="block py-2 px-3 rounded hover:bg-opacity-20 hover:bg-white font-inter transition-all duration-200 transform hover:translate-x-1"
                    onClick={() => setIsSidebarOpen(false)} // Close on click (mobile)
                  >
                    {topic.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Toggle Button (Mobile) */}
        <button
          className="md:hidden fixed top-24 left-4 z-30 p-2 bg-gray-800 text-white rounded transition-transform duration-200 hover:scale-105"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Main Content */}
        <div className="flex-1 md:ml-[15%]">
          <SectionTransition
            transitionType="fade"
            accentColor="#8B0000"
          >
            <header
              className="py-4 text-center"
              style={{ backgroundColor: isDarkMode ? '#0E0E16' : headerBg, color: headerTextColor }}
            >
              <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
                {/* Breadcrumbs */}
                <nav
                  className="mb-6 text-sm"
                  aria-label="Breadcrumb"
                >
                  <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                      <Link
                        href="/"
                        className="hover:underline"
                      >
                        Home
                      </Link>
                      <svg
                        className="fill-current w-3 h-3 mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                      </svg>
                    </li>
                    {pathSegments.map((segment, index) => {
                      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                      const isLast = index === pathSegments.length - 1;

                      return (
                        <li
                          key={segment}
                          className="flex items-center"
                        >
                          {isLast ? (
                            <span className="font-medium">{segment.replace(/-/g, ' ')}</span>
                          ) : (
                            <>
                              <Link
                                href={path}
                                className="hover:underline"
                              >
                                {segment.replace(/-/g, ' ')}
                              </Link>
                              <svg
                                className="fill-current w-3 h-3 mx-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                              >
                                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                              </svg>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>

                <h1 className="text-2xl font-bold font-montserrat leading-tight">{title}</h1>

                {/* Reading time */}
                {readingTime && (
                  <div className="mt-2 flex justify-center items-center text-sm opacity-80">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{readingTime} min read</span>
                  </div>
                )}
              </div>
            </header>

            {/* Theme Toggle */}
            <div className="fixed top-24 right-4 z-30">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-transform duration-200 hover:scale-110"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Table of Contents (for desktop) */}
              {tableOfContents.length > 0 && (
                <div className="hidden lg:block w-64 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto p-4 ml-4 mt-6 bg-white dark:bg-gray-900 rounded shadow-md">
                  <h3 className="text-lg font-bold mb-3 font-montserrat">Table of Contents</h3>
                  <ul className="space-y-2">
                    {tableOfContents.map((item) => (
                      <li
                        key={item.id}
                        className={`pl-${item.level * 3} transition-all duration-200`}
                      >
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`text-left hover:text-blue-600 dark:hover:text-blue-400 ${
                            activeTocItem === item.id
                              ? 'font-semibold text-blue-600 dark:text-blue-400'
                              : ''
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <main
                ref={mainRef}
                className={`py-16 flex-1`}
                style={{
                  backgroundColor: 'transparent',
                  color: isDarkMode ? '#E0E0E0' : mainTextColor,
                }}
              >
                {/* Table of Contents (mobile dropdown) */}
                {tableOfContents.length > 0 && (
                  <div className="lg:hidden mb-8 bg-white dark:bg-gray-900 rounded shadow-md p-4 mx-4 sm:mx-8">
                    <details className="toc-dropdown">
                      <summary className="text-lg font-bold cursor-pointer font-montserrat">
                        Table of Contents
                      </summary>
                      <ul className="mt-3 space-y-2">
                        {tableOfContents.map((item) => (
                          <li
                            key={item.id}
                            className={`pl-${item.level * 2} my-1`}
                          >
                            <button
                              onClick={() => scrollToSection(item.id)}
                              className="text-left hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}

                <div className="max-w-[900px] mx-auto px-4 sm:px-8 flex flex-col gap-8 print-content">
                  {/* Main content with glossary tooltips processing */}
                  {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && typeof child.props.children === 'string') {
                      const childText = child.props.children;
                      const glossaryTerms = Object.keys(glossary).sort(
                        (a, b) => b.length - a.length,
                      );

                      // Check if any glossary terms are in the text
                      let processedContent = childText;
                      let foundTerms = false;

                      glossaryTerms.forEach((term) => {
                        if (childText.includes(term)) {
                          foundTerms = true;
                          const regex = new RegExp(`\\b${term}\\b`, 'g');
                          processedContent = processedContent.replace(
                            regex,
                            `<span class="glossary-term" data-term="${term}">${term}</span>`,
                          );
                        }
                      });

                      if (foundTerms) {
                        return React.cloneElement(child, {
                          dangerouslySetInnerHTML: { __html: processedContent },
                        } as any);
                      }
                    }
                    return child;
                  })}

                  {/* Social sharing */}
                  <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 font-montserrat">Share this page</h3>
                    <div className="flex space-x-4">
                      {socialSharing.map(({ platform, icon, link }) => (
                        <a
                          key={platform}
                          href={link(currentUrl, title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-200 hover:scale-110"
                          aria-label={`Share on ${platform}`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {icon === 'twitter' && (
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                            )}
                            {icon === 'facebook' && (
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            )}
                            {icon === 'linkedin' && (
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            )}
                            {icon === 'mail' && (
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            )}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Featured Resources section */}
                  {featuredResources.length > 0 && (
                    <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                      <h2 className="text-2xl font-bold mb-6 font-montserrat">
                        Featured Resources
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredResources.map((resource, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]"
                          >
                            {resource.image && (
                              <div className="relative h-40 w-full">
                                <Image
                                  src={resource.image}
                                  alt={resource.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-2 font-montserrat">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-inter">
                                {resource.description}
                              </p>
                              <Link
                                href={resource.link}
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                              >
                                View Resource
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Related Topics section */}
                  {relatedTopics.length > 0 && (
                    <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                      <h2 className="text-2xl font-bold mb-6 font-montserrat">Related Topics</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {relatedTopics.map((topic, index) => (
                          <Link
                            key={index}
                            href={topic.link}
                            className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-105"
                          >
                            {topic.image && (
                              <div className="relative h-24 mb-2 overflow-hidden rounded">
                                <Image
                                  src={topic.image}
                                  alt={topic.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  loading="lazy"
                                  className="transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            )}
                            <h3 className="font-medium font-montserrat text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {topic.title}
                            </h3>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </main>
            </div>

            {/* Back to Top button */}
            {showBackToTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 z-30 focus:outline-none"
                aria-label="Back to top"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            )}
          </SectionTransition>
        </div>
      </div>

      {/* Glossary tooltip handler */}
      <div
        id="glossary-tooltip"
        className="fixed hidden p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded max-w-xs z-50 text-sm border border-gray-200 dark:border-gray-700"
      />

      <script
        dangerouslySetInnerHTML={
          {
            __html: `
            // Glossary tooltip functionality
            document.addEventListener('DOMContentLoaded', function() {
              const tooltip = document.getElementById('glossary-tooltip');
              const glossaryTerms = ${JSON.stringify(glossary)};
              
              document.addEventListener('mouseover', function(e) {
                const target = e.target;
                if (target.classList.contains('glossary-term')) {
                  const term = target.getAttribute('data-term');
                  
                  if (term && glossaryTerms[term]) {
                    tooltip.textContent = glossaryTerms[term];
                    tooltip.style.display = 'block';
                    
                    const rect = target.getBoundingClientRect();
                    tooltip.style.left = rect.left + 'px';
                    tooltip.style.top = (rect.bottom + 10) + 'px';
                  }
                }
              });
              
              document.addEventListener('mouseout', function(e) {
                if (e.target.classList.contains('glossary-term')) {
                  tooltip.style.display = 'none';
                }
              });
              
              // Handle collapsible sections
              const collapsibles = document.querySelectorAll('.collapsible-section');
              collapsibles.forEach(section => {
                const toggle = section.querySelector('.collapsible-toggle');
                const content = section.querySelector('.collapsible-content');
                
                toggle.addEventListener('click', () => {
                  content.classList.toggle('hidden');
                  toggle.classList.toggle('expanded');
                });
              });
              
              // Implement search functionality
              const searchInput = document.getElementById('topic-search');
              const searchResults = document.getElementById('search-results');
              
              if (searchInput) {
                searchInput.addEventListener('input', function() {
                  const query = this.value.toLowerCase();
                  
                  if (query.length < 2) {
                    searchResults.classList.add('hidden');
                    return;
                  }
                  
                  // Simple search through headings in the page
                  const headings = document.querySelectorAll('h2, h3, h4');
                  const matches = Array.from(headings).filter(heading => 
                    heading.textContent.toLowerCase().includes(query)
                  );
                  
                  if (matches.length > 0) {
                    searchResults.innerHTML = '';
                    matches.forEach(match => {
                      const item = document.createElement('li');
                      item.className = 'p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
                      item.textContent = match.textContent;
                      item.onclick = () => {
                        match.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        searchResults.classList.add('hidden');
                        searchInput.value = '';
                      };
                      searchResults.appendChild(item);
                    });
                    searchResults.classList.remove('hidden');
                  } else {
                    searchResults.innerHTML = '<li class="p-2">No results found</li>';
                    searchResults.classList.remove('hidden');
                  }
                });
                
                // Hide results when clicking outside
                document.addEventListener('click', (e) => {
                  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.classList.add('hidden');
                  }
                });
              }
            });
          `,
          } as any
        }
      />

      <Footer />
    </div>
  );
};

export const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="collapsible-section border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
      <button className="collapsible-toggle w-full text-left p-4 font-semibold font-montserrat flex justify-between items-center">
        {title}
        <svg
          className="w-5 h-5 transition-transform duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="collapsible-content hidden p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
