const User = require('../models/User');
const Project = require('../models/Project');

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select('-passwordHash').lean();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const projects = await Project.find({ owner: user._id }).lean();
    const totalViews = projects.reduce((sum, project) => sum + (project.stats?.views || 0), 0);
    const totalAppreciations = projects.reduce(
      (sum, project) => sum + (project.stats?.appreciationsCount || 0),
      0
    );

    user.stats = {
      ...(user.stats || {}),
      views: totalViews,
      appreciations: totalAppreciations,
    };

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Fetch user failed' });
  }
};

const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isFollowing = req.user.following.some((id) => id.toString() === userId);

    if (isFollowing) {
      req.user.following = req.user.following.filter((id) => id.toString() !== userId);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      req.user.following.push(targetUser._id);
      targetUser.followers.push(req.user._id);
    }

    await req.user.save();
    await targetUser.save();

    const sanitizedUser = await User.findById(req.user._id).select('-passwordHash');

    return res.status(200).json({
      success: true,
      data: { user: sanitizedUser, following: !isFollowing },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Follow failed' });
  }
};

module.exports = {
  getUserProfile,
  followUser,
};
