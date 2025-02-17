'use client';
import { useState } from 'react';
import { isAuthenticated } from '@/lib/auth';
import PostList from '../components/blog/PostList';
import Link from 'next/link';

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="mt-2 text-gray-600">
              Discover stories, thinking, and expertise from writers.
            </p>
          </div>
          {isAuthenticated() && (
            <Link
              href="/blog/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Post
            </Link>
          )}
        </div>
      </div>

      <PostList selectedTag={selectedTag} onTagSelect={setSelectedTag} />
    </div>
  );
} 