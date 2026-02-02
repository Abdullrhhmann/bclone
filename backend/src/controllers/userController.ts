import User from "../models/userModel";
import CardModel from "../models/cardModel";
import { Request, Response } from "express";

/**
 * Get creator profile by name
 */
export const getCreatorProfile = async (req: Request, res: Response) => {
  try {
    const { creatorName } = req.params;

    if (!creatorName) {
      return res.status(400).json({
        message: "Creator name is required",
      });
    }

    // Find all cards by this creator
    const creatorCards = await CardModel.find({
      creatorName: { $regex: creatorName, $options: 'i' }
    });

    if (creatorCards.length === 0) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    // Calculate stats
    const totalViews = creatorCards.reduce((sum, card) => sum + (card.views || 0), 0);
    const totalLikes = creatorCards.reduce((sum, card) => sum + (card.likes || 0), 0);
    const categories = [...new Set(creatorCards.map(c => c.category).filter(Boolean))];

    const profile = {
      name: creatorName,
      projectCount: creatorCards.length,
      totalViews,
      totalLikes,
      categories,
      location: creatorCards[0]?.country || "Unknown",
      projects: creatorCards.map(card => ({
        id: card._id,
        title: card.imageTitle,
        image: card.images[0],
        likes: card.likes,
        views: card.views,
        category: card.category,
      })),
    };

    res.status(200).json({
      message: "Creator profile fetched successfully",
      data: profile,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

/**
 * Get user's own profile (authenticated)
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('likedCards');

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        likedCards: user.likedCards,
      },
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
