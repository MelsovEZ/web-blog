import Details from './Details';
import { fetchPostData } from '@/lib/posts';
import { Post } from '@prisma/client';

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
    const post: Post | null = await fetchPostData(params.id);

    if (!post) {
        return <p className="text-center text-gray-600 py-8">No post found</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Details post={post} />
        </div>
    );
}