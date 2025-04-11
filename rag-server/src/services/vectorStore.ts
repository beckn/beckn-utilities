// This service will handle interactions with the Qdrant vector database

import { QdrantClient } from '@qdrant/qdrant-js';
import { config } from '../config';
import { TextChunk } from './documentProcessor';
import { chunkit } from 'semantic-chunking';  // This has the embedding function

// Parse host and port from QDRANT_URL
const qdrantUrl = new URL(config.qdrant.url);
const qdrantClient = new QdrantClient({ 
  host: qdrantUrl.hostname,
  port: parseInt(qdrantUrl.port),
  timeout: 15000 // 15 seconds
});

/**
 * Initialize the vector collection if it doesn't exist
 */
export async function initializeCollection(): Promise<void> {
  try {
    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      collection => collection.name === config.qdrant.collection
    );
    
    // Log the dimension we're going to use
    console.log(`Using embedding dimension: ${config.embedding.dimension}`);
    
    if (!collectionExists) {
      // Create collection with the specified dimensions
      console.log(`Creating collection with dimension: ${config.embedding.dimension}`);
      await qdrantClient.createCollection(config.qdrant.collection, {
        vectors: {
          size: config.embedding.dimension,
          distance: 'Cosine'
        }
      });
      console.log(`Created collection: ${config.qdrant.collection}`);
    } else {
      console.log(`Collection ${config.qdrant.collection} already exists`);
      
      // Check the actual dimension of the collection
      try {
        const collectionInfo = await qdrantClient.getCollection(config.qdrant.collection);
        const actualDimension = collectionInfo.config?.params?.vectors?.size;
        console.log(`Collection has dimension: ${actualDimension}`);
        
        if (actualDimension !== config.embedding.dimension) {
          console.log(`WARNING: Collection dimension (${actualDimension}) doesn't match config (${config.embedding.dimension})`);
        }
      } catch (error) {
        console.error('Error checking collection dimensions:', error);
      }
    }
  } catch (error) {
    console.error('Error initializing Qdrant collection:', error);
    throw new Error('Failed to initialize vector database');
  }
}

interface SearchResult {
  text: string;
  metadata: {
    source: string;
    [key: string]: any;
  };
  score: number;
}

/**
 * Search for similar chunks in the vector database
 * @param query The query text
 * @param limit Maximum number of results to return
 * @param threshold Minimum similarity score threshold
 * @returns Array of matching chunks with their similarity scores
 */
export async function searchSimilarChunks(query: string, limit: number = 5, threshold: number = 0.7): Promise<SearchResult[]> {
  try {
    // Get query embedding
    const documents = [{
      document_name: 'query',
      document_text: query
    }];

    const chunkOptions = {
      similarityThreshold: 0.5,
      maxTokenSize: 1000,
      returnEmbedding: true,
      onnxEmbeddingModel: 'Xenova/all-MiniLM-L6-v2',
      dtype: 'q8'
    };

    const chunks = await chunkit(documents, chunkOptions);
    if (!chunks[0]?.embedding) {
      throw new Error('Failed to generate query embedding');
    }

    // Convert embedding to regular array if it's not already
    const queryEmbedding = Array.from(chunks[0].embedding);

    // Search with proper format
    const searchResults = await qdrantClient.search(config.qdrant.collection, {
      vector: Array.from(queryEmbedding), // Ensure it's a regular array
      limit,
      with_payload: true,
      score_threshold: threshold
    });

    // Log the search request for debugging
    console.log('Search request:', {
      collectionName: config.qdrant.collection,
      vectorLength: queryEmbedding.length,
      limit,
      threshold
    });

    return searchResults.map(result => ({
      text: (result.payload?.text as string) || '',
      metadata: (result.payload?.metadata as { source: string; [key: string]: any }) || { source: 'unknown' },
      score: result.score
    }));
  } catch (error) {
    console.error('Error searching vector database:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw new Error('Failed to search vector database');
  }
}

// TODO: Implement functions for storing and retrieving vectors
// This will be expanded in the next implementation phase 