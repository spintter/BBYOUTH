'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';

type QualityLevel = 'low' | 'medium' | 'high';
type DeviceTier = 'low' | 'medium' | 'high';

// Simplified state focused on performance and transformation
interface FPSState {
  fps: number;
  qualityLevel: QualityLevel;
  deviceTier: DeviceTier;
  isWebGPU: boolean;
  transformationActive: boolean;
  transformationProgress: number;
  transformationComplete: boolean;
}

// Define context type with state and actions
interface FPSContextType extends FPSState {
  startTransformation: () => void;
  updateProgress: (progress: number) => void;
  completeTransformation: () => void;
  autoAdjustQuality: (newFps: number) => void;
}

// Create context
const FPSContext = createContext<FPSContextType | null>(null);

// Provider props
interface FPSProviderProps {
  children: React.ReactNode;
  initialQuality?: QualityLevel;
}

// Memoized device tier detection to prevent multiple WebGL context creations
let cachedDeviceTier: DeviceTier | null = null;

function detectDeviceTier(): DeviceTier {
  if (cachedDeviceTier) {
    return cachedDeviceTier; // Return cached result if already computed
  }

  // Check if running in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cachedDeviceTier = 'medium';
    return cachedDeviceTier;
  }

  // Try to detect GPU performance
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  // WebGPU support indicates a high-end device
  const hasWebGPU = 'gpu' in navigator;

  // Check processor cores/threads as an indicator of device power
  const logicalProcessors = navigator.hardwareConcurrency || 2;

  // Check if it's a mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for low-end device indicators
  const isLowEndDevice = isMobile && logicalProcessors <= 4;

  // Use GPU info if available
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

      // Look for indicators of high-end GPUs
      const isHighEndGPU =
        renderer.includes('nvidia') ||
        renderer.includes('radeon') ||
        renderer.includes('geforce') ||
        renderer.includes('intel iris') ||
        renderer.includes('apple m1') ||
        renderer.includes('apple m2');

      // Look for indicators of low-end GPUs
      const isLowEndGPU =
        renderer.includes('intel hd graphics') ||
        renderer.includes('mali-') ||
        renderer.includes('adreno');

      if (isHighEndGPU && !isLowEndDevice) {
        cachedDeviceTier = 'high';
        return cachedDeviceTier;
      }
      if (isLowEndGPU || isLowEndDevice) {
        cachedDeviceTier = 'low';
        return cachedDeviceTier;
      }
    }
  }

  // Fallback to more general detection
  if (hasWebGPU || (!isMobile && logicalProcessors >= 8)) {
    cachedDeviceTier = 'high';
    return cachedDeviceTier;
  }
  if (isMobile || logicalProcessors <= 2) {
    cachedDeviceTier = 'low';
    return cachedDeviceTier;
  }

  cachedDeviceTier = 'medium';
  return cachedDeviceTier;
}

