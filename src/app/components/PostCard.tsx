import Link from 'next/link';

function Card({ thumbnail, title, content, likes, id }: { thumbnail: string; title: string; content: string; likes: number; id: number }) {
    return (
        <Link href={`/posts/${id}`}>
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <img src={thumbnail} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-zinc-600 text-center">{content}</p>
                <p className="text-zinc-600 text-center mt-2">{likes} likes</p>
            </div>
        </Link>
    );
}

export default Card;
