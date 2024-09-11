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
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function fetchPostData(id: string) {
    const headersList = headers();
    const host = headersList.get('host');

    const res = await fetch(`http://${host}/api/posts/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch post data');
    }
    return res.json();
  }
  