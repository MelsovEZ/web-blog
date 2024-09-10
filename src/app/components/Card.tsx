function Card({ thumbnail, title, content }: { thumbnail: string; title: string; content: string }) {
    return (
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg">
            <img src={thumbnail} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-center">{content}</p>
        </div>
    );
};

export default Card;
