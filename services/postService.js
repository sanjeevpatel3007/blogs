import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User'; // Important: Import User model for populate to work
import { uploadImage } from '@/lib/cloudinary';

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
  async updatePost(id, postData, image = null) {
    await connectDB();
    try {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error('Post not found');
      }

      const updateData = { ...postData };
      
      if (image) {
        const imageUrl = await uploadImage(image);
        updateData.imageUrl = imageUrl;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('author', 'name');

      if (!updatedPost) {
        throw new Error('Failed to update post');
      }

      return updatedPost;
    } catch (error) {
      throw new Error(error.message || 'Failed to update post');
    }
  },

  // Delete post
  async deletePost(id) {
    await connectDB();
    try {
      const post = await Post.findById(id);
      if (!post) {
        throw new Error('Post not found');
      }

      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        throw new Error('Failed to delete post');
      }

      return deletedPost;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete post');
    }
  }
}; 