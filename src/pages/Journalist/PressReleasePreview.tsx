import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendar, FaUser, FaPaperclip } from 'react-icons/fa';

interface PressRelease {
  _id: string;
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  categories: string[]; // Changed from tags to categories
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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0d1117] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Press Release Preview</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{release.headline}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <FaCalendar className="text-cyan-400" />
                  <span>{new Date(release.publicationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUser className="text-cyan-400" />
                  <span>{release.author}</span>
                </div>
              </div>

              {release.featuredImage && (
                <div className="my-4">
                  <img 
                    src={`http://localhost:5000${release.featuredImage}`} 
                    alt="Featured" 
                    className="w-full h-auto max-h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg italic border-l-4 border-cyan-500 pl-4">
                  {release.summary}
                </p>
                <div className="text-gray-300 mt-4 whitespace-pre-line">
                  {release.fullContent}
                </div>
              </div>

              {release.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {release.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {release.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {release.attachments.map((attachment, index) => (
                      <div key={index} className="text-gray-300 text-sm bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
                        <FaPaperclip className="text-cyan-400" />
                        <span>{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PressReleasePreview;