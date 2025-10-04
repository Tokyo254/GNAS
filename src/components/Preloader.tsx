import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const topics = [
  "Technology", "Healthcare", "Finance", "Geopolitics", "Environment", "Arts & Culture",
  "Sports", "Education", "AI", "Retail", "Biotechnology", "Energy"
];

interface PreferencePreloaderProps {
  onComplete: (selectedTopics: string[]) => void;
}

const PreferencePreloader: React.FC<PreferencePreloaderProps> = ({ onComplete }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicClick = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.5 }
    },
  };

  const topicVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-white text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Personalize Your Experience
      </motion.h1>
      <motion.p
        className="text-gray-400 text-center mb-10 max-w-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        Select a few topics you're interested in to tailor your news feed.
      </motion.p>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topics.map(topic => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <motion.button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              variants={topicVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-sm font-medium border rounded-full transition-all duration-200 
                ${isSelected 
                  ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-white'
                }`
              }
            >
              {topic}
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selectedTopics.length >= 3 && (
          <motion.button
            onClick={() => onComplete(selectedTopics)}
            className="mt-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Continue to the Portal
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PreferencePreloader;