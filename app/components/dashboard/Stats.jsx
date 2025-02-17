'use client';
import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  TagIcon, 
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';

export default function Stats({ posts }) {
  const stats = [
    {
      name: 'Total Posts',
      value: posts.length,
      icon: DocumentTextIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Total Views',
      value: posts.reduce((acc, post) => acc + (post.views || 0), 0),
      icon: EyeIcon,
      change: '+54.02%',
      changeType: 'positive',
    },
    {
      name: 'Used Tags',
      value: new Set(posts.flatMap(post => post.tags?.map(tag => tag._id))).size,
      icon: TagIcon,
      change: '+12.30%',
      changeType: 'positive',
    },
    {
      name: 'Comments',
      value: posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0),
      icon: ChatBubbleLeftIcon,
      change: '+32.25%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
        >
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
} 