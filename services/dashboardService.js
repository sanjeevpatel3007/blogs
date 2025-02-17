import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import Tag from '@/models/Tag';

export const dashboardService = {
  async getDashboardStats(userId) {
    await connectDB();
    try {
      // Get user's posts
      const userPosts = await Post.find({ author: userId })
        .populate('tags', 'name')
        .sort({ createdAt: -1 })
        .lean();

      // Get total users
      const totalUsers = await User.countDocuments();

      // Get user's post stats by month (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const postsByMonth = await Post.aggregate([
        {
          $match: {
            author: userId,
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Get most used tags
      const tagStats = await Post.aggregate([
        { $match: { author: userId } },
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Populate tag names
      const tagIds = tagStats.map(tag => tag._id);
      const tagDetails = await Tag.find({ _id: { $in: tagIds } });
      const tagMap = new Map(tagDetails.map(tag => [tag._id.toString(), tag.name]));

      const tagStatsWithNames = tagStats.map(stat => ({
        name: tagMap.get(stat._id.toString()),
        count: stat.count
      }));

      // Add some dummy data for better UI
      const dummyStats = {
        totalViews: Math.floor(Math.random() * 10000) + 1000,
        averageReadTime: Math.floor(Math.random() * 8) + 3,
        engagement: Math.floor(Math.random() * 85) + 15,
        topPerformingPost: userPosts[0] || null,
      };

      return {
        posts: userPosts,
        totalPosts: userPosts.length,
        totalUsers,
        postsByMonth,
        tagStats: tagStatsWithNames,
        ...dummyStats
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }
}; 