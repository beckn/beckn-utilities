declare module 'semantic-chunking' {
  export interface ChunkOptions {
    similarityThreshold?: number;
    maxTokenSize?: number;
    numSimilaritySentencesLookahead?: number;
    returnEmbedding?: boolean;
    onnxEmbeddingModel?: string;
    dtype?: string;
  }

  export interface Document {
    document_name: string;
    document_text: string;
  }

  export interface Chunk {
    document_name: string;
    text: string;
    token_length: number;
    model_name: string;
    embedding?: number[];
  }

  export function chunkit(
    documents: Document[],
    options?: ChunkOptions
  ): Promise<Chunk[]>;
}

declare module 'semantic-chunking'; 