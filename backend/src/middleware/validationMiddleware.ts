import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware for user registration
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;
  const errors: any = {};

  // Validate firstName
  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Validate lastName
  if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * Validation middleware for user login
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: any = {};

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * Validation middleware for card operations
 */
export const validateCard = (req: Request, res: Response, next: NextFunction) => {
  const { imageTitle, creatorName, images } = req.body;
  const errors: any = {};

  if (!imageTitle || typeof imageTitle !== 'string' || imageTitle.trim().length < 2) {
    errors.imageTitle = 'Image title is required and must be at least 2 characters';
  }

  if (!creatorName || typeof creatorName !== 'string' || creatorName.trim().length < 2) {
    errors.creatorName = 'Creator name is required and must be at least 2 characters';
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    errors.images = 'At least one image URL is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};
