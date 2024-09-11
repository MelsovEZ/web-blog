'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';

type State = {
    error: string | null;
    success: boolean;
};

async function createPost(prevState: State, formData: FormData): Promise<State> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'Please select a file before submitting.', success: false };
    }

    try {
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

        const createPostRes = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                thumbnail: url,
            }),
        });

        if (!createPostRes.ok) {
            throw new Error('Failed to create post');
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
            {pending ? 'Creating Post...' : 'Create Post'}
        </button>
    );
}

export default function CreateForm() {
    const router = useRouter();
    const [state, formAction] = useFormState(createPost, { error: null, success: false });

    if (state.success) {
        router.push('/');
        router.refresh();
    }

    return (
        <div>
            <BackButton />
            {state.error && <p className="text-red-500 mb-4">{state.error}</p>}
            <form action={formAction} className="space-y-6 mt-6">
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <textarea
                        name="content"
                        placeholder="Post content"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                        type="file"
                        name="file"
                        accept=".jpg,.jpeg,.png"
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <SubmitButton />
            </form>
        </div>
    );
}