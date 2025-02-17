import { postService } from '@/services/postService';
import { auth } from '@/middleware/auth';
import { uploadImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

// GET all posts
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const posts = await postService.getAllPosts(limit, skip);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST new post (protected)
export const POST = auth(async (req) => {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title');
    const intro = formData.get('intro');
    const description = formData.get('description');
    const conclusion = formData.get('conclusion');
    const image = formData.get('image');
    const tags = formData.getAll('tags[]'); // Get all tags

    if (!title || !intro || !description || !conclusion || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImage(image);
    
    const post = await postService.createPost(
      { 
        title, 
        intro, 
        description, 
        conclusion, 
        imageUrl,
        tags, // Add tags to the post data
      },
      req.userId
    );

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating post' },
      { status: 500 }
    );
  }
}); 