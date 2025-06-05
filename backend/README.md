# Customer Service AI Backend

A powerful customer service backend system built with Express.js, LangChain, and Pinecone for intelligent query processing and response generation.

## 🚀 Features

- Express.js REST API server
- Vector database integration with Pinecone
- OpenAI embeddings for semantic search
- Intelligent text processing and chunking
- Built-in knowledge base management
- Real-time chat processing

## 📋 Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Pinecone account and API key
- OpenAI API key

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
OPENAI_API_KEY=your_openai_api_key
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Initialize Pinecone knowledge base
npm run init-pinecone

# Start the server
npm start

# For development with auto-reload
npm run dev
```

## 🏗️ Project Structure

### `src/server.js`
The main Express server application:
- Handles HTTP requests
- Processes chat messages
- Provides health check endpoint
- Implements error handling

### `src/config/pinecone.js`
Pinecone configuration and sample knowledge base:
- Initializes Pinecone client
- Manages vector database connection
- Contains sample customer service data
- Handles database operations

### `src/scripts/initPinecone.js`
Knowledge base initialization script:
- Processes documents into chunks
- Generates embeddings using OpenAI
- Stores vectors in Pinecone
- Sets up initial data structure

### `src/utils/textProcessor.js`
Text processing utilities:
- Splits text into manageable chunks
- Handles document processing
- Manages metadata
- Implements recursive text splitting

## 🔌 API Endpoints

### POST `/api/chat`
Process a customer service request
- Request body: `{ "message": "your message here" }`
- Returns: `{ "status": "success", "data": response_data }`

### GET `/api/health`
Health check endpoint
- Returns: `{ "status": "ok", "timestamp": "ISO_timestamp" }`

## 🛠️ Development

The project uses several key technologies:
- Express.js for the web server
- Pinecone for vector storage
- LangChain for AI operations
- OpenAI for embeddings
- Morgan for logging
- CORS for cross-origin support

## 🔒 Security

- Environment variables for sensitive data
- Error handling middleware
- Input validation
- CORS protection

## 📝 Error Handling

The application includes comprehensive error handling:
- Request validation
- Server errors
- Database connection issues
- API integration errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 