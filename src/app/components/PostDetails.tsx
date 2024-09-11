'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@prisma/client';

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          const data: Post = await res.json();
          setPost(data);
        } else {
          setError('Failed to load post');
        }
      } catch (error: any) {
        setError('Something went wrong');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <p className="flex justify-center">Loading...</p>;
  if (error) return <p className="text-red-500 flex justify-center">{error}</p>;
  if (!post) return <p className="flex justify-center">No post found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img src={post.thumbnail} alt={post.title} className="w-full h-80 object-cover rounded-md mb-4" />
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-lg text-gray-700">{post.content}</p>
    </div>
  );
}
