import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InteractiveNebula from "../../components/Nebula";
import heroImage from "../../assets/hero.jpg";

const Featured: React.FC = () => {
  return (
    <section className="relative bg-gray-900 text-white pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      
      {/* Interactive Nebula remains as the full background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <InteractiveNebula />
      </div>

      {/* The two-column layout sits on top */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        
        {/* Left Column: Text */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            AI-Powered Journalism: The Future
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            A groundbreaking report reveals how artificial intelligence is
            transforming news gathering, analysis, and content creation.
          </p>
          <div className="mt-8">
            <Link
              to="/article"
              className="inline-block px-8 py-3 bg-cyan-500 rounded-full hover:bg-cyan-600 transition-transform hover:scale-105"
            >
              Read More
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div
          className="md:w-1/2 mt-12 md:mt-0 md:pl-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <img
            src={heroImage}
            alt="AI Journalism Illustration"
            // EDITED: Removed rounded-lg, shadow-2xl, ring-1
            // ADDED: A custom style for a diffused shadow without sharp edges
            className="w-full"
            style={{ 
              boxShadow: '0 0 40px rgba(0, 191, 255, 0.6), 0 0 80px rgba(0, 191, 255, 0.3)', // Cyan glow shadow
              borderRadius: '8px', // Slight rounding or '0' for perfectly sharp corners if desired
              objectFit: 'cover'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Featured;