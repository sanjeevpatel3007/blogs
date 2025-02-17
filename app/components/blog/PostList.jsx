'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PostList({ selectedTag, onTagSelect }) {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch posts');
      }

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
      
      // Extract unique tags from posts
      const tags = new Set();
      data.forEach(post => {
        post.tags?.forEach(tag => {
          tags.add(JSON.stringify(tag));
        });
      });
      setAllTags(Array.from(tags).map(t => JSON.parse(t)));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
      toast.error('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.some(tag => tag._id === selectedTag._id))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-red-600">Error loading posts</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <button 
          onClick={fetchPosts}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag._id}
                onClick={() => onTagSelect(selectedTag?._id === tag._id ? null : tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedTag?._id === tag._id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No posts found</h3>
          <p className="text-gray-500 mt-2">
            {selectedTag ? `No posts found with tag "${selectedTag.name}"` : 'Be the first to create a post!'}
          </p>
          {selectedTag && (
            <button
              onClick={() => onTagSelect(null)}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={`${post._id}-${post.updatedAt}`} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Link href={`/blog/${post._id}`}>
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.intro}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        By {post.author?.name || 'Unknown'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
} 