'use client';

import { Post } from '@prisma/client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BackButton from '@/components/BackButton';

function Details({ post }: { post: Post }) {
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
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between mb-6">
        <BackButton />
        <Link
          href={`/posts/edit/${post.id}`}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Edit
        </Link>
      </div>
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title || 'Post Image'}
          width={800}
          height={450}
          className="w-full h-80 object-cover rounded-md mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <div className="prose max-w-none text-gray-700">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="flex items-center mt-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          onClick={handleLike}
        >
          👍 Like
        </button>
        <span className="ml-4 text-xl text-gray-600">{likes} Likes</span>
      </div>
    </div>
  );
}

export default Details;