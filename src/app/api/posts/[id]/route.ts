import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateSignedUrl } from '@/app/lib/s3';

const prisma = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(params.id),
        },
    });
    return post;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { title, content, thumbnail } = await req.json();

        if (!title || !content || !thumbnail) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { url } = await generateSignedUrl(thumbnail.fileName, thumbnail.fileType);

        const post = await prisma.post.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                title,
                content,
                thumbnail: url,
            },
        });

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}
