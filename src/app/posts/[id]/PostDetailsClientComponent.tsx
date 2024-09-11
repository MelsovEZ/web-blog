'use client';

import { Post } from '@prisma/client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BackButton from '@/app/components/BackButton';

export default function PostClientComponent({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail,
        likes: likes + 1,
      }),
    });
    if (res.ok) {
      setLikes(likes + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <BackButton />
        <div className="flex">
          <Link
            href={`/edit/${post.id}`}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-auto"
          >
            Edit
          </Link>
        </div>
      </div>
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title || 'Post Image'}
          width={800}
          height={450}
          className="w-full h-80 object-cover rounded-md mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="flex items-center mt-6">
        <button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          onClick={handleLike}
        >
          👍 Like
        </button>
        <span className="ml-4 text-xl">{likes} Likes</span>
      </div>
    </div>
  );
}
