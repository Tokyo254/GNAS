import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaFileAlt, FaFileCsv, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface BulkReleaseUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

const BulkReleaseUpload: React.FC<BulkReleaseUploadProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
    
    // Preview CSV data
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.split('\n').slice(0, 6); // Preview first 5 rows
      const preview = lines.map(line => line.split(',').map(cell => cell.trim()));
      setPreviewData(preview);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      
      // Mock result - replace with actual API response
      setUploadResult({
        success: 15,
        failed: 1,
        errors: [
          'Row 7: Missing required headline field'
        ]
      });
      
      setSelectedFile(null);
      setPreviewData([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const csvTemplate = `headline,summary,fullContent,categories,publicationDate,status
"Tech Company Launches New AI Platform","Revolutionary AI platform set to transform industry standards","Full detailed content about the AI platform launch...","Technology,AI",2024-01-15,Under Review
"Global Corporation Q4 Earnings Report","Record-breaking quarterly results announced","Complete earnings report and financial analysis...","Finance,Earnings",2024-01-10,Published`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'press_releases_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          className="bg-[#0d1117]/90 backdrop-blur-md rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700/50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaFileAlt className="text-cyan-400" />
                Bulk Upload Press Releases
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!uploadResult ? (
              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <FaExclamationTriangle />
                    Upload Instructions
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Upload a CSV file with press release data</li>
                    <li>• Required fields: headline, summary, fullContent, categories</li>
                    <li>• Optional fields: publicationDate, status (default: Under Review)</li>
                    <li>• Categories should be comma-separated (e.g., "Technology,Finance")</li>
                    <li>• Content is limited to 300 words per release</li>
                  </ul>
                </div>

                {/* Download Template */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Download CSV template:</span>
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm transition-all"
                  >
                    <FaFileCsv />
                    Download Template
                  </button>
                </div>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 hover:border-cyan-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <FaUpload className="text-3xl text-gray-400 mx-auto mb-4" />
                  
                  {!selectedFile ? (
                    <>
                      <p className="text-gray-300 font-medium mb-2">
                        Drag & drop your CSV file here
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        or click to browse files
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all"
                      >
                        Select CSV File
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <FaCheck className="text-green-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-300 font-medium">{selectedFile.name}</p>
                      <p className="text-gray-500 text-sm">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-3 text-red-400 hover:text-red-300 text-sm"
                      >
                        Choose different file
                      </button>
                    </div>
                  )}
                </div>

                {/* Preview Table */}
                {previewData.length > 0 && (
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Data Preview (First 5 rows):</h4>
                    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-600">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-700/50">
                              {previewData[0]?.map((header, index) => (
                                <th key={index} className="text-left p-3 text-gray-300 font-medium">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-gray-700/50">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="p-3 text-gray-400 max-w-xs truncate">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {selectedFile && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/80 transition-all border border-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          Upload {previewData.length - 1} Releases
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Upload Results */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-400 text-2xl" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Upload Complete!</h3>
                <p className="text-gray-400 mb-6">
                  Successfully processed {uploadResult.success + uploadResult.failed} press releases
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-400">{uploadResult.success}</p>
                    <p className="text-gray-400 text-sm">Successful</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-400">{uploadResult.failed}</p>
                    <p className="text-gray-400 text-sm">Failed</p>
                  </div>
                </div>

                {uploadResult.errors.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-left">
                    <h4 className="text-red-400 font-medium mb-2">Errors:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all"
                  >
                    Upload Another File
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/80 transition-all border border-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkReleaseUpload;