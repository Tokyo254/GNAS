import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiBookOpen, FiHeadphones, FiClock, FiArrowRight, FiRadio } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../utils/api';

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
}

interface ContentItem {
  id: string;
  type: 'audio' | 'article' | 'radio';
  headline: string;
  summary: string;
  image: string;
  tag: string;
  category: string;
  readTime?: string;
  author?: string;
  publicationDate?: string;
  duration?: string;
}

// Dummy Radio Release Data
const dummyRadioReleases: ContentItem[] = [
  {
    id: 'radio-1',
    type: 'radio',
    headline: 'Morning Market Brief: Global Economic Outlook',
    summary: 'Daily analysis of market trends and economic indicators affecting your investments.',
    image: 'https://images.unsplash.com/photo-1598890779137-b8b9d37a7d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    tag: 'Live',
    category: 'Finance',
    duration: '15:30',
    author: 'Financial Desk'
  },
  {
    id: 'radio-2',
    type: 'radio',
    headline: 'Tech Talk: AI Regulation Updates',
    summary: 'Latest developments in AI policy and what it means for tech companies.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    tag: 'Weekly',
    category: 'Technology',
    duration: '22:15',
    author: 'Tech Review'
  },
  {
    id: 'radio-3',
    type: 'radio',
    headline: 'Policy Pulse: Legislative Changes',
    summary: 'Breaking down new legislation and its impact on business operations.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    tag: 'Breaking',
    category: 'Policy',
    duration: '18:45',
    author: 'Policy Desk'
  },
  {
    id: 'radio-4',
    type: 'radio',
    headline: 'Health Sector Update: Medical Breakthroughs',
    summary: 'Weekly roundup of healthcare innovations and medical research updates.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    tag: 'Weekly',
    category: 'Healthcare',
    duration: '25:10',
    author: 'Health Desk'
  }
];

