import fs from 'fs';
import path from 'path';

export async function initializeCollection(): Promise<void> {
  console.log('Initializing mock vector store...');
  const outputDir = path.join(process.cwd(), 'output', 'vectors');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`Mock vector store initialized at ${outputDir}`);
}

export async function storeVectors(points: any[]): Promise<void> {
  console.log(`Storing ${points.length} vectors in mock store...`);
  const outputDir = path.join(process.cwd(), 'output', 'vectors');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, `vectors_${Date.now()}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(points, null, 2));
  console.log(`Vectors stored in ${outputFile}`);
} 