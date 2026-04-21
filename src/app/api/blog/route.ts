import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function POST(req: Request) {
  try {
    const { title, slug, excerpt, content } = await req.json();

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectToDatabase();

    const newBlog = new Blog({ title, slug, excerpt, content });
    await newBlog.save();

    return NextResponse.json({ success: true, message: 'Blog created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Blog API POST Error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
