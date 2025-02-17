'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setUser(getUser());
    fetchUserPosts();
  }, [router]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch('/api/posts/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch posts');
      }
      
      const data = await res.json();
      setUserPosts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      toast.success(data.message || 'Post deleted successfully');
      setUserPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Error deleting post');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter posts by tag
  const filteredPosts = selectedTag
    ? userPosts.filter(post => post.tags?.some(tag => tag._id === selectedTag._id))
    : userPosts;

  // Get unique tags from user's posts
  const allTags = [...new Set(userPosts.flatMap(post => post.tags || []))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        <Link
          href="/blog/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Post
        </Link>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by Tag</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag._id}
                onClick={() => setSelectedTag(selectedTag?._id === tag._id ? null : tag)}
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

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl text-gray-600">No posts found</h3>
          <p className="text-gray-500 mt-2">
            {selectedTag 
              ? `No posts found with tag "${selectedTag.name}"`
              : 'Create your first blog post!'
            }
          </p>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden">
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
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/blog/edit/${post._id}`}
                      className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deleteLoading}
                      className="text-red-600 hover:text-red-500 font-medium text-sm disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
} 