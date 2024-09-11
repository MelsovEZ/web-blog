import CreatePostClientComponent from './CreatePostClientComponent';

export default function CreatePostPage() {
  return (
    <div className="max-w-lg mx-auto p-8 m-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h1>
      <CreatePostClientComponent />
    </div>
  );
}
