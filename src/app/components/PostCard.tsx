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
                <div className="flex justify-between items-start w-full">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1 text-left">{title}</h3>
                        <p className="text-zinc-600 text-left">{truncateText(content, 100)}</p>
                    </div>
                    <div className="flex justify-between text-zinc-600 ml-4">
                        <span className="mr-4">{likes}</span>
                        <Image src="/heart.svg" alt="Like icon" width={15} height={15}></Image>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Card;
