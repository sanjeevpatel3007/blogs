import { postService } from '@/services/postService';
import { auth } from '@/middleware/auth';
import { NextResponse } from 'next/server';

export const GET = auth(async (req) => {
  try {
    const posts = await postService.getPostsByUser(req.userId);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}); 