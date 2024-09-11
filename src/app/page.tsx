import Link from "next/link";
import CardGrid from "./components/PostGrid";
import { fetchPosts } from "./lib/posts";

export default async function Home() {
  const posts = await fetchPosts();
  return (
    <div>
      <h1 className="p-4 text-3xl font-bold">Latest Posts</h1>
      <Link href={'/create'} className="p-4">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create Post
        </button>
      </Link>
      <CardGrid posts={posts} />
    </div>
  );
}
