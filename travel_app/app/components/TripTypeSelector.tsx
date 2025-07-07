'use client'

import React from 'react';

interface TripTypeSelectorProps {
  tripTypeToggle: boolean;
  setTripTypeToggle: (value: boolean) => void;
}

const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({ tripTypeToggle, setTripTypeToggle }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 rounded-lg shadow-md bg-white mb-6">
      <span className="flex items-center">
        <input
          type="radio"
          value="R"
          name="trip"
          id="return"
          className="form-radio h-5 w-5 text-blue-600"
          checked={tripTypeToggle}
          onChange={() => setTripTypeToggle(true)}
        />
        <label htmlFor="return" className="ml-2 text-gray-700 font-medium">
          Return
        </label>
      </span>
      <span className="flex items-center">
        <input
          type="radio"
          value="O"
          name="trip"
          id="one-way"
          className="form-radio h-5 w-5 text-blue-600"
          checked={!tripTypeToggle}
          onChange={() => setTripTypeToggle(false)}
        />
        <label htmlFor="one-way" className="ml-2 text-gray-700 font-medium">
          One-way
        </label>
      </span>
    </div>
  );
};

export default TripTypeSelector;
