import React, { useState } from 'react'
import { useAppState } from '../../context/Context'
import apiClient from '../../services/apiClient'
import { validateLoginForm } from '../../utils/validation'

const PopupLogin = () => {
  const { loginActive, setLoginActive, setUser, setIsAuthenticated } = useAppState();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
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
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Validate form
    const validation = validateLoginForm(formData.email, formData.password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await apiClient.login(formData.email, formData.password);
      
      const loggedInUser = result.data?.data?.user;
      if (result.success && loggedInUser) {
        // Login successful - httpOnly cookie is automatically set by backend
        // Update user context
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        setMessage('✓ Login successful! Redirecting...');
        setFormData({ email: '', password: '' });
        setErrors({});
        
        setTimeout(() => setLoginActive(false), 1500);
      } else {
        setMessage('✗ ' + (result.error || 'Login failed'));
      }
    } catch (error) {
      setMessage('✗ Error connecting to server');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loginActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => {
              setLoginActive(false);
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

export default PopupLogin
