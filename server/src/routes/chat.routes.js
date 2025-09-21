import { Router } from 'express';
import { sendMessage, getChatHistory } from '../controllers/chat.controller.js';

const router = Router();

// Chat routes
router.post('/message', sendMessage);
router.get('/history/:documentId', getChatHistory);

export default router;
