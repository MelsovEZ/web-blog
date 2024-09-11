import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(params.id),
        },
    });
    return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { title, content, thumbnail, likes } = await req.json();

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
            likes
        },
    });
    return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const post = await prisma.post.delete({
        where: {
            id: parseInt(params.id),
        },
    });
    return NextResponse.json(post);
}