import { motion } from 'framer-motion';
import { FaUserCircle, FaCalendar, FaTag, FaPaperclip } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface PressRelease {
  _id: string;
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  tags: string[];
  attachments: string[];
  featuredImage?: string;
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
  createdAt?: string;
  updatedAt?: string;
}

interface PressReleasePreviewProps {
  release: PressRelease;
  isOpen: boolean;
  onClose: () => void;
}

const PressReleasePreview: React.FC<PressReleasePreviewProps> = ({ release, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <motion.div
        className="bg-[#0d1117] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto ring-1 ring-slate-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#0d1117]">
          <h2 className="text-lg font-bold text-white">Press Release Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {release.featuredImage && (
            <div className="w-full h-48 sm:h-64 bg-slate-800 rounded-lg overflow-hidden">
              <img 
                src={`http://localhost:5000/${release.featuredImage}`} 
                alt="Featured" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-2">{release.headline}</h1>
            <p className="text-sm text-gray-300 italic mb-3">{release.summary}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-cyan-400" />
                <span>By {release.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-cyan-400" />
                <span>{new Date(release.publicationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTag className="text-cyan-400" />
                <span>{release.tags.join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {release.fullContent}
            </div>
          </div>
          {release.attachments && release.attachments.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-base font-semibold text-white mb-3">Attachments</h3>
              <div className="space-y-2">
                {release.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                    <FaPaperclip className="text-cyan-400 text-sm" />
                    <a href={`http://localhost:5000/${attachment}`} target="_blank" className="text-gray-300 text-sm hover:underline">
                      {attachment.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-slate-800 pt-4">
            <div className="text-xs text-gray-400 space-y-2">
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${release.status === 'Published' ? 'bg-green-500/20 text-green-400' : release.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{release.status}</span></p>
              {release.createdAt && (
                <p><strong>Created:</strong> {new Date(release.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PressReleasePreview;