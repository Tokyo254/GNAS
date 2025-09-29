import React from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiEdit, FiSend } from 'react-icons/fi';

// 1. Using your local images
import signUpImage from '../../assets/signup.png'; 
import editorImage from '../../assets/Analytics.png'; // Assuming you have an 'editor.png' for step 2
import analyticsImage from '../../assets/dashboard.png';

// 2. The steps array now uses the imported images directly
const steps = [
  {
    icon: <FiUserPlus size={24} />,
    title: "1. Create Your Verified Account",
    description: "Sign up in seconds. Our streamlined registration process verifies your professional identity, ensuring you join a trusted network of communicators and journalists.",
    image: signUpImage,
  },
  {
    icon: <FiEdit size={24} />,
    title: "2. Draft Your Press Release",
    description: "Use our intuitive, full-featured editor to craft your message. Add rich content, attach files, and use the live preview to see exactly how your release will look.",
    image: editorImage,
  },
  {
    icon: <FiSend size={24} />,
    title: "3. Publish & Track Your Impact",
    description: "Submit your release for review and, once approved, publish it to our network. Track its performance with our powerful analytics dashboard to measure your reach and engagement.",
    image: analyticsImage,
  }
];

const DemoSection: React.FC = () => {
  return (
    <section className="bg-gray-900 py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold">A Seamless Workflow</h2>
          <p className="mt-4 text-lg text-gray-400">From registration to results in three simple steps.</p>
        </motion.div>

        <div className="relative">
          {/* The vertical timeline line */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-4 h-full w-0.5 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" 
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const isOdd = index % 2 !== 0;
            
            const textVariants = {
              hidden: { opacity: 0, x: isOdd ? 50 : -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
            };
            const imageVariants = {
              hidden: { opacity: 0, x: isOdd ? -50 : 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
            };

            return (
              <motion.div
                key={step.title}
                className="relative flex items-center justify-center mb-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* The content block */}
                <div className={`flex w-full items-center ${isOdd ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  {/* Text */}
                  <motion.div className="md:w-1/2 p-4" variants={textVariants}>
                    <div className={`text-center md:text-left ${isOdd ? 'md:text-right' : ''}`}>
                      <h3 className="text-2xl font-bold text-cyan-400 mb-3">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>

                  {/* Image */}
                  <motion.div className="md:w-1/2 p-4" variants={imageVariants}>
                    <div className="bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm ring-1 ring-white/10 shadow-2xl">
                       <img src={step.image} alt={step.title} className="w-full rounded-md" />
                    </div>
                  </motion.div>
                </div>
                
                {/* The timeline node */}
                <motion.div 
                  className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-900 border-2 border-cyan-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1, transition: { delay: 0.4, type: 'spring', stiffness: 300 } }}
                  viewport={{ once: true }}
                >
                  <div className="text-cyan-400">{step.icon}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;