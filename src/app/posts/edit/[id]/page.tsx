import EditForm from './EditForm';
import { fetchPostData } from '@/app/lib/posts';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await fetchPostData(params.id);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <EditForm post={post} />
    </div>
  );
}