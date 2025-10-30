// pages/BlogPostPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShare2, 
  FiFlag, 
  FiClock,
  FiUser,
  FiCalendar,
  FiArrowLeft,
  FiEye,
  FiMessageCircle
} from 'react-icons/fi';
import { blogService } from '../../utils/api';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import {
  LikeButton,
  BookmarkButton,
  ShareModal,
  ReportModal,
  CommentSection
} from '../../components/Blog';

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
    bio?: string;
  };
  publicationDate: string;
  readTime: string;
  categories: string[];
  tags: string[];
  featuredImage?: {
    url: string;
  };
  attachments: Array<{
    filename: string;
    originalName: string;
    url: string;
    size: number;
  }>;
  views: number;
  likes: string[];
  likesCount: number;
  shares: number;
  engagement: Map<string, number>;
  slug: string;
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, dispatch } = useBlog();
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await blogService.getPost(id);
        
        if (response.success && response.data) {
          setBlogPost(response.data);
        } else {
          setError(response.message || 'Failed to load blog post');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

 const handleLike = async () => {
  if (!blogPost || !user || isLiking) return;

  try {
    setIsLiking(true);
    const response = await blogService.likePost(blogPost._id);

    if (response.success) {
      const { likes, userLiked } = response.data ?? { likes: 0, userLiked: false };

      setBlogPost(prev => prev ? {
        ...prev,
        likesCount: likes,
        likes: userLiked
          ? [...prev.likes, user.id]
          : prev.likes.filter(id => id !== user.id)
      } : null);

      dispatch({ type: 'TOGGLE_LIKE', postId: parseInt(blogPost._id) });
    }
  } catch (error) {
    console.error('Error liking post:', error);
  } finally {
    setIsLiking(false);
  }
};

  // Handle share
  const handleShare = async () => {
    if (!blogPost) return;
    
    try {
      await blogService.sharePost(blogPost._id);
      setShowShareModal(true);
      
      // Update share count optimistically
      setBlogPost(prev => prev ? {
        ...prev,
        shares: prev.shares + 1
      } : null);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Handle bookmark
  const handleBookmark = () => {
    if (!blogPost) return;
    dispatch({ type: 'TOGGLE_BOOKMARK', postId: parseInt(blogPost._id) });
  };

  // Handle report
  const handleReport = async (reason: string, details: string) => {
    if (!blogPost) return;
    
    try {
      const response = await blogService.reportPost(blogPost._id, reason, details);
      
      if (response.success) {
        dispatch({ type: 'REPORT_POST', postId: parseInt(blogPost._id) });
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error; // Re-throw to handle in ReportModal
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFlag className="text-red-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">
            {error || 'The requested blog post could not be found.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userLiked = user ? blogPost.likes.includes(user.id) : false;
  const userBookmarked = state.bookmarkedPosts.includes(parseInt(blogPost._id));
  const userReported = state.reportedPosts.includes(parseInt(blogPost._id));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FiShare2 />
              </button>
              <BookmarkButton
                bookmarked={userBookmarked}
                onBookmark={handleBookmark}
              />
              <button
                onClick={() => setShowReportModal(true)}
                className={`p-2 transition-colors ${
                  userReported 
                    ? 'text-red-500' 
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <FiFlag />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-gray-800/20 rounded-xl p-6 md:p-8 backdrop-blur-sm border border-gray-700/50">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-cyan-400 mb-4">
              {blogPost.categories.map(category => (
                <span 
                  key={category} 
                  className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30"
                >
                  {category}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {blogPost.headline}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {blogPost.summary}
            </p>

            {/* Featured Image */}
            {blogPost.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden border border-gray-600/50">
                <img
                  src={blogPost.featuredImage.url}
                  alt={blogPost.headline}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={blogPost.authorDetails.avatar}
                  alt={blogPost.authorDetails.name}
                  className="w-12 h-12 rounded-full border-2 border-cyan-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {blogPost.authorDetails.name}
                    </span>
                    {blogPost.authorDetails.verified && (
                      <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    {blogPost.authorDetails.title} at {blogPost.authorDetails.company}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-cyan-400" />
                  {new Date(blogPost.publicationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-cyan-400" />
                  {blogPost.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <FiEye className="text-cyan-400" />
                  {blogPost.views} views
                </div>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
              <LikeButton
                likes={blogPost.likesCount}
                userLiked={userLiked}
                onLike={handleLike}
                disabled={!user || isLiking}
              />
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <FiShare2 />
                <span className="font-medium">{blogPost.shares}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-400">
                <FiMessageCircle />
                <span className="font-medium">Comment</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed text-lg space-y-6">
              {blogPost.fullContent.split('\n\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-base leading-7"
                  >
                    {paragraph}
                  </motion.p>
                )
              ))}
            </div>
          </div>

          {/* Tags */}
          {blogPost.tags.length > 0 && (
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800/80 text-cyan-400 text-sm rounded-full border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Attachments */}
          {blogPost.attachments.length > 0 && (
            <motion.div 
              className="mt-8 pt-8 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Attachments</h4>
              <div className="space-y-3">
                {blogPost.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors border border-gray-600"
                  >
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <FiUser className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{file.originalName}</div>
                      <div className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </article>

        {/* Comment Section */}
        <CommentSection postId={blogPost._id} />
      </main>

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={window.location.href}
        title={blogPost.headline}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        userReported={userReported}
      />
    </div>
  );
};

export default BlogPostPage;