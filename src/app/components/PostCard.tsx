import Link from 'next/link';
import Image from 'next/image';

function Card({ thumbnail, title, content, likes, id }: { thumbnail: string; title: string; content: string; likes: number; id: number }) {
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <Link href={`/posts/${id}`}>
            <div className="flex flex-col p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <Image src={thumbnail} alt={title} width={360} height={640} className="w-full h-40 object-cover rounded-md mb-4" />
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <div className="flex items-center text-zinc-600">
                        <span className="mr-2">{likes}</span>
                        👍
                    </div>
                </div>
                <p className="text-zinc-600">{truncateText(content, 100)}</p>
            </div>
        </Link>
    );
}

export default Card;
