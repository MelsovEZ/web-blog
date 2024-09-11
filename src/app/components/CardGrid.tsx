'use client';
import React, { useState } from 'react';
import { Post } from '@prisma/client';
import Card from './Card';

function CardGrid({ posts }: { posts: Post[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-zinc-500 rounded"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPosts.map(post => (
                    <Card
                        key={post.id}
                        thumbnail={post.thumbnail}
                        title={post.title}
                        content={post.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardGrid;
