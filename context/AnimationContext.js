// context/AnimationContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Animation states
const ANIMATION_STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  READY: 'ready',
  ANIMATING: 'animating',
  TRANSFORMED: 'transformed',
  ERROR: 'error'
};

// Action types
const ACTIONS = {
  START_LOADING: 'START_LOADING',
  ASSETS_LOADED: 'ASSETS_LOADED',
  START_ANIMATION: 'START_ANIMATION',
  COMPLETE_TRANSFORMATION: 'COMPLETE_TRANSFORMATION',
  ERROR: 'ERROR',
  RESET: 'RESET'
};

// Initial state
const initialState = {
  phase: ANIMATION_STATES.INITIAL,
  progress: 0,
  error: null,
  assets: null
};

// Reducer function
const animationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_LOADING:
      return {
        ...state,
        phase: ANIMATION_STATES.LOADING,
        progress: 0
      };
    case ACTIONS.ASSETS_LOADED:
      return {
        ...state,
        phase: ANIMATION_STATES.READY,
        progress: 1,
        assets: action.payload
      };
    case ACTIONS.START_ANIMATION:
      return {
        ...state,
        phase: ANIMATION_STATES.ANIMATING
      };
    case ACTIONS.COMPLETE_TRANSFORMATION:
      return {
        ...state,
        phase: ANIMATION_STATES.TRANSFORMED
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        phase: ANIMATION_STATES.ERROR,
        error: action.payload
      };
    case ACTIONS.RESET:
      return initialState;
    case ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        progress: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AnimationContext = createContext();

// Provider component
export const AnimationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);

  // Expose context value
  const value = {
    state,
    startLoading: () => dispatch({ type: ACTIONS.START_LOADING }),
    assetsLoaded: (assets) => dispatch({ type: ACTIONS.ASSETS_LOADED, payload: assets }),
    startAnimation: () => dispatch({ type: ACTIONS.START_ANIMATION }),
    completeTransformation: () => dispatch({ type: ACTIONS.COMPLETE_TRANSFORMATION }),
    setError: (error) => dispatch({ type: ACTIONS.ERROR, payload: error }),
    reset: () => dispatch({ type: ACTIONS.RESET }),
    updateProgress: (progress) => dispatch({ type: ACTIONS.UPDATE_PROGRESS, payload: progress })
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook for using the animation context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Animation sequence hook
export const useAnimationSequence = (delay = 3000) => {
  const { state, startAnimation, completeTransformation } = useAnimation();
  
  useEffect(() => {
    if (state.phase === ANIMATION_STATES.READY) {
      startAnimation();
      
      const timer = setTimeout(() => {
        completeTransformation();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [state.phase, startAnimation, completeTransformation, delay]);
  
  return state.phase;
};

export { ANIMATION_STATES, ACTIONS }; 