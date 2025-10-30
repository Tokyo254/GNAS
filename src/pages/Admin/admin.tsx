import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUpload,
  FaGlobe,
  FaBell,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserPlus,
  FaChild,
  FaComment,
  FaExclamationTriangle,
  FaFlag,
  FaArrowUp,
  FaArrowDown,
  FaEye as FaViews,
  FaShare,
  FaHeart,
  FaCommentDots,
  FaEnvelope,
  FaUserShield,
  FaCheck,
  FaDownload,
  FaFilter,
  FaClock,
  FaMusic,
  FaMicrophone,
  FaVideo,
  FaImage,
  FaFileCsv,
  FaChartLine,
  FaChartPie,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRocket,
  FaDatabase,
  FaShieldAlt,
  FaCogs
} from 'react-icons/fa';

interface User {
  _id: string;
  firstName: string;
  surname: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'journalist' | 'comms' | 'admin';
  orgName?: string;
  publication?: string;
  position?: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdAt: string;
  phoneNumber?: string;
  country?: string;
}

interface PressRelease {
  _id: string;
  headline: string;
  summary: string;
  author: string | { _id: string; fullName: string };
  status: 'Published' | 'Under Review' | 'Draft' | 'Rejected';
  publicationDate: string;
  categories: string[];
  featuredImage?: string;
  views: number;
  likes: number;
  shares: number;
  readTime: string;
  tags?: string[];
}

interface WhistleblowerMessage {
  _id: string;
  type: 'comment' | 'message' | 'report';
  content: string;
  author: {
    name: string;
    email: string;
    ip?: string;
  };
  status: 'pending' | 'reviewed' | 'resolved' | 'flagged';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  relatedPost?: {
    title: string;
    url: string;
    postId?: string;
  };
  reporter?: {
    name: string;
    email: string;
    userId?: string;
  };
}

interface AnalyticsData {
  totalUsers: number;
  pendingComms: number;
  totalReleases: number;
  activeJournalists: number;
  systemHealth: number;
  totalAdmins: number;
  totalComments: number;
  totalReports: number;
  pendingReports: number;
  userGrowth: number;
  releaseGrowth: number;
  engagementRate: number;
  avgReadTime: string;
  topCategories: { name: string; count: number }[];
  trafficSources: { source: string; percentage: number }[];
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  topPerformingReleases: PressRelease[];
  userDemographics: { _id: string; users: number }[];
  whistleblowerStats?: {
    total: number;
    pending: number;
    critical: number;
  };
}

const API_URL = 'http://localhost:5000';

