import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  Eye,
  MapPin,
  Briefcase,
  Users,
  Heart,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
  Edit3,
  LogOut,
  Settings,
  Plus,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import { useAppState } from '../context/Context';
import apiClient from '../services/apiClient';

const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('work');
  const { user, setCurrentPage, isAuthenticated, setIsAuthenticated, setUser } = useAppState();
  const [userProjects, setUserProjects] = useState([]);
  const [userStats, setUserStats] = useState({
    views: 0,
    likes: 0,
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setCurrentPage('home');
        return;
      }

      setLoading(true);
      try {
        // Fetch user's own profile data
        const result = await apiClient.getUserProfile();
        if (result.success) {
          const userData = result.data?.data || result.data;
          
          // Fetch user's created projects/cards
          const allCardsResult = await apiClient.getAllCards();
          if (allCardsResult.success) {
            const allCards = allCardsResult.data?.properties || [];
            const userCards = allCards.filter(card => card.creatorName === user.firstName + ' ' + user.lastName);
            setUserProjects(userCards);

            // Calculate stats
            const totalViews = userCards.reduce((sum, card) => sum + (card.views || 0), 0);
            const totalLikes = userCards.reduce((sum, card) => sum + (card.likes || 0), 0);

            setUserStats({
              views: totalViews,
              likes: totalLikes,
              followers: Math.floor(Math.random() * 500) + 100,
              following: Math.floor(Math.random() * 200) + 50,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, setCurrentPage]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleCreateProject = () => {
    setCurrentPage('createProject');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center text-gray-500">
          <p className="text-lg mb-4">Please log in to view your profile</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-gray-500">Loading your profile...</div>
      </div>
    );
  }

  const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const userEmail = user.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative">
        <button
          onClick={() => setCurrentPage('home')}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userFullName)}&size=128&background=random`}
                  alt={userFullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="pb-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{userFullName}</h1>
                <p className="text-gray-600 text-lg flex items-center gap-2">
                  <span>Creative Professional</span>
                  <CheckCircle2 size={20} className="text-blue-500" />
                </p>
                <p className="text-gray-500 text-sm mt-2">{userEmail}</p>
                <p className="text-green-600 font-medium mt-1">✓ Available Now</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateProject}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition font-medium"
              >
                <Plus size={18} />
                New Project
              </button>
              <button
                onClick={() => {}}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition font-medium"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-full transition font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {userStats.views > 1000 ? `${(userStats.views / 1000).toFixed(1)}k` : userStats.views}
              </p>
              <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                <Eye size={16} />
                Views
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {userStats.likes > 1000 ? `${(userStats.likes / 1000).toFixed(1)}k` : userStats.likes}
              </p>
              <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                <ThumbsUp size={16} />
                Appreciations
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userStats.followers}</p>
              <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                <Users size={16} />
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userStats.following}</p>
              <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                <Users size={16} />
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {['work', 'moodboards', 'appreciations'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'work' ? userProjects.length : 0})
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {activeTab === 'work' && (
          <div className="mb-12">
            {userProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">You haven't created any projects yet</p>
                <button
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition font-medium"
                >
                  <Plus size={20} />
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project, index) => (
                  <div
                    key={project._id || index}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    {/* Project Image */}
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      <img
                        src={
                          project.images && project.images.length > 0
                            ? project.images[0]
                            : 'https://via.placeholder.com/400/2C2C2C/FFFFFF?text=No+Image'
                        }
                        alt={project.imageTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>

                    {/* Project Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 truncate">
                        {project.imageTitle}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.category || 'Creative Work'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-gray-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {project.views > 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={14} />
                          {project.likes > 1000 ? `${(project.likes / 1000).toFixed(1)}k` : project.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Moodboards Tab */}
        {activeTab === 'moodboards' && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No moodboards yet</p>
          </div>
        )}

        {/* Appreciations Tab */}
        {activeTab === 'appreciations' && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No appreciations yet</p>
          </div>
        )}

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Me</h3>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
