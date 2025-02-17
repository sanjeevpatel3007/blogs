import { connectDB } from '@/lib/db';
import { auth } from '@/middleware/auth';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export const GET = auth(async (req) => {
  try {
    await connectDB();
    
    const posts = await Post.find({ author: req.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}); 