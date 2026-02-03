import React, { useState } from 'react'
import { useAppState } from '../../context/Context'
import apiClient from '../../services/apiClient'
import { validateSignupForm, getPasswordStrength } from '../../utils/validation'

const PopupSign = () => {
  const { signupActive, setSignupActive } = useAppState();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Update password strength indicator
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Validate form
    const validation = validateSignupForm(
      formData.username,
      formData.displayName,
      formData.email,
      formData.password
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await apiClient.register(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName
      );
      
      if (result.success) {
        setMessage('✓ Registration successful! You can now log in.');
        setFormData({ username: '', displayName: '', email: '', password: '' });
        setErrors({});
        setPasswordStrength(null);
        setTimeout(() => setSignupActive(false), 2000);
      } else {
        setMessage('✗ ' + (result.error || 'Registration failed'));
      }
    } catch (error) {
      setMessage('✗ Error connecting to server');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!signupActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username (3-30 chars, alphanumeric)"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Display Name */}
          <div>
            <input
              type="text"
              name="displayName"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.displayName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            {passwordStrength && formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 flex-1 rounded-full bg-${passwordStrength.color}-500`}></div>
                  <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{passwordStrength.message}</p>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <p className={`text-center py-2 rounded ${message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => {
              setSignupActive(false);
              setErrors({});
              setMessage('');
            }}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupSign