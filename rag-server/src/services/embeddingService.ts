// This service will handle generating embeddings for text

import { OpenAI } from 'openai';
import { config } from '../config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

/**
 * Generate embeddings for a text string
 * @param text The text to generate embeddings for
 * @returns An array of embedding values
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: config.embedding.model,
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for multiple text strings in batch
 * @param texts Array of text strings to generate embeddings for
 * @returns Array of embedding arrays
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: config.embedding.model,
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings in batch:', error);
    throw new Error('Failed to generate embeddings in batch');
  }
} 