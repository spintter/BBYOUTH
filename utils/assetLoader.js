import { TextureLoader, RepeatWrapping, LinearSRGBColorSpace } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Asset manifest for the church website
export const ASSET_MANIFEST = {
  models: {
    // panther entry removed to resolve 404 error
  },
  textures: {
    wood: {
      base: '/textures/african-wood-base.jpg',
      roughness: '/textures/african-wood-roughness.jpg',
      normal: '/textures/african-wood-normal.jpg',
      fallback: {
        base: '/textures/fallback-base.jpg',
        roughness: '/textures/fallback-roughness.jpg',
        normal: '/textures/fallback-normal.jpg',
      }
    }
  },
  environment: {
    church: '/hdr/wakanda.hdr'
  }
};

// Texture loader with AbortController support
export const loadTextures = async (urls, options = {}) => {
  const { signal } = options;
  
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  
  try {
    const loadedTextures = await Promise.all(
      urls.map(url => {
        const loader = new TextureLoader();
        return loader.loadAsync(url);
      })
    );
    
    loadedTextures.forEach(texture => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(0.25, 0.25);
      texture.colorSpace = LinearSRGBColorSpace;
    });
    
    return loadedTextures;
  } catch (err) {
    console.error(`Texture Load Error:`, err);
    throw err;
  }
};

// Model loader with progress tracking
export const loadModel = async (url, onProgress = () => {}) => {
  const loader = new GLTFLoader();
  return loader.loadAsync(url, onProgress);
};

// Preload assets based on manifest
export const preloadAssets = async (manifest = ASSET_MANIFEST, onProgress = () => {}) => {
  const assets = {
    textures: {},
    models: {}
  };
  
  let loaded = 0;
  let total = 0;
  
  // Count total assets safely
  if (manifest.models && Object.keys(manifest.models).length > 0) {
    Object.values(manifest.models).forEach(model => {
      if (model.preload) total++;
    });
  }
  
  Object.values(manifest.textures || {}).forEach(texture => {
    total += 3; // base, roughness, normal
  });
  
  // Handle the case where there are no assets to load
  if (total === 0) {
    console.log('No assets to preload in manifest');
    return assets;
  }
  
  const updateProgress = () => {
    loaded++;
    onProgress(loaded / total);
  };
  
  // Load models (with defensive check)
  const modelPromises = [];
  if (manifest.models && Object.keys(manifest.models).length > 0) {
    Object.entries(manifest.models)
      .filter(([_, model]) => model.preload)
      .forEach(([key, model]) => {
        modelPromises.push(
          (async () => {
            try {
              const result = await loadModel(model.path, updateProgress);
              assets.models[key] = result;
            } catch (err) {
              console.error(`Failed to load model: ${key}`, err);
              // Provide a null value instead of undefined for failed models
              assets.models[key] = null;
            }
          })()
        );
      });
  }
  
  // Load textures (with defensive check)
  const texturePromises = [];
  if (manifest.textures && Object.keys(manifest.textures).length > 0) {
    Object.entries(manifest.textures).forEach(([key, texture]) => {
      texturePromises.push(
        (async () => {
          try {
            const urls = [texture.base, texture.roughness, texture.normal];
            const result = await loadTextures(urls);
            assets.textures[key] = {
              baseColor: result[0],
              roughness: result[1],
              normal: result[2]
            };
            updateProgress();
          } catch (err) {
            console.error(`Failed to load texture: ${key}`, err);
            // Try fallback if available
            if (texture.fallback) {
              try {
                const fallbackUrls = [
                  texture.fallback.base, 
                  texture.fallback.roughness, 
                  texture.fallback.normal
                ];
                const fallbackResult = await loadTextures(fallbackUrls);
                assets.textures[key] = {
                  baseColor: fallbackResult[0],
                  roughness: fallbackResult[1],
                  normal: fallbackResult[2]
                };
                updateProgress();
              } catch (fallbackErr) {
                console.error(`Failed to load fallback texture: ${key}`, fallbackErr);
                // Provide a null value instead of undefined for failed textures
                assets.textures[key] = null;
              }
            } else {
              // Provide a null value for textures with no fallback
              assets.textures[key] = null;
            }
          }
        })()
      );
    });
  }
  
  await Promise.allSettled([...modelPromises, ...texturePromises]);
  return assets;
};

export default {
  loadTextures,
  loadModel,
  preloadAssets,
  ASSET_MANIFEST
};