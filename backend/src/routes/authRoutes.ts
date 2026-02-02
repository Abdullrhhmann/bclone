import { Router } from 'express';
import { register, login, refreshToken, getProfile, checkRole } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh_token', refreshToken);
router.get('/me', authenticateToken, getProfile);
router.post('/checkRole', authenticateToken, checkRole);

export default router;
