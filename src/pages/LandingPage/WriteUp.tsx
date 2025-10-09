import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const topics = [
  "Health", "Finance", "E-Mobility", "Law", "Tech",
  "Security", "Politics", "AI", "Geopolitics", "Environment",
  "Arts & Culture", "Sports"
];

const TopicSelector: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicClick = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) // Deselect if already selected
        : [...prev, topic] // Select if not selected
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Tags will appear one by one
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-extrabold text-white">
            Personalize Your Feed
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Select your interests to receive news stories that matter most to you.
          </p>
        </motion.div>

        {/* Interactive Topic Cloud */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {topics.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <motion.button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className={`px-5 py-2 text-sm font-medium border rounded-full transition-all duration-200
                  ${isSelected 
                    ? 'bg-cyan-500 border-cyan-500 text-white' 
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-white'
                  }`
                }
                variants={tagVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {topic}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="#"
            className="inline-block px-8 py-3 text-white bg-cyan-500 rounded-full hover:bg-cyan-600 transition-transform hover:scale-105"
          >
            Create My Feed
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopicSelector;