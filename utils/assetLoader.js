import { TextureLoader, RepeatWrapping, LinearSRGBColorSpace, CanvasTexture } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// Enhanced asset manifest
export const ASSET_MANIFEST = {
  models: {
    africanGirl: {
      path: '/models/african-girl.glb',
      preload: true,
      optimizations: {
        draco: true,
        meshopt: true,
        textureCompression: 'ktx2'
      }
    }
  },
  textures: {
    wood: {
      base: '/textures/african-wood-base.jpg',
      roughness: '/textures/african-wood-roughness.jpg',
      normal: '/textures/african-wood-normal.jpg',
      // Remove fallback paths that don't exist
      useProceduralFallback: true // Flag to generate procedural texture if loading fails
    }
  },
  environment: {
    church: '/hdr/wakanda.hdr'
  }
};

// Create a procedural texture as fallback
const createProceduralTexture = (type = 'base', color = '#8B4513') => {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  
  const context = canvas.getContext('2d');
  if (!context) return new CanvasTexture(canvas);
  
  // Base color
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);
  
  // Add texture pattern based on type
  if (type === 'normal') {
    // Normal map - mostly flat with some variation
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 2 + 0.5;
      
      context.fillStyle = `rgba(128, 128, 255, ${Math.random() * 0.1 + 0.05})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  } else if (type === 'roughness') {
    // Roughness map - grayscale with grain
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 1.5 + 0.5;
      
      const brightness = Math.random() * 40 + 140;
      context.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  } else {
    // Base color texture - add wood grain pattern
    for (let y = 0; y < size; y += 4) {
      const grainWidth = Math.sin(y * 0.1) * 10 + 20;
      const brightness = Math.sin(y * 0.05) * 20 + 10;
      
      context.fillStyle = `rgba(60, 30, 15, ${brightness/100})`;
      context.fillRect(0, y, size, grainWidth);
    }
    
    // Add noise
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 1 + 0.2;
      
      context.fillStyle = `rgba(60, 30, 15, ${Math.random() * 0.1 + 0.05})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
  
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = LinearSRGBColorSpace;
  return texture;
};

// Setup optimized loaders
const setupLoaders = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('/basis/');
  
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.setKTX2Loader(ktx2Loader);
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  
  return {
    textureLoader: new TextureLoader(),
    gltfLoader,
    dracoLoader,
    ktx2Loader
  };
};

// Texture loader with AbortController support and procedural fallbacks
const loadTextures = (urls, options = {}) => {
  return new Promise((resolve, reject) => {
    const { 
      onProgress = () => {}, 
      signal,
      useProceduralFallback = true,
      defaultColor = '#8B4513'
    } = options;
    
    // Handle AbortController signal
    if (signal && signal.aborted) {
      return reject(new DOMException('Loading aborted', 'AbortError'));
    }
    
    const { textureLoader } = setupLoaders();
    const textures = {};
    const totalUrls = Object.keys(urls).length;
    let loadedCount = 0;
    let hasErrors = false;
    
    // Setup abort handler
    const abortHandler = () => {
      reject(new DOMException('Loading aborted', 'AbortError'));
    };
    
    if (signal) {
      signal.addEventListener('abort', abortHandler);
    }
    
    // Process each texture type (base, normal, roughness, etc)
    Object.entries(urls).forEach(([type, url]) => {
      if (typeof url !== 'string') return; // Skip non-string values like useProceduralFallback
      
      textureLoader.load(
        url,
        // Success callback
        (texture) => {
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.colorSpace = LinearSRGBColorSpace;
          textures[type] = texture;
          
          loadedCount++;
          onProgress(loadedCount / totalUrls);
          
          if (loadedCount === totalUrls) {
            if (signal) {
              signal.removeEventListener('abort', abortHandler);
            }
            resolve(textures);
          }
        },
        // Progress callback
        undefined,
        // Error callback
        (error) => {
          console.error(`Texture Load Error:`, error);
          console.error(`Failed to load texture: ${type}`, error);
          
          hasErrors = true;
          
          // Create procedural fallback if enabled
          if (useProceduralFallback) {
            console.info(`Creating procedural fallback for: ${type}`);
            textures[type] = createProceduralTexture(type, defaultColor);
            
            loadedCount++;
            onProgress(loadedCount / totalUrls);
            
            if (loadedCount === totalUrls) {
              if (signal) {
                signal.removeEventListener('abort', abortHandler);
              }
              resolve(textures);
            }
          } else {
            if (signal) {
              signal.removeEventListener('abort', abortHandler);
            }
            reject(error);
          }
        }
      );
    });
  });
};

// Model loader with optimizations
const loadModel = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const { 
      onProgress = () => {}, 
      signal,
      optimizations = {
        draco: true,
        meshopt: true,
        textureCompression: false
      }
    } = options;
    
    if (signal && signal.aborted) {
      return reject(new DOMException('Loading aborted', 'AbortError'));
    }
    
    const { gltfLoader } = setupLoaders();
    
    const abortHandler = () => {
      reject(new DOMException('Loading aborted', 'AbortError'));
    };
    
    if (signal) {
      signal.addEventListener('abort', abortHandler);
    }
    
    gltfLoader.load(
      url,
      (gltf) => {
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        resolve(gltf);
      },
      (progress) => {
        if (progress.lengthComputable) {
          onProgress(progress.loaded / progress.total);
        }
      },
      (error) => {
        console.error('Model Load Error:', error);
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        reject(error);
      }
    );
  });
};

// Preload assets based on manifest
const preloadAssets = (manifest = ASSET_MANIFEST, onProgress = () => {}) => {
  return new Promise((resolve) => {
    const assets = { models: {}, textures: {}, environment: {} };
    const controller = new AbortController();
    const { signal } = controller;
    
    const totalAssets = 
      Object.keys(manifest.models || {}).length + 
      Object.keys(manifest.textures || {}).length +
      Object.keys(manifest.environment || {}).length;
    
    let loadedCount = 0;
    
    const updateProgress = () => {
      loadedCount++;
      onProgress(loadedCount / totalAssets);
      
      if (loadedCount === totalAssets) {
        resolve(assets);
      }
    };
    
    // Preload models
    if (manifest.models) {
      Object.entries(manifest.models).forEach(([key, config]) => {
        if (config.preload) {
          loadModel(config.path, { 
            signal,
            optimizations: config.optimizations || {},
            onProgress: (progress) => {
              onProgress((loadedCount + progress) / totalAssets);
            }
          })
            .then(model => {
              assets.models[key] = model;
              updateProgress();
            })
            .catch(error => {
              console.error(`Failed to preload model: ${key}`, error);
              updateProgress();
            });
        } else {
          // Skip non-preloaded models
          updateProgress();
        }
      });
    }
    
    // Preload textures
    if (manifest.textures) {
      Object.entries(manifest.textures).forEach(([key, paths]) => {
        const { useProceduralFallback, ...textureUrls } = paths; // Extract the flag
        
        loadTextures(textureUrls, { 
          signal, 
          useProceduralFallback, 
          onProgress: (progress) => {
            onProgress((loadedCount + progress) / totalAssets);
          }
        })
          .then(textures => {
            assets.textures[key] = textures;
            updateProgress();
          })
          .catch(error => {
            console.error(`Failed to preload textures: ${key}`, error);
            updateProgress();
          });
      });
    }
    
    // Preload environment maps
    if (manifest.environment) {
      // Implementation for environment map preloading...
      // For now, just mark them as loaded
      Object.keys(manifest.environment).forEach(() => {
        updateProgress();
      });
    }
    
    // Handle timeout
    setTimeout(() => {
      if (loadedCount < totalAssets) {
        console.warn('Asset preloading timed out, continuing with partial assets');
        controller.abort();
        resolve(assets);
      }
    }, 30000); // 30 second timeout
  });
};

export default {
  loadTextures,
  loadModel,
  preloadAssets,
  createProceduralTexture
};