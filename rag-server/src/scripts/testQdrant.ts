import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config';

async function testQdrant() {
  try {
    console.log('Testing Qdrant connection...');
    
    // Initialize Qdrant client
    const qdrantClient = new QdrantClient({ url: config.qdrant.url });
    
    // Create a test vector (384 dimensions)
    const testVector = Array(384).fill(0).map(() => Math.random());
    
    console.log(`Created test vector with ${testVector.length} dimensions`);
    console.log('First 5 values:', testVector.slice(0, 5));
    
    // Insert the test vector
    console.log('Inserting test vector...');
    await qdrantClient.upsert(config.qdrant.collection, {
      points: [{
        id: 'test-vector-1',
        vector: testVector,
        payload: {
          text: 'This is a test vector',
          metadata: {
            source: 'test'
          }
        }
      }]
    });
    
    console.log('Successfully inserted test vector');
    
    // Retrieve the vector
    console.log('Retrieving test vector...');
    const result = await qdrantClient.retrieve(config.qdrant.collection, { ids: ['test-vector-1'] });
    
    console.log('Retrieved vector:', result);
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error testing Qdrant:', error);
  }
}

testQdrant(); 