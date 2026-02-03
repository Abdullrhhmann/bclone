/**
 * Frontend validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password.length >= 6;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'weak', color: 'red', message: 'Password is required' };
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  if (strength < 2) return { strength: 'weak', color: 'red', message: 'Password is too weak' };
  if (strength < 4) return { strength: 'fair', color: 'yellow', message: 'Password is fair' };
  if (strength < 6) return { strength: 'good', color: 'blue', message: 'Password is good' };
  return { strength: 'strong', color: 'green', message: 'Password is strong' };
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateUsername = (username) => {
  // 3-30 characters, alphanumeric (and underscore allowed)
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const validateSignupForm = (username, displayName, email, password) => {
  const errors = {};

  if (!username || !validateUsername(username)) {
    errors.username = 'Username must be 3-30 characters (alphanumeric and underscore only)';
  }

  if (!displayName || !validateName(displayName)) {
    errors.displayName = 'Display name must be at least 2 characters';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
