import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PDFContextType = {
  file: File | null;
  numPages: number | null;
  currentPage: number;
  setFile: (file: File | null) => void;
  setNumPages: (numPages: number | null) => void;
  setCurrentPage: (page: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
};

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  return (
    <PDFContext.Provider
      value={{
        file,
        numPages,
        currentPage,
        setFile,
        setNumPages,
        setCurrentPage,
        onDocumentLoadSuccess,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = (): PDFContextType => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};
