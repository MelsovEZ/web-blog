import PostClientComponent from './PostDetailsClientComponent';
import { fetchPostData } from '@/app/lib/posts';
import { Post } from '@prisma/client';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post: Post | null = await fetchPostData(params.id);

  if (!post) {
    return <p className="flex justify-center">No post found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostClientComponent post={post} />
    </div>
  );
}
