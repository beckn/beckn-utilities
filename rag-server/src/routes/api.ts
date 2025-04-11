import { Router, Request, Response } from 'express';
import { searchSimilarChunks } from '../services/vectorStore';

const router = Router();

interface VectorSearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
}

// Vector similarity search endpoint
router.post('/search/vector', async (req: Request, res: Response) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body as VectorSearchRequest;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query is required and must be a string'
      });
    }

    const results = await searchSimilarChunks(query, limit, threshold);

    res.status(200).json({
      query,
      results: results.map(result => ({
        text: result.text,
        metadata: result.metadata,
        score: result.score
      }))
    });
  } catch (error) {
    console.error('Error in vector search:', error);
    res.status(500).json({
      error: 'Failed to perform vector search'
    });
  }
});

// LLM Query endpoint - search vector DB and process with LLM
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required and must be a string' });
    }
    
    // TODO: Implement vector search + LLM processing
    // This will be implemented when we add the vector store and LLM services
    
    // Temporary placeholder response
    res.status(200).json({
      message: 'LLM-enhanced search will be implemented soon',
      query,
      limit,
      threshold
    });
  } catch (error) {
    console.error('Error in /ask endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router }; 