const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const desktopPath = os.homedir() + '/Desktop';
const modelsDir = path.join(process.cwd(), 'public/models');

// Ensure models directory exists
if (!fs.existsSync(modelsDir)) {
  console.log(`Creating models directory at ${modelsDir}`);
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Models to copy
const modelsToCopy = [
  {
    source: path.join(desktopPath, 'african-girl-processed.glb'),
    destination: path.join(modelsDir, 'african-girl-optimized.glb')
  },
  {
    source: path.join(desktopPath, 'african-queen-processed.glb'),
    destination: path.join(modelsDir, 'african-queen-optimized.glb')
  }
];

// Copy models
let copyCount = 0;
modelsToCopy.forEach(model => {
  if (fs.existsSync(model.source)) {
    try {
      fs.copyFileSync(model.source, model.destination);
      console.log(`✅ Copied ${model.source} to ${model.destination}`);
      copyCount++;
    } catch (error) {
      console.error(`❌ Error copying ${model.source}: ${error.message}`);
    }
  } else {
    console.warn(`⚠️ Source file not found: ${model.source}`);
  }
});

console.log(`\nCopied ${copyCount} of ${modelsToCopy.length} models.`);

// If no models were copied, provide fallback instructions
if (copyCount === 0) {
  console.log('\n⚠️ No models were copied. To manually optimize models:');
  console.log('1. Install gltf-transform: npm install -g @gltf-transform/cli');
  console.log('2. Run the following commands:');
  console.log(`   gltf-transform copy "/path/to/african-girl.glb" "${modelsDir}/african-girl-temp.glb"`);
  console.log(`   gltf-transform simplify "${modelsDir}/african-girl-temp.glb" "${modelsDir}/african-girl-optimized.glb" --ratio 0.2 --error 0.01`);
  console.log(`   gltf-transform copy "/path/to/african-queen.glb" "${modelsDir}/african-queen-temp.glb"`);
  console.log(`   gltf-transform simplify "${modelsDir}/african-queen-temp.glb" "${modelsDir}/african-queen-optimized.glb" --ratio 0.5 --error 0.01`);
  console.log('3. Delete the temporary files after optimization is complete.');
} 