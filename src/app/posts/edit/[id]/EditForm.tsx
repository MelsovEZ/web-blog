'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import { useState } from 'react';

type Post = {
    title: string;
    content: string;
    thumbnail: string;
    id: string;
};

type State = {
    error: string | null;
    success: boolean;
};

async function updatePost(prevState: State, formData: FormData): Promise<State> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;
    const postId = formData.get('postId') as string;
    const currentThumbnail = formData.get('currentThumbnail') as string;

    try {
        let thumbnailUrl = currentThumbnail;

        if (file && file.size > 0) {
            const fileName = encodeURIComponent(file.name);
            const fileType = file.type;

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to get signed URL');
            }

            const { signedRequest, url } = await uploadRes.json();

            const s3UploadRes = await fetch(signedRequest, {
                method: 'PUT',
                headers: { 'Content-Type': fileType },
                body: file,
            });

            if (!s3UploadRes.ok) {
                throw new Error('Failed to upload file to S3');
            }

            thumbnailUrl = url;
        }

        const updateRes = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                thumbnail: thumbnailUrl,
            }),
        });

        if (!updateRes.ok) {
            throw new Error('Failed to update post');
        }

        return { success: true, error: null };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message, success: false };
        }
        return { error: 'An unexpected error occurred', success: false };
    }
}

async function deletePost(prevState: State, formData: FormData): Promise<State> {
    const postId = formData.get('postId') as string;

    try {
        const deleteRes = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
        });

        if (!deleteRes.ok) {
            throw new Error('Failed to delete post');
        }

        return { success: true, error: null };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message, success: false };
        }
        return { error: 'An unexpected error occurred', success: false };
    }
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-3 font-semibold text-white rounded transition duration-300 ease-in-out ${pending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
            {pending ? 'Updating...' : 'Update Post'}
        </button>
    );
}

function DeleteButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`mt-4 w-full py-3 font-semibold text-white rounded transition duration-300 ease-in-out ${pending ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
        >
            {pending ? 'Deleting...' : 'Delete Post'}
        </button>
    );
}

export default function EditForm({ post }: { post: Post }) {
    const router = useRouter();
    const [updateState, updateAction] = useFormState(updatePost, { error: null, success: false });
    const [deleteState, deleteAction] = useFormState(deletePost, { error: null, success: false });
    const [, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

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

    if (updateState.success || deleteState.success) {
        router.push('/');
        router.refresh();
    }

    return (
        <div>
            <BackButton />
            {(updateState.error || deleteState.error || errorMessage) && (
                <p className="text-red-500 mb-4">{updateState.error || deleteState.error || errorMessage}</p>
            )}
            <form action={updateAction} className="space-y-6 mt-6">
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="currentThumbnail" value={post.thumbnail} />
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        defaultValue={post.title}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <textarea
                        name="content"
                        placeholder="Post content"
                        defaultValue={post.content}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <SubmitButton />
            </form>
            <form action={deleteAction}>
                <input type="hidden" name="postId" value={post.id} />
                <DeleteButton />
            </form>
        </div>
    );
}