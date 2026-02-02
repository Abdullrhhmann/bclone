import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  Loader,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import { useAppState } from '../context/Context';
import apiClient from '../services/apiClient';

const CreateProjectPage = () => {
  const { setCurrentPage, user, isAuthenticated } = useAppState();
  const [formData, setFormData] = useState({
    imageTitle: '',
    description: '',
    category: '',
    type: '',
    price_type: 'free',
    tools: [],
    images: [],
    colors_used: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [toolInput, setToolInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'graphic-design',
    'web-design',
    'illustration',
    'branding',
    'motion-design',
    '3d-design',
    'photography',
    'ui-ux',
    'fashion',
    'architecture',
  ];

  const types = ['vector', 'template', 'font', 'web', 'mobile', 'branding', 'illustration', '3d'];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center text-gray-500">
          <p className="text-lg mb-4">Please log in to create a project</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, toolInput.trim()],
      }));
      setToolInput('');
    }
  };

  const handleRemoveTool = (tool) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool),
    }));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors_used.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors_used: [...prev.colors_used, colorInput.trim()],
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors_used: prev.colors_used.filter(c => c !== color),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setPreviewImages(prev => [...prev, imageData]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageData],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.imageTitle.trim()) {
      setError('Project title is required');
      return false;
    }
    if (formData.images.length === 0) {
      setError('At least one image is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.type) {
      setError('Please select a project type');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for submission
      const projectData = {
        imageTitle: formData.imageTitle,
        creatorName: `${user.firstName} ${user.lastName}`,
        category: formData.category,
        type: formData.type,
        price_type: formData.price_type,
        tools: formData.tools,
        colors_used: formData.colors_used,
        images: formData.images,
        likes: 0,
        views: 0,
        country: 'USA', // Default, can be enhanced
        file_extension: '.jpg',
        availability: 'full time',
      };

      // Call backend API to create card
      const result = await apiClient.createCard(projectData);

      if (result.success) {
        setSuccess('Project created successfully! Redirecting to your profile...');
        setTimeout(() => {
          setCurrentPage('myProfile');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('An error occurred while creating your project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle2 size={20} className="text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Project Title */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="imageTitle"
              value={formData.imageTitle}
              onChange={handleInputChange}
              placeholder="Give your project a compelling title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Project Images * (Drag and drop or click to upload)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
                disabled={loading}
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Project Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select a type</option>
                {types.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Type */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Availability
            </label>
            <div className="flex gap-4">
              {['free', 'paid', 'subscription'].map(priceType => (
                <label key={priceType} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price_type"
                    value={priceType}
                    checked={formData.price_type === priceType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 capitalize">{priceType}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tools Used */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Tools & Software Used
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
                placeholder="Add a tool (e.g., Figma, Photoshop)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Tools Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.tools.map(tool => (
                <div
                  key={tool}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="hover:text-blue-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors Used */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Colors Used
            </label>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 flex gap-2">
                <input
                  type="color"
                  value={colorInput || '#000000'}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Color Swatches */}
            <div className="flex flex-wrap gap-3">
              {formData.colors_used.map(color => (
                <div key={color} className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
