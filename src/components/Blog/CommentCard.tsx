// components/blog/CommentCard.tsx
import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

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

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  currentUserId
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUserId && comment.author?._id === currentUserId;
  const isLiked = currentUserId ? comment.likes.includes(currentUserId) : false;

  const handleLike = () => {
    if (currentUserId) {
      onLike(comment._id);
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
  };

  const authorName = comment.author?.name || comment.guestAuthor?.name || 'Anonymous';
  const avatar = comment.author?.avatar;
  const isVerified = comment.author?.verified || false;
  const isGuestComment = comment.isGuestComment || !comment.author;

  return (
    <div className="bg-gray-800/20 rounded-lg p-6 border border-gray-700/50">
      {/* Comment Header */}
      <div className="flex items-start gap-3 mb-4">
        {avatar ? (
          <img
            src={avatar}
            alt={authorName}
            className="w-10 h-10 rounded-full border-2 border-cyan-500/30"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-2 border-cyan-500/30">
            <FiUser className="text-gray-400" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{authorName}</span>
            {isVerified && (
              <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                Verified
              </span>
            )}
            {isGuestComment && (
              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                Guest
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            {comment.edited && <span className="ml-2 text-gray-500">(edited)</span>}
          </div>
        </div>
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{comment.content}</p>
      )}

      {/* Comment Actions */}
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleLike}
          disabled={!currentUserId}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FiHeart className={isLiked ? 'fill-current' : ''} />
          <span>{comment.likesCount}</span>
        </button>

        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
        >
          <FiMessageCircle />
          <span>Reply</span>
        </button>

        {isAuthor && !isGuestComment && (
          <>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <FiEdit />
              <span>Edit</span>
            </button>

            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 pl-4 border-l-2 border-cyan-500/30">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm"
            >
              Post Reply
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-cyan-500/30">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;