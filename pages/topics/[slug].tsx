import React from 'react';
import { useRouter } from 'next/router';
import PageTemplate from '../../components/PageTemplate';
import Card from '../../components/Card';
import Image from 'next/image';
import { topicsContent } from '../../data/topics';

const TopicPage: React.FC<{ topic: (typeof topicsContent)[keyof typeof topicsContent] }> = ({
  topic,
}) => {
  if (!topic) {
    return (
      <PageTemplate
        title="Topic Not Found"
        description="The requested topic could not be found."
        headerBg="#1a1a2e"
        headerTextColor="white"
      >
        <div className="text-center py-8">
          <p className="text-lg mb-4">Sorry, we couldn't find the topic you're looking for.</p>
          <a
            href="/topics/religion"
            className="inline-block px-6 py-3 bg-[#8B0000] text-white rounded-md hover:bg-[#700000] transition-colors"
            aria-label="Explore Our Topics"
          >
            Explore Our Topics
          </a>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title={topic.title}
      description={topic.description}
      headerBg="#1a1a2e"
      headerTextColor="white"
      mainBg="#F9F9F9"
      mainTextColor="#333333"
    >
      {topic.image && (
        <div className="w-full overflow-hidden rounded-lg mb-8">
          <Image
            src={topic.image}
            alt={topic.title}
            width={900}
            height={500}
            className="w-full h-auto object-cover"
            loading="lazy"
            priority={false}
          />
        </div>
      )}

      <section
        className="mb-8"
        aria-labelledby="introduction"
      >
        <h2
          id="introduction"
          className="sr-only"
        >
          Introduction
        </h2>
        <p className="text-base sm:text-lg font-inter text-[#555555]">{topic.introduction}</p>
      </section>

      <section
        className="mb-8"
        aria-labelledby="subtopics"
      >
        <h2
          id="subtopics"
          className="text-2xl font-bold font-heading mb-4"
        >
          Key Areas of Focus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topic.subtopics.map((subtopic, index) => (
            <Card
              key={index}
              title={subtopic.title}
              description={subtopic.description}
              isDark={false}
            />
          ))}
        </div>
      </section>

      <section
        className="mb-8"
        aria-labelledby="further-exploration"
      >
        <h2
          id="further-exploration"
          className="text-2xl font-bold font-heading mb-4"
        >
          Further Exploration
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {topic.furtherExploration.map((resource, index) => (
            <li key={index}>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B0000] hover:underline"
                aria-label={`Visit ${resource.title}`}
              >
                {resource.title}
              </a>
              : {resource.description}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="discussion">
        <h2
          id="discussion"
          className="text-2xl font-bold font-heading mb-4"
        >
          Discussion
        </h2>
        <p className="text-base sm:text-lg font-inter text-[#555555]">{topic.discussion}</p>
      </section>
    </PageTemplate>
  );
};

export async function getStaticPaths() {
  const paths = Object.keys(topicsContent).map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const topic = topicsContent[params.slug as keyof typeof topicsContent];

  return {
    props: {
      topic,
    },
  };
}

export default TopicPage;
