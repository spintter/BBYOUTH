// Script to generate texture files for the chessboard
// Run with: node scripts/generate-textures.js

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create textures directory if it doesn't exist
const texturesDir = path.join(process.cwd(), 'public', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
  console.log('Created textures directory');
}

// Generate all textures
function generateTextures() {
  console.log('Generating textures...');
  
  // Generate basic board texture with improved checkerboard pattern
  generateBoardTexture();
  
  // Generate African-inspired background texture
  generateAfricanMotifTexture();
  
  console.log('All textures generated successfully!');
}

// Generate a better checkerboard texture
function generateBoardTexture() {
  const canvas = createCanvas(128, 128); // Higher resolution for better quality
  const ctx = canvas.getContext('2d');
  
  // Create a more detailed checkerboard pattern
  const squareSize = 16; // Larger squares for better visibility
  
  // Fill with base color
  ctx.fillStyle = '#4A2C2A'; // Dark brown base
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw checkerboard pattern
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = '#F5E6CC'; // Light cream color
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      } else {
        // Add subtle texture to dark squares
        ctx.fillStyle = '#2A1810'; // Darker brown
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
        
        // Add subtle grain to dark squares
        ctx.fillStyle = 'rgba(74, 44, 42, 0.5)';
        for (let g = 0; g < 3; g++) {
          const grainX = i * squareSize + Math.random() * squareSize;
          const grainY = j * squareSize + Math.random() * squareSize;
          ctx.fillRect(grainX, grainY, 1, 1);
        }
      }
    }
  }
  
  // Add a subtle border
  ctx.strokeStyle = '#D4AF37'; // Gold border
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Save the texture
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(texturesDir, 'board-base.png'), buffer);
  console.log('Generated board-base.png');
}

// Generate an African-inspired motif texture
function generateAfricanMotifTexture() {
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  
  // Fill with base color
  ctx.fillStyle = '#1A1A1A'; // Dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw geometric patterns inspired by African textiles
  ctx.strokeStyle = '#D4AF37'; // Gold color for patterns
  ctx.lineWidth = 1;
  
  // Draw diamond pattern
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const x = i * 32;
      const y = j * 32;
      
      // Draw diamond
      ctx.beginPath();
      ctx.moveTo(x + 16, y);
      ctx.lineTo(x + 32, y + 16);
      ctx.lineTo(x + 16, y + 32);
      ctx.lineTo(x, y + 16);
      ctx.closePath();
      ctx.stroke();
      
      // Add center dot
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Add zigzag patterns
  ctx.strokeStyle = '#F5E6CC';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < 8; i++) {
    // Horizontal zigzags
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 16) {
      ctx.lineTo(x, i * 32 + (x % 32 === 0 ? 8 : 24));
    }
    ctx.stroke();
    
    // Vertical zigzags
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.lineTo(i * 32 + (y % 32 === 0 ? 8 : 24), y);
    }
    ctx.stroke();
  }
  
  // Save the texture
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(texturesDir, 'african-motif.png'), buffer);
  console.log('Generated african-motif.png');
}

// Run the texture generation
generateTextures(); 