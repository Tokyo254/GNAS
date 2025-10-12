import { useState, useEffect } from 'react';
import { useAuth, type User } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaFileImage,
} from 'react-icons/fa';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import PressReleaseForm from './NewReleaseModal';
import PressReleasePreview from './PressReleasePreview';
import CategorySelector from '../../components/categories';

const API_URL = 'http://localhost:5000';

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

interface PressReleaseFormData {
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  categories: string;
  attachments: File[];
  featuredImage?: File;
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
}

interface AnalyticsData {
  totalViews: number;
  mediaPickups: number;
  engagementRate: number;
  topPerforming: number;
  viewsOverTime: { month: string; views: number }[];
  engagementBreakdown: { platform: string; percentage: number }[];
}

// Extend the User interface to include categories
interface JournalistUser extends User {
  categories?: string[];
}

const JournalistDashboard: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Cast the user to our extended interface
  const user = authUser as JournalistUser;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(
    window.innerWidth < 768
  );
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'myReleases' | 'analytics' | 'settings'
  >('myReleases');
  const [isPressReleaseFormOpen, setIsPressReleaseFormOpen] = useState<boolean>(false);
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(null);
  const [previewRelease, setPreviewRelease] = useState<PressRelease | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [analyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    mediaPickups: 0,
    engagementRate: 0,
    topPerforming: 0,
    viewsOverTime: [],
    engagementBreakdown: []
  });
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    console.log('JournalistDashboard - User state:', user);
    
    // If user is undefined, we're still loading auth state
    if (user === undefined) {
      return;
    }
    
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'journalist') {
      console.log('User role is not journalist, redirecting to unauthorized');
      navigate('/unauthorized');
      return;
    }

    const fetchPressReleases = async () => {
      try {
        console.log('Fetching press releases...');
        const response = await fetch(`${API_URL}/api/journalist/press-releases`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Press releases response:', data);
        
        if (data.success) {
          // Handle different possible response structures
          let releasesData = data.data;
          
          // If data.data is an object with pressReleases property
          if (data.data && data.data.pressReleases && Array.isArray(data.data.pressReleases)) {
            releasesData = data.data.pressReleases;
          }
          // If data.data is directly the array
          else if (Array.isArray(data.data)) {
            releasesData = data.data;
          }
          // If data is directly the array (some APIs return this way)
          else if (Array.isArray(data)) {
            releasesData = data;
          }
          // Default to empty array if structure is unexpected
          else {
            console.warn('Unexpected API response structure:', data);
            releasesData = [];
          }
          
          console.log('Processed press releases:', releasesData);
          setPressReleases(releasesData);
        } else {
          console.error('API returned error:', data.message);
          setPressReleases([]); // Set empty array on error
        }
      } catch (error) {
        console.error('Error fetching press releases:', error);
        setPressReleases([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPressReleases();
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsSidebarCollapsed(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewPressRelease = async (formData: PressReleaseFormData) => {
    try {
      const form = new FormData();
      form.append('headline', formData.headline);
      form.append('summary', formData.summary);
      form.append('fullContent', formData.fullContent);
      form.append('author', formData.author);
      
      // Convert categories from comma-separated string to JSON array
      const categoriesArray = formData.categories
        .split(',')
        .map(category => category.trim())
        .filter(category => category !== '');
      form.append('categories', JSON.stringify(categoriesArray));
      
      form.append('publicationDate', formData.publicationDate);
      form.append('status', formData.status);
      
      if (formData.featuredImage) {
        form.append('featuredImage', formData.featuredImage);
      }
      
      formData.attachments.forEach(file => form.append('attachments', file));

      const url = editingRelease
        ? `${API_URL}/api/journalist/press-releases/${editingRelease._id}`
        : `${API_URL}/api/journalist/press-releases`;

      const response = await fetch(url, {
        method: editingRelease ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: form
      });

      const data = await response.json();
      if (data.success) {
        // Handle different response structures for the new/updated release
        const newRelease = data.data || data;
        setPressReleases(prev => editingRelease
          ? prev.map(r => r._id === editingRelease._id ? newRelease : r)
          : [newRelease, ...prev]);
        handleCloseForm();
      } else {
        console.error('Error saving press release:', data.message);
        alert('Error saving press release: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving press release:', error);
      alert('Error saving press release. Please try again.');
    }
  };

  const handleEditPressRelease = (release: PressRelease) => {
    setEditingRelease(release);
    setIsPressReleaseFormOpen(true);
  };

  const handleDeletePressRelease = async (releaseId: string) => {
    if (window.confirm('Are you sure you want to delete this press release?')) {
      try {
        const response = await fetch(`${API_URL}/api/journalist/press-releases/${releaseId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.success) {
          setPressReleases(prev => prev.filter(r => r._id !== releaseId));
        }
      } catch (error) {
        console.error('Error deleting press release:', error);
      }
    }
  };

  const handlePreviewPressRelease = (release: PressRelease) => {
    setPreviewRelease(release);
  };

  const handleClosePreview = () => {
    setPreviewRelease(null);
  };

  const handleCloseForm = () => {
    setIsPressReleaseFormOpen(false);
    setEditingRelease(null);
  };

  const handleProfileUpdate = async (updatedProfile: Partial<JournalistUser>) => {
    try {
      const response = await fetch(`${API_URL}/api/journalist/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedProfile)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify({ ...user, ...updatedProfile }));
        // You might want to update the auth context here as well
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageError = (releaseId: string) => {
    setImageErrors(prev => ({ ...prev, [releaseId]: true }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-500/20 text-green-400';
      case 'Under Review': return 'bg-yellow-500/20 text-yellow-400';
      case 'Draft': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Safe rendering of press releases
  const renderPressReleases = () => {
    if (!pressReleases || !Array.isArray(pressReleases)) {
      return (
        <div className="text-center py-8">
          <FaFileAlt className="text-3xl text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No press releases available.</p>
        </div>
      );
    }

    if (pressReleases.length === 0) {
      return (
        <div className="text-center py-8">
          <FaFileAlt className="text-3xl text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No press releases yet.</p>
          <button
            onClick={() => setIsPressReleaseFormOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 text-sm mt-2"
          >
            Create your first press release
          </button>
        </div>
      );
    }

    return pressReleases.map((release) => (
      <tr key={release._id} className="hover:bg-gray-800/30">
        <td className="p-3">
          <div>
            <p className="text-white text-sm font-medium">{release.headline}</p>
            <p className="text-gray-400 text-xs italic">{release.summary}</p>
            {release.featuredImage && !imageErrors[release._id] ? (
              <div className="mt-2 w-16 h-10 bg-gray-700 rounded overflow-hidden">
                <img 
                  src={`${API_URL}${release.featuredImage}`} 
                  alt={`Featured image for ${release.headline}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(release._id)}
                />
              </div>
            ) : (
              <div className="mt-2 w-16 h-10 bg-gray-800 rounded flex items-center justify-center">
                <FaFileImage className="text-gray-500 text-xs" />
              </div>
            )}
          </div>
        </td>
        <td className="p-3">
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(release.status)}`}>
            {release.status}
          </span>
        </td>
        <td className="p-3">
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {release.categories?.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {release.categories && release.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                +{release.categories.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="p-3 text-gray-400 text-xs">
          {new Date(release.publicationDate).toLocaleDateString()}
        </td>
        <td className="p-3">
          <div className="flex gap-1">
            <button
              onClick={() => handleEditPressRelease(release)}
              className="p-1 text-cyan-400 hover:text-cyan-300"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeletePressRelease(release._id)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Delete"
            >
              <FaTrash />
            </button>
            <button
              onClick={() => handlePreviewPressRelease(release)}
              className="p-1 text-gray-400 hover:text-white"
              title="Preview"
            >
              <FaEye />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Show loading spinner while checking authentication
  if (user === undefined || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading journalist dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no user after loading
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-red-400">Error loading user data. Please try logging in again.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-gray-300 font-sans">
      {/* Sidebar */}
      <aside className={`bg-[#161B22] border-r border-gray-800 flex flex-col transition-all duration-300 shrink-0 fixed md:static z-50 h-full ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } md:w-64`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold text-cyan-400">PR Portal</span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-400 hover:text-white p-1 rounded-md md:hidden"
          >
            {isSidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>
        </div>
        <nav className="flex-grow p-2 space-y-1">
          <button
            onClick={() => setActiveTab('myReleases')}
            className={`flex items-center w-full p-3 rounded-lg text-sm transition-colors ${
              activeTab === 'myReleases' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaFileAlt className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
            {!isSidebarCollapsed && <span>My Releases</span>}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full p-3 rounded-lg text-sm transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaChartBar className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
            {!isSidebarCollapsed && <span>Analytics</span>}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 rounded-lg text-sm transition-colors ${
              activeTab === 'settings' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaCog className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
            {!isSidebarCollapsed && <span>Settings</span>}
          </button>
        </nav>
        <div className="p-2 border-t border-gray-800">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full p-3 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <FaSignOutAlt className={isSidebarCollapsed ? 'mx-auto' : 'mr-3'} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto space-y-4">
          {activeTab === 'myReleases' && (
            <div className="bg-[#161B22] rounded-lg p-4 ring-1 ring-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
                  <p className="text-gray-400 text-sm">{user.position} at {user.publication || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-1 w-full sm:w-auto"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          )}

          <div className="bg-[#161B22] rounded-lg p-4 ring-1 ring-white/10">
            {activeTab === 'myReleases' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">My Press Releases</h3>
                  <button
                    onClick={() => setIsPressReleaseFormOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-1"
                  >
                    <FaPlus /> New Release
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="text-left p-3 text-xs">Headline</th>
                        <th className="text-left p-3 text-xs">Status</th>
                        <th className="text-left p-3 text-xs">Categories</th>
                        <th className="text-left p-3 text-xs">Date</th>
                        <th className="text-left p-3 text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {renderPressReleases()}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded-full"><FaEye /></div>
                    <div>
                      <p className="text-xs text-gray-400">Total Views</p>
                      <p className="text-lg font-bold text-white">{analyticsData.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded-full"><FaFileAlt /></div>
                    <div>
                      <p className="text-xs text-gray-400">Media Pickups</p>
                      <p className="text-lg font-bold text-white">{analyticsData.mediaPickups}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user.fullName}
                      disabled
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={user.phoneNumber || ''}
                      onChange={(e) => handleProfileUpdate({ phoneNumber: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Publication</label>
                    <input
                      type="text"
                      value={user.publication || ''}
                      onChange={(e) => handleProfileUpdate({ publication: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Bio</label>
                    <textarea
                      value={user.bio || ''}
                      onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-cyan-500 resize-y"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <CategorySelector
                      selectedCategories={user.categories || []}
                      onCategoriesChange={(categories) => handleProfileUpdate({ categories })}
                      maxSelection={8}
                      label="Your Preferred Categories"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select categories you're interested in to personalize your feed
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setActiveTab('myReleases')}
                    className="px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleProfileUpdate({
                      phoneNumber: user.phoneNumber,
                      bio: user.bio,
                      categories: user.categories
                    })}
                    className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {isPressReleaseFormOpen && (
        <PressReleaseForm
          isOpen={isPressReleaseFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleNewPressRelease}
          initialData={
            editingRelease
              ? {
                  headline: editingRelease.headline,
                  summary: editingRelease.summary,
                  fullContent: editingRelease.fullContent,
                  author: editingRelease.author,
                  categories: editingRelease.categories.join(', '),
                  publicationDate: editingRelease.publicationDate,
                  status: editingRelease.status
                }
              : { author: user.fullName }
          }
          mode={editingRelease ? 'edit' : 'create'}
          user={user}
        />
      )}

      {previewRelease && (
        <PressReleasePreview
          release={previewRelease}
          isOpen={!!previewRelease}
          onClose={handleClosePreview}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="w-80 h-96 mb-4 rounded-lg overflow-hidden shadow-lg bg-[#161B22]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              {/* Placeholder for ChatPanel */}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-cyan-500 text-white rounded-full p-3 shadow-lg hover:bg-cyan-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isChatOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
        </motion.button>
      </div>
    </div>
  );
};

export default JournalistDashboard;