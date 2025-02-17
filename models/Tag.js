import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
}, { timestamps: true });

// Add this to ensure the model is registered
mongoose.models = {};

const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);
export default Tag; 