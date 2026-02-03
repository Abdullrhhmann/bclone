const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      url: { type: String, default: '' },
    },
    coverImage: {
      url: { type: String, default: '' },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    experience: [ExperienceSchema],
    stats: {
      views: { type: Number, default: 0 },
      appreciations: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
