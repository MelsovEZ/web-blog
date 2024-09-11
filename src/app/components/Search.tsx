'use client';

import React from 'react';
import { useSearch } from '@/app/context/SearchContext';

export default function Search() {
  const { searchTerm, setSearchTerm } = useSearch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search posts..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="p-2 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}