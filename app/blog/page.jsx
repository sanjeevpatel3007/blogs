import { isAuthenticated } from '@/lib/auth';
import PostList from '../components/blog/PostList';
import Link from 'next/link';

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        {isAuthenticated() && (
          <Link
            href="/blog/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Post
          </Link>
        )}
      </div>
      <PostList />
    </div>
  );
} 