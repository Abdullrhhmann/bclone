const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, me } = require('../controllers/authController');
const handleValidationErrors = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
      .withMessage('Password must be at least 8 characters and include upper, lower, number, and symbol'),
  ],
  handleValidationErrors,
  register
);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);
router.post('/logout', logout);
router.get('/me', me);

module.exports = router;
