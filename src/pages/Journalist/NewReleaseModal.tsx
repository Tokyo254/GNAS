import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage, FaPaperclip } from 'react-icons/fa';

interface PressReleaseFormData {
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  tags: string;
  attachments: File[];
  featuredImage?: File;
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
}

interface PressReleaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PressReleaseFormData) => void;
  initialData?: Partial<PressReleaseFormData>;
  mode?: 'create' | 'edit';
}

const PressReleaseForm: React.FC<PressReleaseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<PressReleaseFormData>({
    headline: initialData?.headline || '',
    summary: initialData?.summary || '',
    fullContent: initialData?.fullContent || '',
    author: initialData?.author || '',
    tags: initialData?.tags || '',
    attachments: initialData?.attachments || [],
    featuredImage: initialData?.featuredImage,
    publicationDate: initialData?.publicationDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'Draft'
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.featuredImage) {
      setImagePreview(URL.createObjectURL(formData.featuredImage));
    }
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [formData.featuredImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'attachments' | 'featuredImage') => {
    const files = e.target.files;
    if (files) {
      if (field === 'attachments') {
        setFormData(prev => ({ ...prev, attachments: Array.from(files) }));
      } else {
        setFormData(prev => ({ ...prev, featuredImage: files[0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
          className="bg-[#0d1117] rounded-lg w-full max-w-2xl p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">{mode === 'edit' ? 'Edit Press Release' : 'New Press Release'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Content</label>
              <textarea
                name="fullContent"
                value={formData.fullContent}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                rows={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                disabled
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Featured Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'featuredImage')}
                  className="hidden"
                  id="featuredImage"
                />
                <label
                  htmlFor="featuredImage"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer text-sm"
                >
                  <FaImage /> Upload Image
                </label>
                {imagePreview && (
                  <div className="w-16 h-10 rounded overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Attachments</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'attachments')}
                className="hidden"
                id="attachments"
              />
              <label
                htmlFor="attachments"
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer text-sm"
              >
                <FaPaperclip /> Upload Attachments
              </label>
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="text-gray-300 text-xs">{file.name}</div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Publication Date</label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm"
              >
                {mode === 'edit' ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PressReleaseForm;