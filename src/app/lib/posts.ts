import { headers } from 'next/headers';

export async function fetchPosts() {
    try {
        const headersList = headers();
        const host = headersList.get('host');

        const response = await fetch(`http://${host}/api/posts`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}