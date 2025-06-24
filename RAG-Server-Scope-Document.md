# RAG Server Scope Document

## Project Overview
The Retrieval-Augmented Generation (RAG) server provides intelligent, context-aware responses about Beckn Protocol technical documentation by leveraging a vector database (Qdrant) and OpenAI's language models. This system enables developers to quickly access relevant documentation through natural language queries.

## Objectives
- Provide accurate, context-aware responses to technical queries about Beckn Protocol
- Reduce support ticket volume by enabling self-service information retrieval
- Improve developer experience by making documentation more accessible
- Create a foundation for integrating with multiple interfaces (Discord, web)

## Current Status
- ✅ Vector database (Qdrant) integration complete
- ✅ Document processing pipeline with semantic chunking
- ✅ Basic API endpoints (`/search/vector` and `/search/llm`) implemented
- ✅ Source attribution and relevance scoring functional

## API Endpoints
1. **Vector Search** (`/search/vector`): Returns raw vector similarity search results
2. **LLM Augmented Search** (`/search/llm`): Processes vector search results through LLM to generate coherent answers

## Implementation Plan

### Phase 1: Core Infrastructure (Completed)
- Vector database setup and connection
- Document ingestion pipeline 
- API endpoint implementation
- Basic error handling


### Phase 2: Enhancement & Optimization - (7 days)

1. **Implement Caching System**  - (3 days)
   - Design and implement caching strategy based on application needs
   - Set up multi-level caching if required
   - Implement cache monitoring and analytics if required

2. **Discord Bot Integration** - (2 days)
   - Design Discord bot interface 
   - Deploy bot to Beckn community server

3. **Automated Document Indexing** - (2 days)
   - Create GitHub action for monitoring documentation changes and trigger indexing pipeline
   - Implement incremental indexing pipeline
	 - Add necessary doc to the repo


Release date - 29th April 2025 EOD or 30th April 2025


## API Credit Requirements

### Development Phase (Monthly)
## Estimated API Usage and Credits:

- **Total tokens per month**: 3,000,000 tokens (1M for vector embeddings, 2M for LLM responses).

### Model Pricing Breakdown:

#### **Smartest Model**:
- **Estimated cost**: $10.00/month
- **Credits needed**: 10 credits/month
- **Best for**: Complex tasks, requiring high intelligence (e.g., detailed responses, intricate queries).

#### **GPT-4.1 mini**:
- **Estimated cost**: $3.60/month
- **Credits needed**: 4 credits/month
- **Best for**: Balanced model (e.g., more affordable while maintaining speed and intelligence).

#### **GPT-4.1 nano**:
- **Estimated cost**: $0.90/month
- **Credits needed**: 1 credit/month
- **Best for**: Low-latency, cost-effective tasks (e.g., quick responses with low complexity).


## Caching Requirements

### Need for Caching
The RAG server relies heavily on OpenAI API calls for both embedding generation and LLM responses, which incur costs based on token usage. Without a caching mechanism, every query would:
1. Generate a new embedding vector (token usage)
2. Retrieve context from the vector database
3. Send both context and query to the LLM (significant token usage)

For frequently asked questions or similar queries, this represents unnecessary expenditure and increased latency.


## Dependencies
- Stable OpenAI API access with sufficient rate limits
- Redis for distributed caching
- Access to documentation repositories
- Discord API for bot integration 