# NotebookLM Clone

A Google NotebookLM clone built with React and Node.js that allows users to upload PDF documents and interact with them through a chat interface powered by AI.

## Features

- **PDF Upload and Viewing**: Upload and view PDF documents directly in the browser
- **Interactive Chat Interface**: Ask questions about your documents and get AI-powered answers
- **AI-powered Document Analysis**: Uses OpenAI's GPT models to understand and analyze document content
- **Citation and Reference System**: Get references to the exact pages where information was found
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- Tailwind CSS for styling
- React PDF for PDF viewing
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB (for storing document metadata and chat history)
- OpenAI API for document analysis and chat
- Multer for file uploads
- PDF-lib for PDF processing

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- OpenAI API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/notebooklm-clone.git
cd notebooklm-clone
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

The backend server will be running at `http://localhost:5000`

### 3. Set up the frontend

In a new terminal window:

```bash
cd ../client
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (server/.env)

| Variable | Description |
|----------|-------------|
| PORT | Port to run the server on (default: 5000) |
| NODE_ENV | Node environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| OPENAI_API_KEY | Your OpenAI API key |
| JWT_SECRET | Secret for JWT token generation |
| MAX_FILE_SIZE | Maximum file size for uploads (in bytes) |
| UPLOAD_DIR | Directory to store uploaded files |

### Frontend (client/.env)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Base URL for API requests |

## Project Structure

```
notebooklm-clone/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── styles/        # Global styles
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Entry point
│   └── ...
├── server/                # Backend Node.js/Express application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── index.js      # Application entry point
│   └── ...
└── README.md             # This file
```

## Deployment

### Backend

The backend can be deployed to any Node.js hosting platform like:
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Heroku](https://www.heroku.com/)

### Frontend

The frontend can be deployed to:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com/) for their powerful language models
- [React PDF](https://react-pdf.org/) for PDF rendering
- [Vite](https://vitejs.dev/) for the awesome development experience
