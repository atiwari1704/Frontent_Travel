'use client'

import React from 'react';

interface SearchButtonProps {
  isLoading?: boolean;
  onClick?: () => void; // If you need to handle click specifically in the component
}

const SearchButton: React.FC<SearchButtonProps> = ({ isLoading, onClick }) => {
  return (
    <div className="flex flex-col justify-center items-center p-4 mt-6 lg:mt-0 lg:ml-4">
      <button
        type="submit"
        className={`text-center text-xl font-semibold text-white py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition duration-150 ease-in-out ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Search Flights"
        )}
      </button>
    </div>
  );
};

export default SearchButton;
