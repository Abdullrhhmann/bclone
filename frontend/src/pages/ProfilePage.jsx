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
  const { selectedCreator, setCurrentPage } = useAppState();
  const [creatorProjects, setCreatorProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!selectedCreator) return;
      
      setLoading(true);
      try {
        const result = await apiClient.getCreatorProfile(selectedCreator);
        if (result.success) {
          const creatorData = result.data.data;
          setCreatorProjects(creatorData.projects || []);
        } else {
          // Fallback to getAllCards if API fails
          const allCardsResult = await apiClient.getAllCards();
          if (allCardsResult.success) {
            const filtered = allCardsResult.data.properties.filter(
              (project) => project.creatorName === selectedCreator
            );
            setCreatorProjects(filtered);
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

  // Calculate stats from actual projects
  const totalViews = creatorProjects.reduce((sum, project) => sum + (project.views || 0), 0);
  const totalLikes = creatorProjects.reduce((sum, project) => sum + (project.likes || 0), 0);

  // User profile data - dynamic based on selected creator
  const profile = {
    name: selectedCreator || 'Unknown Creator',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCreator || 'User')}&size=120&background=random`,
    coverImage: (creatorProjects[0]?.images && creatorProjects[0].images.length > 0) ? creatorProjects[0].images[0] : 'https://via.placeholder.com/1200/2C2C2C/FFFFFF?text=Cover',
    status: 'Available Now',
    roles: creatorProjects[0]?.category || 'Creative Professional',
    location: creatorProjects[0]?.country || 'Unknown',
    bio: `${creatorProjects.length} projects published`,
    stats: {
      views: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString(),
      appreciations: totalLikes > 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes.toString(),
      followers: Math.floor(Math.random() * 500) + 100,
      following: Math.floor(Math.random() * 200) + 50,
    },
    social: [
      { name: 'Facebook', url: '#' },
      { name: 'Instagram', url: '#' },
      { name: 'LinkedIn', url: '#' },
    ],
    experience: [
      {
        title: creatorProjects[0]?.category || 'Creative Professional',
        company: creatorProjects[0]?.country || 'Remote',
      },
    ],
    memberSince: 'MEMBER SINCE 2024',
  };

  // Project data
  const projects = {
    work: creatorProjects.map((project, index) => ({
      id: project._id || index,
      title: project.imageTitle,
      image: (project.images && project.images.length > 0) ? project.images[0] : 'https://via.placeholder.com/400/2C2C2C/FFFFFF?text=No+Image',
      likes: project.likes > 1000 ? `${(project.likes / 1000).toFixed(1)}k` : project.likes,
      views: project.views > 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views,
    })),
    moodboards: [],
    appreciations: [],
  };

  const currentProjects = projects[activeTab] || projects.work;
  const handleBack = () => {
    setCurrentPage('home');
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
            <span>{profile.roles.split('|')[0].trim().toUpperCase()}</span>
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
                  <span>{profile.roles}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                  Follow
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition">
                  Message
                </button>
              </div>

              {/* Hire Section */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-black mb-4">Hire {profile.name.split(' ')[0]}</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Freelance Job
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
                  {profile.experience.map((exp, idx) => (
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
                              {project.likes}
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
