import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, thumbnail } = await req.json();

    if (!title || !content || !thumbnail) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail
      },
    });

    return NextResponse.json(post, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
