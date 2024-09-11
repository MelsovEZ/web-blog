import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const { title, content, thumbnail } = await req.json();

    if (!title || !content || !thumbnail) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const post = await prisma.post.update({
        where: {
            id: parseInt(params.id),
        },
        data: {
            title,
            content,
            thumbnail,
        },
    });
    return post;
}

export async function DELETE({ params }: { params: { id: string } }) {
    const post = await prisma.post.delete({
        where: {
            id: parseInt(params.id),
        },
    });
    return post;
}