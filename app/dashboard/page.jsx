'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';
import toast from 'react-hot-toast';
import Stats from '../components/dashboard/Stats';
import PostsChart from '../components/dashboard/PostsChart';
import PostsGrid from '../components/dashboard/PostsGrid';

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your blog posts
          </p>
        </div>

      <Stats posts={userPosts} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PostsChart posts={userPosts} />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          {/* Add recent activity component here */}
          </div>
        </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
            <button
            onClick={() => router.push('/blog/create')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Post
                    </button>
                  </div>
        <PostsGrid posts={userPosts} onDelete={handleDelete} />
                </div>
    </div>
  );
} 