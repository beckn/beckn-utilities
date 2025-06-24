import { OpenAI } from 'openai';
import { config } from '../config';
import { searchSimilarChunks } from './vectorStore';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: config.openai.apiKey });

interface LLMResponse {
  answer: string;
  sources: Array<{
    file: string;
    score: number;
    text: string;
  }>;
  hasSourceContext: boolean;
}

/**
 * Generate a response using the LLM, with or without RAG context
 */
export async function generateResponse(query: string): Promise<LLMResponse> {
  try {
    // Get relevant context from vector DB
    const vectorResults = await searchSimilarChunks(query, 5, 0.5);
    
    // Extract context and flag whether we have relevant sources
    const hasSourceContext = vectorResults.length > 0;
    const context = vectorResults.map(r => r.text).join('\n\n');
    
    // Prepare system message based on available context
    const systemMessage = hasSourceContext 
      ? `You are a Beckn Protocol expert. Answer the user's question based ONLY on the provided context. 
If the context doesn't fully answer the question, say so clearly. Use markdown formatting for readability.
Include technical details when present and structure your answer with headings if applicable.`
      : `You are a Beckn Protocol expert. The query doesn't match specific Beckn documentation in our database.
Provide a general helpful response, but clearly indicate that this is general knowledge rather than from
official Beckn documentation. Suggest the user rephrase their query if appropriate.`;
    
    // Construct messages
    const messages = [
      { role: "system", content: systemMessage },
      { 
        role: "user", 
        content: hasSourceContext 
          ? `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer using ONLY the provided context.`
          : `Question: ${query}\n\nNote: This query doesn't match our Beckn documentation database.`
      }
    ];
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return {
      answer: response.choices[0]?.message?.content || "Failed to generate a response",
      sources: vectorResults.map(r => ({
        file: r.metadata.source,
        score: r.score,
        text: r.text.substring(0, 150) + "..." // First 150 chars for context
      })),
      hasSourceContext
    };
  } catch (error) {
    console.error('Error generating LLM response:', error);
    throw new Error('Failed to generate response');
  }
} 