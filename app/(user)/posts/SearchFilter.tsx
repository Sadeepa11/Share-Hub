'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(currentQuery);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/posts?${createQueryString('q', query)}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/posts?${createQueryString('category', e.target.value)}`);
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-3">
      <form onSubmit={handleSearch} className="flex-1 flex relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by item name..."
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-app-border bg-white text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-app-green text-white hover:bg-app-green-light transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      <div className="w-full md:w-56 shrink-0 relative">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-3 rounded-xl border border-app-border bg-white text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-app-text-light">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
