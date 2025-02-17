import mongoose from 'mongoose';

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

// Make sure Tag model is imported and registered before Post model
require('./Tag');

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post; 