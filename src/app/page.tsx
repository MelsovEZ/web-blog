import CardGrid from "./components/CardGrid";
import { fetchPosts } from "./lib/posts";

export default async function Home() {
  const posts = await fetchPosts();
  return (
    <div>
      <h1 className="px-4 pt-2 text-3xl font-bold">Latest Posts</h1>
      <CardGrid posts={posts} />
    </div>
  );
}
