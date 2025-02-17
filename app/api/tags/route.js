import { connectDB } from '@/lib/db';
import Tag from '@/models/Tag';
import { NextResponse } from 'next/server';

// GET all tags
export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST new tag
export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Check if tag already exists
    let tag = await Tag.findOne({ name: name.toLowerCase() });
    if (tag) {
      return NextResponse.json(tag);
    }

    // Create new tag
    tag = await Tag.create({ name: name.toLowerCase() });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
} 