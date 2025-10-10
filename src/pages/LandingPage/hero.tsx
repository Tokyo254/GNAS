import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle, FiChevronLeft, FiChevronRight, FiHeadphones, FiPause, FiPlay } from 'react-icons/fi';
import InteractiveNebula from '../../components/Nebula';

// --- Interfaces and Expanded Dummy Data ---
interface ContentItem {
  id: number;
  type: string;
  tag: string;
  headline: string;
  image: string;
  summary?: string;
  duration?: string;
}

const dummyContent: { [key: string]: ContentItem[] } = {
  Featured: [
    { id: 1, type: 'article', tag: 'Artificial Intelligence', headline: 'Groundbreaking AI Achieves Human-Level Text Generation', image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1974', summary: 'A new language model showcases unprecedented capabilities in content creation...' },
    { id: 2, type: 'audio', tag: 'Future of Tech', headline: 'Podcast: The Ethics of AI in Journalism', image: 'https://images.unsplash.com/photo-1554344224-496022890924?q=80&w=2070', duration: '15:30' },
    { id: 3, type: 'article', tag: 'Geopolitics', headline: 'Global Summit Addresses AI Regulation Framework', image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070' },
    { id: 4, type: 'article', tag: 'Healthcare', headline: 'AI-Powered Diagnostics Receives FDA Approval', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070' },
    { id: 5, type: 'article', tag: 'Finance', headline: 'FinTech Disruptors Embrace AI for Risk Assessment', image: 'https://images.unsplash.com/photo-1665686310931-73933e451318?q=80&w=1974' },
  ],
  Trending: [
    { id: 6, type: 'audio', tag: 'Cybersecurity', headline: 'Audio Brief: The Rise of AI-Driven Phishing Scams', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070', duration: '05:45' },
    { id: 7, type: 'article', tag: 'Environment', headline: 'Breakthrough in Carbon Capture Technology', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070' },
    { id: 8, type: 'article', tag: 'Business', headline: 'Navigating the Post-Pandemic Office Landscape', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071' },
    { id: 9, type: 'article', tag: 'Space', headline: 'New Telescope Uncovers Secrets of Distant Galaxies', image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1780' },
    { id: 10, type: 'audio', tag: 'Podcast', headline: 'The Psychology of Modern Marketing', image: 'https://images.unsplash.com/photo-1533750349088-245c71b6266d?q=80&w=2070', duration: '32:10' },
  ],
  "Hot Topics": [
    { id: 11, type: 'article', tag: 'Innovation', headline: 'Startup Revolutionizes Renewable Energy Storage', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070' },
    { id: 12, type: 'audio', tag: 'Technology', headline: 'The Future of Quantum Computing', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070', duration: '22:15' },
    { id: 13, type: 'article', tag: 'Education', headline: 'Digital Learning Platforms Transform Higher Education', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2092' },
  ]
};

// Dedicated audio content for integration into the right grid
const featuredPodcasts: ContentItem[] = [
  { id: 101, type: 'audio', tag: 'Technology', headline: 'The Future of Web Development', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074', duration: '45:20' },
  { id: 102, type: 'audio', tag: 'Business', headline: 'Startup Success Stories', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074', duration: '38:15' },
  { id: 103, type: 'audio', tag: 'Science', headline: 'Breakthroughs in Medical Research', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2071', duration: '52:10' },
  { id: 104, type: 'audio', tag: 'Culture', headline: 'The Impact of Social Media on Society', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074', duration: '41:35' },
  { id: 105, type: 'audio', tag: 'Entertainment', headline: 'Behind the Scenes of Film Production', image: 'https://images.unsplash.com/photo-1489599809505-f2a93ef4c32c?q=80&w=2074', duration: '29:45' },
  { id: 106, type: 'audio', tag: 'Health', headline: 'Mental Wellness in the Digital Age', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=2070', duration: '36:20' },
  { id: 107, type: 'audio', tag: 'Sports', headline: 'The Science of Athletic Performance', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070', duration: '28:15' },
  { id: 108, type: 'audio', tag: 'Travel', headline: 'Hidden Gems Around the World', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2034', duration: '47:30' }
];

const tabs = ['Featured', 'Trending', 'Hot Topics'];

// --- Reusable Card Components ---
const ArticleCard: React.FC<{ item: ContentItem; isFeatured?: boolean }> = ({ item, isFeatured = false }) => (
  <motion.div 
    className={`relative w-full h-full rounded-xl overflow-hidden group ${isFeatured ? 'p-6 flex flex-col justify-end' : 'p-4'}`}
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
  >
    <img src={item.image} alt={item.headline} className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="relative z-10 text-white">
      <p className="text-xs font-semibold text-cyan-400 mb-2">{item.tag}</p>
      <h3 className={`font-bold ${isFeatured ? 'text-2xl md:text-4xl' : 'text-lg'}`}>{item.headline}</h3>
      {isFeatured && <p className="mt-2 text-sm text-gray-300 hidden md:block">{item.summary}</p>}
    </div>
  </motion.div>
);

const AudioCard: React.FC<{ item: ContentItem }> = ({ item }) => (
  <motion.div 
    className="relative w-full h-full rounded-xl overflow-hidden group p-4 flex flex-col justify-between"
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
  >
    <img src={item.image} alt={item.headline} className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-50" />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="relative z-10 text-white">
      <p className="text-xs font-semibold text-cyan-400 mb-2">{item.tag}</p>
      <h3 className="font-bold text-lg">{item.headline}</h3>
    </div>
    <div className="relative z-10 flex items-center justify-between mt-4">
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <FiPlayCircle />
        <span>{item.duration}</span>
      </div>
    </div>
  </motion.div>
);

// --- Compact Audio Card for Grid Integration ---
const CompactAudioCard: React.FC<{ item: ContentItem; isActive?: boolean }> = ({ item, isActive = false }) => (
  <motion.div 
    className={`relative w-full rounded-xl overflow-hidden group p-4 flex flex-col justify-between border transition-all duration-300 ${
      isActive 
        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
        : 'border-slate-700 bg-slate-800/50 hover:border-cyan-500/30'
    }`}
    whileHover={{ transform: "translateY(-2px)" }}
  >
    <div className="flex items-start gap-3">
      <div className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ${
        isActive ? 'bg-cyan-500/30' : 'bg-cyan-500/20'
      }`}>
        <img src={item.image} alt={item.headline} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 flex items-center justify-center ${
          isActive ? 'bg-cyan-500/20' : 'bg-cyan-500/10'
        }`}>
          <FiPlayCircle className="text-cyan-400 text-lg" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-cyan-400 mb-1 truncate">{item.tag}</p>
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{item.headline}</h3>
      </div>
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <FiPlayCircle className="text-cyan-400" />
        <span>{item.duration}</span>
      </div>
      <div className="text-xs text-cyan-400 font-medium">LISTEN</div>
    </div>
  </motion.div>
);

// --- Image Carousel Component ---
const ImageCarousel: React.FC<{ 
  items: ContentItem[]; 
  currentIndex: number; 
  onNext: () => void; 
  onPrev: () => void;
  onDotClick: (index: number) => void;
}> = ({ items, currentIndex, onNext, onPrev, onDotClick }) => {
  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Main Carousel Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img 
            src={currentItem.image} 
            alt={currentItem.headline} 
            className="w-full h-full object-cover"
          />
          
          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
            <p className="text-xs font-semibold text-cyan-400 mb-2">{currentItem.tag}</p>
            <h3 className="text-2xl md:text-4xl font-bold mb-3">{currentItem.headline}</h3>
            {currentItem.summary && (
              <p className="text-sm text-gray-300 hidden md:block max-w-2xl">{currentItem.summary}</p>
            )}
            {currentItem.duration && (
              <div className="flex items-center gap-2 text-xs text-gray-300 mt-3">
                <FiPlayCircle className="text-cyan-400" />
                <span>{currentItem.duration}</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={onPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={20} />
      </button>
      <button 
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
        aria-label="Next slide"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, index) => (
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
    </div>
  );
};

// --- Audio Section Component for Right Grid ---
const AudioSection: React.FC<{ podcasts: ContentItem[] }> = ({ podcasts }) => {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<number | null>(null);

  // Number of cards to show at once
  const visibleCards = 2;
  const totalGroups = Math.ceil(podcasts.length / visibleCards);

  const nextGroup = () => {
    setCurrentAudioIndex((prev) => (prev + 1) % totalGroups);
  };

  const prevGroup = () => {
    setCurrentAudioIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToGroup = (index: number) => {
    setCurrentAudioIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-cycle effect
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = window.setInterval(() => {
        nextGroup();
      }, 5000);
    } else {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, totalGroups]);

  // Get current group of podcasts
  const startIndex = currentAudioIndex * visibleCards;
  const currentPodcasts = podcasts.slice(startIndex, startIndex + visibleCards);

  return (
    <div className="lg:col-span-2 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiHeadphones className="text-cyan-400 text-lg" />
          <h3 className="font-bold text-white text-lg">Featured Radio</h3>
          <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded-full">
            {currentAudioIndex + 1}/{totalGroups}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleAutoPlay}
            className="p-2 rounded-full bg-slate-700 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
            aria-label={isAutoPlaying ? "Pause auto-play" : "Play auto-play"}
          >
            {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
          </button>
          <button 
            onClick={prevGroup}
            className="p-2 rounded-full bg-slate-700 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
            aria-label="Previous group"
          >
            <FiChevronLeft size={16} />
          </button>
          <button 
            onClick={nextGroup}
            className="p-2 rounded-full bg-slate-700 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
            aria-label="Next group"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Audio Cards Grid - No Scrollbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentPodcasts.map((podcast, index) => (
          <CompactAudioCard 
            key={podcast.id} 
            item={podcast} 
            isActive={index === 0} // Highlight first card in group
          />
        ))}
      </div>

      {/* Group Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalGroups }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToGroup(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentAudioIndex 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Main Hero Component ---
const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const content = dummyContent[activeTab] || [];
  const carouselItems = content.slice(0, 3);
  const otherItems = content.slice(3);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCarouselIndex(index);
  };

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Reset carousel index when tab changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [activeTab]);

  return (
    <section className="relative bg-gray-900 text-white pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <InteractiveNebula />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center border-b border-slate-800 mb-8">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" layoutId="underline" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 h-[70vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Carousel Section - Left Side */}
            {carouselItems.length > 0 && (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <ImageCarousel 
                  items={carouselItems}
                  currentIndex={carouselIndex}
                  onNext={nextSlide}
                  onPrev={prevSlide}
                  onDotClick={goToSlide}
                />
              </div>
            )}

            {/* Other Items - Right Side Grid */}
            {otherItems.map(item => (
              <div key={item.id}>
                {item.type === 'article' ? (
                  <ArticleCard item={item} />
                ) : (
                  <AudioCard item={item} />
                )}
              </div>
            ))}

            {/* Audio Section - Integrated into the right grid */}
            <AudioSection podcasts={featuredPodcasts} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;