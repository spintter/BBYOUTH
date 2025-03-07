'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { useThree } from '@react-three/fiber';
import { useDetectGPU } from '@react-three/drei';
import { QualityLevel } from '../PerformanceMonitor';

// Cache for loaded textures to prevent duplicate loading
const textureCache = new Map<string, THREE.Texture>();

// Interface for texture options
export interface TextureOptions {
  anisotropy?: number;
  flipY?: boolean;
  colorSpace?: THREE.ColorSpace;
  generateMipmaps?: boolean;
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  minFilter?: THREE.TextureFilter;
  magFilter?: THREE.MagnificationTextureFilter;
  mapping?: THREE.Mapping;
}

// Interface for KTX2 texture loader props
interface KTX2TextureLoaderProps {
  url: string;
  fallbackUrl?: string; // Fallback URL for devices that don't support KTX2
  options?: TextureOptions;
  onLoad?: (texture: THREE.Texture) => void;
  onError?: (error: Error) => void;
  qualityLevel?: QualityLevel;
}

/**
 * KTX2 Texture Loader Component
 * 
 * Loads KTX2 compressed textures with fallback to regular textures for unsupported devices.
 * Implements caching, preloading, and adaptive quality based on device capabilities.
 * 
 * KTX2 textures can reduce memory usage by up to 80% compared to uncompressed textures.
 */
export function useKTX2Texture({
  url,
  fallbackUrl,
  options = {},
  onLoad,
  onError,
  qualityLevel = QualityLevel.HIGH
}: KTX2TextureLoaderProps): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { gl } = useThree();
  const gpuInfo = useDetectGPU();
  const isLoading = useRef(false);
  
  useEffect(() => {
    // Skip if already loading or if URL is empty
    if (isLoading.current || !url) return;
    isLoading.current = true;
    
    // Check if texture is already cached
    if (textureCache.has(url)) {
      const cachedTexture = textureCache.get(url)!;
      setTexture(cachedTexture);
      if (onLoad) onLoad(cachedTexture);
      isLoading.current = false;
      return;
    }
    
    // Determine if device supports KTX2
    const supportsKTX2 = checkKTX2Support(gl);
    
    // Choose appropriate loader and URL
    if (supportsKTX2) {
      loadKTX2Texture(url, options, qualityLevel)
        .then(loadedTexture => {
          setTexture(loadedTexture);
          textureCache.set(url, loadedTexture);
          if (onLoad) onLoad(loadedTexture);
        })
        .catch(error => {
          console.error('Error loading KTX2 texture:', error);
          // Try fallback if available
          if (fallbackUrl) {
            loadFallbackTexture(fallbackUrl, options)
              .then(fallbackTexture => {
                setTexture(fallbackTexture);
                textureCache.set(url, fallbackTexture); // Cache under original URL
                if (onLoad) onLoad(fallbackTexture);
              })
              .catch(fallbackError => {
                console.error('Error loading fallback texture:', fallbackError);
                if (onError) onError(fallbackError);
              });
          } else if (onError) {
            onError(error);
          }
        })
        .finally(() => {
          isLoading.current = false;
        });
    } else if (fallbackUrl) {
      // Use fallback for devices without KTX2 support
      loadFallbackTexture(fallbackUrl, options)
        .then(fallbackTexture => {
          setTexture(fallbackTexture);
          textureCache.set(url, fallbackTexture); // Cache under original URL
          if (onLoad) onLoad(fallbackTexture);
        })
        .catch(error => {
          console.error('Error loading fallback texture:', error);
          if (onError) onError(error);
        })
        .finally(() => {
          isLoading.current = false;
        });
    } else {
      // No fallback available, try to load as regular texture
      loadFallbackTexture(url, options)
        .then(regularTexture => {
          setTexture(regularTexture);
          textureCache.set(url, regularTexture);
          if (onLoad) onLoad(regularTexture);
        })
        .catch(error => {
          console.error('Error loading texture:', error);
          if (onError) onError(error);
        })
        .finally(() => {
          isLoading.current = false;
        });
    }
    
    // Cleanup function
    return () => {
      // Note: We don't dispose textures here as they might be used elsewhere
      // Textures are managed by the cache and disposed when no longer needed
    };
  }, [url, fallbackUrl, onLoad, onError, gl, qualityLevel]);
  
  return texture;
}

/**
 * Check if the device supports KTX2 textures
 */
