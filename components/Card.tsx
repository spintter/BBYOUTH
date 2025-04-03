import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  isDark?: boolean;
  image?: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  link,
  linkText = 'Learn More →',
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
      <h3 className="text-xl font-semibold font-montserrat mb-4">{title}</h3>
      <p className="text-base font-inter mb-4 opacity-90">{description}</p>
      {link && (
        <Link 
          href={link} 
          className={`text-[#8B0000] font-medium font-inter hover:underline flex items-center gap-1 group ${
            isDark ? 'text-[#FFD700]' : ''
          }`}
        >
          <span>{linkText}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      )}
    </article>
  );
};

export default Card; 