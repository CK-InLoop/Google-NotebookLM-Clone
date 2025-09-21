import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  citations?: Array<{
    text: string;
    page: number;
    score: number;
  }>;
};

type ChatContextType = {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (text: string, documentId?: string) => Promise<void>;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (text: string, documentId?: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // In a real app, you would make an API call to your backend
      // const response = await api.post('/chat/message', { message: text, documentId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: `This is a simulated response to: "${text}"`,
        timestamp: new Date(),
        citations: [
          {
            text: 'This is a sample citation from the document.',
            page: 1,
            score: 0.95
          }
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isProcessing,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
