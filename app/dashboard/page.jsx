'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Dummy data for charts
const dummyMonthlyData = [
  { name: 'Jan', posts: 4, views: 1200 },
  { name: 'Feb', posts: 6, views: 1800 },
  { name: 'Mar', posts: 8, views: 2400 },
  { name: 'Apr', posts: 5, views: 1500 },
  { name: 'May', posts: 7, views: 2100 },
  { name: 'Jun', posts: 9, views: 2700 },
  { name: 'Jul', posts: 12, views: 3600 },
  { name: 'Aug', posts: 8, views: 2400 },
  { name: 'Sep', posts: 10, views: 3000 },
  { name: 'Oct', posts: 11, views: 3300 },
  { name: 'Nov', posts: 7, views: 2100 },
  { name: 'Dec', posts: 5, views: 1500 }
];

const dummyTagData = [
  { name: 'Technology', count: 15 },
  { name: 'Travel', count: 12 },
  { name: 'Food', count: 8 },
  { name: 'Lifestyle', count: 10 },
  { name: 'Business', count: 6 }
];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted successfully');
      fetchDashboardStats(); // Refresh data
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Error deleting post');
    }
  };

  // Prepare chart data with fallback to dummy data
  const prepareChartData = () => {
    if (!stats || !stats.postsByMonth || stats.postsByMonth.length === 0) {
      return dummyMonthlyData;
    }

    // Map real data and fill missing months with 0
    const realData = new Map(
      stats.postsByMonth.map(item => [
        months[item._id.month - 1],
        { posts: item.count, views: Math.floor(item.count * 300) }
      ])
    );

    return months.map(month => ({
      name: month,
      ...(realData.get(month) || { posts: 0, views: 0 })
    }));
  };

  const prepareTagData = () => {
    if (!stats || !stats.tagStats || stats.tagStats.length === 0) {
      return dummyTagData;
    }
    return stats.tagStats.length < 3 ? dummyTagData : stats.tagStats;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard Error</h2>
        <p className="mt-2 text-gray-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const chartData = prepareChartData();
  const tagData = prepareTagData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          href="/blog/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon="📝"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon="👀"
        />
        <StatCard
          title="Avg. Read Time"
          value={`${stats.averageReadTime} min`}
          icon="⏱️"
        />
        <StatCard
          title="Engagement"
          value={`${stats.engagement}%`}
          icon="📈"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Posts by Month Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Posts & Views by Month</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="posts" fill="#4F46E5" name="Posts" />
                <Bar yAxisId="right" dataKey="views" fill="#10B981" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tags Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tagData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {tagData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.intro}
              </p>
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
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${post._id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/blog/edit/${post._id}`}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
} 