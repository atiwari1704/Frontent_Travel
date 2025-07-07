'use client'

import React from 'react';

interface DateInputProps {
  name: string;
  label: string;
  minDate?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({ name, label, minDate, required, defaultValue, value, onChange, error }) => {
  const borderClass = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  return (
    <div className="flex flex-col w-full p-2 rounded-lg bg-white mb-2 sm:mb-0 mx-auto">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1 self-start">
        {label}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm text-blue-500 ${borderClass}`}
        required={required}
        defaultValue={defaultValue}
        value={value}
        min={minDate}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600 self-start">
          {error}
        </p>
      )}
    </div>
  );
};

export default DateInput;
