import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { blogService } from '../../utils/api';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
  onLikeUpdate?: (likes: number, liked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  postId, 
  initialLikes, 
  initialLiked, 
  onLikeUpdate,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLike = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    
    // Optimistic update
    const newLikedState = !liked;
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;
    
    setLiked(newLikedState);
    setLikes(newLikesCount);
    
    try {
      const response = await blogService.likePost(postId);
      
      if (response.success && response.data) {
        // Use server data to ensure consistency
        setLikes(Number(response.data.likesCount));
        setLiked(response.data.userLiked);
        onLikeUpdate?.(Number(response.data.likesCount), response.data.userLiked);
      } else {
        // Revert optimistic update on error
        setLiked(!newLikedState);
        setLikes(initialLikes);
        console.error('Like failed:', response.message);
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLikedState);
      setLikes(initialLikes);
      console.error('Like error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading || disabled}
      whileHover={{ scale: (isLoading || disabled) ? 1 : 1.05 }}
      whileTap={{ scale: (isLoading || disabled) ? 1 : 0.95 }}
      className={`flex items-center gap-2 rounded-lg transition-all duration-200 border ${
        liked
          ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30'
          : 'bg-gray-800/50 text-gray-400 border-gray-600 hover:bg-gray-700/50 hover:text-white'
      } ${
        (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${sizeClasses[size]} ${className}`}
    >
      <motion.div
        animate={{ 
          scale: liked ? [1, 1.3, 1] : 1,
          transition: { duration: 0.3 }
        }}
      >
        {liked ? (
          <FaHeart className="text-red-500" size={iconSizes[size]} />
        ) : (
          <FaRegHeart size={iconSizes[size]} />
        )}
      </motion.div>
      <span className="font-medium">{likes}</span>
      
      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"
        />
      )}
    </motion.button>
  );
};

export default LikeButton;