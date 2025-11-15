// BlogListPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiLayout, 
  FiClock, 
  FiEye, 
  FiShare2,
  FiHeart,
  FiUser,
  FiCalendar,
  FiChevronDown,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../utils/api';
import Header from '../../components/header'; // Updated import path
import Footer from '../../components/footer'; // Updated import path
import InteractiveNebula from '../../components/Nebula';

// Interfaces
interface BlogPost {
  _id: string;
  headline: string;
  summary: string;
  fullContent: string;
  authorDetails: {
    _id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
    verified: boolean;
  };
  publicationDate: string;
  readTime: string;
  categories: string[];
  tags: string[];
  featuredImage?: {
    url: string;
    altText?: string;
    caption?: string;
  };
  views: number;
  likes: string[];
  likesCount: number;
  shares: number;
  slug: string;
  type?: 'article' | 'press-release';
  status: 'published' | 'draft';
}

interface FilterState {
  categories: string[];
  contentTypes: string[];
  dateRange: string;
  tags: string[];
  searchQuery: string;
}

type ViewMode = 'grid' | 'list' | 'magazine';
type SortOption = 'newest' | 'popular' | 'trending' | 'alphabetical';

// Filter Options
const filterOptions = {
  categories: ['Technology', 'AI', 'Digital PR', 'Crisis Management', 'Content Strategy', 'Social Media', 'Analytics', 'Thought Leadership', 'Integrated Marketing', 'International PR'],
  contentTypes: ['Article', 'Press Release', 'Audio', 'Radio'],
  dateRanges: ['All Time', 'Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'],
  tags: ['artificial intelligence', 'machine learning', 'media relations', 'crisis communication', 'content creation', 'social media', 'analytics', 'thought leadership']
};

// Sort Options
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'alphabetical', label: 'A-Z' }
];

