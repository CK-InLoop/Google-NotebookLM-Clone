import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';
import { processPDF } from '../services/document.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.files || !req.files.document) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.files.document;
        const fileExt = path.extname(file.name).toLowerCase();
        
        // Validate file type
        if (fileExt !== '.pdf') {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        // Generate unique filename
        const fileId = uuidv4();
        const fileName = `${fileId}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // Save the file
        await file.mv(filePath);

        // Process the PDF (extract text, create embeddings, etc.)
        const document = await processPDF(filePath, {
            originalName: file.name,
            fileId,
            mimeType: file.mimetype,
            size: file.size
        });

        res.status(201).json({
            message: 'File uploaded successfully',
            document: {
                id: fileId,
                name: file.name,
                size: file.size,
                pages: document.pages,
                createdAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        next(error);
    }
};

export const getDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const filePath = path.join(uploadDir, `${id}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // In a real app, you'd get this from a database
        const documentInfo = {
            id,
            name: 'Document.pdf', // This would come from your database
            size: fs.statSync(filePath).size,
            pages: 0, // You'd get this from your database
            createdAt: new Date()
        };

        res.json(documentInfo);
    } catch (error) {
        console.error('Error getting document:', error);
        next(error);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const filePath = path.join(uploadDir, `${id}.pdf`);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            // In a real app, you'd also delete the document from your database
            // and clean up any associated data (embeddings, etc.)
        }

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        next(error);
    }
};
