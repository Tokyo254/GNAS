// components/blog/CommentSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiSend} from 'react-icons/fi';
import { blogService } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import CommentCard from './CommentCard';

interface GuestAuthor {
  name: string;
  email?: string;
}

interface Comment {
  _id: string;
  content: string;
  author?: {
    _id: string;
    name: string;
    avatar: string;
    verified: boolean;
    title?: string;
    company?: string;
  };
  guestAuthor?: GuestAuthor;
  likes: string[];
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
  edited?: boolean;
  isGuestComment?: boolean;
  isVerifiedAuthor?: boolean;
  authorName?: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await blogService.getComments(postId);
        
        if (response.success && response.data) {
          setComments(response.data);
        } else {
          setError(response.message || 'Failed to load comments');
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Add new comment
  const handleAddComment = async (content: string, parentComment?: string) => {
    if (!user && !guestName) return;

    try {
      setSubmitting(true);
      let response;

      if (user) {
        // Submit as authenticated user
        response = await blogService.addComment(postId, content, parentComment);
      } else {
        // Submit as guest
        response = await blogService.addGuestComment(postId, content, guestName, guestEmail, parentComment);
      }
      
      if (response.success && response.data) {
        if (parentComment) {
          // Add as reply to parent comment
          setComments(prev => 
            prev.map(comment => 
              comment._id === parentComment 
                ? { 
                    ...comment, 
                    replies: [...(comment.replies || []), response.data!] 
                  }
                : comment
            )
          );
        } else {
          // Add as top-level comment - using non-null assertion since we checked response.data
          setComments(prev => [response.data!, ...prev]);
        }
        
        // Reset form
        setNewComment('');
        setGuestName('');
        setGuestEmail('');
        setShowGuestForm(false);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Like comment
  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await blogService.likeComment(commentId);
      
      if (response.success && response.data) {
        // Use the response data safely
        const { likesCount, userLiked } = response.data;
        
        // Update comment likes in state
        const updateCommentLikes = (comments: Comment[]): Comment[] => 
          comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likesCount,
                likes: userLiked 
                  ? [...comment.likes, user.id]
                  : comment.likes.filter(id => id !== user.id)
              };
            }
            
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentLikes(comment.replies)
              };
            }
            
            return comment;
          });

        setComments(updateCommentLikes(comments));
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  // Handle reply
  const handleReply = (commentId: string, content: string) => {
    handleAddComment(content, commentId);
  };

  // Handle edit comment
  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const response = await blogService.updateComment(commentId, content);
      
      if (response.success && response.data) {
        // Update comment in state
        const updateCommentContent = (comments: Comment[]): Comment[] => 
          comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                content: response.data!.content, // Using non-null assertion
                edited: true
              };
            }
            
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentContent(comment.replies)
              };
            }
            
            return comment;
          });

        setComments(updateCommentContent(comments));
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await blogService.deleteComment(commentId);
      
      if (response.success) {
        // Remove comment from state
        const removeComment = (comments: Comment[]): Comment[] => 
          comments.filter(comment => comment._id !== commentId)
            .map(comment => {
              if (comment.replies) {
                return {
                  ...comment,
                  replies: removeComment(comment.replies)
                };
              }
              return comment;
            });

        setComments(removeComment(comments));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && (user || guestName)) {
      handleAddComment(newComment.trim());
    }
  };

  // Remove the unused handleGuestSubmit function

  if (loading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiMessageCircle className="text-cyan-400 text-xl" />
        <h3 className="text-2xl font-bold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <motion.form 
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-800/20 rounded-lg p-6 border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          rows={4}
        />
        
        {/* Guest Information Fields */}
        {!user && showGuestForm && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name *"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Your email (optional)"
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-400 text-sm">
            {user 
              ? `Commenting as ${user.name}` 
              : showGuestForm 
                ? 'Commenting as guest' 
                : 'Join the discussion...'
            }
          </p>
          
          <div className="flex gap-3">
            {!user && !showGuestForm && (
              <button
                type="button"
                onClick={() => setShowGuestForm(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Continue as Guest
              </button>
            )}
            
            {!user && showGuestForm && (
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={!newComment.trim() || submitting || (!user && !guestName)}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              <FiSend size={16} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>

        {!user && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              💡 <strong>Want to verify your identity?</strong>{' '}
              <button 
                type="button"
                onClick={() => {/* Navigate to sign in */}}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Sign in
              </button>{' '}
              to comment with your verified profile.
            </p>
          </div>
        )}
      </motion.form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageCircle className="text-gray-500 text-4xl mx-auto mb-4" />
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment as any} // Temporary fix for type mismatch
              onLike={handleLikeComment}
              onReply={handleReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={user?.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;