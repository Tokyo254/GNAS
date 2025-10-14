import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaMicrophone,
  FaHeadphones,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaCalendar,
  FaUser,
} from 'react-icons/fa';
import CategorySelector from '../../components/categories';

interface AudioReleaseFormData {
  title: string;
  description: string;
  audioFile: File | null;
  transcript: string;
  categories: string;
  publicationDate: string;
  status: 'Published' | 'Under Review' | 'Draft';
}

interface AudioReleaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AudioReleaseFormData) => void;
  user: any;
}

const AudioReleaseForm: React.FC<AudioReleaseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user
}) => {
  const [formData, setFormData] = useState<AudioReleaseFormData>({
    title: '',
    description: '',
    audioFile: null,
    transcript: '',
    categories: '',
    publicationDate: new Date().toISOString().split('T')[0],
    status: 'Under Review'
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setFormData(prev => ({ ...prev, audioFile: file }));
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);

      // Get audio duration
      const audio = new Audio(previewUrl);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(Math.round(audio.duration));
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.audioFile || selectedCategories.length === 0) {
      alert('Please fill in all required fields including audio file and categories');
      return;
    }

    const formDataWithCategories = {
      ...formData,
      categories: selectedCategories.join(', ')
    };

    onSubmit(formDataWithCategories);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          className="bg-[#0d1117]/90 backdrop-blur-md rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700/50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaMicrophone className="text-purple-400" />
                Create Audio Release
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter audio release title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Describe your audio content..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio File *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audioFile"
                    required
                  />
                  <label htmlFor="audioFile" className="cursor-pointer">
                    <FaHeadphones className="text-purple-400 text-3xl mx-auto mb-3" />
                    <p className="text-gray-300 font-medium">Click to upload audio file</p>
                    <p className="text-gray-500 text-sm mt-1">MP3, WAV, or M4A files accepted</p>
                  </label>
                </div>

                {audioPreview && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlayback}
                          className="w-10 h-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                        </button>
                        <div>
                          <p className="text-white font-medium">Audio Preview</p>
                          <p className="text-gray-400 text-sm">
                            {formatTime(duration)} • {formData.audioFile?.name}
                          </p>
                        </div>
                      </div>
                      <FaVolumeUp className="text-purple-400" />
                    </div>
                    
                    {/* Audio progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transcript
                </label>
                <textarea
                  name="transcript"
                  value={formData.transcript}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                  rows={6}
                  placeholder="Optional: Add transcript for accessibility..."
                />
              </div>

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
                    Author
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-300">
                    <FaUser className="text-purple-400" />
                    <span>{user?.fullName || 'Author Name'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publication Date
                  </label>
                  <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-300">
                    <FaCalendar className="text-purple-400" />
                    <span>{new Date(formData.publicationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/80 text-base font-medium transition-all duration-200 border border-gray-600 hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-base font-medium transition-all duration-200 border border-purple-500 hover:border-purple-600 shadow-lg shadow-purple-500/20"
                >
                  Submit Audio Release
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioReleaseForm;