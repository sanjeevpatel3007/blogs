import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User'; // Important: Import User model for populate to work

export const postService = {
  // Create a new post
  async createPost(postData, userId) {
    await connectDB();
    return await Post.create({
      ...postData,
      author: userId,
    });
  },

  // Get all posts
  async getAllPosts() {
    await connectDB();
    return await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();
  },

  // Get single post by ID
  async getPostById(id) {
    await connectDB();
    return await Post.findById(id)
      .populate('author', 'name')
      .lean();
  },

  // Get posts by user ID
  async getPostsByUser(userId) {
    await connectDB();
    return await Post.find({ author: userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();
  },

  // Update post
  async updatePost(id, postData) {
    await connectDB();
    return await Post.findByIdAndUpdate(
      id,
      { ...postData },
      { new: true }
    ).populate('author', 'name');
  },

  // Delete post
  async deletePost(id) {
    await connectDB();
    return await Post.findByIdAndDelete(id);
  }
}; 