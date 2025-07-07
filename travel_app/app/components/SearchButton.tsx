'use client'

import React from 'react';

interface SearchButtonProps {
  onClick?: () => void; // If you need to handle click specifically in the component
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col justify-center items-center p-4 mt-6 lg:mt-0 lg:ml-4">
      <button
        type="submit"
        className="text-center text-xl font-semibold text-white bg-blue-600 py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition duration-150 ease-in-out"
        onClick={onClick}
      >
        Search Flights
      </button>
    </div>
  );
};

export default SearchButton;
