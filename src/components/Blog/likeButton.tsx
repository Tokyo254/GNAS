// components/blog/LikeButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface LikeButtonProps {
  likes: number;
  userLiked: boolean;
  onLike: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  likes, 
  userLiked, 
  onLike, 
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <motion.button
      onClick={onLike}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`flex items-center gap-2 rounded-lg transition-all duration-200 border ${
        userLiked
          ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30'
          : 'bg-gray-800/50 text-gray-400 border-gray-600 hover:bg-gray-700/50'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${sizeClasses[size]}`}
    >
      <motion.div
        animate={{ scale: userLiked ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {userLiked ? (
          <FaHeart className="text-red-500" size={iconSizes[size]} />
        ) : (
          <FaRegHeart size={iconSizes[size]} />
        )}
      </motion.div>
      <span className="font-medium">{likes}</span>
    </motion.button>
  );
};

export default LikeButton;