'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPostClientComponent({ post }: { post: { title: string, content: string, thumbnail: string, id: string } }) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState(post.thumbnail);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;

        if (selectedFile && !allowedFileTypes.includes(selectedFile.type)) {
            setErrorMessage('Only image files (JPG, PNG, GIF) are allowed.');
            setFile(null);
        } else {
            setErrorMessage('');
            setFile(selectedFile);
        }
    };

    const handleFileUpload = async (): Promise<string | null> => {
        if (!file) return thumbnail;

        try {
            setIsUploading(true);
            const fileName = encodeURIComponent(file.name);
            const fileType = file.type;

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!res.ok) {
                throw new Error('Failed to get signed URL');
            }

            const { signedRequest, url } = await res.json();

            const uploadRes = await fetch(signedRequest, {
                method: 'PUT',
                headers: { 'Content-Type': fileType },
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload file to S3');
            }

            setIsUploading(false);
            return url;
        } catch (error: any) {
            setErrorMessage(error.message || 'Error during file upload');
            setIsUploading(false);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const uploadedThumbnailUrl = await handleFileUpload();
        if (!uploadedThumbnailUrl) {
            setErrorMessage('File upload failed. Please try again.');
            return;
        }

        const res = await fetch(`/api/posts/${post.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                thumbnail: uploadedThumbnailUrl,
            }),
        });

        if (res.ok) {
            router.push('/');
            router.refresh();
        } else {
            setErrorMessage('Failed to update post. Please try again.');
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await fetch(`/api/posts/${post.id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            router.push('/');
            router.refresh();
        } else {
            setErrorMessage('Failed to delete post. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <button
                className="mb-6 px-4 py-2 bg-zinc-600 text-white font-semibold rounded-lg shadow-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition"
                onClick={() => router.back()}
            >
                ← Go Back
            </button>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Post content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                </div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-3 font-semibold text-white rounded-md transition ${isUploading ? 'bg-gray-400' : 'bg-zinc-600 hover:bg-zinc-700'
                        } focus:outline-none focus:ring-2 focus:ring-zinc-500`}
                >
                    {isUploading ? 'Uploading...' : 'Update Post'}
                </button>
            </form>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`mt-4 w-full py-3 font-semibold text-white rounded-md transition ${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
                {isDeleting ? 'Deleting...' : 'Delete Post'}
            </button>
        </div>
    );
}
