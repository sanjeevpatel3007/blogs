import { postService } from '@/services/postService';
import { auth } from '@/middleware/auth';
import { NextResponse } from 'next/server';

// GET single post
export async function GET(req, context) {
  try {
    const id = context.params.id;
    const post = await postService.getPostById(id);
    
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
export const PUT = auth(async (request, context) => {
  try {
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Extract data from formData
    const updateData = {
      title: formData.get('title'),
      intro: formData.get('intro'),
      description: formData.get('description'),
      conclusion: formData.get('conclusion'),
    };

    // Check if image is included
    const image = formData.get('image');
    
    // Validate required fields
    for (const [key, value] of Object.entries(updateData)) {
      if (!value) {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    const post = await postService.updatePost(id, updateData, image);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Post updated successfully',
      post 
    });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
});

// DELETE post (protected)
export const DELETE = auth(async (request, context) => {
  try {
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await postService.deletePost(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Post deleted successfully',
      post 
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}); 