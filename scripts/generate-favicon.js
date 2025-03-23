const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicon() {
  try {
    const inputPath = path.join(__dirname, '../public/images/optimized/logo_optimized.webp');
    const pngOutputPath = path.join(__dirname, '../public/favicon.png');
    
    // Create a 32x32 PNG favicon from the logo
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(pngOutputPath);
    
    // Create a copy with .ico extension for older browsers
    fs.copyFileSync(pngOutputPath, path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Favicons created successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 