// Determine initial quality based on device tier and url params
function getInitialQuality(userPreference?: QualityLevel): QualityLevel {
  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    return userPreference || 'medium';
  }

  // Check URL parameters first (allows manual quality override)
  const urlParams = new URLSearchParams(window.location.search);
  const qualityParam = urlParams.get('quality');
  if (qualityParam === 'low' || qualityParam === 'medium' || qualityParam === 'high') {
    return qualityParam;
  }

  // Check for quality override in localStorage (user preference)
  try {
    const storedQuality = localStorage.getItem('bbym-quality-preference');
    if (storedQuality === 'low' || storedQuality === 'medium' || storedQuality === 'high') {
      return storedQuality as QualityLevel;
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // Use explicit user preference if provided
  if (userPreference) return userPreference;

  // Otherwise, determine based on device tier
  const deviceTier = detectDeviceTier();

  // Map device tier to quality level
  switch (deviceTier) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
}

// Detect WebGPU support
function hasWebGPUSupport(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

// Custom hook to use FPS context
export function useFPS() {
  const context = useContext(FPSContext);
  if (!context) {
    throw new Error('useFPS must be used within an FPSProvider');
  }
  return context;
}

// Provider component
export function FPSProvider({ children, initialQuality }: FPSProviderProps) {
  // Compute deviceTier only once on mount
  const deviceTier = useMemo(() => detectDeviceTier(), []);
  const fpsHistoryRef = useRef<number[]>([]);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Initialize state
  const [state, setState] = useState<FPSState>({
    fps: 60,
    qualityLevel: getInitialQuality(initialQuality),
    deviceTier,
    isWebGPU: hasWebGPUSupport(),
    transformationActive: false,
    transformationProgress: 0,
    transformationComplete: false,
  });

  // Auto-adjust quality based on current FPS
  const autoAdjustQuality = useCallback((currentFps: number) => {
    setState(prev => {
      // Don't adjust if we're already at lowest quality
      if (prev.qualityLevel === 'low') return prev;

      // If FPS drops below certain thresholds, reduce quality
      if (currentFps < 25 && (prev.qualityLevel === 'medium' || prev.qualityLevel === 'high')) {
        // Store preference if possible
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('bbym-quality-preference', 'low');
          }
        } catch (e) {
          // Ignore localStorage errors
        }
        return { ...prev, qualityLevel: 'low' };
      } else if (currentFps < 40 && prev.qualityLevel === 'high') {
        // Store preference if possible
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('bbym-quality-preference', 'medium');
          }
        } catch (e) {
          // Ignore localStorage errors
        }
        return { ...prev, qualityLevel: 'medium' };
      }

      return prev;
    });
  }, []);

  // Performance monitoring with RAF and visibility awareness
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return;

    lastTimeRef.current = performance.now();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;

      // Reset timing data when page becomes visible again
      if (isVisibleRef.current) {
        lastTimeRef.current = performance.now();
        frameCountRef.current = 0;
        fpsHistoryRef.current = [];
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    function measurePerformance() {
      // Skip measurement when page is not visible
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(measurePerformance);
        return;
      }

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Only track meaningful frames (skip outliers)
      if (deltaTime < 100) {
        fpsHistoryRef.current.push(deltaTime);
        if (fpsHistoryRef.current.length > 30) fpsHistoryRef.current.shift();
      }

      frameCountRef.current++;

      // Update FPS metrics every second or after collecting enough samples
      if (currentTime - lastTimeRef.current > 1000 || frameCountRef.current >= 30) {
        // Calculate average frame time and FPS
        const avgFrameTime =
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / Math.max(1, fpsHistoryRef.current.length);
        const fps = Math.round(1000 / avgFrameTime);

        // Update state with new FPS value
        setState(prev => ({ ...prev, fps }));

        // Auto-adjust quality based on performance
        autoAdjustQuality(fps);

        // Reset frame counter
        frameCountRef.current = 0;
      }

      // Continue the measurement loop
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    }

    // Start the performance measurement loop
    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoAdjustQuality]);

  // Action methods
  const startTransformation = useCallback(() => {
    setState(prev => {
      if (prev.transformationActive) return prev; // Prevent multiple starts
      return { ...prev, transformationActive: true, transformationProgress: 0 };
    });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState(prev => {
      // Ensure progress is within bounds
      const boundedProgress = Math.max(0, Math.min(1, progress));
      return { ...prev, transformationProgress: boundedProgress };
    });
  }, []);

  const completeTransformation = useCallback(() => {
    setState(prev => ({
      ...prev,
      transformationProgress: 1,
      transformationComplete: true,
    }));
  }, []);

  // Context value
  const contextValue: FPSContextType = {
    ...state,
    startTransformation,
    updateProgress,
    completeTransformation,
    autoAdjustQuality,
  };

  return <FPSContext.Provider value={contextValue}>{children}</FPSContext.Provider>;
}