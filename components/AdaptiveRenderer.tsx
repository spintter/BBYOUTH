'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, BakeShadows } from '@react-three/drei';
import { getAdaptiveQualitySettings, isWebGPUSupported } from '../utils/performanceUtils';

export function AdaptiveRenderer({ children, ...props }) {
  const [qualitySettings, setQualitySettings] = useState({
    pixelRatio: 1,
    shadowMapSize: 1024,
    textureSize: 1024,
    geometryDetail: 16
  });
  
  const [isWebGPU, setIsWebGPU] = useState(false);
  
  // Check for WebGPU support and set quality settings
  useEffect(() => {
    const checkWebGPU = async () => {
      const webGPUSupported = await isWebGPUSupported();
      setIsWebGPU(webGPUSupported !== false && (webGPUSupported as any).supported === true);
      
      const settings = getAdaptiveQualitySettings();
      setQualitySettings(settings);
    };
    
    checkWebGPU();
  }, []);
  
  return (
    <Canvas
      shadows
      dpr={qualitySettings.pixelRatio}
      gl={{ 
        antialias: true,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
      }}
      camera={{ 
        position: [0, 1, 5], 
        fov: 45, 
        near: 0.1, 
        far: 1000 
      }}
      {...props}
    >
      {/* Performance optimizations */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <BakeShadows />
      
      {/* Pass quality settings to children */}
      {React.Children.map(children, child => 
        React.cloneElement(child, { qualitySettings, isWebGPU })
      )}
    </Canvas>
  );
} 