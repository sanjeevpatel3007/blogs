'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingSection, setGeneratingSection] = useState('');
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
    fetchTags();
  }, []);

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
      setNewTag('');
      toast.success('Tag added successfully');
    } catch (error) {
      toast.error('Error adding tag');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to create a post');
      router.push('/login');
      return;
    }

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
      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach(tagId => {
          data.append('tags[]', tagId);
        });
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const responseData = await res.json();
      toast.success('Post created successfully!');
      router.push('/blog');
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post');
      if (error.message.includes('unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSection = async (section) => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setGeneratingSection(section);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: formData.title,
          section: section 
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await res.json();
      
      setFormData(prev => ({
        ...prev,
        [section]: data.content
      }));

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} generated successfully!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content');
    } finally {
      setGeneratingSection('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
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
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Introduction</label>
            <button
              type="button"
              onClick={() => generateSection('intro')}
              disabled={!formData.title || generatingSection}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
            >
              {generatingSection === 'intro' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
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
          <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
            <button
              type="button"
              onClick={() => generateSection('description')}
              disabled={!formData.title || generatingSection}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
            >
              {generatingSection === 'description' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
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
          <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Conclusion</label>
            <button
              type="button"
              onClick={() => generateSection('conclusion')}
              disabled={!formData.title || generatingSection}
              className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
            >
              {generatingSection === 'conclusion' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
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
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            name="image"
            required
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full"
          />
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
} 