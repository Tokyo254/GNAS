import React from 'react';
import { FaComment, FaEnvelope, FaEye, FaCheck, FaFlag } from 'react-icons/fa';

interface WhistleblowerMessageCardProps {
  message: {
    _id: string;
    type: 'comment' | 'message';
    content: string;
    author: {
      name: string;
      email: string;
    };
    status: string;
    severity: string;
    createdAt: string;
    relatedPost?: {
      title: string;
      url: string;
    };
  };
  onStatusUpdate: (id: string, status: string) => void;
}

const WhistleblowerMessageCard: React.FC<WhistleblowerMessageCardProps> = ({ 
  message, 
  onStatusUpdate 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${getSeverityColor(message.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {message.type === 'comment' ? (
              <FaComment className="text-blue-400" />
            ) : (
              <FaEnvelope className="text-green-400" />
            )}
            <span className="text-sm font-medium text-gray-300 capitalize">
              {message.type} • {message.severity}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-200 mb-2">{message.content}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>By: {message.author.name} ({message.author.email})</span>
            {message.relatedPost && (
              <span>Post: {message.relatedPost.title}</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onStatusUpdate(message._id, 'reviewed')}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors hover:bg-gray-700/50 rounded-lg"
            title="Mark as Reviewed"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => onStatusUpdate(message._id, 'resolved')}
            className="p-2 text-green-400 hover:text-green-300 transition-colors hover:bg-gray-700/50 rounded-lg"
            title="Mark as Resolved"
          >
            <FaCheck size={14} />
          </button>
          <button
            onClick={() => onStatusUpdate(message._id, 'flagged')}
            className="p-2 text-red-400 hover:text-red-300 transition-colors hover:bg-gray-700/50 rounded-lg"
            title="Flag for Follow-up"
          >
            <FaFlag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhistleblowerMessageCard;