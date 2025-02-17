'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts components with no SSR
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function PostsChart({ posts }) {
  const [data, setData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Group posts by month
    const groupedPosts = posts.reduce((acc, post) => {
      const date = new Date(post.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      if (!acc[key]) {
        acc[key] = { name: key, posts: 0, views: 0 };
      }
      acc[key].posts += 1;
      acc[key].views += post.views || 0;
      return acc;
    }, {});

    // Convert to array and sort by date
    const chartData = Object.values(groupedPosts).sort((a, b) => {
      return new Date(a.name) - new Date(b.name);
    });

    setData(chartData);
  }, [posts]);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Posts Activity</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Posts Activity</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="posts"
              stackId="1"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.3}
              name="Posts"
            />
            <Area
              type="monotone"
              dataKey="views"
              stackId="2"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.3}
              name="Views"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 