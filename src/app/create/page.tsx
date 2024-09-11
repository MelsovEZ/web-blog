'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !content || !thumbnail) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('thumbnail', thumbnail);

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          thumbnail: {
            fileName: thumbnail.name,
            fileType: thumbnail.type,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const post = await res.json();
        router.push(`/posts/${post.id}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create post');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, or GIF)');
        setThumbnail(null);
        return;
      }
      
      setThumbnail(file);
      setError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail Image
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleThumbnailChange}
            required
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-700 hover:bg-zinc-800 focus:outline-none"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
