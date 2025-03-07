#!/usr/bin/env node

/**
 * Asset Optimization Script
 * 
 * This script optimizes 3D models and textures to reduce memory usage and improve performance.
 * It performs the following optimizations:
 * 
 * 1. Compresses textures to KTX2 format
 * 2. Generates mipmaps for textures
 * 3. Resizes large textures to reasonable dimensions
 * 4. Compresses 3D models with Draco compression
 * 5. Generates LOD (Level of Detail) versions of models
 * 6. Optimizes meshes by removing unnecessary data
 * 
 * Usage:
 * npm run optimize-assets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const config = {
  textureMaxSize: 2048, // Maximum texture size (2K)
  textureFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  modelFormats: ['.glb', '.gltf'],
  outputDir: 'public/optimized',
  hdriDir: 'public/hdri',
  modelsDir: 'public/models',
  texturesDir: 'public/textures',
  ktx2Quality: 'medium', // Options: low, medium, high
  generateLODs: true,
  lodLevels: [100, 50, 25], // Percentage of original vertices
};

// Create output directories if they don't exist
function createDirectories() {
  const dirs = [
    config.outputDir,
    path.join(config.outputDir, 'models'),
    path.join(config.outputDir, 'textures'),
    path.join(config.outputDir, 'hdri'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`Created directory: ${dir}`));
    }
  });
}

// Find all textures to optimize
function findTextures() {
  let textures = [];
  
  config.textureFormats.forEach(format => {
    const textureFiles = glob.sync(`${config.texturesDir}/**/*${format}`);
    textures = textures.concat(textureFiles);
  });
  
  // Also include HDRI files
  const hdriFiles = glob.sync(`${config.hdriDir}/**/*.hdr`);
  textures = textures.concat(hdriFiles);
  
  return textures;
}

// Find all models to optimize
function findModels() {
  let models = [];
  
  config.modelFormats.forEach(format => {
    const modelFiles = glob.sync(`${config.modelsDir}/**/*${format}`);
    models = models.concat(modelFiles);
  });
  
  return models;
}

// Optimize a texture
async function optimizeTexture(texturePath) {
  const filename = path.basename(texturePath);
  const ext = path.extname(texturePath).toLowerCase();
  const baseName = path.basename(texturePath, ext);
  const relativePath = path.relative(
    ext === '.hdr' ? config.hdriDir : config.texturesDir,
    path.dirname(texturePath)
  );
  
  const outputDir = path.join(
    config.outputDir,
    ext === '.hdr' ? 'hdri' : 'textures',
    relativePath
  );
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Output paths
  const ktx2Path = path.join(outputDir, `${baseName}.ktx2`);
  const resizedPath = path.join(outputDir, filename);
  
  console.log(chalk.blue(`Optimizing texture: ${texturePath}`));
  
  try {
    // For HDR files, use toktx directly
    if (ext === '.hdr') {
      // Convert HDR to KTX2
      execSync(`toktx --genmipmap --assign_oetf linear --target_type RGBA --bcmp ${ktx2Path} ${texturePath}`);
      console.log(chalk.green(`  ✓ Converted to KTX2: ${ktx2Path}`));
      return;
    }
    
    // For regular textures, resize first if needed
    const metadata = await sharp(texturePath).metadata();
    
    if (metadata.width > config.textureMaxSize || metadata.height > config.textureMaxSize) {
      // Resize the texture
      await sharp(texturePath)
        .resize(
          metadata.width > metadata.height 
            ? config.textureMaxSize 
            : Math.round(metadata.width * (config.textureMaxSize / metadata.height)),
          metadata.height > metadata.width 
            ? config.textureMaxSize 
            : Math.round(metadata.height * (config.textureMaxSize / metadata.width)),
          { fit: 'inside' }
        )
        .toFile(resizedPath);
      
      console.log(chalk.green(`  ✓ Resized to ${config.textureMaxSize}px: ${resizedPath}`));
      
      // Convert to KTX2
      execSync(`toktx --genmipmap --assign_oetf srgb --bcmp ${ktx2Path} ${resizedPath}`);
    } else {
      // Just copy the file and convert to KTX2
      fs.copyFileSync(texturePath, resizedPath);
      execSync(`toktx --genmipmap --assign_oetf srgb --bcmp ${ktx2Path} ${texturePath}`);
    }
    
    console.log(chalk.green(`  ✓ Converted to KTX2: ${ktx2Path}`));
  } catch (error) {
    console.error(chalk.red(`  ✗ Error optimizing texture: ${error.message}`));
  }
}

// Optimize a model
async function optimizeModel(modelPath) {
  const filename = path.basename(modelPath);
  const ext = path.extname(modelPath).toLowerCase();
  const baseName = path.basename(modelPath, ext);
  const relativePath = path.relative(config.modelsDir, path.dirname(modelPath));
  
  const outputDir = path.join(config.outputDir, 'models', relativePath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Output paths
  const optimizedPath = path.join(outputDir, filename);
  
  console.log(chalk.blue(`Optimizing model: ${modelPath}`));
  
  try {
    // Use gltf-transform to optimize the model
    execSync(`gltf-transform optimize ${modelPath} ${optimizedPath} --draco.compressionLevel=7 --texture-compress ktx2 --texture-resize "1024x1024"`);
    
    console.log(chalk.green(`  ✓ Optimized model: ${optimizedPath}`));
    
    // Generate LOD versions if enabled
    if (config.generateLODs) {
      for (const level of config.lodLevels) {
        const lodPath = path.join(outputDir, `${baseName}_lod${level}${ext}`);
        
        execSync(`gltf-transform simplify ${optimizedPath} ${lodPath} --ratio ${level / 100} --error 0.01`);
        
        console.log(chalk.green(`  ✓ Generated LOD (${level}%): ${lodPath}`));
      }
    }
  } catch (error) {
    console.error(chalk.red(`  ✗ Error optimizing model: ${error.message}`));
  }
}

// Main function
async function main() {
  console.log(chalk.yellow('Starting asset optimization...'));
  
  // Create output directories
  createDirectories();
  
  // Find assets to optimize
  const textures = findTextures();
  const models = findModels();
  
  console.log(chalk.yellow(`Found ${textures.length} textures and ${models.length} models to optimize.`));
  
  // Optimize textures
  console.log(chalk.yellow('\nOptimizing textures...'));
  for (const texture of textures) {
    await optimizeTexture(texture);
  }
  
  // Optimize models
  console.log(chalk.yellow('\nOptimizing models...'));
  for (const model of models) {
    await optimizeModel(model);
  }
  
  console.log(chalk.green('\nAsset optimization complete!'));
  console.log(chalk.yellow(`Optimized assets are in: ${config.outputDir}`));
  console.log(chalk.yellow('Remember to update your code to use the optimized assets.'));
}

// Run the script
main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
}); 