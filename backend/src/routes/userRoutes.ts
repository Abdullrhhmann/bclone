import { Router } from 'express';
import { getCreatorProfile, getUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get creator profile by name (public)
router.get('/creator/:creatorName', getCreatorProfile);

// Get authenticated user's profile
router.get('/profile', authenticateToken, getUserProfile);

export default router;