// Blog Card Components for Different Views
const GridBlogCard: React.FC<{ post: BlogPost; onReadMore: (id: string) => void }> = ({ post, onReadMore }) => (
  <motion.div
    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
    onClick={() => onReadMore(post._id)}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
        alt={post.headline}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      {/* Content Type Badge */}
      <div className="absolute top-3 left-3 flex gap-2">
        {post.type === 'press-release' && (
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
            Press Release
          </span>
        )}
        {post.tags.includes('audio') && (
          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
            Audio
          </span>
        )}
      </div>
    </div>

    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.categories.slice(0, 2).map(category => (
          <span key={category} className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
        {post.headline}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiUser className="text-cyan-400" size={14} />
            <span>{post.authorDetails.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="text-cyan-400" size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <FiEye size={14} />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiHeart size={14} />
            <span>{post.likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ListBlogCard: React.FC<{ post: BlogPost; onReadMore: (id: string) => void }> = ({ post, onReadMore }) => (
  <motion.div
    className="group flex gap-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
    whileHover={{ x: 4, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
    onClick={() => onReadMore(post._id)}
  >
    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
      <img
        src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
        alt={post.headline}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-2 mb-2">
        {post.categories.slice(0, 1).map(category => (
          <span key={category} className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        ))}
        {post.type === 'press-release' && (
          <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-1 rounded-full">
            Press Release
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
        {post.headline}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiUser className="text-cyan-400" size={14} />
            <span>{post.authorDetails.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-cyan-400" size={14} />
            <span>{new Date(post.publicationDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="text-cyan-400" size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiEye size={14} />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiHeart size={14} />
            <span>{post.likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiShare2 size={14} />
            <span>{post.shares}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const MagazineBlogCard: React.FC<{ post: BlogPost; onReadMore: (id: string) => void; featured?: boolean }> = ({ 
  post, 
  onReadMore, 
  featured = false 
}) => (
  <motion.div
    className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer ${
      featured ? 'md:col-span-2' : ''
    }`}
    whileHover={{ y: -4, boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)" }}
    onClick={() => onReadMore(post._id)}
  >
    <div className={`relative ${featured ? 'h-80' : 'h-56'} overflow-hidden`}>
      <img
        src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
        alt={post.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      <div className="absolute top-4 left-4 flex gap-2">
        {post.categories.slice(0, 1).map(category => (
          <span key={category} className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/30">
            {category}
          </span>
        ))}
        {post.type === 'press-release' && (
          <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
            Press Release
          </span>
        )}
      </div>
    </div>

    <div className="p-6">
      <h3 className={`text-white font-bold mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors ${
        featured ? 'text-2xl' : 'text-xl'
      }`}>
        {post.headline}
      </h3>

      <p className="text-gray-400 mb-4 line-clamp-2">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiUser className="text-cyan-400" size={14} />
            <span>{post.authorDetails.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="text-cyan-400" size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <FiEye size={14} />
            <span>{post.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiHeart size={14} />
            <span>{post.likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Filter Content Component
const FilterContent: React.FC<{
  localFilters: FilterState;
  onApply: () => void;
  onClear: () => void;
  toggleCategory: (category: string) => void;
  toggleContentType: (type: string) => void;
  toggleTag: (tag: string) => void;
  setLocalFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}> = ({ localFilters, onApply, onClear, toggleCategory, toggleContentType, toggleTag, setLocalFilters }) => (
  <div className="space-y-6">
    {/* Search */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search articles..."
          value={localFilters.searchQuery}
          onChange={(e) => setLocalFilters((prev: FilterState) => ({ ...prev, searchQuery: e.target.value }))}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>

    {/* Categories */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
      <div className="space-y-2">
        {filterOptions.categories.map(category => (
          <label key={category} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={localFilters.categories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">{category}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Content Types */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
      <div className="space-y-2">
        {filterOptions.contentTypes.map(type => (
          <label key={type} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={localFilters.contentTypes.includes(type)}
              onChange={() => toggleContentType(type)}
              className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">{type}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Date Range */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
      <select
        value={localFilters.dateRange}
        onChange={(e) => setLocalFilters((prev: FilterState) => ({ ...prev, dateRange: e.target.value }))}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
      >
        {filterOptions.dateRanges.map(range => (
          <option key={range} value={range}>{range}</option>
        ))}
      </select>
    </div>

    {/* Popular Tags */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Popular Tags</label>
      <div className="flex flex-wrap gap-2">
        {filterOptions.tags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              localFilters.tags.includes(tag)
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 pt-4">
      <button
        onClick={onClear}
        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onApply}
        className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
      >
        Apply
      </button>
    </div>
  </div>
);

// Filter Section Component
const FilterSection: React.FC<{
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
}> = ({ filters, onFiltersChange, isFilterOpen, onToggleFilter }) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onToggleFilter();
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      contentTypes: [],
      dateRange: 'All Time',
      tags: [],
      searchQuery: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleCategory = (category: string) => {
    setLocalFilters((prev: FilterState) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleContentType = (type: string) => {
    setLocalFilters((prev: FilterState) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const toggleTag = (tag: string) => {
    setLocalFilters((prev: FilterState) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={onToggleFilter}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <FiFilter size={18} />
        <span>Filters</span>
        {(filters.categories.length > 0 || filters.contentTypes.length > 0 || filters.tags.length > 0) && (
          <span className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filters.categories.length + filters.contentTypes.length + filters.tags.length}
          </span>
        )}
      </button>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onToggleFilter}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 p-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button onClick={onToggleFilter} className="text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>
              <FilterContent
                localFilters={localFilters}
                onApply={applyFilters}
                onClear={clearFilters}
                toggleCategory={toggleCategory}
                toggleContentType={toggleContentType}
                toggleTag={toggleTag}
                setLocalFilters={setLocalFilters}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <FilterContent
          localFilters={localFilters}
          onApply={applyFilters}
          onClear={clearFilters}
          toggleCategory={toggleCategory}
          toggleContentType={toggleContentType}
          toggleTag={toggleTag}
          setLocalFilters={setLocalFilters}
        />
      </div>
    </>
  );
};

// Main Blog List Page Component
const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    contentTypes: [],
    dateRange: 'All Time',
    tags: [],
    searchQuery: ''
  });

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response: any;
        
        // Try getAllPosts first, fallback to getHeroPosts if it doesn't exist
        if (blogService.getAllPosts) {
          response = await blogService.getAllPosts();
        } else {
          console.warn('getAllPosts not available, using getHeroPosts instead');
          response = await blogService.getHeroPosts();
        }
        
        if (response.success && response.data) {
          const transformedPosts: BlogPost[] = response.data.map((post: any) => ({
            ...post,
            authorDetails: {
              _id: post.authorDetails?._id || 'unknown',
              name: post.authorDetails?.name || 'Unknown Author',
              title: post.authorDetails?.title || '',
              company: post.authorDetails?.company || '',
              avatar: post.authorDetails?.avatar || '',
              verified: post.authorDetails?.verified || false
            },
            categories: post.categories || [],
            tags: post.tags || [],
            likes: post.likes || [],
            views: post.views || 0,
            likesCount: post.likesCount || post.likes?.length || 0,
            shares: post.shares || 0,
            status: post.status || 'published'
          }));
          
          setBlogPosts(transformedPosts);
        } else {
          setError(response.message || 'Failed to load blog posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      // Search query filter
      if (filters.searchQuery && !post.headline.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !post.summary.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.some(cat => post.categories.includes(cat))) {
        return false;
      }

      // Content type filter
      if (filters.contentTypes.length > 0) {
        if (filters.contentTypes.includes('Press Release') && post.type !== 'press-release') return false;
        if (filters.contentTypes.includes('Audio') && !post.tags.includes('audio')) return false;
        if (filters.contentTypes.includes('Radio') && !post.tags.includes('radio')) return false;
        if (filters.contentTypes.includes('Article') && post.type !== 'press-release' && 
            !post.tags.includes('audio') && !post.tags.includes('radio')) return false;
      }

      // Tag filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => post.tags.includes(tag))) {
        return false;
      }

      // Date range filter
      const postDate = new Date(post.publicationDate);
      const now = new Date();
      switch (filters.dateRange) {
        case 'Last 24 Hours':
          return (now.getTime() - postDate.getTime()) <= 24 * 60 * 60 * 1000;
        case 'Last Week':
          return (now.getTime() - postDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'Last Month':
          return (now.getTime() - postDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case 'Last Year':
          return (now.getTime() - postDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return (b.views + b.likesCount * 10 + b.shares * 5) - (a.views + a.likesCount * 10 + a.shares * 5);
        case 'alphabetical':
          return a.headline.localeCompare(b.headline);
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogPosts, filters, sortBy]);

  const handleReadMore = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const activeFilterCount = filters.categories.length + filters.contentTypes.length + filters.tags.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-red-400 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Failed to Load Content</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Component */}
      <Header />
      
      {/* Main Content with Nebula Background */}
      <main className="relative pt-24 pb-16 min-h-screen">
        {/* Nebula Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <InteractiveNebula />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              All Content
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover our complete collection of articles, press releases, audio content, and radio shows
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <FilterSection
              filters={filters}
              onFiltersChange={setFilters}
              isFilterOpen={isFilterOpen}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    {[
                      { mode: 'grid' as ViewMode, icon: FiGrid, label: 'Grid' },
                      { mode: 'list' as ViewMode, icon: FiList, label: 'List' },
                      { mode: 'magazine' as ViewMode, icon: FiLayout, label: 'Magazine' }
                    ].map(({ mode, icon: Icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === mode
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                        aria-label={`Switch to ${label} view`}
                      >
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-gray-400 text-sm">
                  Showing {filteredAndSortedPosts.length} of {blogPosts.length} articles
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-cyan-400">
                      ({activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Content Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${sortBy}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
                    ${viewMode === 'list' ? 'space-y-6' : ''}
                    ${viewMode === 'magazine' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}
                  `}
                >
                  {filteredAndSortedPosts.length > 0 ? (
                    filteredAndSortedPosts.map((post, index) => {
                      if (viewMode === 'grid') {
                        return <GridBlogCard key={post._id} post={post} onReadMore={handleReadMore} />;
                      } else if (viewMode === 'list') {
                        return <ListBlogCard key={post._id} post={post} onReadMore={handleReadMore} />;
                      } else if (viewMode === 'magazine') {
                        return (
                          <MagazineBlogCard
                            key={post._id}
                            post={post}
                            onReadMore={handleReadMore}
                            featured={index === 0} // First post is featured
                          />
                        );
                      }
                      return null;
                    })
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiSearch className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                      <p className="text-gray-400 mb-6">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                      <button
                        onClick={() => setFilters({
                          categories: [],
                          contentTypes: [],
                          dateRange: 'All Time',
                          tags: [],
                          searchQuery: ''
                        })}
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Load More Button (for future pagination) */}
              {filteredAndSortedPosts.length > 0 && (
                <div className="text-center mt-12">
                  <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default BlogListPage;