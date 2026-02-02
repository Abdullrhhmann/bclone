import User, { IUser } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (isUser)
      return res.status(400).json({
        message: "User already exists",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User not found",
      });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    res.status(200).json({
      message: "Login Successful",
      accessToken: accessToken,
      refreshToken: refreshToken,

    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken)
      return res.status(400).json({
        message: "Refresh Token Required",
      });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, user: any) => {
        if (err)
          return res.status(403).json({
            message: "Invalid Refresh Token",
          });
        const accessToken = generateAccessToken(user.id);
        res.status(200).json({
          accessToken: accessToken,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/**
 * Get current authenticated user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        likedCards: user.likedCards,
      },
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/**
 * Check user role/permissions
 */
export const checkRole = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // TODO: Implement role system (admin, creator, user)
    // For now, all authenticated users have 'user' role
    res.status(200).json({
      message: "Role checked successfully",
      role: "user", // Default role
      userId: user._id,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
