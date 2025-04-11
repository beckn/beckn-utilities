// This script indexes documents from the docs folder into the vector database

import { config, validateConfig } from '../config';
import { initializeCollection } from '../services/vectorStore';
import { chunkit, Chunk } from 'semantic-chunking';
import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Initialize clients
const qdrantClient = new QdrantClient({ url: config.qdrant.url });
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Supported file extensions
const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.json', '.html', '.csv'];

// Add these interfaces at the top of the file
interface SemanticChunk {
  document_name: string;
  text: string;
  token_length: number;
  model_name: string;
  embedding?: number[];
}

interface QdrantPoint {
  id: string;
  vector: number[];
  payload: {
    text: string;
    metadata: {
      source: string;
      filePath: string;
      chunkIndex: number;
      modelName: string;
      tokenLength: number;
      [key: string]: any;
    };
  };
}

/**
 * Generate a unique ID for a chunk
 */
function generateChunkId(source: string, index: number): string {
  const hash = crypto.createHash('md5').update(`${source}_${index}`).digest('hex');
  return hash;
}

/**
 * Process a single document file
 */
async function processDocument(filePath: string, skipVectorStorage: boolean = false): Promise<void> {
  try {
    console.log(`Processing document: ${filePath}`);
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Prepare document for semantic chunking
    const documents = [
      {
        document_name: fileName,
        document_text: content
      }
    ];
    
    // Configure chunking options
    const chunkOptions = {
      similarityThreshold: config.document.semanticThreshold || 0.5,
      maxTokenSize: config.document.chunkSize || 1000,
      numSimilaritySentencesLookahead: 3,
      returnEmbedding: true, // Get embeddings directly from semantic-chunking
      onnxEmbeddingModel: 'Xenova/all-MiniLM-L6-v2',
      dtype: 'q8'
    };
    
    console.log('Creating semantic chunks with embeddings...');
    
    // Process the document with semantic chunking
    const semanticChunks = await chunkit(documents, chunkOptions);
    
    console.log(`Created ${semanticChunks.length} chunks with embeddings`);
    
    // Log first chunk for inspection if available
    if (semanticChunks.length > 0) {
      console.log('\nSample chunk:');
      console.log('-------------');
      console.log(`Text (first 150 chars): ${semanticChunks[0].text.substring(0, 150)}...`);
      console.log(`Token length: ${semanticChunks[0].token_length}`);
      console.log(`Model: ${semanticChunks[0].model_name}`);
      
      if (semanticChunks[0].embedding) {
        console.log(`Embedding dimensions: ${semanticChunks[0].embedding.length}`);
      } else {
        console.log('No embedding found in the first chunk');
      }
    }
    
    // Save chunks and embeddings to a file for inspection
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `${path.parse(fileName).name}_chunks.json`);
    
    // Create a sample of the data to save
    let sampleData: any = {
      fileName,
      totalChunks: semanticChunks.length
    };
    
    if (semanticChunks.length > 0) {
      sampleData.sampleChunk = {
        text: semanticChunks[0].text,
        tokenLength: semanticChunks[0].token_length,
        modelName: semanticChunks[0].model_name
      };
      
      if (semanticChunks[0].embedding) {
        sampleData.sampleEmbedding = {
          dimensions: semanticChunks[0].embedding.length,
          firstFiveValues: semanticChunks[0].embedding.slice(0, 5),
          lastFiveValues: semanticChunks[0].embedding.slice(-5)
        };
      }
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(sampleData, null, 2));
    console.log(`\nSample data saved to: ${outputFile}`);
    
    if (!skipVectorStorage) {
      console.log('\nStoring chunks in vector database...');
      
      // Log the first vector's dimension
      if (semanticChunks.length > 0 && semanticChunks[0].embedding) {
        console.log(`First vector dimension: ${semanticChunks[0].embedding.length}`);
      }
      
      // Prepare points for Qdrant
      const points = semanticChunks
        .filter((chunk): chunk is Chunk & { embedding: number[] } => {
          if (!chunk.embedding) {
            console.warn(`Chunk with text "${chunk.text.substring(0, 50)}..." has no embedding, skipping`);
            return false;
          }
          return true;
        })
        .map((chunk, index) => ({
          id: generateChunkId(fileName, index),
          vector: chunk.embedding,
          payload: {
            text: chunk.text,
            metadata: {
              source: fileName,
              filePath: filePath,
              chunkIndex: index,
              modelName: chunk.model_name,
              tokenLength: chunk.token_length
            }
          }
        } as QdrantPoint));
      
      // Insert vectors in batches of 10
      const BATCH_SIZE = 10;
      let successCount = 0;
      
      for (let i = 0; i < points.length; i += BATCH_SIZE) {
        const batch = points.slice(i, i + BATCH_SIZE);
        
        try {
          console.log(`Storing batch ${i / BATCH_SIZE + 1}/${Math.ceil(points.length / BATCH_SIZE)} (${batch.length} vectors)`);
          
          // Validate and convert points
          const qdrantPoints = batch
            .filter(point => validatePoint(point))
            .map(point => ({
              id: point.id,
              vector: Array.from(point.vector), // Convert Float32Array to regular array
              payload: point.payload
            }));
          
          if (qdrantPoints.length !== batch.length) {
            console.warn(`Skipped ${batch.length - qdrantPoints.length} invalid points`);
          }
          
          if (qdrantPoints.length > 0) {
            await qdrantClient.upsert(config.qdrant.collection, {
              points: qdrantPoints,
              wait: true
            });
            
            successCount += qdrantPoints.length;
            console.log(`Successfully stored batch (${successCount}/${points.length} vectors)`);
          }
        } catch (error) {
          console.error('Error storing batch:', error);
          if (batch.length > 0) {
            const samplePoint = batch[0];
            console.log('Sample point:', {
              id: samplePoint.id,
              vectorLength: samplePoint.vector.length,
              vectorType: samplePoint.vector.constructor.name,
              vectorSample: Array.from(samplePoint.vector.slice(0, 5))
            });
          }
        }
      }
      
      console.log(`Indexing complete: ${successCount}/${points.length} vectors stored`);
    } else {
      // If skipping vector storage, save all vectors to file
      console.log('\nSkipping vector database storage, saving vectors to file...');
      const { storeVectors } = await import('../services/mockVectorStore');
      
      const points = semanticChunks
        .filter((chunk): chunk is Chunk & { embedding: number[] } => {
          if (!chunk.embedding) {
            console.warn(`Chunk with text "${chunk.text.substring(0, 50)}..." has no embedding, skipping`);
            return false;
          }
          return true;
        })
        .map((chunk, index) => ({
          id: generateChunkId(fileName, index),
          vector: chunk.embedding,
          payload: {
            text: chunk.text,
            metadata: {
              source: fileName,
              filePath: filePath,
              chunkIndex: index,
              modelName: chunk.model_name,
              tokenLength: chunk.token_length
            }
          }
        } as QdrantPoint));
      
      await storeVectors(points);
    }
  } catch (error) {
    console.error(`Error processing document ${filePath}:`, error);
  }
}

