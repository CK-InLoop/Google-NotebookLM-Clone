import { Router } from 'express';
import { uploadDocument, getDocument, deleteDocument } from '../controllers/document.controller.js';

const router = Router();

// Document routes
router.post('/upload', uploadDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;