// Content Card Components
const AudioContentCard = ({ item, onItemClick }: { item: ContentItem; onItemClick: (id: string) => void }) => (
  <motion.div
    className="group relative w-full h-48 rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20"
    whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 10px 20px rgba(168, 85, 247, 0.2)" }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    onClick={() => onItemClick(item.id)}
  >
    <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-purple-900/50"></div>
      <div className="absolute top-3 right-3 bg-purple-500/20 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
        <FiHeadphones className="text-purple-400" />
      </div>
    </div>

    <div className="pt-28 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-2">
        <FiPlay className="text-purple-400" />
        <span>AUDIO RELEASE</span>
      </div>
      
      <h4 className="text-white text-sm font-bold mb-2 line-clamp-2 leading-tight">
        {item.headline}
      </h4>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
        <div className="flex items-center gap-2">
          <span>{item.tag}</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <span>Listen</span>
          <FiArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

const ArticleContentCard = ({ item, onItemClick }: { item: ContentItem; onItemClick: (id: string) => void }) => (
  <motion.div
    className="group relative w-full h-48 rounded-xl overflow-hidden cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
    whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    onClick={() => onItemClick(item.id)}
  >
    <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
    </div>

    <div className="pt-24 p-4 h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
        <span className="bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-500/30">
          {item.category}
        </span>
      </div>
      
      <h4 className="text-white text-sm font-bold mb-2 line-clamp-2 leading-tight">
        {item.headline}
      </h4>
      
      <p className="text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
        {item.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          {item.readTime && (
            <>
              <FiClock size={12} />
              <span>{item.readTime}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-cyan-400">
          <span>Read</span>
          <FiArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

const RadioContentCard = ({ item, onItemClick }: { item: ContentItem; onItemClick: (id: string) => void }) => (
  <motion.div
    className="group relative w-full h-48 rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20"
    whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 10px 20px rgba(245, 158, 11, 0.2)" }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    onClick={() => onItemClick(item.id)}
  >
    <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
      <img 
        src={item.image} 
        alt={item.headline}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-orange-900/50"></div>
      <div className="absolute top-3 right-3 bg-orange-500/20 backdrop-blur-sm rounded-full p-2 border border-orange-500/30">
        <FiRadio className="text-orange-400" />
      </div>
    </div>

    <div className="pt-28 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between text-xs font-semibold text-orange-400 mb-2">
        <div className="flex items-center gap-2">
          <FiRadio className="text-orange-400" />
          <span>RADIO RELEASE</span>
        </div>
        <span className="bg-orange-500/20 px-2 py-1 rounded-full text-orange-300">
          {item.duration}
        </span>
      </div>
      
      <h4 className="text-white text-sm font-bold mb-2 line-clamp-2 leading-tight">
        {item.headline}
      </h4>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/20 px-2 py-1 rounded-full text-orange-300 text-xs">
            {item.tag}
          </span>
          <span>{item.author}</span>
        </div>
        <div className="flex items-center gap-1 text-orange-400">
          <span>Tune In</span>
          <FiArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

// Mobile Carousel Component
const MobileCarousel = ({ 
  items, 
  onItemClick 
}: { 
  items: ContentItem[]; 
  onItemClick: (id: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (items.length === 0) return null;

  const renderCard = (item: ContentItem) => {
    switch (item.type) {
      case 'audio':
        return <AudioContentCard item={item} onItemClick={onItemClick} />;
      case 'radio':
        return <RadioContentCard item={item} onItemClick={onItemClick} />;
      default:
        return <ArticleContentCard item={item} onItemClick={onItemClick} />;
    }
  };

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden md:hidden">
      <motion.div
        key={items[currentIndex]?.id}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {renderCard(items[currentIndex])}
      </motion.div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <FiArrowRight className="rotate-180" size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <FiArrowRight size={16} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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

// Content Row Component
interface ContentRowProps {
  title: string;
  items: ContentItem[];
  type: 'audio' | 'article' | 'radio';
  onItemClick: (id: string) => void;
}

const ContentRow = ({ title, items, onItemClick }: ContentRowProps) => {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  const renderCard = (item: ContentItem) => {
    switch (item.type) {
      case 'audio':
        return <AudioContentCard key={item.id} item={item} onItemClick={onItemClick} />;
      case 'radio':
        return <RadioContentCard key={item.id} item={item} onItemClick={onItemClick} />;
      default:
        return <ArticleContentCard key={item.id} item={item} onItemClick={onItemClick} />;
    }
  };

  return (
    <motion.div 
      className="my-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <button
          onClick={() => navigate('/blog')}
          className="hidden md:flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
        >
          View All
          <FiArrowRight size={16} />
        </button>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <MobileCarousel items={items} onItemClick={onItemClick} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map(renderCard)}
      </div>
    </motion.div>
  );
};

// Main Content Component
const Content: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogService.getHeroPosts();
        
        if (response.success && response.data) {
          const transformedPosts = (response.data as unknown as BlogPost[]).map(post => ({
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

  // Transform blog posts to content items
  const transformToContentItems = (posts: BlogPost[], itemType: 'audio' | 'article'): ContentItem[] => {
    return posts
      .filter(post => {
        if (itemType === 'audio') {
          return post.tags.some(tag => 
            ['audio', 'podcast', 'briefing'].includes(tag.toLowerCase())
          ) || post.type === 'press-release';
        }
        return true; // For articles, include all non-audio posts
      })
      .map(post => ({
        id: post._id,
        type: itemType,
        headline: post.headline,
        summary: post.summary,
        image: post.featuredImage?.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
        tag: post.tags[0] || 'General',
        category: post.categories[0] || 'Uncategorized',
        readTime: post.readTime,
        author: post.authorDetails.name,
        publicationDate: post.publicationDate
      }))
      .slice(0, 8); // Limit to 8 items per category
  };

  const audioItems = transformToContentItems(blogPosts, 'audio');
  const articleItems = transformToContentItems(blogPosts, 'article');

  const handleItemClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBookOpen className="text-red-400 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Content Unavailable</h3>
          <p className="text-gray-400 mb-6">
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
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Explore More Content
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive deeper into our latest audio briefs, articles, and comprehensive reports
          </p>
        </div>

        {/* Audio Content Row */}
        <ContentRow 
          title="Latest Audio Briefs" 
          items={audioItems}
          type="audio"
          onItemClick={handleItemClick}
        />

        {/* Article Content Row */}
        <ContentRow 
          title="Deep Dives & Reports" 
          items={articleItems}
          type="article"
          onItemClick={handleItemClick}
        />

        {/* Radio Releases Row - Using Dummy Data */}
        <ContentRow 
          title="Radio Releases" 
          items={dummyRadioReleases}
          type="radio"
          onItemClick={handleItemClick}
        />

        {/* View All Button for Mobile */}
        <div className="text-center mt-8 md:hidden">
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

export default Content;