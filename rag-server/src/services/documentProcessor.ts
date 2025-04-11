// This service will handle document loading and chunking

import { config } from '../config';

/**
 * Represents a chunk of text with metadata
 */
export interface TextChunk {
  text: string;
  metadata: {
    source: string;
    pageNumber?: number;
    chunkIndex: number;
    [key: string]: any;
  };
}

/**
 * Split text into chunks with overlap
 * @param text The text to split into chunks
 * @param metadata Metadata to attach to each chunk
 * @returns Array of text chunks with metadata
 */
export function chunkText(text: string, metadata: Omit<TextChunk['metadata'], 'chunkIndex'>): TextChunk[] {
  // Ensure metadata has a source property
  if (!metadata.source) {
    throw new Error("Metadata must include a 'source' property");
  }

  const { chunkSize, chunkOverlap } = config.document;
  const chunks: TextChunk[] = [];
  
  // Simple character-based chunking for now
  // In a production system, you might want to use token-based chunking
  // or more sophisticated methods like chunking by paragraph or section
  
  let startIndex = 0;
  let chunkIndex = 0;
  
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.substring(startIndex, endIndex);
    
    chunks.push({
      text: chunk,
      // @ts-ignore - We know metadata has a source property
      metadata: {
        ...metadata,
        chunkIndex
      }
    });
    
    startIndex += chunkSize - chunkOverlap;
    chunkIndex++;
    
    // Avoid creating empty or tiny chunks at the end
    if (startIndex + chunkSize - chunkOverlap >= text.length) break;
  }
  
  return chunks;
}

// TODO: Implement document loading functions for different file types
// This will be expanded in the next implementation phase 