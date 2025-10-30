// components/blog/BookmarkButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

interface BookmarkButtonProps {
  bookmarked: boolean;
  onBookmark: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  bookmarked, 
  onBookmark, 
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <motion.button
      onClick={onBookmark}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`rounded-lg transition-all duration-200 border ${
        bookmarked
          ? 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/30'
          : 'bg-gray-800/50 text-gray-400 border-gray-600 hover:bg-gray-700/50'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${sizeClasses[size]}`}
    >
      <motion.div
        animate={{ scale: bookmarked ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {bookmarked ? (
          <FaBookmark size={iconSizes[size]} />
        ) : (
          <FaRegBookmark size={iconSizes[size]} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default BookmarkButton;