import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  subject?: string;
  externalLinks?: { name: string; url: string }[];
  isDark?: boolean;
  image?: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  subject,
  externalLinks = [],
  isDark = false,
  image,
  imageAlt = '',
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
            alt={imageAlt}
            width={400}
            height={225}
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {subject && (
        <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {subject.toUpperCase()}
        </p>
      )}

      <h3 className="text-xl font-semibold font-montserrat mb-4">{title}</h3>
      <p className="text-base font-inter mb-4 opacity-90">{description}</p>

      {externalLinks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-sm">Resources:</h4>
          <ul className="space-y-1 list-disc list-inside">
            {externalLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline ${isDark ? 'text-[#FFD700] hover:text-yellow-300' : 'text-[#8B0000] hover:text-red-700'}`}
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

export default Card;
