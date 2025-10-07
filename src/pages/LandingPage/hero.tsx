import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle } from 'react-icons/fi';
import InteractiveNebula from '../../components/Nebula'; // Make sure this path is correct

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
     // Add more data for this tab...
  ]
};

const tabs = ['Featured', 'Trending', 'Hot Topics'];

// --- Reusable Card Components ---
const ArticleCard: React.FC<{ item: ContentItem; isFeatured?: boolean }> = ({ item, isFeatured = false }) => (
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

const AudioCard: React.FC<{ item: ContentItem }> = ({ item }) => (
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
            {/* Featured Item */}
            {featuredItem && (
              <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                {featuredItem.type === 'article' ? (
                  <ArticleCard item={featuredItem} isFeatured={true} />
                ) : (
                  <AudioCard item={featuredItem} />
                )}
              </div>
            )}

            {/* Other Items - now fills the rest of the grid */}
            {otherItems.map(item => (
              <div key={item.id}>
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