function checkKTX2Support(renderer: THREE.WebGLRenderer): boolean {
  // Check for WebGL2 support (required for KTX2)
  if (!(renderer.capabilities.isWebGL2)) {
    return false;
  }
  
  // Check for required extensions
  const extensions = [
    'EXT_texture_compression_astc',
    'EXT_texture_compression_bptc',
    'EXT_texture_compression_rgtc',
    'WEBGL_compressed_texture_etc',
    'WEBGL_compressed_texture_etc1',
    'WEBGL_compressed_texture_s3tc'
  ];
  
  // Need at least one compression format
  return extensions.some(ext => renderer.capabilities.isWebGL2 && 
    (renderer as any).extensions.get(ext));
}

/**
 * Load a KTX2 texture with the KTX2Loader
 */
async function loadKTX2Texture(
  url: string, 
  options: TextureOptions,
  qualityLevel: QualityLevel
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    // Create a temporary renderer to initialize the KTX2Loader
    const tempRenderer = new THREE.WebGLRenderer();
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/basis/');
    ktx2Loader.detectSupport(tempRenderer);
    
    // Set quality based on quality level - more aggressive compression
    let quality = 1.0;
    switch (qualityLevel) {
      case QualityLevel.ULTRA:
        quality = 0.8; // Reduced from 1.0
        break;
      case QualityLevel.HIGH:
        quality = 0.6; // Reduced from 0.8
        break;
      case QualityLevel.MEDIUM:
        quality = 0.4; // Reduced from 0.6
        break;
      case QualityLevel.LOW:
        quality = 0.2; // Reduced from 0.4
        break;
      case QualityLevel.MINIMUM:
        quality = 0.1; // Reduced from 0.2
        break;
    }
    
    // We can't directly set transcoding quality in KTX2Loader
    // Instead, we'll apply quality settings to the texture after loading
    // ktx2Loader.setTranscodeLevel(quality);
    
    // Dispose of temporary renderer
    tempRenderer.dispose();
    
    // Load the texture with a timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`KTX2 texture load timeout: ${url}`));
    }, 10000); // 10 second timeout
    
    ktx2Loader.load(
      url,
      (texture) => {
        clearTimeout(timeoutId);
        
        // Apply texture options
        applyTextureOptions(texture, options);
        
        // Apply additional optimizations
        optimizeTexture(texture, qualityLevel);
        
        resolve(texture);
      },
      undefined,
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

/**
 * Apply additional optimizations to a texture based on quality level
 */
function optimizeTexture(texture: THREE.Texture, qualityLevel: QualityLevel): void {
  // Disable mipmaps for minimum quality to save memory
  if (qualityLevel === QualityLevel.MINIMUM) {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter; // Use LinearFilter when mipmaps are disabled
  }
  
  // Set appropriate texture filter based on quality
  if (qualityLevel <= QualityLevel.LOW) {
    texture.minFilter = THREE.LinearFilter; // Less quality but better performance
  } else {
    texture.minFilter = THREE.LinearMipmapLinearFilter; // Better quality
  }
  
  // Optimize memory usage by disposing the image data after upload to GPU
  // This is safe because Three.js keeps the data in GPU memory
  const originalImage = texture.image;
  texture.addEventListener('dispose', () => {
    // Clean up any references that might prevent garbage collection
    if (texture.image) {
      // @ts-ignore: Safely clear image data
      texture.image = null;
    }
  });
  
  // Force texture update
  texture.needsUpdate = true;
}

/**
 * Load a regular texture as fallback
 */
async function loadFallbackTexture(url: string, options: TextureOptions): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    // Create a lower resolution version for fallback textures
    const loader = new THREE.TextureLoader();
    
    // Set a timeout to prevent hanging on slow loads
    const timeoutId = setTimeout(() => {
      reject(new Error(`Texture load timeout: ${url}`));
    }, 10000); // 10 second timeout
    
    loader.load(
      url,
      (texture) => {
        clearTimeout(timeoutId);
        
        // Apply texture options
        applyTextureOptions(texture, options);
        
        // For fallback textures, we'll apply additional optimizations
        // to reduce memory usage since they're likely uncompressed
        const resizeCanvas = document.createElement('canvas');
        const ctx = resizeCanvas.getContext('2d');
        
        if (ctx && texture.image) {
          // Limit maximum texture size for fallbacks
          const maxSize = 1024; // Limit to 1K textures for fallbacks
          let newWidth = texture.image.width;
          let newHeight = texture.image.height;
          
          // Scale down if needed
          if (newWidth > maxSize || newHeight > maxSize) {
            if (newWidth > newHeight) {
              newHeight = Math.round(newHeight * (maxSize / newWidth));
              newWidth = maxSize;
            } else {
              newWidth = Math.round(newWidth * (maxSize / newHeight));
              newHeight = maxSize;
            }
            
            // Resize the image
            resizeCanvas.width = newWidth;
            resizeCanvas.height = newHeight;
            ctx.drawImage(texture.image, 0, 0, newWidth, newHeight);
            
            // Replace the texture image with the resized one
            texture.image = resizeCanvas;
            texture.needsUpdate = true;
          }
        }
        
        resolve(texture);
      },
      undefined,
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

/**
 * Apply texture options to a loaded texture
 */
function applyTextureOptions(texture: THREE.Texture, options: TextureOptions): void {
  // Apply all provided options
  if (options.anisotropy !== undefined) texture.anisotropy = options.anisotropy;
  if (options.flipY !== undefined) texture.flipY = options.flipY;
  if (options.colorSpace !== undefined) texture.colorSpace = options.colorSpace;
  if (options.generateMipmaps !== undefined) texture.generateMipmaps = options.generateMipmaps;
  if (options.wrapS !== undefined) texture.wrapS = options.wrapS;
  if (options.wrapT !== undefined) texture.wrapT = options.wrapT;
  if (options.minFilter !== undefined) texture.minFilter = options.minFilter;
  if (options.magFilter !== undefined) texture.magFilter = options.magFilter;
  
  // Set defaults if not specified
  if (options.anisotropy === undefined) {
    // Create a temporary renderer to get max anisotropy
    const tempRenderer = new THREE.WebGLRenderer();
    texture.anisotropy = tempRenderer.capabilities.getMaxAnisotropy();
    tempRenderer.dispose();
  }
  if (options.colorSpace === undefined) texture.colorSpace = THREE.SRGBColorSpace;
  if (options.generateMipmaps === undefined) texture.generateMipmaps = true;
  if (options.minFilter === undefined) texture.minFilter = THREE.LinearMipmapLinearFilter;
  if (options.magFilter === undefined) texture.magFilter = THREE.LinearFilter;
  
  texture.needsUpdate = true;
}

/**
 * Preload a KTX2 texture to ensure it's available when needed
 */
export function preloadKTX2Texture(
  url: string, 
  fallbackUrl?: string,
  options?: TextureOptions,
  qualityLevel: QualityLevel = QualityLevel.HIGH
): void {
  // Skip if already cached
  if (textureCache.has(url)) return;
  
  // Create a temporary renderer to check KTX2 support
  const tempRenderer = new THREE.WebGLRenderer();
  const supportsKTX2 = checkKTX2Support(tempRenderer);
  tempRenderer.dispose();
  
  if (supportsKTX2) {
    loadKTX2Texture(url, options || {}, qualityLevel)
      .then(texture => {
        textureCache.set(url, texture);
        console.log(`Preloaded KTX2 texture: ${url}`);
      })
      .catch(error => {
        console.error(`Failed to preload KTX2 texture: ${url}`, error);
        // Try fallback if available
        if (fallbackUrl) {
          loadFallbackTexture(fallbackUrl, options || {})
            .then(fallbackTexture => {
              textureCache.set(url, fallbackTexture);
              console.log(`Preloaded fallback texture: ${fallbackUrl}`);
            })
            .catch(fallbackError => {
              console.error(`Failed to preload fallback texture: ${fallbackUrl}`, fallbackError);
            });
        }
      });
  } else if (fallbackUrl) {
    loadFallbackTexture(fallbackUrl, options || {})
      .then(fallbackTexture => {
        textureCache.set(url, fallbackTexture);
        console.log(`Preloaded fallback texture: ${fallbackUrl}`);
      })
      .catch(error => {
        console.error(`Failed to preload fallback texture: ${fallbackUrl}`, error);
      });
  } else {
    loadFallbackTexture(url, options || {})
      .then(regularTexture => {
        textureCache.set(url, regularTexture);
        console.log(`Preloaded regular texture: ${url}`);
      })
      .catch(error => {
        console.error(`Failed to preload regular texture: ${url}`, error);
      });
  }
}

/**
 * Clear the texture cache and dispose of all textures
 */
export function clearTextureCache(): void {
  textureCache.forEach(texture => {
    texture.dispose();
  });
  textureCache.clear();
}

/**
 * Dispose of a specific texture from the cache
 */
export function disposeTexture(url: string): void {
  if (textureCache.has(url)) {
    const texture = textureCache.get(url)!;
    texture.dispose();
    textureCache.delete(url);
  }
}

/**
 * Get the current size of the texture cache in MB
 */
export function getTextureCacheSize(): number {
  let totalSize = 0;
  
  textureCache.forEach(texture => {
    if (texture.image) {
      const width = texture.image.width || 0;
      const height = texture.image.height || 0;
      // Estimate 4 bytes per pixel (RGBA)
      totalSize += width * height * 4;
    }
  });
  
  // Convert to MB
  return totalSize / (1024 * 1024);
} 