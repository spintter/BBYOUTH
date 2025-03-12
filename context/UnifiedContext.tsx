'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';

// Define quality levels
type QualityLevel = 'low' | 'medium' | 'high';

// Define animation states
type AnimationState = 'initial' | 'loading' | 'ready' | 'animating' | 'transformed';

// Define unified state
interface UnifiedState {
  // Performance metrics
  qualityLevel: QualityLevel;
  fps: number;
  frameTime: number;
  isWebGPU: boolean;
  
  // Animation state
  animationState: AnimationState;
  transformationActive: boolean;
  transformationProgress: number;
  isLoaded: boolean;
}

// Define context type with state and actions
interface UnifiedContextType extends UnifiedState {
  setQualityLevel: (level: QualityLevel) => void;
  startTransformation: () => void;
  setLoaded: (loaded: boolean) => void;
  updateProgress: (progress: number) => void;
}

// Initial state
const initialState: UnifiedState = {
  // Performance initial values
  qualityLevel: 'high',
  fps: 60,
  frameTime: 16.67,
  isWebGPU: false,
  
  // Animation initial values
  animationState: 'initial',
  transformationActive: false,
  transformationProgress: 0,
  isLoaded: false,
};

// Define action types
type UnifiedAction =
  | { type: 'SET_QUALITY'; payload: QualityLevel }
  | { type: 'UPDATE_METRICS'; payload: { fps: number; frameTime: number } }
  | { type: 'SET_ANIMATION_STATE'; payload: AnimationState }
  | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'START_TRANSFORMATION' }
  | { type: 'UPDATE_PROGRESS'; payload: number };

// Reducer function
function unifiedReducer(state: UnifiedState, action: UnifiedAction): UnifiedState {
  switch (action.type) {
    case 'SET_QUALITY':
      return { ...state, qualityLevel: action.payload };
    case 'UPDATE_METRICS':
      return {
        ...state,
        fps: action.payload.fps,
        frameTime: action.payload.frameTime,
      };
    case 'SET_ANIMATION_STATE':
      return { ...state, animationState: action.payload };
    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload };
    case 'START_TRANSFORMATION':
      return { ...state, transformationActive: true, animationState: 'animating' };
    case 'UPDATE_PROGRESS':
      return { ...state, transformationProgress: action.payload };
    default:
      return state;
  }
}

// Create context
const UnifiedContext = createContext<UnifiedContextType | null>(null);

// Provider props
interface UnifiedProviderProps {
  children: React.ReactNode;
  initialQuality?: QualityLevel;
  isWebGPU?: boolean;
}

// Provider component
export function UnifiedProvider({
  children,
  initialQuality = 'high',
  isWebGPU = false,
}: UnifiedProviderProps) {
  const [state, dispatch] = useReducer(unifiedReducer, {
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
      if (frameTimes.length > 30) frameTimes.shift();

      frameCount++;
      if (frameCount >= 30) {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;

        dispatch({
          type: 'UPDATE_METRICS',
          payload: { fps, frameTime: avgFrameTime },
        });

        // Auto-adjust quality based on performance
        if (fps < 30 && state.qualityLevel !== 'low') {
          dispatch({ type: 'SET_QUALITY', payload: 'low' });
        } else if (fps < 45 && state.qualityLevel === 'high') {
          dispatch({ type: 'SET_QUALITY', payload: 'medium' });
        }

        frameCount = 0;
      }

      requestAnimationFrame(measurePerformance);
    }

    const animationFrame = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(animationFrame);
  }, [state.qualityLevel]);

  // Action methods
  const startTransformation = useCallback(() => {
    dispatch({ type: 'START_TRANSFORMATION' });
  }, []);

  const setLoaded = useCallback((loaded: boolean) => {
    dispatch({ type: 'SET_LOADED', payload: loaded });
    if (loaded) {
      dispatch({ type: 'SET_ANIMATION_STATE', payload: 'ready' });
    }
  }, []);

  const updateProgress = useCallback((progress: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
    if (progress >= 1 && state.animationState === 'animating') {
      dispatch({ type: 'SET_ANIMATION_STATE', payload: 'transformed' });
    }
  }, [state.animationState]);

  // Create context value
  const contextValue: UnifiedContextType = {
    ...state,
    setQualityLevel: (level) => dispatch({ type: 'SET_QUALITY', payload: level }),
    startTransformation,
    setLoaded,
    updateProgress,
  };

  return (
    <UnifiedContext.Provider value={contextValue}>
      {children}
    </UnifiedContext.Provider>
  );
}

// Custom hook for using the unified context
export function useUnified() {
  const context = useContext(UnifiedContext);
  if (!context) {
    throw new Error('useUnified must be used within a UnifiedProvider');
  }
  return context;
}