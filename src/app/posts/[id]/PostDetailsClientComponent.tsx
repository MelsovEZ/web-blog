'use client';

import { Post } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function PostClientComponent({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between mb-6">
        <button
          className="px-4 py-2 bg-zinc-600 text-white font-semibold rounded-lg shadow-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition"
          onClick={() => router.back()}
        >
          ← Go Back
        </button>
        <Link
          href={`/edit/${post.id}`}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
          className="w-full h-80 object-cover rounded-md mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
