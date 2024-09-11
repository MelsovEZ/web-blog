'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile && !allowedFileTypes.includes(selectedFile.type)) {
      setErrorMessage('Only image files (JPG, PNG, GIF) are allowed.');
      setFile(null);
    } else {
      setErrorMessage('');
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async (): Promise<string | null> => {
    if (!file) return null;

    try {
      setIsUploading(true);
      const fileName = encodeURIComponent(file.name);
      const fileType = file.type;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType }),
      });

      if (!res.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signedRequest, url } = await res.json();

      const uploadRes = await fetch(signedRequest, {
        method: 'PUT',
        headers: { 'Content-Type': fileType },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to S3');
      }

      setThumbnailUrl(url);
      setIsUploading(false);
      return url;
    } catch (error: any) {
      setErrorMessage(error.message || 'Error during file upload');
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!file) {
      setErrorMessage('Please select a file before submitting.');
      return;
    }

    const uploadedThumbnailUrl = await handleFileUpload();

    if (!uploadedThumbnailUrl) {
      setErrorMessage('File upload failed. Please try again.');
      return;
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        thumbnail: uploadedThumbnailUrl,
      }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      setErrorMessage('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 font-semibold text-white rounded-md transition ${
            isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isUploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
