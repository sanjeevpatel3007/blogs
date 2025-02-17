'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      if (!res.ok) throw new Error('Failed to fetch posts');
      
      const data = await res.json();
      setUserPosts(data);
    } catch (error) {
      toast.error('Error loading your posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and create new content</p>
          </div>
          <Link
            href="/blog/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Post
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold mb-4">Your Posts</h2>
          {userPosts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">You haven't created any posts yet</p>
              <Link
                href="/blog/create"
                className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userPosts.map((post) => (
                <div key={post._id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{post.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm">
                      {post.intro.substring(0, 100)}...
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <div className="space-x-2">
                        <Link
                          href={`/blog/${post._id}`}
                          className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/blog/edit/${post._id}`}
                          className="text-gray-600 hover:text-gray-500 text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 