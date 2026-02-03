const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');

const JWT_EXPIRES_IN = '7d';

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: JWT_EXPIRES_IN });
};

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.passwordHash;
  return user;
};

const validateUsername = (username) => /^[a-zA-Z0-9_]{3,30}$/.test(username);

const register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3-30 characters (alphanumeric and underscore only)',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      displayName,
    });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true, message: 'Logged out' });
};

const me = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
};
