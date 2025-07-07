'use client'

import React from 'react';

interface TripTypeSelectorProps {
  tripTypeToggle: boolean;
  setTripTypeToggle: (value: boolean) => void;
}

const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({ tripTypeToggle, setTripTypeToggle }) => {
  const selectedClasses = "bg-blue-600 text-white";
  const deselectedClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="flex items-center justify-center rounded-lg shadow-md bg-white p-1 space-x-1 mb-6">
      <button
        type="button"
        id="return-btn"
        className={`flex-1 sm:flex-initial py-2 px-4 sm:px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 transition-colors duration-150 ease-in-out ${
          tripTypeToggle ? selectedClasses : deselectedClasses
        }`}
        onClick={() => setTripTypeToggle(true)}
        aria-pressed={tripTypeToggle}
      >
        Return
      </button>
      <button
        type="button"
        id="one-way-btn"
        className={`flex-1 sm:flex-initial py-2 px-4 sm:px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 transition-colors duration-150 ease-in-out ${
          !tripTypeToggle ? selectedClasses : deselectedClasses
        }`}
        onClick={() => setTripTypeToggle(false)}
        aria-pressed={!tripTypeToggle}
      >
        One-way
      </button>
    </div>
  );
};

export default TripTypeSelector;
