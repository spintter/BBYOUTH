import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import SectionTransition from './SectionTransition';

interface PageTemplateProps {
  title: string;
  description: string;
  headerBg?: string;
  headerTextColor?: string;
  mainBg?: string;
  mainTextColor?: string;
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  headerBg = '#1a1a2e',
  headerTextColor = 'white',
  mainBg = '#F9F9F9',
  mainTextColor = '#333333',
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{`BBYM | ${title}`}</title>
        <meta name="description" content={description} />
      </Head>
      <Navbar />
      <div className="pt-20 flex-1"> {/* Padding to account for fixed navbar */}
        <SectionTransition transitionType="fade" accentColor="#8B0000">
          <header 
            className={`py-16 text-center bg-[${headerBg}] text-[${headerTextColor}]`}
          >
            <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
              <h1 className="text-4xl sm:text-[2.5rem] font-bold font-montserrat">{title}</h1>
              <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg opacity-90 font-inter">
                {description}
              </p>
            </div>
          </header>
          <main 
            className={`py-16 bg-[${mainBg}] text-[${mainTextColor}]`}
          >
            <div className="max-w-[900px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
              {children}
            </div>
          </main>
        </SectionTransition>
      </div>
      <Footer />
    </div>
  );
};

export default PageTemplate; 