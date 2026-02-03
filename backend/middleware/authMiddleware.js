const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
};

module.exports = authMiddleware;
