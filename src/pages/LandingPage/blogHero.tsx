import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle, FiChevronLeft, FiChevronRight, FiHeadphones, FiClock, FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../utils/api';
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
  };
  views: number;
  likes: string[];
  likesCount: number;
  shares: number;
  slug: string;
  type?: 'article' | 'press-release';
}

// Card Components
const FeaturedBlogCard: React.FC<{ 
  post: BlogPost; 
  onReadMore: (id: string) => void;
  isActive?: boolean;
}> = ({ post, onReadMore, isActive = false }) => (
  <motion.div 
    className={`relative w-full h-full rounded-xl overflow-hidden group cursor-pointer ${
      isActive ? 'ring-2 ring-cyan-500' : ''
    }`}
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
    onClick={() => onReadMore(post._id)}
  >
    <img 
      src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'} 
      alt={post.headline}
      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
    
    <div className="relative z-10 text-white p-6 flex flex-col justify-end h-full">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-3">
        {post.categories.slice(0, 2).map(category => (
          <span key={category} className="bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-500/30">
            {category}
          </span>
        ))}
        {post.type === 'press-release' && (
          <span className="bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
            Press Release
          </span>
        )}
      </div>
      
      <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
        {post.headline}
      </h3>
      
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiUser className="text-cyan-400" />
            <span>{post.authorDetails.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-cyan-400" />
            <span>{new Date(post.publicationDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="text-cyan-400" />
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 group-hover:gap-3 transition-all">
          <span className="font-medium">Read More</span>
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  </motion.div>
);

const StandardBlogCard: React.FC<{ 
  post: BlogPost; 
  onReadMore: (id: string) => void;
}> = ({ post, onReadMore }) => (
  <motion.div 
    className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
    onClick={() => onReadMore(post._id)}
  >
    <div className="absolute top-0 left-0 w-full h-48 overflow-hidden">
      <img 
        src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'} 
        alt={post.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
    </div>

    <div className="pt-52 p-4 h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
        {post.categories.slice(0, 1).map(category => (
          <span key={category} className="bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-500/30">
            {category}
          </span>
        ))}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
        {post.headline}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <span>{post.authorDetails.name}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400">
          <span>Read</span>
          <FiArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

const AudioBlogCard: React.FC<{ 
  post: BlogPost; 
  onReadMore: (id: string) => void;
}> = ({ post, onReadMore }) => (
  <motion.div 
    className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20"
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(168, 85, 247, 0.2)" }}
    onClick={() => onReadMore(post._id)}
  >
    <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
      <img 
        src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070'} 
        alt={post.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-purple-900/50"></div>
      <div className="absolute top-3 right-3 bg-purple-500/20 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
        <FiHeadphones className="text-purple-400" />
      </div>
    </div>

    <div className="pt-36 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-2">
        <FiPlayCircle />
        <span>AUDIO RELEASE</span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
        {post.headline}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
        {post.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-purple-500/20">
        <div className="flex items-center gap-2">
          <span>{post.authorDetails.name}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <span>Listen</span>
          <FiArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

// Carousel Component
const BlogCarousel: React.FC<{ 
  posts: BlogPost[]; 
  currentIndex: number; 
  onNext: () => void; 
  onPrev: () => void;
  onDotClick: (index: number) => void;
  onReadMore: (id: string) => void;
}> = ({ posts, currentIndex, onNext, onPrev, onDotClick, onReadMore }) => {
  const currentPost = posts[currentIndex];

  if (!currentPost) return null;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost._id}
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FeaturedBlogCard 
            post={currentPost} 
            onReadMore={onReadMore}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button 
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={20} />
          </button>
          <button 
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-cyan-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Blog Hero Component
const BlogHero: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('featured');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'featured', label: 'Featured' },
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' },
    { id: 'press-releases', label: 'Press Releases' }
  ];


// Fetch blog posts
// Fetch blog posts
useEffect(() => {
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getHeroPosts();
      
      if (response.success && response.data) {
        // Runtime-safe extraction of array
        const rawData = response.data;
        const postsData: BlogPost[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray((rawData as any)?.data)
          ? (rawData as any).data
          : [];
        
        // Transform the data to ensure it matches our interface
        const transformedPosts = postsData.map(post => ({
          ...post,
          // Ensure authorDetails has all required fields
          authorDetails: {
            _id: post.authorDetails?._id || 'unknown',
            name: post.authorDetails?.name || 'Unknown Author',
            title: post.authorDetails?.title || '',
            company: post.authorDetails?.company || '',
            avatar: post.authorDetails?.avatar || '',
            verified: post.authorDetails?.verified || false
          },
          // Ensure we have required arrays
          categories: post.categories || [],
          tags: post.tags || [],
          likes: post.likes || [],
          // Ensure required numbers
          views: post.views || 0,
          likesCount: post.likesCount || 0,
          shares: post.shares || 0
        }));
        
        setBlogPosts(transformedPosts);
      } else {
        setError(response.message || 'Failed to load content');
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchBlogPosts();
}, []);

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    const posts = [...blogPosts]; // Create a copy to avoid mutating original
    
    switch (activeTab) {
      case 'featured':
        return posts.slice(0, 6); 
      case 'trending':
        return posts.sort((a, b) => b.views - a.views).slice(0, 6);
      case 'recent':
        return posts.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()).slice(0, 6);
      case 'press-releases':
        return posts.filter(post => post.type === 'press-release').slice(0, 6);
      default:
        return posts.slice(0, 6);
    }
  };

  const filteredPosts = getFilteredPosts();
  const carouselPosts = filteredPosts.slice(0, 3);
  const gridPosts = filteredPosts.slice(3, 6);

  // Add mock audio posts for demonstration (you can remove this once you have real audio posts)
  const audioPosts: BlogPost[] = [
    {
      _id: 'audio-1',
      headline: 'The Future of Digital Communication',
      summary: 'Exploring how AI is transforming the way we communicate in digital spaces.',
      fullContent: '',
      authorDetails: {
        _id: '1',
        name: 'Sarah Chen',
        title: 'Tech Analyst',
        company: 'Digital Futures',
        avatar: '',
        verified: true
      },
      publicationDate: new Date().toISOString(),
      readTime: '25 min',
      categories: ['Technology', 'AI'],
      tags: ['audio', 'podcast'],
      views: 1500,
      likes: [],
      likesCount: 45,
      shares: 12,
      slug: 'future-digital-communication',
      type: 'article'
    },
    {
      _id: 'audio-2',
      headline: 'Media Relations in 2024',
      summary: 'Latest strategies for effective media engagement and press release distribution.',
      fullContent: '',
      authorDetails: {
        _id: '2',
        name: 'Mike Rodriguez',
        title: 'PR Director',
        company: 'Global Comms',
        avatar: '',
        verified: true
      },
      publicationDate: new Date().toISOString(),
      readTime: '18 min',
      categories: ['Media', 'Communication'],
      tags: ['audio', 'interview'],
      views: 890,
      likes: [],
      likesCount: 23,
      shares: 8,
      slug: 'media-relations-2024',
      type: 'article'
    }
  ];

  const nextSlide = () => {
    if (carouselPosts.length > 0) {
      setCarouselIndex((prev) => (prev + 1) % carouselPosts.length);
    }
  };

  const prevSlide = () => {
    if (carouselPosts.length > 0) {
      setCarouselIndex((prev) => (prev - 1 + carouselPosts.length) % carouselPosts.length);
    }
  };

  const goToSlide = (index: number) => {
    setCarouselIndex(index);
  };

  const handleReadMore = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (carouselPosts.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselPosts.length]);

  if (loading) {
    return (
      <section className="relative bg-gray-900 text-white pt-24 pb-16 overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <InteractiveNebula />
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading featured content...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative bg-gray-900 text-white pt-24 pb-16 overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <InteractiveNebula />
        </div>
        <div className="relative z-10 text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="text-red-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Content Unavailable</h1>
          <p className="text-gray-400 mb-8">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 text-white pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <InteractiveNebula />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Featured Content
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the latest press releases, articles, and audio content from our community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center border-b border-slate-800 mb-8">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-3 px-6 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" 
                  layoutId="underline"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 min-h-[600px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Carousel Section - Left Side */}
            {carouselPosts.length > 0 ? (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <BlogCarousel 
                  posts={carouselPosts}
                  currentIndex={carouselIndex}
                  onNext={nextSlide}
                  onPrev={prevSlide}
                  onDotClick={goToSlide}
                  onReadMore={handleReadMore}
                />
              </div>
            ) : (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 flex items-center justify-center bg-gray-800/30 rounded-xl border border-gray-700/50">
                <p className="text-gray-400">No featured content available</p>
              </div>
            )}

            {/* Standard Blog Posts - Top Right */}
            {gridPosts.map((post, index) => (
              <div key={post._id} className={`${index === 0 ? 'lg:col-span-2' : ''}`}>
                <StandardBlogCard 
                  post={post} 
                  onReadMore={handleReadMore}
                />
              </div>
            ))}

            {/* Show placeholder if no grid posts */}
            {gridPosts.length === 0 && carouselPosts.length > 0 && (
              <>
                <div className="lg:col-span-2 flex items-center justify-center bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <p className="text-gray-400">More content coming soon</p>
                </div>
                <div className="flex items-center justify-center bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <p className="text-gray-400">More content coming soon</p>
                </div>
              </>
            )}

            {/* Audio Section - Bottom Right */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {audioPosts.map(post => (
                  <AudioBlogCard 
                    key={post._id}
                    post={post} 
                    onReadMore={handleReadMore}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium group"
          >
            View All Content
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;