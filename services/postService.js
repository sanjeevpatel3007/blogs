import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Tag from '@/models/Tag';
import { uploadImage } from '@/lib/cloudinary';

export const postService = {
  // Create a new post
  async createPost(postData, userId) {
    await connectDB();
    try {
      const { tags, ...otherData } = postData;
      
      // Create the post with tags
      const post = await Post.create({
        ...otherData,
        author: userId,
        tags: tags || [], // Ensure tags is an array
      });

      // Populate author and tags
      return await Post.findById(post._id)
        .populate('author', 'name')
        .populate('tags', 'name');
    } catch (error) {
      console.error('Create post error:', error);
      throw new Error(error.message || 'Failed to create post');
    }
  },

  // Get all posts with populated tags
  async getAllPosts(limit = 10, skip = 0) {
    await connectDB();
    return await Post.find()
      .populate('author', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  // Get single post by ID with populated tags
  async getPostById(id) {
    await connectDB();
    return await Post.findById(id)
      .populate('author', 'name')
      .populate('tags', 'name')
      .lean();
  },

  // Get posts by user ID with populated tags
  async getPostsByUser(userId) {
    await connectDB();
    return await Post.find({ author: userId })
      .populate('author', 'name')
      .populate('tags', 'name')
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
        { 
          new: true,
          runValidators: true 
        }
      )
      .populate('author', 'name')
      .populate('tags', 'name');

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