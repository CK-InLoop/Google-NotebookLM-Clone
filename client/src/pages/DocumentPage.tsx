import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePDF } from '../contexts/PDFContext';
import ChatInterface from '../components/ChatInterface';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { file, numPages, currentPage, setCurrentPage, onDocumentLoadSuccess } = usePDF();
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showChat, setShowChat] = useState(true);

  // Set up resize observer to handle container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle document loading
  const handleLoadSuccess = (pdf: any) => {
    onDocumentLoadSuccess({ numPages: pdf.numPages });
    setIsLoading(false);
  };

  // Handle page navigation
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setCurrentPage((prev) => Math.min(prev + 1, numPages));
    }
  };

  // Handle zoom in/out
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Handle page number input
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber = Number(e.target.value);
    if (pageNumber >= 1 && numPages && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Navigate to a specific page from chat citation
  const navigateToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // You could add smooth scrolling to the page here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            {file?.name || 'Document'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ArrowPathIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <div 
          ref={containerRef}
          className={`${showChat ? 'w-2/3' : 'w-full'} h-full overflow-auto bg-gray-200 p-4`}
        >
          <div className="flex flex-col items-center">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-700">Loading document...</span>
              </div>
            )}

            {file && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Document
                  file={file}
                  onLoadSuccess={handleLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-700">Loading page {currentPage}...</span>
                    </div>
                  }
                  error={
                    <div className="p-8 text-center text-red-600">
                      Failed to load PDF. Please try again.
                    </div>
                  }
                >
                  <Page 
                    pageNumber={currentPage} 
                    width={Math.min(containerWidth * 0.9, 1000) * scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <div className="flex flex-col w-1/3 h-full border-l border-gray-200 bg-white">
            <ChatInterface 
              documentId={id || ''} 
              onNavigateToPage={navigateToPage} 
            />
          </div>
        )}
      </div>

      {/* PDF Controls */}
      <div className="flex items-center justify-between p-2 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className={`p-1 rounded-md ${scale <= 0.5 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-lg font-bold">−</span>
          </button>
          <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className={`p-1 rounded-md ${scale >= 2.0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-lg font-bold">+</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className={`p-1 rounded-md ${currentPage <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-lg">←</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={currentPage}
              onChange={handlePageChange}
              className="w-12 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <span className="text-sm text-gray-600">of {numPages || '--'}</span>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={!numPages || currentPage >= numPages}
            className={`p-1 rounded-md ${
              !numPages || currentPage >= numPages 
                ? 'text-gray-300' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="w-24">
          {/* Empty div for layout balance */}
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
