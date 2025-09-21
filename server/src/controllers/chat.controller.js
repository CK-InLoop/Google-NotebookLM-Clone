import { Configuration, OpenAIApi } from 'openai';
import { searchDocuments } from '../services/document.service.js';

// Initialize OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// In-memory storage for chat history (in a real app, use a database)
const chatHistory = new Map();

export const sendMessage = async (req, res, next) => {
    try {
        const { documentId, message, history = [] } = req.body;
        
        if (!documentId || !message) {
            return res.status(400).json({ error: 'Document ID and message are required' });
        }

        // In a real app, you would:
        // 1. Retrieve the document from your database
        // 2. Search for relevant document chunks using the message
        // 3. Use the relevant chunks as context for the AI
        
        // For now, we'll use a simplified implementation
        const relevantChunks = [
            { 
                text: 'This is a sample relevant text chunk from the document.',
                page: 1,
                score: 0.95
            }
        ];
        
        // Prepare the prompt with context from the document
        const context = relevantChunks
            .map(chunk => `[Page ${chunk.page}] ${chunk.text}`)
            .join('\n\n');
            
        const prompt = `You are an AI assistant helping a user with their document. 
        Use the following context from the document to answer the question. 
        If the answer isn't in the document, say so.
        
        Document Context:
        ${context}
        
        User Question: ${message}
        
        Answer:`;
        
        // Call OpenAI API
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that answers questions about the provided document.'
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                })),
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        
        const aiResponse = completion.data.choices[0].message.content;
        
        // Format the response with citations
        const response = {
            text: aiResponse,
            citations: relevantChunks.map(chunk => ({
                text: chunk.text,
                page: chunk.page,
                score: chunk.score
            })),
            timestamp: new Date().toISOString()
        };
        
        // Update chat history (in-memory, would be a database in production)
        if (!chatHistory.has(documentId)) {
            chatHistory.set(documentId, []);
        }
        
        chatHistory.get(documentId).push(
            { sender: 'user', text: message, timestamp: new Date().toISOString() },
            { sender: 'ai', ...response }
        );
        
        res.json(response);
        
    } catch (error) {
        console.error('Error processing chat message:', error);
        next(error);
    }
};

export const getChatHistory = (req, res, next) => {
    try {
        const { documentId } = req.params;
        const history = chatHistory.get(documentId) || [];
        res.json(history);
    } catch (error) {
        console.error('Error getting chat history:', error);
        next(error);
    }
};
