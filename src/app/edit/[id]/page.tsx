import EditPostClientComponent from './EditPostClientComponent';
import { fetchPostData } from '@/app/lib/posts';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await fetchPostData(params.id);
  
  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <EditPostClientComponent post={post} />
    </div>
  );
}
