import { connectDB } from '@/lib/db';
import { auth } from '@/middleware/auth';
import Post from '@/models/Post';
import { uploadImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export const POST = auth(async (req) => {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const title = formData.get('title');
    const intro = formData.get('intro');
    const description = formData.get('description');
    const conclusion = formData.get('conclusion');
    const image = formData.get('image');

    if (!title || !intro || !description || !conclusion || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate image file
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Please upload a valid image file' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(image);

    // Create new post
    const post = await Post.create({
      title,
      intro,
      description,
      conclusion,
      imageUrl,
      author: req.userId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating post' },
      { status: 500 }
    );
  }
});

export const GET = async () => {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}; 