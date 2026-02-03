const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

const mapProjectForFrontend = (project) => {
  if (!project) return project;
  const normalized = { ...project };
  if (project.stats) {
    normalized.views = project.stats.views;
    normalized.appreciationsCount = project.stats.appreciationsCount;
  }
  return normalized;
};

const createProject = async (req, res) => {
  try {
    const { title, description, fields, tags, tools, modules, coverImage } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const normalizedModules = Array.isArray(modules)
      ? modules.map((module, index) => ({
          type: module.type || 'image',
          content: module.content || '',
          url: module.url || module.image?.url || '',
          image: module.image || {},
          caption: module.caption || '',
          order: typeof module.order === 'number' ? module.order : index + 1,
        }))
      : [];

    const project = await Project.create({
      title: title.trim(),
      description: description || '',
      owner: req.user._id,
      coverImage: coverImage || {},
      modules: normalizedModules,
      fields: Array.isArray(fields) ? fields : fields ? [fields] : [],
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      tools: Array.isArray(tools) ? tools : tools ? [tools] : [],
    });

    const populated = await Project.findById(project._id)
      .populate('owner', '-passwordHash')
      .lean();

    return res.status(201).json({
      success: true,
      data: { data: mapProjectForFrontend(populated) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Create project failed' });
  }
};

const getProjects = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '12', 10), 1);
    const { search, field, sort, tool, color, ownerUsername } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (field) {
      const fields = Array.isArray(field) ? field : String(field).split(',');
      filter.fields = { $in: fields.map((f) => f.trim()).filter(Boolean) };
    }

    if (tool) {
      const tools = Array.isArray(tool) ? tool : String(tool).split(',');
      filter.tools = { $in: tools.map((t) => t.trim()).filter(Boolean) };
    }

    if (color) {
      const colors = Array.isArray(color) ? color : String(color).split(',');
      filter.colors = { $in: colors.map((c) => c.trim()).filter(Boolean) };
    }

    if (ownerUsername) {
      const owner = await User.findOne({ username: String(ownerUsername).toLowerCase() }).select('_id');
      if (owner) {
        filter.owner = owner._id;
      } else {
        return res.status(200).json({
          success: true,
          data: { data: [], pagination: { page, limit, total: 0, totalPages: 0 } },
        });
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'most-appreciated') {
      sortOption = { 'stats.appreciationsCount': -1 };
    } else if (sort === 'popular') {
      sortOption = { 'stats.views': -1 };
    } else if (search && search.trim()) {
      sortOption = { score: { $meta: 'textScore' } };
    }

    const projects = await Project.find(filter, search && search.trim() ? { score: { $meta: 'textScore' } } : {})
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', '-passwordHash')
      .lean();

    const total = await Project.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        data: projects.map(mapProjectForFrontend),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Fetch projects failed' });
  }
};

const getProjectByIdOrSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let project;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      project = await Project.findById(slug).populate('owner', '-passwordHash').lean();
    }

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    return res.status(200).json({
      success: true,
      data: { data: mapProjectForFrontend(project) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Fetch project failed' });
  }
};

const appreciateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = project.appreciations.some((uid) => uid.toString() === userId);

    if (alreadyLiked) {
      project.appreciations = project.appreciations.filter((uid) => uid.toString() !== userId);
      project.stats.appreciationsCount = Math.max(0, project.stats.appreciationsCount - 1);
    } else {
      project.appreciations.push(req.user._id);
      project.stats.appreciationsCount += 1;
    }

    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', '-passwordHash')
      .lean();

    return res.status(200).json({
      success: true,
      data: { data: mapProjectForFrontend(populated) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Appreciation failed' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('owner', '-passwordHash')
      .lean();

    return res.status(200).json({
      success: true,
      data: projects.map(mapProjectForFrontend),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Fetch user projects failed' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectByIdOrSlug,
  appreciateProject,
  getUserProjects,
};
