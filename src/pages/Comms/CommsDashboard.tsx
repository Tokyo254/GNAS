import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaEye,
  FaMicrophone,
  FaHeadphones,
  FaPlay,
  FaPause,
  FaCalendar,
  FaShare,
  FaRegClock,
  FaRegChartBar
} from 'react-icons/fa';
import PressReleaseForm from '../PressRelease/NewReleaseModal';
import AudioReleaseForm from './AudioRelease';
import PressReleasePreview from '../PressRelease/PressReleasePreview';


interface PressRelease {
  _id: string;
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  categories: string[];
  attachments: string[];
  featuredImage?: string;
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
  createdAt?: string;
  updatedAt?: string;
}

interface AudioRelease {
  _id: string;
  title: string;
  description: string;
  audioFile: string;
  duration: number;
  transcript: string;
  categories: string[];
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
  createdAt?: string;
}

interface AnalyticsData {
  totalViews: number;
  mediaPickups: number;
  engagementRate: number;
  topPerforming: number;
  totalReleases: number;
  avgEngagementRate: number;
  totalSocialShares: number;
  viewsOverTime: { month: string; views: number }[];
  engagementBreakdown: { platform: string; percentage: number }[];
  mediaPickupSources: { source: string; count: number }[];
}

const CommsDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<'overview' | 'releases' | 'audio' | 'analytics' | 'settings'>('overview');
  const [isPressReleaseFormOpen, setIsPressReleaseFormOpen] = useState<boolean>(false);
  const [isAudioReleaseFormOpen, setIsAudioReleaseFormOpen] = useState<boolean>(false);
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(null);
  const [previewRelease, setPreviewRelease] = useState<PressRelease | null>(null);
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [audioReleases, setAudioReleases] = useState<AudioRelease[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Mock analytics data - replace with actual API calls
  const [analyticsData] = useState<AnalyticsData>({
    totalViews: 12500,
    mediaPickups: 180,
    engagementRate: 4.7,
    topPerforming: 3,
    totalReleases: 124,
    avgEngagementRate: 5.5,
    totalSocialShares: 12500,
    viewsOverTime: [
      { month: 'Jan', views: 8500 },
      { month: 'Feb', views: 9200 },
      { month: 'Mar', views: 7800 },
      { month: 'Apr', views: 11000 },
      { month: 'May', views: 12500 },
      { month: 'Jun', views: 9800 }
    ],
    engagementBreakdown: [
      { platform: 'LinkedIn', percentage: 45 },
      { platform: 'Twitter', percentage: 25 },
      { platform: 'Facebook', percentage: 15 },
      { platform: 'Email', percentage: 10 },
      { platform: 'Other', percentage: 5 }
    ],
    mediaPickupSources: [
      { source: 'News Sites', count: 65 },
      { source: 'Blogs', count: 45 },
      { source: 'Industry Pubs', count: 40 },
      { source: 'Local News', count: 20 },
      { source: 'Podcasts', count: 10 }
    ]
  });

  useEffect(() => {
    // Fetch press releases and audio releases
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        setPressReleases([
          {
            _id: '1',
            headline: 'Global Innovations Unveils Breakthrough AI Platform',
            summary: 'Revolutionary AI platform set to transform industry standards',
            fullContent: 'Full content here...',
            author: user?.fullName || 'User',
            categories: ['Technology', 'AI'],
            attachments: [],
            publicationDate: '2024-07-20',
            status: 'Published'
          }
        ]);

        setAudioReleases([
          {
            _id: '1',
            title: 'Q3 Earnings Report Commentary',
            description: 'Executive commentary on our latest quarterly results',
            audioFile: '/audio/sample.mp3',
            duration: 180, // 3 minutes
            transcript: 'Full transcript here...',
            categories: ['Finance', 'Earnings'],
            publicationDate: '2024-07-15',
            status: 'Published'
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleNewPressRelease = async (formData: any) => {
    // Implementation for creating/updating press release
    console.log('Submitting press release:', formData);
    setIsPressReleaseFormOpen(false);
    setEditingRelease(null);
  };

  const handleNewAudioRelease = async (formData: any) => {
    // Implementation for creating/updating audio release
    console.log('Submitting audio release:', formData);
    setIsAudioReleaseFormOpen(false);
  };

  const handleEditPressRelease = (release: PressRelease) => {
    setEditingRelease(release);
    setIsPressReleaseFormOpen(true);
  };

  const handleDeletePressRelease = async (releaseId: string) => {
    if (window.confirm('Are you sure you want to delete this press release?')) {
      // Implementation for deletion
      setPressReleases(prev => prev.filter(r => r._id !== releaseId));
    }
  };

  const handlePreviewPressRelease = (release: PressRelease) => {
    setPreviewRelease(release);
  };

  const toggleAudioPlayback = (audioId: string) => {
    setCurrentlyPlaying(currentlyPlaying === audioId ? null : audioId);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Under Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Draft': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 font-sans">
      {/* Modern Sidebar */}
      <aside className={`bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50 flex flex-col transition-all duration-300 shrink-0 fixed md:static z-50 h-full ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } md:w-64`}>
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between h-16">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PR Portal
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all"
          >
            {isSidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-6">
          {[
            { id: 'overview', label: 'Overview', icon: FaChartBar },
            { id: 'releases', label: 'Press Releases', icon: FaFileAlt },
            { id: 'audio', label: 'Audio Releases', icon: FaMicrophone },
            { id: 'analytics', label: 'Analytics', icon: FaRegChartBar },
            { id: 'settings', label: 'Settings', icon: FaCog }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center w-full p-3 rounded-xl text-sm transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border hover:border-gray-600/50'
              }`}
            >
              <item.icon className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-700/50">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full p-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30"
          >
            <FaSignOutAlt className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-2 p-6 overflow-y-auto ml-0 md:ml-0 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>
                  <p className="text-cyan-400 text-sm">{user?.position} at {user?.orgName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 text-sm">{user?.email}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user?.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      user?.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {user?.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPressReleaseFormOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-cyan-500/25"
                >
                  <FaPlus className="text-sm" />
                  <span>New Press Release</span>
                </button>
                <button
                  onClick={() => setIsAudioReleaseFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  <FaMicrophone className="text-sm" />
                  <span>New Audio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Views', value: analyticsData.totalViews.toLocaleString(), icon: FaEye, color: 'cyan' },
                  { label: 'Media Pickups', value: analyticsData.mediaPickups.toLocaleString(), icon: FaShare, color: 'green' },
                  { label: 'Engagement Rate', value: `${analyticsData.engagementRate}%`, icon: FaRegChartBar, color: 'purple' },
                  { label: 'Top Performing', value: analyticsData.topPerforming.toString(), icon: FaChartBar, color: 'orange' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Press Releases</h3>
                  <div className="space-y-4">
                    {pressReleases.slice(0, 3).map((release) => (
                      <div key={release._id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{release.headline}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <FaCalendar size={12} />
                              <span>{new Date(release.publicationDate).toLocaleDateString()}</span>
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(release.status)}`}>
                              {release.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePreviewPressRelease(release)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditPressRelease(release)}
                            className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <FaEdit size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'View Analytics Reports', icon: FaChartBar, action: () => setActiveTab('analytics') },
                      { label: 'Manage Media Contacts', icon: FaUser },
                      { label: 'Review Drafts', icon: FaFileAlt },
                      { label: 'Platform Resources', icon: FaCog }
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={action.action}
                        className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all text-left"
                      >
                        <action.icon className="text-cyan-400" />
                        <span className="text-sm">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Press Releases Tab */}
          {activeTab === 'releases' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">My Press Releases</h3>
                <button
                  onClick={() => setIsPressReleaseFormOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-cyan-500/25"
                >
                  <FaPlus className="text-sm" />
                  <span>New Release</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700/50 rounded-xl">
                    <tr>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Headline</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Categories</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Date</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {pressReleases.map((release) => (
                      <tr key={release._id} className="hover:bg-gray-700/30 transition-all">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{release.headline}</p>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{release.summary}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(release.status)}`}>
                            {release.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {release.categories.slice(0, 2).map((category, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                            {release.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                                +{release.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(release.publicationDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePreviewPressRelease(release)}
                              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700/50 rounded-lg"
                              title="Preview"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleEditPressRelease(release)}
                              className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeletePressRelease(release._id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audio Releases Tab */}
          {activeTab === 'audio' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Audio Releases</h3>
                <button
                  onClick={() => setIsAudioReleaseFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  <FaPlus className="text-sm" />
                  <span>New Audio Release</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {audioReleases.map((audio) => (
                  <motion.div
                    key={audio._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                          <FaHeadphones size={20} />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(audio.status)}`}>
                          {audio.status}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleAudioPlayback(audio._id)}
                        className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-all"
                      >
                        {currentlyPlaying === audio._id ? <FaPause size={12} /> : <FaPlay size={12} />}
                      </button>
                    </div>

                    <h4 className="text-white font-medium mb-2 line-clamp-2">{audio.title}</h4>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{audio.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <FaRegClock size={10} />
                        <span>{formatDuration(audio.duration)}</span>
                      </span>
                      <span>{new Date(audio.publicationDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {audio.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-6">Performance Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalReleases}</p>
                      <p className="text-gray-400 text-sm">Total Releases</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                      <p className="text-2xl font-bold text-white">{analyticsData.avgEngagementRate}%</p>
                      <p className="text-gray-400 text-sm">Avg Engagement</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                      <p className="text-2xl font-bold text-white">{analyticsData.totalSocialShares.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Social Shares</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                      <p className="text-2xl font-bold text-white">{analyticsData.mediaPickups}</p>
                      <p className="text-gray-400 text-sm">Media Pickups</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-6">Engagement by Platform</h3>
                  <div className="space-y-3">
                    {analyticsData.engagementBreakdown.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{platform.platform}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${platform.percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-8">{platform.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Media Pickup Sources */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-6">Media Pickup Sources</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {analyticsData.mediaPickupSources.map((source) => (
                    <div key={source.source} className="text-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all">
                      <p className="text-2xl font-bold text-white">{source.count}</p>
                      <p className="text-gray-400 text-sm">{source.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                  <input
                    type="text"
                    value={user?.orgName || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <input
                    type="text"
                    value={user?.position || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={user?.bio || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isPressReleaseFormOpen && (
          <PressReleaseForm
            isOpen={isPressReleaseFormOpen}
            onClose={() => {
              setIsPressReleaseFormOpen(false);
              setEditingRelease(null);
            }}
            onSubmit={handleNewPressRelease}
            initialData={editingRelease ? {
              headline: editingRelease.headline,
              summary: editingRelease.summary,
              fullContent: editingRelease.fullContent,
              author: editingRelease.author,
              categories: editingRelease.categories.join(', '),
              publicationDate: editingRelease.publicationDate,
              status: editingRelease.status
            } : { author: user?.fullName }}
            mode={editingRelease ? 'edit' : 'create'}
            user={user}
          />
        )}

        {isAudioReleaseFormOpen && (
          <AudioReleaseForm
            isOpen={isAudioReleaseFormOpen}
            onClose={() => setIsAudioReleaseFormOpen(false)}
            onSubmit={handleNewAudioRelease}
            user={user}
          />
        )}

        {previewRelease && (
          <PressReleasePreview
            release={previewRelease}
            isOpen={!!previewRelease}
            onClose={() => setPreviewRelease(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommsDashboard;