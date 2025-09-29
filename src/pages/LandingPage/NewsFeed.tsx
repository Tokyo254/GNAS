import { motion } from 'framer-motion';
import Newsfeed from '../../assets/newsFeed4.jpg';
import newsFeed1 from '../../assets/newsFeed1.jpg';
import newsFeed2 from '../../assets/newsFeed2.jpg';

// 1. Define the "shape" of a single news item object
interface NewsItem {
  image: string; // The image source is a string
  tag: string;
  headline: string;
  description: string;
}

// 2. Define the "shape" of the props for the entire component
interface NewsSectionProps {
  title: string;
}

// 3. Type the component with React.FC<NewsSectionProps>
const NewsSection: React.FC<NewsSectionProps> = ({ title }) => {
  // Also, type the newsItems array using the NewsItem interface
  const newsItems: NewsItem[] = [
    {
      image: Newsfeed,
      tag: 'Artificial Intelligence',
      headline: 'Breaking News: AI Advances in PR',
      description: 'Explore how new AI models are transforming public relations strategies and audience engagement.',
    },
    {
      image: newsFeed1,
      tag: 'Future of Media',
      headline: 'Top 5 Trends in Digital Journalism',
      description: 'Anticipating the technological and ethical shifts that will define journalism and communication.',
    },
    {
      image: newsFeed2,
      tag: 'Ethics & Tech',
      headline: 'Ethical AI in News Distribution',
      description: 'A deep dive into ensuring transparency and accountability in algorithm-driven content delivery.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }, // use a valid easing value
    },
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl font-extrabold text-white mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {newsItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300"
              variants={cardVariants}
            >
              <div className="overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.headline} 
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-cyan-400 mb-2">{item.tag}</p>
                <h3 className="text-xl font-bold text-white mb-3">{item.headline}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;