const mongoose = require('mongoose');

const CoverImageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    filename: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
    dominantColor: { type: String, default: '' },
  },
  { _id: false }
);

const ModuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'text'],
      default: 'image',
    },
    content: { type: String, default: '' },
    url: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      filename: { type: String, default: '' },
      width: { type: Number },
      height: { type: Number },
      dominantColor: { type: String, default: '' },
    },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: CoverImageSchema,
    modules: [ModuleSchema],
    fields: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    stats: {
      views: { type: Number, default: 0 },
      appreciationsCount: { type: Number, default: 0 },
    },
    appreciations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', description: 'text', tags: 'text', fields: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
