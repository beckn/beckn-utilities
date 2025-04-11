# RAG Server

A Retrieval-Augmented Generation (RAG) server using Qdrant vector database.

## Installation Steps

### Prerequisites
- Node.js (v16+)
- Docker Desktop

### 1. Setup Environment
```bash
# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
```

### 2. Setup Qdrant
```bash
# Start Docker Desktop and wait for it to fully start

# Create storage directory
mkdir -p qdrant_storage

# Start Qdrant container
docker run -d --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v "$(pwd)/qdrant_storage:/qdrant/storage" \
  qdrant/qdrant

# Verify Qdrant is running
curl http://localhost:6333/collections
```

### 3. Index Documents
```bash
# Add your documents to docs/ directory

# Build and index
npm run build
npm run index
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### Test API
```bash
curl -X POST http://localhost:3000/api/search/vector \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Beckn protocol?"}'
```