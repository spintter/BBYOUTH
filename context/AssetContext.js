// context/AssetContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import assetLoader from '../utils/assetLoader';
import { useAnimation } from './AnimationContext';

// Get the asset manifest from the loader
const { ASSET_MANIFEST } = assetLoader;

// Create context
const AssetContext = createContext();

// Provider component
export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { startLoading, assetsLoaded, updateProgress, setError: setAnimationError } = useAnimation();

  // Load assets on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadAssets = async () => {
      if (assets) return; // Already loaded
      
      try {
        setIsLoading(true);
        startLoading();
        
        const loadedAssets = await assetLoader.preloadAssets(ASSET_MANIFEST, (progress) => {
          if (isMounted) {
            updateProgress(progress);
          }
        });
        
        if (isMounted && !controller.signal.aborted) {
          setAssets(loadedAssets);
          setIsLoading(false);
          assetsLoaded(loadedAssets);
        }
      } catch (err) {
        if (isMounted && !controller.signal.aborted) {
          console.error('Failed to load assets:', err);
          setError(err);
          setAnimationError(err);
          setIsLoading(false);
        }
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [startLoading, assetsLoaded, updateProgress, setAnimationError, assets]);

  // Expose context value
  const value = {
    assets,
    isLoading,
    error,
    getTexture: (key) => assets?.textures?.[key] || null,
    getModel: (key) => {
      // Safely handle model access with defensive coding
      if (!assets?.models) return null;
      if (!(key in assets.models)) {
        console.warn(`Model "${key}" not found in assets`);
        return null;
      }
      return assets.models[key];
    }
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

// Custom hook for using the asset context
export const useAssets = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export default AssetContext; 