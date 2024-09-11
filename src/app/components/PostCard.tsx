import Link from 'next/link';
import Image from 'next/image';

function Card({ thumbnail, title, content, likes, id }: { thumbnail: string; title: string; content: string; likes: number; id: number }) {
    return (
        <Link href={`/posts/${id}`}>
            <div className="flex flex-col justify-between border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-white">
                <div className="relative w-full h-[200px]">
                    <Image
                        src={thumbnail}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                </div>

                <div className="flex flex-col p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">{title}</h3>
                        <div className="flex items-center text-gray-600">
                            <span className="mr-2">{likes}</span>
                            👍
                        </div>
                    </div>

                    <p className="text-gray-600 truncate">{content}</p>
                </div>
            </div>
        </Link>
    );
}

export default Card;