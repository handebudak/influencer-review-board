'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...",
  className = "",
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    setSelectedLabel(selectedOption ? selectedOption.label : placeholder);
  }, [value, options, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-all duration-200 cursor-pointer text-left flex items-center justify-between text-zinc-900"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-50 transition-colors ${
                value === option.value ? 'bg-zinc-100 text-zinc-800 font-medium' : 'text-zinc-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}