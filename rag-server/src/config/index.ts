import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    collection: process.env.QDRANT_COLLECTION || 'documents',
    host: new URL(process.env.QDRANT_URL || 'http://localhost:6333').hostname,
    port: parseInt(new URL(process.env.QDRANT_URL || 'http://localhost:6333').port)
  },
  embedding: {
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimension: parseInt(process.env.EMBEDDING_DIMENSION || '384', 10)
  },
  document: {
    chunkSize: parseInt(process.env.CHUNK_SIZE || '1000', 10),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200', 10),
    semanticThreshold: parseFloat(process.env.SEMANTIC_THRESHOLD || '0.5')
  }
};

// Validate required configuration
export function validateConfig() {
  const missingVars = [];
  
  if (!config.openai.apiKey) missingVars.push('OPENAI_API_KEY');
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return true;
} 