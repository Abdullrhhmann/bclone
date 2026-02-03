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
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import { useAppState } from '../context/Context';
import apiClient from '../services/apiClient';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('work');
  const { selectedCreator, setCurrentPage, user, isAuthenticated, setLoginActive } = useAppState();
  const [creatorData, setCreatorData] = useState(null);
  const [creatorProjects, setCreatorProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!selectedCreator) return;
      
      setLoading(true);
      try {
        // Fetch creator profile by username
        const result = await apiClient.getUserByUsername(selectedCreator);
        if (result.success) {
          const userData = result.data.user || result.data.data;
          setCreatorData(userData);
          if (userData?.followers && user?._id) {
            const following = userData.followers.some(
              (follower) => follower === user._id || follower?._id === user._id
            );
            setIsFollowing(following);
          } else {
            setIsFollowing(false);
          }
          
          // Fetch creator's projects
          const projectsResult = await apiClient.getAllProjects(1, 50, { 
            ownerUsername: selectedCreator 
          });
          if (projectsResult.success) {
            const projects = projectsResult.data.data || projectsResult.data.projects || [];
            setCreatorProjects(projects);
          }
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [selectedCreator]);

  if (!creatorData && loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-gray-500">Loading creator profile...</div>
      </div>
    );
  }

  // Calculate stats from actual projects
  const totalViews = creatorProjects.reduce((sum, project) => sum + (project.views || 0), 0);
  const totalAppreciations = creatorProjects.reduce((sum, project) => sum + (project.appreciationsCount || 0), 0);

  // User profile data - dynamic based on selected creator
  const profile = {
    name: creatorData?.displayName || selectedCreator || 'Unknown Creator',
    username: creatorData?.username || selectedCreator || 'unknown',
    avatar: creatorData?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorData?.displayName || selectedCreator || 'User')}&size=120&background=random`,
    coverImage: creatorData?.coverImage?.url || 'https://via.placeholder.com/1200/2C2C2C/FFFFFF?text=Cover',
    status: 'Available Now',
    email: creatorData?.email || 'contact@example.com',
    bio: creatorData?.bio || `${creatorProjects.length} projects published`,
    stats: {
      views: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString(),
      appreciations: totalAppreciations > 1000 ? `${(totalAppreciations / 1000).toFixed(1)}k` : totalAppreciations.toString(),
      followers: creatorData?.followersCount || 0,
      following: creatorData?.followingCount || 0,
    },
    social: [
      { name: 'Facebook', url: '#' },
      { name: 'Instagram', url: '#' },
      { name: 'LinkedIn', url: '#' },
    ],
    memberSince: `MEMBER SINCE ${new Date(creatorData?.createdAt || new Date()).getFullYear()}`,
  };

  // Project data
  const projects = {
    work: creatorProjects.map((project, index) => ({
      id: project._id || index,
      title: project.title,
      image: project.coverImage?.url || 'https://via.placeholder.com/400/2C2C2C/FFFFFF?text=No+Image',
      appreciations: project.appreciationsCount > 1000 ? `${(project.appreciationsCount / 1000).toFixed(1)}k` : project.appreciationsCount,
      views: project.views > 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views,
    })),
    moodboards: [],
    appreciations: [],
  };

  const currentProjects = projects[activeTab] || projects.work;
  const handleBack = () => {
    setCurrentPage('home');
  };
  const handleFollow = async () => {
    if (!isAuthenticated) {
      setLoginActive(true);
      return;
    }
    if (!creatorData?._id || followLoading) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    setFollowLoading(true);

    try {
      const result = await apiClient.followUser(creatorData._id);
      if (!result.success) {
        setIsFollowing(!nextFollowing);
      }
    } catch (error) {
      setIsFollowing(!nextFollowing);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!selectedCreator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">No creator selected</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />
      
      {/* Back Button */}
      <div className="flex items-center gap-4 px-8 py-4 border-b border-gray-200">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          title="Back to home"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Cover Banner */}
      <div className="relative h-64 bg-gray-800 overflow-hidden">
        <img
          src={profile.coverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex flex-col items-center justify-center">
          <p className="text-red-400 text-2xl font-light mb-4">
            Bringing your ideas to life with stunning visuals.
          </p>
          <div className="flex gap-4 text-white font-semibold text-sm tracking-wide">
            <span>{profile?.roles ? profile.roles.split('|')[0].trim().toUpperCase() : 'CREATOR'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h1 className="text-2xl font-bold text-black">{profile.name}</h1>
                <p className="text-gray-600 text-sm">@{profile.username}</p>
                <div className="flex items-center gap-1 mt-1 justify-center">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-semibold text-green-600">
                    {profile.status}
                  </span>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Users size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{profile.bio}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{profile.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`w-full font-semibold py-3 rounded-lg transition ${
                    isFollowing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } ${followLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition">
                  Message
                </button>
              </div>

              {/* Hire Section */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-black mb-4">Contact {profile.name}</h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Send Message
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Full Time Job
                    </span>
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-bold text-black">
                    {profile.stats.views}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Project Views
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">
                    {profile.stats.appreciations}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Appreciations
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">
                    {profile.stats.followers}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Followers
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">
                    {profile.stats.following}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Following
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-black text-sm uppercase tracking-wide mb-3">
                  On The Web
                </h3>
                <div className="space-y-2">
                  {profile.social.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition"
                    >
                      <span className="text-sm text-gray-700">
                        {social.name === 'Facebook' && <Facebook size={16} />}
                        {social.name === 'Instagram' && <Instagram size={16} />}
                        {social.name === 'LinkedIn' && <Linkedin size={16} />}
                      </span>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-black text-sm uppercase tracking-wide mb-4">
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {profile.experience?.map((exp, idx) => (
                    <div key={idx} className="pb-4 border-b last:border-b-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {exp.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{exp.company}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-4 inline-block"
                >
                  View Full Resume →
                </a>
              </div>

              {/* Member Info */}
              <div className="border-t pt-6 text-xs text-gray-500 space-y-2">
                <p>
                  <strong className="text-black">MEMBER SINCE:</strong>{' '}
                  {profile.memberSince}
                </p>
                <a href="#" className="text-gray-600 hover:text-gray-900 block">
                  Report
                </a>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {['work', 'moodboards', 'appreciations'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 font-semibold text-sm transition relative ${
                      activeTab === tab
                        ? 'text-black'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-pointer overflow-hidden rounded-lg"
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-end justify-end p-4">
                      <div className="text-white space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            <span className="text-sm font-semibold">
                              {project.appreciations}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span className="text-sm font-semibold">
                              {project.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition">
                      {project.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
