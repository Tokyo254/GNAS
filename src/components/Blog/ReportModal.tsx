// components/blog/ReportModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  userReported?: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userReported = false 
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    {
      value: 'Factual Inaccuracies',
      description: 'The content contains incorrect facts or misleading information'
    },
    {
      value: 'Misleading Information',
      description: 'The content is presented in a way that could mislead readers'
    },
    {
      value: 'Source Issues',
      description: 'Sources are missing, unreliable, or improperly cited'
    },
    {
      value: 'Plagiarism Concerns',
      description: 'Content appears to be copied from other sources without attribution'
    },
    {
      value: 'Spam or Promotion',
      description: 'This appears to be promotional content or spam'
    },
    {
      value: 'Other',
      description: 'Other concerns not covered by the above categories'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason || !details.trim()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(selectedReason, details.trim());
      setSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSelectedReason('');
        setDetails('');
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setDetails('');
      setSubmitted(false);
      onClose();
    }
  };

  if (userReported) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Already Reported</h3>
                <p className="text-gray-400 mb-6">
                  You have already reported this content. Our moderation team will review it shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Report Submitted</h3>
                <p className="text-gray-400">
                  Thank you for your report. Our moderation team will review it shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Report Content Concern</h3>
                    <p className="text-gray-400 text-sm">
                      Help us maintain content quality and authenticity
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Reason for reporting *
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {reportReasons.map((reason) => (
                        <label
                          key={reason.value}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedReason === reason.value
                              ? 'bg-cyan-500/10 border-cyan-500/50'
                              : 'bg-gray-800/30 border-gray-600 hover:bg-gray-700/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="reportReason"
                            value={reason.value}
                            checked={selectedReason === reason.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="mt-1 text-cyan-500 focus:ring-cyan-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">
                              {reason.value}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              {reason.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specific details *
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                      placeholder="Please provide specific details and, if possible, sources to support your claim..."
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Your report is confidential and will be reviewed by our moderation team
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedReason || !details.trim() || isSubmitting}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;