import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import NotFoundPage from './pages/NotFoundPage';
import { PDFProvider } from './contexts/PDFContext';
import { ChatProvider } from './contexts/ChatContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PDFProvider>
        <ChatProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="document/:id" element={<DocumentPage />} />
                  <Route path="404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </ChatProvider>
      </PDFProvider>
    </QueryClientProvider>
  );
}

export default App;
