import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle } from 'react-icons/fi';

// --- Dummy Data ---
// In a real application, this data would come from your API.

interface ContentItem {
  id: number;
  type: string;
  tag: string;
  headline: string;
  image: string;
  summary?: string;
  duration?: string;
}


interface DummyContent {
  [key: string]: ContentItem[];
}

const dummyContent: DummyContent = {
  Featured: [
    { id: 1, type: 'article', tag: 'Artificial Intelligence', headline: 'Groundbreaking AI Achieves Human-Level Text Generation', image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1974', summary: 'A new language model showcases unprecedented capabilities in content creation, blurring the lines between human and machine.' },
    { id: 2, type: 'audio', tag: 'Future of Tech', headline: 'Podcast: The Ethics of AI in Journalism', image: 'https://images.unsplash.com/photo-1554344224-496022890924?q=80&w=2070', duration: '15:30' },
    { id: 3, type: 'article', tag: 'Geopolitics', headline: 'Global Summit Addresses AI Regulation Framework', image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070' },
  ],
  Trending: [
    { id: 4, type: 'article', tag: 'Healthcare', headline: 'AI-Powered Diagnostics Receives FDA Approval', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070' },
    { id: 5, type: 'article', tag: 'Finance', headline: 'FinTech Disruptors Embrace AI for Risk Assessment', image: 'https://images.unsplash.com/photo-1665686310931-73933e451318?q=80&w=1974' },
    { id: 6, type: 'audio', tag: 'Cybersecurity', headline: 'Audio Brief: The Rise of AI-Driven Phishing Scams', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070', duration: '05:45' },
  ],
  // Add more categories as needed
};

const tabs = ['Featured', 'Trending', 'Hot Topics'];

// --- Reusable Card Components ---
interface ArticleCardProps {
  item: ContentItem;
  isFeatured?: boolean;
}

const ArticleCard = ({ item, isFeatured = false }: ArticleCardProps) => (
  <motion.div 
    className={`relative w-full h-full rounded-xl overflow-hidden group ${isFeatured ? 'p-6 flex flex-col justify-end' : 'p-4'}`}
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
  >
    <img src={item.image} alt={item.headline} className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="relative z-10 text-white">
      <p className="text-xs font-semibold text-cyan-400 mb-2">{item.tag}</p>
      <h3 className={`font-bold ${isFeatured ? 'text-2xl md:text-4xl' : 'text-lg'}`}>{item.headline}</h3>
      {isFeatured && <p className="mt-2 text-sm text-gray-300 hidden md:block">{item.summary}</p>}
    </div>
  </motion.div>
);

interface AudioCardProps {
  item: ContentItem;
}

const AudioCard = ({ item }: AudioCardProps) => (
  <motion.div 
    className="relative w-full h-full rounded-xl overflow-hidden group p-4 flex flex-col justify-between"
    whileHover={{ transform: "translateY(-4px)", boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.1)" }}
  >
    <img src={item.image} alt={item.headline} className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-50" />
    <div className="relative z-10 text-white">
      <p className="text-xs font-semibold text-cyan-400 mb-2">{item.tag}</p>
      <h3 className="font-bold text-lg">{item.headline}</h3>
    </div>
    <div className="relative z-10 flex items-center justify-between mt-4">
      <div className="flex items-center gap-2 text-xs text-gray-300">
        <FiPlayCircle />
        <span>{item.duration}</span>
      </div>
      <div className="w-16 h-4 bg-white/20 rounded-full flex items-center">
        {/* Mock waveform */}
        <div className="w-full h-px bg-cyan-400 animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

// --- Main Hero Component ---
const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const content = dummyContent[activeTab] || [];
  const featuredItem = content[0];
  const otherItems = content.slice(1);

  return (
    <section className="bg-gray-900 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" layoutId="underline" />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Featured Item */}
            {featuredItem && (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[400px] lg:min-h-0">
                {featuredItem.type === 'article' ? (
                  <ArticleCard item={featuredItem} isFeatured={true} />
                ) : (
                  <AudioCard item={featuredItem} /> // Assuming audio can also be featured
                )}
              </div>
            )}

            {/* Other Items */}
            {otherItems.map(item => (
              <div key={item.id} className="min-h-[242px]">
                {item.type === 'article' ? (
                  <ArticleCard item={item} />
                ) : (
                  <AudioCard item={item} />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;