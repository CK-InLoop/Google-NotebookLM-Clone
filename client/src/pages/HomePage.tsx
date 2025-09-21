import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentTextIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePDF } from '../contexts/PDFContext';

const HomePage = () => {
  const { setFile } = usePDF();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid PDF file');
      return false;
    }
    
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size should be less than 50MB');
      return false;
    }
    
    return true;
  };

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      // In a real app, you would upload the file to your server here
      // const formData = new FormData();
      // formData.append('document', file);
      // const response = await api.post('/documents/upload', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(progress);
      //   },
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Set the file in context
      setFile(file);
      
      // In a real app, you would use the document ID from the response
      const documentId = 'temp-' + Date.now();
      
      // Navigate to the document page
      navigate(`/document/${documentId}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [navigate, setFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Upload a document to get started
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-500">
            Upload a PDF document to start interacting with it using AI. Ask questions, get summaries, and more.
          </p>
        </div>

        <div 
          className={`mt-10 border-2 border-dashed rounded-lg ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="px-6 py-12 text-center">
            <DocumentTextIcon 
              className={`w-12 h-12 mx-auto ${
                dragActive ? 'text-primary-500' : 'text-gray-400'
              }`} 
              aria-hidden="true" 
            />
            
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative font-medium text-primary-600 bg-white rounded-md cursor-pointer hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PDF up to 50MB
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-medium text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-center text-gray-500 uppercase tracking-wider">
            Or try one of these examples
          </h2>
          <ul className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
            {[
              { name: 'Research Paper', description: 'Upload a research paper to analyze' },
              { name: 'Legal Document', description: 'Get insights from legal documents' },
              { name: 'Academic Paper', description: 'Summarize and ask questions' },
              { name: 'Technical Manual', description: 'Find information quickly' },
            ].map((example) => (
              <li
                key={example.name}
                className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50"
                onClick={() => {
                  // In a real app, you would load a sample document
                  alert('This is a demo. In a real app, this would load a sample document.');
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary-100 text-primary-600">
                    <DocumentTextIcon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{example.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{example.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
