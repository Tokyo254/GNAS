import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage, FaPaperclip, FaEye, FaCalendar, FaTag, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import CategorySelector from '../../components/categories';

interface PressReleaseFormData {
  headline: string;
  summary: string;
  fullContent: string;
  author: string;
  categories: string;
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
  user: any;
}

const PressReleaseForm: React.FC<PressReleaseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  user
}) => {
  const [formData, setFormData] = useState<PressReleaseFormData>({
    headline: initialData?.headline || '',
    summary: initialData?.summary || '',
    fullContent: initialData?.fullContent || '',
    author: user?.fullName || '',
    categories: initialData?.categories || '',
    attachments: initialData?.attachments || [],
    featuredImage: initialData?.featuredImage,
    publicationDate: initialData?.publicationDate || new Date().toISOString().split('T')[0],
    status: 'Under Review'
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories ? initialData.categories.split(',').map(category => category.trim()).filter(category => category !== '') : []
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [contentError, setContentError] = useState<string>('');

  useEffect(() => {
    if (formData.featuredImage) {
      setImagePreview(URL.createObjectURL(formData.featuredImage));
    }
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [formData.featuredImage]);

  useEffect(() => {
    // Calculate word count
    const words = formData.fullContent.trim() ? formData.fullContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
    
    if (words > 300) {
      setContentError(`Content exceeds 300 words (current: ${words})`);
    } else {
      setContentError('');
    }
  }, [formData.fullContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'attachments' | 'featuredImage') => {
    const files = e.target.files;
    if (files) {
      if (field === 'attachments') {
        setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...Array.from(files)] }));
      } else {
        setFormData(prev => ({ ...prev, featuredImage: files[0] }));
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const handleRemoveFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: undefined }));
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate word count
    if (wordCount > 300) {
      alert('Please reduce content to 300 words or less');
      return;
    }

    // Validate required fields including categories
    if (!formData.headline.trim() || !formData.summary.trim() || !formData.fullContent.trim() || selectedCategories.length === 0) {
      alert('Please fill in all required fields including at least one category');
      return;
    }

    // Convert selected categories to comma-separated string for form data
    const formDataWithCategories = {
      ...formData,
      categories: selectedCategories.join(', ')
    };

    onSubmit(formDataWithCategories);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0d1117]/90 backdrop-blur-md rounded-xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-gray-700/50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          {/* Form Section - Left */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto border-b md:border-r md:border-b-0 border-gray-700/50 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-cyan-500/50 hover:scrollbar-thumb-cyan-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {mode === 'edit' ? 'Edit Press Release' : 'Create New Press Release'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Headline *
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter compelling headline..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Summary / Teaser *
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 backdrop-blur-sm resize-none"
                  rows={3}
                  placeholder="Brief summary that grabs attention..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Content * ({wordCount}/300 words)
                  {contentError && (
                    <span className="text-red-400 text-sm ml-2 flex items-center gap-1">
                      <FaExclamationTriangle /> {contentError}
                    </span>
                  )}
                </label>
                <textarea
                  name="fullContent"
                  value={formData.fullContent}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    contentError ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 backdrop-blur-sm resize-none`}
                  rows={8}
                  placeholder="Write your full press release content (max 300 words)..."
                  required
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={`${wordCount > 300 ? 'text-red-400' : 'text-gray-400'}`}>
                    {wordCount} / 300 words
                  </span>
                  {wordCount > 300 && (
                    <span className="text-red-400 font-medium">
                      Please reduce by {wordCount - 300} words
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author *
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 backdrop-blur-sm">
                    <FaUser className="text-cyan-400" />
                    <span>{formData.author}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pre-filled from your profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publication Date *
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 backdrop-blur-sm">
                    <FaCalendar className="text-cyan-400" />
                    <span>{new Date(formData.publicationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Automatically set to today</p>
                </div>
              </div>

              {/* Replace the old categories input with CategorySelector */}
              <CategorySelector
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                maxSelection={5}
                label="Select Categories *"
                required={true}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Featured Image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'featuredImage')}
                      className="hidden"
                      id="featuredImage"
                    />
                    <label
                      htmlFor="featuredImage"
                      className="bg-gray-700/80 hover:bg-gray-600/80 text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer text-sm transition-all duration-200 border border-gray-600 hover:border-cyan-500/50 backdrop-blur-sm"
                    >
                      <FaImage /> Upload Image
                    </label>
                    {imagePreview && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-12 rounded overflow-hidden border border-gray-600 backdrop-blur-sm">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                          onClick={handleRemoveFeaturedImage}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800/50 border border-yellow-600 rounded-lg px-4 py-3 text-yellow-400 backdrop-blur-sm">
                    <span>Under Review</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">All new releases require approval</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileChange(e, 'attachments')}
                  className="hidden"
                  id="attachments"
                />
                <label
                  htmlFor="attachments"
                  className="bg-gray-700/80 hover:bg-gray-600/80 text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer text-sm transition-all duration-200 border border-gray-600 hover:border-cyan-500/50 backdrop-blur-sm w-fit"
                >
                  <FaPaperclip /> Upload Attachments
                </label>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="text-gray-300 text-sm bg-gray-800/50 px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700 backdrop-blur-sm">
                        <FaPaperclip className="text-cyan-400" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-gray-500 text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/80 text-base font-medium transition-all duration-200 border border-gray-600 hover:border-gray-500 active:scale-95 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!contentError}
                  className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 border active:scale-95 backdrop-blur-sm ${
                    contentError 
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-gray-600' 
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600 shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {mode === 'edit' ? 'Update Release' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section - Right */}
          <div className="w-full md:w-1/2 bg-gray-900/80 backdrop-blur-md p-6 overflow-y-auto border-t md:border-l md:border-t-0 border-gray-700/50 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-cyan-500/50 hover:scrollbar-thumb-cyan-500">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-700/50">
              <FaEye className="text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Live Preview</h3>
            </div>

            <div className="bg-[#161B22]/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-xl shadow-black/20">
              {/* Header Section */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {formData.headline || 'Your Press Release Headline'}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-cyan-400" />
                    <span>
                      {formData.publicationDate 
                        ? new Date(formData.publicationDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUser className="text-cyan-400" />
                    <span>{formData.author || 'Author Name'}</span>
                  </div>
                </div>

                {/* Featured Image */}
                {imagePreview && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-gray-600/50">
                    <img 
                      src={imagePreview} 
                      alt="Featured" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Summary/Teaser */}
              {formData.summary && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-l-4 border-cyan-500 backdrop-blur-sm">
                  <p className="text-gray-300 text-base leading-relaxed italic">
                    {formData.summary}
                  </p>
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {formData.fullContent ? (
                    formData.fullContent.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-base">
                          {paragraph}
                        </p>
                      )
                    ))
                  ) : (
                    <div className="text-gray-500 italic">
                      Your full press release content will appear here...
                    </div>
                  )}
                </div>
              </div>

              {/* Categories Section */}
              {selectedCategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <FaTag className="text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Categories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-gray-800/80 text-cyan-400 text-sm rounded-full border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200 backdrop-blur-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments Preview */}
              {formData.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/80 rounded-lg hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm border border-gray-700/50">
                        <FaPaperclip className="text-cyan-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 text-sm truncate">{file.name}</p>
                          <p className="text-gray-500 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium backdrop-blur-sm border border-yellow-500/30">
                    Under Review
                  </span>
                </div>
              </div>
            </div>

            {/* Word Count Warning */}
            {contentError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 text-red-400">
                  <FaExclamationTriangle />
                  <span className="text-sm">{contentError}</span>
                </div>
              </div>
            )}

            {/* Preview Help Text */}
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Changes in the form are instantly reflected in this preview
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PressReleaseForm;