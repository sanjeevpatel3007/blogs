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
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    description: '',
    conclusion: '',
    image: null,
    tags: [],
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchPost();
    fetchTags();
  }, [params.id, router]);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      toast.error('Error loading tags');
    }
  };

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
        tags: post.tags?.map(tag => tag._id) || [],
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
    const { name, value, files, type } = e.target;
    if (type === 'select-multiple') {
      const selectedTags = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        tags: selectedTags
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setCurrentImage(e.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() }),
      });

      if (!res.ok) throw new Error('Failed to create tag');

      const tag = await res.json();
      setTags(prev => [...prev, tag]);
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag._id]
      }));
      setNewTag('');
      toast.success('Tag added successfully');
    } catch (error) {
      toast.error('Error adding tag');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // Add basic fields
      data.append('title', formData.title);
      data.append('intro', formData.intro);
      data.append('description', formData.description);
      data.append('conclusion', formData.conclusion);
      
      // Add image if exists
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      // Add tags
      formData.tags.forEach(tagId => {
        data.append('tags[]', tagId);
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Tag
            </button>
          </div>
          <select
            multiple
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {tags.map(tag => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Hold Ctrl (Cmd on Mac) to select multiple tags
          </p>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tagId => {
              const tag = tags.find(t => t._id === tagId);
              return tag ? (
                <span
                  key={tag._id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
        )}

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