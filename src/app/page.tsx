import Link from "next/link";
import CardGrid from "@/app/components/PostGrid";
import Search from "@/app/components/Search";
import { SearchProvider } from "@/app/context/SearchContext";
import { fetchPosts } from "@/app/lib/posts";

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <SearchProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Latest Posts</h1>
        <div className="flex flex-wrap justify-start items-center gap-4 mb-8">
          <Link href="/posts/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
              Create Post
            </button>
          </Link>
          <Search />
        </div>
        <CardGrid posts={posts} />
      </div>
    </SearchProvider>
  );
}