import React from 'react';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-6 rounded-[25px] font-medium font-inter transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] ${
        isActive 
          ? 'bg-[#8B0000] text-white shadow-md hover:bg-[#700000]' 
          : 'bg-transparent border border-[#8B0000] text-white hover:bg-[#8B0000] hover:bg-opacity-10'
      }`}
      aria-current={isActive ? 'true' : 'false'}
    >
      {label}
    </button>
  );
};

export default FilterButton; 