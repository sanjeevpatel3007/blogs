import mongoose from 'mongoose';

// Import User and Tag models first
require('./User');
require('./Tag');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  intro: {
    type: String,
    required: [true, 'Introduction is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  conclusion: {
    type: String,
    required: [true, 'Conclusion is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
}, { 
  timestamps: true,
  strictPopulate: false // Add this option
});

// Add a pre-save middleware to ensure tags are unique
postSchema.pre('save', function(next) {
  if (this.tags) {
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }
  next();
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post; 