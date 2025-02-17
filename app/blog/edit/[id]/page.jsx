'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function EditPost({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    description: '',
    conclusion: '',
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchPost();
  }, [params.id, router]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const post = await res.json();
      setFormData({
        title: post.title,
        intro: post.intro,
        description: post.description,
        conclusion: post.conclusion,
        image: null,
      });
      setCurrentImage(post.imageUrl);
    } catch (error) {
      toast.error('Error loading post');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Show preview for new image
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setCurrentImage(e.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          data.append(key, formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update post');
      }

      toast.success('Post updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Introduction</label>
          <textarea
            name="intro"
            required
            value={formData.intro}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Conclusion</label>
          <textarea
            name="conclusion"
            required
            value={formData.conclusion}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Image</label>
          <div className="mt-2 relative h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={currentImage}
              alt="Current post image"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Update Image (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 