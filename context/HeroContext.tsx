'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';

type QualityLevel = 'low' | 'medium' | 'high';

interface HeroState {
  // Performance state
  qualityLevel: QualityLevel;
  fps: number;
  frameTime: number;
  gpuTier: number;
  isWebGPU: boolean;
  // Animation state
  isLoaded: boolean;
  transformationActive: boolean;
  transformationProgress: number;
}

interface HeroContextType extends HeroState {
  setQualityLevel: (level: QualityLevel) => void;
  startTransformation: () => void;
  setLoaded: (loaded: boolean) => void;
  updateProgress: (progress: number) => void;
}

const initialState: HeroState = {
  // Performance initial state
  qualityLevel: 'high',
  fps: 60,
  frameTime: 16.67,
  gpuTier: 1,
  isWebGPU: false,
  // Animation initial state
  isLoaded: false,
  transformationActive: false,
  transformationProgress: 0,
};

type HeroAction =
  | { type: 'SET_QUALITY'; payload: QualityLevel }
  | { type: 'UPDATE_METRICS'; payload: { fps: number; frameTime: number } }
  | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'START_TRANSFORMATION' }
  | { type: 'UPDATE_PROGRESS'; payload: number };

function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case 'SET_QUALITY':
      return { ...state, qualityLevel: action.payload };
    case 'UPDATE_METRICS':
      return {
        ...state,
        fps: action.payload.fps,
        frameTime: action.payload.frameTime,
      };
    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload };
    case 'START_TRANSFORMATION':
      return { ...state, transformationActive: true };
    case 'UPDATE_PROGRESS':
      return { ...state, transformationProgress: action.payload };
    default:
      return state;
  }
}

const HeroContext = createContext<HeroContextType | null>(null);

interface HeroProviderProps {
  children: React.ReactNode;
  initialQuality?: QualityLevel;
  isWebGPU?: boolean;
}

export function HeroProvider({
  children,
  initialQuality = 'high',
  isWebGPU = false,
}: HeroProviderProps) {
  const [state, dispatch] = useReducer(heroReducer, {
    ...initialState,
    qualityLevel: initialQuality,
    isWebGPU,
  });

  const { gl } = useThree();

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimes: number[] = [];

    function measurePerformance() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      frameTimes.push(deltaTime);
      if (frameTimes.length > 60) frameTimes.shift();

      frameCount++;
      if (frameCount >= 60) {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;

        dispatch({
          type: 'UPDATE_METRICS',
          payload: { fps, frameTime: avgFrameTime },
        });

        // Auto-adjust quality based on performance
        if (fps < 30 && state.qualityLevel !== 'low') {
          dispatch({ type: 'SET_QUALITY', payload: 'low' });
        } else if (fps > 55 && fps < 45 && state.qualityLevel !== 'medium') {
          dispatch({ type: 'SET_QUALITY', payload: 'medium' });
        } else if (fps > 58 && state.qualityLevel !== 'high') {
          dispatch({ type: 'SET_QUALITY', payload: 'high' });
        }

        frameCount = 0;
      }

      requestAnimationFrame(measurePerformance);
    }

    const animationFrame = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Animation methods
  const startTransformation = useCallback(() => {
    dispatch({ type: 'START_TRANSFORMATION' });
  }, []);

  const setLoaded = useCallback((loaded: boolean) => {
    dispatch({ type: 'SET_LOADED', payload: loaded });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  }, []);

  const contextValue: HeroContextType = {
    ...state,
    setQualityLevel: (level) => dispatch({ type: 'SET_QUALITY', payload: level }),
    startTransformation,
    setLoaded,
    updateProgress,
  };

  return (
    <HeroContext.Provider value={contextValue}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
}