function validatePoint(point: any): boolean {
  if (!point.vector || !(point.vector instanceof Float32Array || Array.isArray(point.vector))) {
    console.error('Invalid vector format:', point.vector);
    return false;
  }
  
  // Convert Float32Array to regular array if needed
  const vector = Array.isArray(point.vector) ? point.vector : Array.from(point.vector);
  
  // Check for invalid values
  return vector.every((value: number, index: number) => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      console.error(`Invalid value at index ${index}:`, value);
      return false;
    }
    return true;
  });
}

// Add this function to validate vectors
function validateVectors(points: any[]): boolean {
  let isValid = true;
  
  for (let i = 0; i < points.length; i++) {
    const vector = points[i].vector;
    
    // Check if vector exists
    if (!vector) {
      console.error(`Vector missing for point ${i}`);
      isValid = false;
      continue;
    }
    
    // Check vector length
    if (vector.length !== config.embedding.dimension) {
      console.error(`Vector ${i} has wrong dimension: ${vector.length} (expected ${config.embedding.dimension})`);
      isValid = false;
    }
    
    // Check for NaN or Infinity
    for (let j = 0; j < vector.length; j++) {
      if (isNaN(vector[j]) || !isFinite(vector[j])) {
        console.error(`Vector ${i} has invalid value at position ${j}: ${vector[j]}`);
        isValid = false;
        break;
      }
    }
  }
  
  return isValid;
}

/**
 * Main function
 */
async function main() {
  try {
    // Validate configuration
    validateConfig();
    
    console.log('Starting document indexing process...');
    
    let skipVectorStorage = false;
    
    try {
      // Initialize vector database collection
      await initializeCollection();
    } catch (error) {
      console.error('Error connecting to Qdrant. Proceeding without vector storage.');
      console.error('You can still process documents and save embeddings to files.');
      skipVectorStorage = true;
    }
    
    // Path to docs directory
    const docsPath = path.join(process.cwd(), 'docs');
    
    // Check if docs directory exists
    if (!fs.existsSync(docsPath)) {
      console.log(`Creating docs directory at ${docsPath}`);
      fs.mkdirSync(docsPath, { recursive: true });
      console.log('Please add documents to the docs directory and run this script again.');
      return;
    }
    
    // Process all documents in the docs directory
    console.log(`Processing directory: ${docsPath}`);
    
    // Get all files in the directory
    const files = fs.readdirSync(docsPath);
    
    // Filter for supported file types
    const documentFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });
    
    console.log(`Found ${documentFiles.length} documents to process`);
    
    // Process each document
    for (const file of documentFiles) {
      const filePath = path.join(docsPath, file);
      await processDocument(filePath, skipVectorStorage);
    }
    
    console.log('Document indexing completed successfully');
  } catch (error) {
    console.error('Error during document indexing:', error);
    process.exit(1);
  }
}

// Run the indexing process
main(); 