'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function PostsGrid({ posts, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <Link href={`/blog/${post._id}`}>
            <div className="relative h-40">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
              {post.tags && post.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag._id}
                      className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/blog/${post._id}`}>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-indigo-600">
                {post.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {post.intro}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.views || 0} views</span>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/blog/edit/${post._id}`}
                  className="p-1 text-gray-400 hover:text-indigo-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => onDelete(post._id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 