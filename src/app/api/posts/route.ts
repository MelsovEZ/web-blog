import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany();
  return posts;
}

export async function POST(req: Request) {
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
  return post;
}