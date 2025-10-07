import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiPlus } from 'react-icons/fi';

// --- Dummy Data ---
const contentData = {
  billboard: { id: 1, type: 'article', tag: 'Featured Story', headline: 'AI-Powered Journalism: A New Era of Information', image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1974', summary: 'Explore a groundbreaking report on how artificial intelligence is transforming news gathering, analysis, and content creation, promising unprecedented efficiency and accuracy.' },
  rows: [
    {
      title: 'Trending Now',
      items: [
        { id: 2, type: 'article', headline: 'Global Summit on AI Regulation', image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070', tag: 'Geopolitics' },
        { id: 3, type: 'audio', headline: 'The Ethics of AI in Media', image: 'https://images.unsplash.com/photo-1554344224-496022890924?q=80&w=2070', tag: 'Podcast', duration: '24:15' },
        { id: 4, type: 'article', headline: 'AI Diagnostics Get FDA Approval', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070', tag: 'Healthcare' },
        { id: 5, type: 'article', headline: 'FinTech\'s AI Revolution', image: 'https://images.unsplash.com/photo-1665686310931-73933e451318?q=80&w=1974', tag: 'Finance' },
      ]
    },
    {
      title: 'Latest Audio Briefs',
      items: [
        { id: 6, type: 'audio', headline: 'Cybersecurity in the AI Age', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070', tag: 'Audio Brief', duration: '08:30' },
        { id: 7, type: 'audio', headline: 'Market Analysis: Q3 Earnings', image: 'https://images.unsplash.com/photo-1640622300473-977435c26c04?q=80&w=2070', tag: 'Finance', duration: '12:05' },
        { id: 8, type: 'audio', headline: 'The Future of Remote Work Tech', image: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?q=80&w=2070', tag: 'Technology', duration: '18:50' },
      ]
    }
  ]
};



// --- Main BrowseHero Component ---
const featuredItem: React.FC = () => {
  const billboardItem = contentData.billboard;

  return (
    <div className="relative z-10">
      {/* Billboard Section */}
      <div className="relative h-[80vh] flex flex-col justify-center text-white">
        <div className="absolute inset-0">
          <img src={billboardItem.image} alt={billboardItem.headline} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent"></div>
        </div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="max-w-xl">
            <p className="font-bold text-cyan-400 uppercase tracking-widest">{billboardItem.tag}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold my-4">{billboardItem.headline}</h1>
            <p className="text-gray-300 md:text-lg">{billboardItem.summary}</p>
            <div className="mt-8 flex gap-4">
              <button className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-md hover:bg-gray-200 transition-colors">
                <FiBookOpen /> Read More
              </button>
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-md hover:bg-white/30 transition-colors">
                <FiPlus /> Add to List
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default featuredItem;