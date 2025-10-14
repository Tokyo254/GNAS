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
  FaChild
} from 'react-icons/fa';
import BulkUserUpload from '../../components/BulkUserUpload';
import BulkReleaseUpload from '../../components/BulkReleaseUpload';

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
  author: string;
  status: 'Published' | 'Under Review' | 'Draft';
  publicationDate: string;
  categories: string[];
  featuredImage?: string;
}

interface AnalyticsData {
  totalUsers: number;
  pendingComms: number;
  totalReleases: number;
  activeJournalists: number;
  systemHealth: number;
  totalAdmins: number;
}

const API_URL = 'http://localhost:5000';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'releases' | 'uploads' | 'analytics' | 'settings'>('overview');
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allReleases, setAllReleases] = useState<PressRelease[]>([]);
  const [isBulkUserUploadOpen, setIsBulkUserUploadOpen] = useState<boolean>(false);
  const [isBulkReleaseUploadOpen, setIsBulkReleaseUploadOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    pendingComms: 0,
    totalReleases: 0,
    activeJournalists: 0,
    systemHealth: 100,
    totalAdmins: 0
  });

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
        fetchAnalytics()
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
        fetchAnalytics(); // Refresh analytics
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
        fetchAnalytics(); // Refresh analytics
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
        alert(`Successfully uploaded ${data.data.processed} users`);
        fetchDashboardData(); // Refresh all data
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
        alert(`Successfully uploaded ${data.data.processed} releases`);
        fetchDashboardData(); // Refresh all data
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Upload failed. Please try again.');
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

  const filteredUsers = allUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.orgName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 font-sans">
      {/* Modern Sidebar */}
      <aside className={`bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50 flex flex-col transition-all duration-300 shrink-0 fixed md:static z-50 h-full ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } md:w-64`}>
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between h-16">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Admin Portal
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
            { id: 'users', label: 'User Management', icon: FaUsers },
            { id: 'releases', label: 'Press Releases', icon: FaFileAlt },
            { id: 'uploads', label: 'Bulk Uploads', icon: FaUpload },
            { id: 'analytics', label: 'Analytics', icon: FaGlobe },
            { id: 'settings', label: 'System Settings', icon: FaCog }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center w-full p-3 rounded-xl text-sm transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10' 
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
      <main className="flex-1 p-6 overflow-y-auto ml-0 md:ml-0 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
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
                  <span>System Alerts</span>
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
                    className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all group"
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
                <div className="lg:col-span-2 bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
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

                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Bulk Upload Users', icon: FaUpload, action: () => setIsBulkUserUploadOpen(true) },
                      { label: 'Bulk Upload Releases', icon: FaFileAlt, action: () => setIsBulkReleaseUploadOpen(true) },
                      { label: 'Add Single User', icon: FaUserPlus, action: () => {/* Implement single user add */} },
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

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
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

          {/* Press Releases Tab */}
          {activeTab === 'releases' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">All Press Releases</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsBulkReleaseUploadOpen(true)}
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
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Headline</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Author</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Categories</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Date</th>
                      <th className="text-left p-4 text-xs font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {allReleases.map((release) => (
                      <tr key={release._id} className="hover:bg-gray-700/30 transition-all">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{release.headline}</p>
                            <p className="text-gray-400 text-xs line-clamp-2">{release.summary}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {release.author}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${
                            release.status === 'Published' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            release.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
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
                              onClick={() => {/* Implement preview */}}
                              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700/50 rounded-lg"
                              title="Preview"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRelease(release._id)}
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
                {allReleases.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FaFileAlt className="text-3xl mx-auto mb-2" />
                    <p>No press releases found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Users', value: analyticsData.totalUsers, color: 'purple' },
                  { label: 'Active Journalists', value: analyticsData.activeJournalists, color: 'blue' },
                  { label: 'Pending Comms', value: analyticsData.pendingComms, color: 'yellow' },
                  { label: 'Total Releases', value: analyticsData.totalReleases, color: 'green' },
                  { label: 'Admin Users', value: analyticsData.totalAdmins, color: 'pink' },
                  { label: 'System Health', value: `${analyticsData.systemHealth}%`, color: 'cyan' }
                ].map((stat, _index) => (
                  <div key={stat.label} className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
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
    </div>
  );
};

export default AdminDashboard;