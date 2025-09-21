import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useChat } from '../contexts/ChatContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  citations?: Array<{
    text: string;
    page: number;
    score: number;
  }>;
}

interface ChatInterfaceProps {
  documentId: string;
  onNavigateToPage: (pageNumber: number) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ documentId, onNavigateToPage }) => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isProcessing, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    await sendMessage(inputValue, documentId);
    setInputValue('');
  };

  // Format message timestamp
  const formatTime = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Chat with Document</h2>
          <button
            onClick={clearChat}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Clear Chat
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Ask questions about the document</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="p-3 mb-4 rounded-full bg-primary-100 text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Ask about this document</h3>
            <p className="max-w-md mt-1">
              Ask questions, request summaries, or get explanations about the content.
            </p>
            <div className="grid grid-cols-1 gap-3 mt-6 sm:grid-cols-2">
              {[
                'Summarize this document',
                'What are the key points?',
                'Explain the main concepts',
                'Find relevant sections about...',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="px-4 py-2 text-sm text-left text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  
                  {/* Citations */}
                  {message.sender === 'ai' && message.citations && message.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-300">
                      <p className="text-xs font-medium text-gray-500">Sources:</p>
                      <div className="mt-1 space-y-1">
                        {message.citations.map((citation, index) => (
                          <button
                            key={index}
                            onClick={() => onNavigateToPage(citation.page)}
                            className="block w-full px-2 py-1 text-xs text-left text-gray-700 bg-white bg-opacity-50 rounded hover:bg-opacity-70"
                          >
                            <span className="font-medium">Page {citation.page}:</span>{' '}
                            <span className="line-clamp-2">{citation.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`mt-1 text-xs ${
                      message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-start">
                <div className="px-4 py-2 bg-gray-100 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about the document..."
              className="w-full px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              onClick={() => {
                // In a real app, you might add file attachment functionality here
                document.getElementById('file-upload')?.click();
              }}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <input type="file" id="file-upload" className="hidden" />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md ${
              !inputValue.trim() || isProcessing
                ? 'bg-primary-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            <PaperAirplaneIcon className="w-5 h-5 -ml-1 mr-2" />
            {isProcessing ? 'Sending...' : 'Send'}
          </button>
        </form>
        <p className="mt-2 text-xs text-center text-gray-500">
          AI-powered responses may not always be accurate. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
