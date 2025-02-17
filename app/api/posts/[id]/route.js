import { postService } from '@/services/postService';
import { auth } from '@/middleware/auth';
import { NextResponse } from 'next/server';

// GET single post
export async function GET(req, { params }) {
  try {
    const post = await postService.getPostById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT update post (protected)
export const PUT = auth(async (req, { params }) => {
  try {
    const formData = await req.formData();
    const post = await postService.updatePost(params.id, Object.fromEntries(formData));
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
});

// DELETE post (protected)
export const DELETE = auth(async (req, { params }) => {
  try {
    const post = await postService.deletePost(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}); 