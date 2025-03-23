// scripts/createParticleTexture.js
const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

function createParticleTexture() {
  console.log('Creating particle texture...');
  
  // Create canvas
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  
  // Create radial gradient
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  // Draw gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  // Ensure directory exists
  const dirPath = path.join(__dirname, '../public/images');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
  
  // Save as PNG file
  const outputPath = path.join(dirPath, 'particle.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Particle texture saved to: ${outputPath}`);
}

// Export for run-func
module.exports = {
  createParticleTexture
};

// Direct execution
if (require.main === module) {
  createParticleTexture();
} 