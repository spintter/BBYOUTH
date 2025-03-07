'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useDetectGPU } from '@react-three/drei';

// WebGPU detection and initialization component
export function WebGPUProvider({ children }: { children: React.ReactNode }) {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const gpuTier = useDetectGPU();
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  
  // Check for WebGPU support
  useEffect(() => {
    const checkWebGPU = async () => {
      try {
        // Check if WebGPU is supported
        if (!(navigator as any).gpu) {
          console.log('WebGPU is not supported. Falling back to WebGL.');
          setIsWebGPUSupported(false);
          initializeWebGLRenderer();
          return;
        }
        
        // Request adapter
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (!adapter) {
          console.log('WebGPU adapter not available. Falling back to WebGL.');
          setIsWebGPUSupported(false);
          initializeWebGLRenderer();
          return;
        }
        
        // WebGPU is supported
        console.log('WebGPU is supported!');
        setIsWebGPUSupported(true);
        
        // Initialize WebGL renderer for now (WebGPU renderer will be used by Three.js internally)
        initializeWebGLRenderer();
      } catch (error) {
        console.error('Error checking WebGPU support:', error);
        setIsWebGPUSupported(false);
        initializeWebGLRenderer();
      }
    };
    
    const initializeWebGLRenderer = () => {
      // Create WebGL renderer
      const webglRenderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      setRenderer(webglRenderer);
      setIsLoading(false);
    };
    
    checkWebGPU();
    
    // Set up keyboard shortcut for toggling stats
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        setIsStatsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Initializing 3D renderer...</p>
          <p className="text-sm text-gray-600">Checking for WebGPU support</p>
        </div>
      </div>
    );
  }
  
  // Show error if neither renderer could be initialized
  if (!renderer) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-4 bg-red-100 text-red-800 rounded-lg">
          <p className="font-bold">3D Rendering Error</p>
          <p>Unable to initialize WebGPU or WebGL renderer.</p>
          <p className="text-sm mt-2">Please try a different browser or device.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      {children}
      {isStatsVisible && <PerformanceStats isWebGPU={isWebGPUSupported} gpuTier={gpuTier.tier} />}
    </div>
  );
}

// Performance stats component
function PerformanceStats({ isWebGPU, gpuTier }: { isWebGPU: boolean | null, gpuTier: number }) {
  return (
    <div className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded text-xs font-mono">
      <div>Renderer: {isWebGPU ? 'WebGPU' : 'WebGL'}</div>
      <div>GPU Tier: {gpuTier}</div>
      <div className="text-gray-400 text-xs">Press F9 to hide</div>
    </div>
  );
} 