'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);  // State to manage file upload process
  const [errorMessage, setErrorMessage] = useState('');  // Error message state
  const router = useRouter();

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
    <div>
      <h1>Create a New Post</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
