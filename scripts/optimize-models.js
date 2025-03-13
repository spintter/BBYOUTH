/**
 * Model Optimization Script
 * 
 * This script optimizes GLB models for better performance in the web application.
 * It uses gltf-transform to simplify meshes and apply compression.
 * 
 * Usage:
 * 1. Install dependencies: npm install -g @gltf-transform/cli
 * 2. Run: node scripts/optimize-models.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const modelsDir = path.join(process.cwd(), 'public/models');
const tempDir = path.join(process.cwd(), 'temp');
const originalModels = [
  { 
    path: path.join(modelsDir, 'african-girl.glb'),
    ratio: 0.2, // Based on successful optimization from logs
    outputName: 'african-girl-optimized.glb'
  },
  { 
    path: path.join(modelsDir, 'african-queen.glb'),
    ratio: 0.5, // Based on successful optimization from logs
    outputName: 'african-queen-optimized.glb'
  }
];

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Check if gltf-transform is installed
try {
  execSync('gltf-transform --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ gltf-transform is not installed. Please install it with:');
  console.error('npm install -g @gltf-transform/cli');
  process.exit(1);
}

// Process each model
originalModels.forEach(model => {
  const { path: modelPath, ratio, outputName } = model;
  const modelName = path.basename(modelPath);
  const tempPath = path.join(tempDir, `${path.basename(modelPath, '.glb')}-temp.glb`);
  const outputPath = path.join(modelsDir, outputName);
  
  console.log(`\n📦 Processing ${modelName}...`);
  
  if (!fs.existsSync(modelPath)) {
    console.warn(`⚠️ Model not found: ${modelPath}`);
    return;
  }
  
  try {
    // Step 1: Copy the model (decompresses if it was Draco compressed)
    console.log('  🔄 Copying and decompressing...');
    execSync(`gltf-transform copy "${modelPath}" "${tempPath}"`, { stdio: 'ignore' });
    
    // Step 2: Simplify and optimize
    console.log(`  🔍 Simplifying with ratio ${ratio}...`);
    execSync(
      `gltf-transform simplify "${tempPath}" "${outputPath}" --ratio ${ratio} --error 0.01`,
      { stdio: 'ignore' }
    );
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(modelPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const percentChange = ((optimizedSize - originalSize) / originalSize * 100).toFixed(2);
    const sizeChange = percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`;
    
    console.log(`  ✅ Optimization complete: ${originalSize} bytes → ${optimizedSize} bytes (${sizeChange})`);
  } catch (error) {
    console.error(`  ❌ Error processing ${modelName}: ${error.message}`);
  }
});

// Clean up
console.log('\n🧹 Cleaning up temporary files...');
if (fs.existsSync(tempDir)) {
  fs.readdirSync(tempDir).forEach(file => {
    fs.unlinkSync(path.join(tempDir, file));
  });
  fs.rmdirSync(tempDir);
}

console.log('\n✨ Model optimization complete!');
console.log('To use optimized models, update your code to reference:');
originalModels.forEach(model => {
  console.log(`  - ${model.outputName}`);
}); 