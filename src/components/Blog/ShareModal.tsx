// components/blog/ShareModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLinkedin, FaTwitter, FaLink, FaFacebook, FaEnvelope } from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const shareOptions = [
    {
      name: 'Twitter',
      icon: <FaTwitter className="text-blue-400" size={24} />,
      color: 'hover:bg-blue-500/20',
      action: () => {
        const text = `Check out: ${title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="text-blue-600" size={24} />,
      color: 'hover:bg-blue-600/20',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-blue-500" size={24} />,
      color: 'hover:bg-blue-500/20',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: <FaEnvelope className="text-red-400" size={24} />,
      color: 'hover:bg-red-500/20',
      action: () => {
        const subject = `Check out: ${title}`;
        const body = `I thought you might be interested in this: ${title}\n\n${url}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      }
    },
    {
      name: 'Copy Link',
      icon: <FaLink className="text-gray-400" size={24} />,
      color: 'hover:bg-gray-500/20',
      action: () => {
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Share this post</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  onClick={option.action}
                  className={`flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-lg transition-colors border border-gray-600 ${option.color}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <span className="text-sm text-gray-300 font-medium">{option.name}</span>
                </motion.button>
              ))}
            </div>

            {/* URL Preview */}
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400 mb-1">Share URL:</p>
              <p className="text-sm text-gray-300 truncate">{url}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-3 text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;