// Bulk Upload Modal Components
const BulkUserUpload: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Bulk Upload Users</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
            />
            <p className="text-gray-400 text-xs mt-2">
              CSV format with columns: firstName, surname, lastName, email, orgName, position, phoneNumber, country, interests
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-all"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BulkReleaseUpload: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Bulk Upload Press Releases</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
            />
            <p className="text-gray-400 text-xs mt-2">
              CSV format with columns: headline, summary, fullContent, categories, tags, publicationDate, status
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BulkAudioUpload: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Bulk Upload Audio Files</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Audio Files
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
            />
            <p className="text-gray-400 text-xs mt-2">
              Supported formats: MP3, WAV, AAC, OGG
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-all"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'releases' | 'uploads' | 'analytics' | 'settings' | 'whistleblower'>('overview');
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allReleases, setAllReleases] = useState<PressRelease[]>([]);
  const [whistleblowerMessages, setWhistleblowerMessages] = useState<WhistleblowerMessage[]>([]);
  const [isBulkUserUploadOpen, setIsBulkUserUploadOpen] = useState<boolean>(false);
  const [isBulkReleaseUploadOpen, setIsBulkReleaseUploadOpen] = useState<boolean>(false);
  const [isBulkAudioUploadOpen, setIsBulkAudioUploadOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    pendingComms: 0,
    totalReleases: 0,
    activeJournalists: 0,
    systemHealth: 100,
    totalAdmins: 0,
    totalComments: 0,
    totalReports: 0,
    pendingReports: 0,
    userGrowth: 0,
    releaseGrowth: 0,
    engagementRate: 0,
    avgReadTime: '0 min',
    topCategories: [],
    trafficSources: [],
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    topPerformingReleases: [],
    userDemographics: []
  });

  // Enhanced responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchPendingUsers(),
        fetchAllUsers(),
        fetchAllReleases(),
        fetchAnalytics(),
        fetchWhistleblowerMessages()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/comms/pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const fetchAllReleases = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/press-releases`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllReleases(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all releases:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data for demonstration
      setAnalyticsData({
        totalUsers: 1247,
        pendingComms: 23,
        totalReleases: 892,
        activeJournalists: 156,
        systemHealth: 98.5,
        totalAdmins: 5,
        totalComments: 2345,
        totalReports: 67,
        pendingReports: 12,
        userGrowth: 12.5,
        releaseGrowth: 8.3,
        engagementRate: 67.8,
        avgReadTime: '3.2 min',
        topCategories: [
          { name: 'Technology', count: 234 },
          { name: 'Business', count: 189 },
          { name: 'Politics', count: 156 },
          { name: 'Health', count: 134 },
          { name: 'Environment', count: 98 }
        ],
        trafficSources: [
          { source: 'Direct', percentage: 45 },
          { source: 'Social Media', percentage: 30 },
          { source: 'Search Engines', percentage: 15 },
          { source: 'Referral', percentage: 10 }
        ],
        dailyActiveUsers: 1247,
        weeklyActiveUsers: 8432,
        monthlyActiveUsers: 28765,
        topPerformingReleases: [
          {
            _id: '1',
            headline: 'Tech Company Launches Revolutionary AI Platform',
            summary: 'New AI platform set to transform industry standards with cutting-edge technology',
            author: 'John Smith',
            status: 'Published',
            publicationDate: new Date().toISOString(),
            categories: ['Technology', 'AI'],
            views: 15420,
            likes: 2345,
            shares: 567,
            readTime: '5 min read'
          },
          {
            _id: '2',
            headline: 'Global Corporation Announces Record Q4 Earnings',
            summary: 'Record-breaking quarterly results with significant growth across all segments',
            author: 'Sarah Johnson',
            status: 'Published',
            publicationDate: new Date().toISOString(),
            categories: ['Business', 'Finance'],
            views: 9876,
            likes: 1456,
            shares: 234,
            readTime: '4 min read'
          },
          {
            _id: '3',
            headline: 'New Sustainability Initiative Targets Carbon Neutrality',
            summary: 'Comprehensive environmental program aims for carbon neutrality by 2030',
            author: 'Michael Chen',
            status: 'Published',
            publicationDate: new Date().toISOString(),
            categories: ['Environment', 'Sustainability'],
            views: 7654,
            likes: 987,
            shares: 123,
            readTime: '6 min read'
          }
        ],
        userDemographics: [
          { _id: 'US', users: 456 },
          { _id: 'UK', users: 234 },
          { _id: 'Canada', users: 189 },
          { _id: 'Australia', users: 156 },
          { _id: 'Germany', users: 134 }
        ]
      });
    }
  };

  const fetchWhistleblowerMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/whistleblower-messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWhistleblowerMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching whistleblower messages:', error);
      // Set mock data for demonstration
      setWhistleblowerMessages([
        {
          _id: '1',
          type: 'report',
          content: 'Potential factual inaccuracies in the recent technology press release',
          author: {
            name: 'Anonymous Reporter',
            email: 'reporter@example.com',
            ip: '192.168.1.1'
          },
          status: 'pending',
          severity: 'high',
          createdAt: new Date().toISOString(),
          relatedPost: {
            title: 'Tech Company Launches Revolutionary AI Platform',
            url: '/blog/posts/tech-company-ai'
          }
        },
        {
          _id: '2',
          type: 'comment',
          content: 'Excellent coverage of the sustainability initiative',
          author: {
            name: 'Jane Doe',
            email: 'jane.doe@example.com'
          },
          status: 'reviewed',
          severity: 'low',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/comms/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        fetchAnalytics();
      } else {
        alert('Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/comms/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId));
        fetchAnalytics();
      } else {
        alert('Failed to reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user');
    }
  };

  const handleBulkUserUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/admin/bulk-upload/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully uploaded ${data.data.successful} users out of ${data.data.processed}`);
        fetchDashboardData();
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleBulkReleaseUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/admin/bulk-upload/releases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully uploaded ${data.data.successful} releases out of ${data.data.processed}`);
        fetchDashboardData();
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleBulkAudioUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/admin/bulk-upload/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully uploaded ${data.data.successful} audio files out of ${data.data.processed}`);
        fetchDashboardData();
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Bulk audio upload error:', error);
      alert('Audio upload failed. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAllUsers(prev => prev.filter(user => user._id !== userId));
        fetchAnalytics();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleDeleteRelease = async (releaseId: string) => {
    if (!window.confirm('Are you sure you want to delete this press release?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/press-releases/${releaseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAllReleases(prev => prev.filter(release => release._id !== releaseId));
        fetchAnalytics();
      } else {
        alert('Failed to delete press release');
      }
    } catch (error) {
      console.error('Error deleting press release:', error);
      alert('Error deleting press release');
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/whistleblower-messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchWhistleblowerMessages();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rejected': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'comms': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'journalist': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.orgName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced Analytics Dashboard Component
  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Users', 
            value: analyticsData.totalUsers.toLocaleString(), 
            change: analyticsData.userGrowth,
            icon: FaUsers, 
            color: 'purple',
            trend: 'up'
          },
          { 
            label: 'Daily Active', 
            value: analyticsData.dailyActiveUsers.toLocaleString(), 
            change: 12.5,
            icon: FaChartLine, 
            color: 'blue',
            trend: 'up'
          },
          { 
            label: 'Press Releases', 
            value: analyticsData.totalReleases.toLocaleString(), 
            change: analyticsData.releaseGrowth,
            icon: FaFileAlt, 
            color: 'green',
            trend: 'up'
          },
          { 
            label: 'Engagement Rate', 
            value: `${analyticsData.engagementRate}%`, 
            change: 5.2,
            icon: FaHeart, 
            color: 'pink',
            trend: 'up'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className={`flex items-center mt-1 text-xs ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  <span className="ml-1">{Math.abs(stat.change)}%</span>
                  <span className="text-gray-500 ml-1">from last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Active Journalists', 
            value: analyticsData.activeJournalists.toLocaleString(), 
            change: 8.3,
            icon: FaUserCheck, 
            color: 'cyan' 
          },
          { 
            label: 'Pending Approvals', 
            value: analyticsData.pendingComms.toString(), 
            change: -2.1,
            icon: FaUserClock, 
            color: 'yellow' 
          },
          { 
            label: 'System Health', 
            value: `${analyticsData.systemHealth}%`, 
            change: 0.5,
            icon: FaRocket, 
            color: 'green' 
          },
          { 
            label: 'Avg. Read Time', 
            value: analyticsData.avgReadTime, 
            change: 12.7,
            icon: FaClock, 
            color: 'blue' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 4) * 0.1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className={`flex items-center mt-1 text-xs ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  <span className="ml-1">{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <FaChartPie className="mr-2 text-purple-400" />
              Top Categories Distribution
            </h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FaDownload size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topCategories.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all group">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-300 font-medium">{category.name}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-3 mx-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${(category.count / Math.max(...analyticsData.topCategories.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">{category.count}</span>
                  <div className="text-green-400 text-xs flex items-center space-x-1">
                    <FaArrowUp size={8} />
                    <span>+{Math.floor(Math.random() * 20) + 5}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <FaChartBar className="mr-2 text-blue-400" />
              Traffic Sources
            </h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FaFilter size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between group hover:bg-gray-700/30 p-2 rounded-lg transition-all">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-purple-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-gray-300 font-medium">{source.source}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2 mx-4">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-white font-semibold bg-gray-700/50 px-2 py-1 rounded-lg min-w-12 text-center">
                  {source.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Demographics & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Demographics */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-400" />
              User Demographics
            </h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FaDownload size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {analyticsData.userDemographics.slice(0, 5).map((demo, index) => (
              <div key={demo._id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-300 font-medium">{demo._id || 'Unknown'}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">{demo.users} users</span>
                  <div className="text-blue-400 text-xs">
                    {Math.round((demo.users / analyticsData.totalUsers) * 100)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <FaRocket className="mr-2 text-orange-400" />
              Top Performing Content
            </h3>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25">
              <FaDownload className="text-sm" />
              <span>Export</span>
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topPerformingReleases.slice(0, 3).map((release, index) => (
              <div key={release._id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors truncate">
                      {release.headline}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FaViews size={12} />
                        <span>{(release.views || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaHeart size={12} />
                        <span>{(release.likes || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaShare size={12} />
                        <span>{(release.shares || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{release.readTime}</div>
                  <div className="text-green-400 text-sm flex items-center justify-end space-x-1">
                    <FaArrowUp size={10} />
                    <span>+{Math.floor(Math.random() * 50) + 20}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Bulk Upload Section
  const UploadsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bulk Upload Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105 cursor-pointer"
          onClick={() => setIsBulkUserUploadOpen(true)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300 mb-4">
              <FaUsers size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bulk Upload Users</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Upload CSV files to add multiple comms professionals, journalists, or administrators at scale
            </p>
            <div className="flex items-center space-x-2 text-purple-400 text-sm">
              <FaFileCsv />
              <span>CSV Format Supported</span>
            </div>
          </div>
        </motion.div>

        {/* Bulk Upload Press Releases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group hover:scale-105 cursor-pointer"
          onClick={() => setIsBulkReleaseUploadOpen(true)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300 mb-4">
              <FaFileAlt size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bulk Upload Press Releases</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Import multiple press releases with images, categories, and metadata in one operation
            </p>
            <div className="flex items-center space-x-2 text-blue-400 text-sm">
              <FaImage />
              <span>Supports Images & Files</span>
            </div>
          </div>
        </motion.div>

        {/* Bulk Upload Audio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group hover:scale-105 cursor-pointer"
          onClick={() => setIsBulkAudioUploadOpen(true)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform duration-300 mb-4">
              <FaMusic size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bulk Upload Audio</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Upload multiple audio files, podcasts, or voice notes for press releases and multimedia content
            </p>
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <FaMicrophone />
              <span>Audio Files Supported</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upload Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users Uploaded</p>
              <p className="text-2xl font-bold text-white">1,247</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
              <FaUsers size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Press Releases Uploaded</p>
              <p className="text-2xl font-bold text-white">892</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <FaFileAlt size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Audio Files Uploaded</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
              <FaMusic size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Press Releases Tab
  const PressReleasesTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Press Releases Management</h3>
            <p className="text-gray-400 text-sm">Manage all press releases across the platform</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search releases..."
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              onClick={() => setIsBulkReleaseUploadOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25"
            >
              <FaUpload className="text-sm" />
              <span>Bulk Upload</span>
            </button>
          </div>
        </div>
        
        {/* Enhanced Releases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReleases.slice(0, 6).map((release) => (
            <motion.div
              key={release._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  release.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                  release.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {release.status}
                </span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-blue-400 hover:text-blue-300">
                    <FaEye size={12} />
                  </button>
                  <button 
                    onClick={() => handleDeleteRelease(release._id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              
              <h4 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {release.headline}
              </h4>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {release.summary}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {release.categories?.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {release.categories && release.categories.length > 2 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                    +{release.categories.length - 2}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(release.publicationDate).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <span>{release.views || 0} views</span>
                  <span>{release.likes || 0} likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {allReleases.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FaFileAlt className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg">No press releases found</p>
            <p className="text-sm mt-2">Get started by uploading your first press release</p>
            <button
              onClick={() => setIsBulkReleaseUploadOpen(true)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all mx-auto"
            >
              <FaUpload className="text-sm" />
              <span>Upload Press Releases</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced Whistleblower Tab
  const WhistleblowerTab = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reports', value: analyticsData.totalReports, icon: FaFlag, color: 'red' },
          { label: 'Pending Review', value: analyticsData.pendingReports, icon: FaExclamationTriangle, color: 'yellow' },
          { label: 'Total Comments', value: analyticsData.totalComments, icon: FaCommentDots, color: 'blue' },
          { label: 'Critical Issues', value: whistleblowerMessages.filter(m => m.severity === 'critical').length, icon: FaUserShield, color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all group"
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

      {/* Messages Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Whistleblower Messages & Reports</h3>
          <div className="flex space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25">
              <FaFilter className="text-sm" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50 rounded-xl">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Type</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Content</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Author</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Severity</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Date</th>
                <th className="text-left p-4 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {whistleblowerMessages.map((message) => (
                <tr key={message._id} className="hover:bg-gray-700/30 transition-all">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {message.type === 'comment' ? (
                        <FaComment className="text-blue-400" />
                      ) : (
                        <FaEnvelope className="text-green-400" />
                      )}
                      <span className="text-gray-300 capitalize text-sm font-medium">{message.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p className="text-white text-sm line-clamp-2">{message.content}</p>
                      {message.relatedPost && (
                        <p className="text-gray-400 text-xs mt-1 truncate">Related to: {message.relatedPost.title}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white text-sm font-medium">{message.author.name}</p>
                      <p className="text-gray-400 text-xs">{message.author.email}</p>
                      {message.author.ip && (
                        <p className="text-gray-500 text-xs">IP: {message.author.ip}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getSeverityColor(message.severity)}`}>
                      {message.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getMessageStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(message.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateMessageStatus(message._id, 'reviewed')}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                        title="Mark as Reviewed"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(message._id, 'resolved')}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                        title="Mark as Resolved"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(message._id, 'flagged')}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                        title="Flag for Follow-up"
                      >
                        <FaFlag size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {whistleblowerMessages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FaComment className="text-4xl mx-auto mb-4 opacity-50" />
              <p className="text-lg">No whistleblower messages found</p>
              <p className="text-sm mt-2">All reports and comments are currently managed and up to date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'releases', label: 'Press Releases', icon: FaFileAlt },
    { id: 'uploads', label: 'Bulk Uploads', icon: FaUpload },
    { id: 'analytics', label: 'Analytics', icon: FaGlobe },
    { id: 'whistleblower', label: 'Whistleblower', icon: FaExclamationTriangle },
    { id: 'settings', label: 'System Settings', icon: FaCog }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 font-sans">
      {/* Enhanced Responsive Sidebar */}
      <aside className={`bg-gray-800/90 backdrop-blur-lg border-r border-gray-700/50 flex flex-col transition-all duration-300 shrink-0 fixed md:relative z-50 h-full ${
        isSidebarCollapsed ? 'w-16 md:w-20' : 'w-64'
      }`}>
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between h-16">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Admin Portal
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all hidden md:block"
          >
            {isSidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center w-full p-3 rounded-xl text-sm transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border hover:border-gray-600/50'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={isSidebarCollapsed ? '' : 'mr-3'} size={isSidebarCollapsed ? 18 : 16} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-700/50">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className={`flex items-center w-full p-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaSignOutAlt className={isSidebarCollapsed ? '' : 'mr-3'} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content with improved responsiveness */}
      <main className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16 md:ml-20' : 'ml-64 md:ml-0'
      } w-full`}>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaChild className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Administrator Portal</h1>
                  <p className="text-purple-400 text-sm">Global System Administration</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 text-sm">{user?.email}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Super Admin
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25">
                  <FaBell className="text-sm" />
                  <span className="hidden sm:inline">System Alerts</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: analyticsData.totalUsers.toLocaleString(), icon: FaUsers, color: 'purple' },
                  { label: 'Pending Approvals', value: analyticsData.pendingComms.toString(), icon: FaUserClock, color: 'yellow' },
                  { label: 'Press Releases', value: analyticsData.totalReleases.toLocaleString(), icon: FaFileAlt, color: 'blue' },
                  { label: 'System Health', value: `${analyticsData.systemHealth}%`, icon: FaChartBar, color: 'green' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all group"
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

              {/* Quick Actions & Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Pending Comms Approvals</h3>
                    <span className="text-sm text-gray-400">{pendingUsers.length} pending</span>
                  </div>
                  <div className="space-y-4">
                    {pendingUsers.map((pendingUser) => (
                      <div key={pendingUser._id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                              <FaUserClock className="text-yellow-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{pendingUser.fullName}</h4>
                              <p className="text-gray-400 text-sm">{pendingUser.email}</p>
                              <p className="text-gray-400 text-sm">{pendingUser.position} at {pendingUser.orgName}</p>
                              <p className="text-gray-500 text-xs">Applied: {new Date(pendingUser.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(pendingUser._id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(pendingUser._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <FaUserCheck className="text-3xl mx-auto mb-2" />
                        <p>No pending approvals</p>
                        <p className="text-sm">All comms professionals are approved</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Bulk Upload Users', icon: FaUpload, action: () => setIsBulkUserUploadOpen(true) },
                      { label: 'Bulk Upload Releases', icon: FaFileAlt, action: () => setIsBulkReleaseUploadOpen(true) },
                      { label: 'Bulk Upload Audio', icon: FaMusic, action: () => setIsBulkAudioUploadOpen(true) },
                      { label: 'System Analytics', icon: FaChartBar, action: () => setActiveTab('analytics') },
                      { label: 'User Management', icon: FaUsers, action: () => setActiveTab('users') },
                      { label: 'Content Management', icon: FaFileAlt, action: () => setActiveTab('releases') }
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={action.action}
                        className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all text-left"
                      >
                        <action.icon className="text-purple-400" />
                        <span className="text-sm">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">User Management</h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setIsBulkUserUploadOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/25"
                  >
                    <FaUpload className="text-sm" />
                    <span>Bulk Upload</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700/50 rounded-xl">
                    <tr>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">User</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Role</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Organization</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Joined</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-700/30 transition-all">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{user.fullName}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                            {user.phoneNumber && (
                              <p className="text-gray-500 text-xs">{user.phoneNumber}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {user.orgName || user.publication || 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {/* Implement edit */}}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors hover:bg-gray-700/50 rounded-lg"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
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
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FaUsers className="text-3xl mx-auto mb-2" />
                    <p>No users found</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'releases' && <PressReleasesTab />}

          {activeTab === 'uploads' && <UploadsTab />}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'whistleblower' && <WhistleblowerTab />}

          {activeTab === 'settings' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">System Name</label>
                  <input
                    type="text"
                    defaultValue="PR Portal"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">System Description</label>
                  <textarea
                    defaultValue="Professional Press Release Management System"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700/50">
                <button className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/80 transition-all border border-gray-600">
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Bulk Upload Modals */}
      <BulkUserUpload
        isOpen={isBulkUserUploadOpen}
        onClose={() => setIsBulkUserUploadOpen(false)}
        onUpload={handleBulkUserUpload}
      />

      <BulkReleaseUpload
        isOpen={isBulkReleaseUploadOpen}
        onClose={() => setIsBulkReleaseUploadOpen(false)}
        onUpload={handleBulkReleaseUpload}
      />

      <BulkAudioUpload
        isOpen={isBulkAudioUploadOpen}
        onClose={() => setIsBulkAudioUploadOpen(false)}
        onUpload={handleBulkAudioUpload}
      />
    </div>
  );
};

export default AdminDashboard;