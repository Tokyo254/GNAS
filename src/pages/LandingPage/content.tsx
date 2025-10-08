import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiBookOpen } from 'react-icons/fi';

// --- Dummy Data for the Carousels ---
const contentRows = [
  {
    title: 'Latest Audio Briefs',
    items: [
      { id: 10, type: 'audio' as const, headline: 'Market Analysis: Q3 Earnings Report', image: 'https://images.unsplash.com/photo-1640622300473-977435c26c04?q=80&w=2070', tag: 'Finance', duration: '12:05' },
      { id: 11, type: 'audio' as const, headline: 'Cybersecurity in the AI Age', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070', tag: 'Tech', duration: '08:30' },
      { id: 12, type: 'audio' as const, headline: 'The Future of Remote Work', image: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?q=80&w=2070', tag: 'Business', duration: '18:50' },
      { id: 13, type: 'audio' as const, headline: 'Environmental Policy Update', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070', tag: 'Environment', duration: '09:10' },
    ]
  },
  {
    title: 'Deep Dives & Reports',
    items: [
      { id: 14, type: 'article' as const, headline: 'AI in Healthcare: A Revolution in Diagnostics', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070', tag: 'Healthcare' },
      { id: 15, type: 'article' as const, headline: 'The Geopolitics of Semiconductor Manufacturing', image: 'https://images.unsplash.com/photo-1677442293202-7645377db2a0?q=80&w=1974', tag: 'Geopolitics' },
      { id: 16, type: 'article' as const, headline: 'Sustainable Agriculture Innovations', image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1970', tag: 'Environment' },
      { id: 17, type: 'article' as const, headline: 'The Evolution of Digital Currency', image: 'https://images.unsplash.com/photo-1621405788223-0711453a99a4?q=80&w=2070', tag: 'Finance' },
    ]
  },
];

// --- Reusable Card & Row Components ---
interface ContentItem {
  id: number;
  type: 'audio' | 'article';
  headline: string;
  image: string;
  tag: string;
  duration?: string;
}

const ContentCard = ({ item }: { item: ContentItem }) => (
  <motion.div
    className="group relative w-72 h-40 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
    whileHover={{ scale: 1.05, y: -5, zIndex: 10, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.4)" }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <img src={item.image} alt={item.headline} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
      <p className="text-xs text-cyan-400 font-semibold">{item.tag}</p>
      <h4 className="text-white text-base font-bold">{item.headline}</h4>
    </div>
    <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
      {item.type === 'audio' ? <FiPlay className="text-white" /> : <FiBookOpen className="text-white" />}
    </div>
  </motion.div>
);

interface ContentRowProps {
  title: string;
  items: ContentItem[];
}

const ContentRow = ({ title, items }: ContentRowProps) => (
  <motion.div 
    className="my-12"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
      {items.map(item => <ContentCard key={item.id} item={item} />)}
    </div>
  </motion.div>
);

// --- Main ContentShowcase Component ---
const Content: React.FC = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {contentRows.map(row => (
          <ContentRow key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </section>
  );
};

export default Content;