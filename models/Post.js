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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', postSchema); 