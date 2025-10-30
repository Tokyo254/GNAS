// components/blog/CommentCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiThumbsUp, FiCornerUpRight, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { FaRegCheckCircle, FaCheckCircle } from 'react-icons/fa';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  likes: string[];
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
  edited?: boolean;
}

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  depth?: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  depth = 0
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showOptions, setShowOptions] = useState(false);

  const userLiked = currentUserId ? comment.likes.includes(currentUserId) : false;
  const isAuthor = currentUserId === comment.author._id;
  const maxDepth = 3; // Maximum nesting depth

  const handleLike = () => {
    onLike(comment._id);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && onEdit) {
      onEdit(comment._id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment._id);
    }
    setShowOptions(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}>
      <motion.div 
        className="bg-gray-800/30 rounded-lg p-4 mb-4 border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-3">
          {/* Author Avatar */}
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Comment Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white text-sm">
                  {comment.author.name}
                </span>
                {comment.author.verified && (
                  <span className="text-cyan-400 text-xs">
                    {comment.author.verified ? (
                      <FaCheckCircle size={12} />
                    ) : (
                      <FaRegCheckCircle size={12} />
                    )}
                  </span>
                )}
              </div>
              
              <span className="text-gray-400 text-xs">
                {formatDate(comment.createdAt)}
              </span>

              {comment.edited && (
                <span className="text-gray-500 text-xs">(edited)</span>
              )}

              {/* Options Menu */}
              {(isAuthor || onDelete) && (
                <div className="relative ml-auto">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                  >
                    <FiMoreVertical size={14} />
                  </button>

                  {showOptions && (
                    <div className="absolute right-0 top-6 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                      {isAuthor && onEdit && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowOptions(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <FiEdit size={14} />
                          Edit
                        </button>
                      )}
                      {(isAuthor || onDelete) && (
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Content */}
            {isEditing ? (
              <form onSubmit={handleEdit} className="mb-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={!editContent.trim()}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {comment.content}
              </p>
            )}

            {/* Comment Actions */}
            {!isEditing && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    userLiked ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <FiThumbsUp className={userLiked ? 'fill-cyan-400' : ''} size={14} />
                  {comment.likesCount}
                </button>

                {depth < maxDepth && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 text-xs transition-colors"
                  >
                    <FiCornerUpRight size={14} />
                    Reply
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 pl-13">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Post Reply
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.map((reply) => (
        <CommentCard
          key={reply._id}
          comment={reply}
          onLike={onLike}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default CommentCard;