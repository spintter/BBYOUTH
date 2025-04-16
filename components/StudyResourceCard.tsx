import React from 'react';
import Image from 'next/image';

interface StudyResourceCardProps {
  title: string;
  subject: string;
  description: string;
  externalLinks: { name: string; url: string }[];
  example?: string;
  image?: string;
  imageAlt?: string;
  isDark?: boolean;
}

const StudyResourceCard: React.FC<StudyResourceCardProps> = ({
  title,
  subject,
  description,
  externalLinks,
  example,
  image,
  imageAlt = '',
  isDark = true,
}) => {
  return (
    <article
      className={`p-6 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
      ${isDark ? 'bg-[#2a2a3e] text-white' : 'bg-white text-[#333333]'}`}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={imageAlt || title}
            width={400}
            height={225}
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Subject badge */}
      <div className="mb-4 flex items-center">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded ${
            isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {subject.toUpperCase()}
        </span>
      </div>

      <h3 className="text-xl font-semibold font-montserrat mb-3">{title}</h3>
      <p className="text-base font-inter mb-4 opacity-90">{description}</p>

      {/* Example usage section */}
      {example && (
        <div className={`mb-4 p-3 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h4
            className={`text-sm font-semibold mb-2 ${isDark ? 'text-[#FFD700]' : 'text-[#8B0000]'}`}
          >
            Example Activity:
          </h4>
          <p className="text-sm italic">{example}</p>
        </div>
      )}

      {/* External links section */}
      {externalLinks.length > 0 && (
        <div className="mt-4">
          <h4
            className={`text-sm font-semibold mb-2 ${isDark ? 'text-[#FFD700]' : 'text-[#8B0000]'}`}
          >
            Resources:
          </h4>
          <ul className="space-y-2">
            {externalLinks.map((link, index) => (
              <li
                key={index}
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
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
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline ${
                    isDark
                      ? 'text-[#FFD700] hover:text-yellow-300'
                      : 'text-[#8B0000] hover:text-red-700'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default StudyResourceCard;
