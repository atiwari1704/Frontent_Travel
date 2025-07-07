'use client'

import React from 'react';

interface LocationInputProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  listId?: string;
  options?: string[];
  required?: boolean;
  error?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  listId,
  options,
  required,
  error,
}) => {
  const borderClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  return (
    <div className="flex flex-col w-full p-2 rounded-lg bg-white mb-2 sm:mb-0 mx-auto">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1 self-start">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm text-blue-500 text-center ${borderClass}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        list={listId}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {listId && options && options.length > 0 && (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600 self-start">
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
