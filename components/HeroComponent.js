// HeroComponent.js
'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, LinearSRGBColorSpace, Color, PMREMGenerator, MathUtils, InstancedMesh, Matrix4, Object3D } from 'three';
import { Environment, OrbitControls, Html, useProgress, Effects, EffectComposer, Bloom, SMAA, PerformanceMonitor, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import * as THREE from 'three';
import { useAssets } from '../context/AssetContext';

// Performance constants with safe limits
const MOBILE_DPR = 1;
const DESKTOP_DPR = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1.5 : 1.5, 1.5);
const isMobile = typeof window !== 'undefined' ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

// Material store with optimized parameters
const materialStore = {
  black: new THREE.MeshPhysicalMaterial({
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1
  }),
  white: new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1
  })
};

// Optimized animation constants
const ANIMATION_CONFIG = {
  duration: 0.016,
  waveIntensity: isMobile ? 0.4 : 0.5,
  scaleIntensity: isMobile ? 0.1 : 0.15,
  speed: isMobile ? 0.5 : 0.7,
  waveFrequency: isMobile ? 0.6 : 0.8,
  dispersionFactor: isMobile ? 1.2 : 1.5
};

// Convert chess notation to coordinates
const chessToCoords = (position) => {
  const file = position.charAt(0).toLowerCase();
  const rank = parseInt(position.charAt(1));
  const x = (file.charCodeAt(0) - 97) - 3.5;
  const z = (rank - 4.5);
  return [x * 0.45, 0, z * 0.45];
};

// Define complete chess pieces configuration
const CHESS_PIECES = [
  {
    model: '/models/pawn.glb',
    positions: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    scale: 0.1,
    height: 0.3
  },
  {
    model: '/models/rook.glb',
    positions: ['a1', 'h1', 'a8', 'h8'],
    scale: 0.12,
    height: 0.35
  },
  {
    model: '/models/knight.glb',
    positions: ['b1', 'g1', 'b8', 'g8'],
    scale: 0.11,
    height: 0.35
  },
  {
    model: '/models/bishop.glb',
    positions: ['c1', 'f1', 'c8', 'f8'],
    scale: 0.11,
    height: 0.38
  },
  {
    model: '/models/queen.glb',
    positions: ['d1', 'd8'],
    scale: 0.13,
    height: 0.4
  },
  {
    model: '/models/king.glb',
    positions: ['e1', 'e8'],
    scale: 0.14,
    height: 0.45
  }
];

// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('R3F Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the 3D scene.</h2>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-black rounded"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Indicator with Progress
const LoadingIndicator = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center text-white" aria-live="polite">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold">Loading... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

// Performance Optimizer Component
const PerformanceOptimizer = () => {
  const { gl, invalidate } = useThree();
  
  useEffect(() => {
    // Ensure animation loop is running initially
    gl.setAnimationLoop(() => invalidate());
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gl.setAnimationLoop(null);
      } else {
        gl.setAnimationLoop(() => invalidate());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gl, invalidate]);
  
  return null;
};

// Enhanced Text Overlay
const TextOverlay = ({ title, subtitle, ctaText }) => {
  const handleExplore = useCallback(() => {
    const humanitiesSection = document.getElementById('humanities');
    if (humanitiesSection) {
      humanitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 text-white max-w-xl z-10" role="banner">
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">BBYM</div>
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Humanities', 'Ministries', 'Events', 'K-12 Resources', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>
      
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
        <span className="inline-block bg-gradient-to-r from-orange-500 via-orange-400 to-red-600 
                       bg-clip-text text-transparent 
                       filter drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]
                       hover:scale-[1.02] transition-transform duration-300">
          {title.split(' ').map((word, i) => (
            <span 
              key={i}
              className="inline-block hover:translate-y-[-2px] transition-transform duration-200"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {word}{' '}
            </span>
          ))}
        </span>
      </h1>
      
      <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light
                    animate-slide-up opacity-90
                    drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                    leading-relaxed">
        {subtitle}
      </p>
      
      <button
        onClick={handleExplore}
        className="group relative overflow-hidden
                   bg-gradient-to-r from-orange-500 to-red-600 
                   text-white px-8 py-4 rounded-lg font-bold text-lg
                   transform transition-all duration-300
                   hover:scale-105 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-orange-500
                   active:scale-95"
        aria-label={ctaText}
      >
        <span className="relative z-10">{ctaText}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 
                      transform scale-x-0 group-hover:scale-x-100
                      transition-transform duration-300 origin-left" />
      </button>
    </div>
  );
};

// Enhanced Chessboard with stable optimizations
const Chessboard = ({ pieces = CHESS_PIECES }) => {
  const { getModel } = useAssets();
  const groupRef = useRef();
  const instancedMeshRef = useRef();
  const whiteInstancedMeshRef = useRef();
  const characterRefs = useRef({});
  const { clock } = useThree();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rotationProgress = useRef(0);
  const orbitControlsRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create smaller geometry for tiles with bevels and slight height variation to prevent z-fighting
  const tileGeometry = useMemo(() => 
    new THREE.BoxGeometry(
      0.35, // width
      0.08 + (Math.random() * 0.005), // height with slight variation to prevent z-fighting
      0.35, // depth
      isMobile ? 2 : 3, // segments - added for bevels
      1,
      isMobile ? 2 : 3
    ), 
  []);

  // Use single material instances
  const blackMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#000000',
    metalness: 0.7,
    roughness: 0.2,
    envMapIntensity: 1.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2
  }), []);

  const whiteMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    metalness: 0.7,
    roughness: 0.2,
    envMapIntensity: 1.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2
  }), []);

  // Handle interaction
  const handleClick = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Add character instances
  useEffect(() => {
    pieces.forEach((config) => {
      config.positions.forEach(position => {
        const [x, y, z] = chessToCoords(position);
        if (characterRefs.current[position]?.mesh) {
          const instance = characterRefs.current[position].mesh.clone();
          instance.position.set(x, config.height, z);
          instance.scale.setScalar(config.scale);
          groupRef.current?.add(instance);
        }
      });
    });
  }, [pieces]);

  // Add animation state initialization
  const [animationEnabled, setAnimationEnabled] = useState(true);
  
  // Reuse object for animation to prevent memory churn
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  
  // Enhanced animation frame with throttling
  useFrame((state) => {
    if (!groupRef.current) return;

    // Performance optimization: Skip frames for throttling
    // Using modulo on elapsedTime ensures consistent frame skipping
    const elapsed = clockRef.current.getElapsedTime();
    const shouldRender = elapsed % 0.1 < 0.016; // Only render ~16% of frames
    
    if (!shouldRender && !isFlipped) return; // Skip this frame unless board is flipped (needs update)

    // Update animation condition to ensure it runs on mount
    if (animationEnabled && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime();
      const BOARD_SIZE = 8;

      // Check if performances API is available for timing
      const perfNow = typeof performance !== 'undefined' ? performance.now() : 0;

      // Tile wave animation with performance optimization
      for (let x = 0; x < BOARD_SIZE; x++) {
        for (let z = 0; z < BOARD_SIZE; z++) {
          const id = x * BOARD_SIZE + z;
          const isBlack = (x + z) % 2 === 0;
          const targetMesh = isBlack ? instancedMeshRef.current : whiteInstancedMeshRef.current;
          
          if (!targetMesh) continue;

          // Use cached math operations to prevent garbage collection
          const xPos = (x - BOARD_SIZE / 2 + 0.5) * 0.45;
          const zPos = (z - BOARD_SIZE / 2 + 0.5) * 0.45;
          
          // Calculate wave effect with distance from center
          const distance = Math.sqrt(
            Math.pow(x - BOARD_SIZE / 2, 2) + 
            Math.pow(z - BOARD_SIZE / 2, 2)
          );
          
          const wave = isFlipped ? 0 : 
                     Math.sin(distance - time * ANIMATION_CONFIG.speed * 0.5) * 
                     ANIMATION_CONFIG.waveIntensity * 0.25;
          
          // Use temporary vector to avoid creating new objects
          tempVector.set(xPos, wave, zPos);
          tempObject.position.copy(tempVector);
          
          // Calculate rotation based on wave height
          tempObject.rotation.x = wave * 0.02;
          tempObject.rotation.z = wave * 0.02;
          
          // Update matrix and apply to instanced mesh
          tempObject.updateMatrix();
          targetMesh.setMatrixAt(id, tempObject.matrix);
        }
      }

      // Batch update instance matrices to minimize GPU calls
      if (instancedMeshRef.current) {
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      }
      if (whiteInstancedMeshRef.current) {
        whiteInstancedMeshRef.current.instanceMatrix.needsUpdate = true;
      }

      // Update character positions to follow tiles - only if visible and in viewport
      if (!isFlipped) {
        const meshRefs = Object.values(characterRefs.current);
        const visibleMeshes = meshRefs.filter(ref => ref && ref.instances);
        
        for (let i = 0; i < visibleMeshes.length; i++) {
          const charRef = visibleMeshes[i];
          
          if (!charRef || !charRef.instances) continue;
          
          Object.entries(charRef.instances).forEach(([position, instance]) => {
            const [charX, _, charZ] = chessToCoords(position);
            
            // Find the closest tile
            for (let x = 0; x < BOARD_SIZE; x++) {
              for (let z = 0; z < BOARD_SIZE; z++) {
                const xPos = (x - BOARD_SIZE / 2 + 0.5) * 0.45;
                const zPos = (z - BOARD_SIZE / 2 + 0.5) * 0.45;
                
                if (Math.abs(charX - xPos) < 0.1 && Math.abs(charZ - zPos) < 0.1) {
                  const distance = Math.sqrt(
                    Math.pow(x - BOARD_SIZE / 2, 2) + 
                    Math.pow(z - BOARD_SIZE / 2, 2)
                  );
                  
                  const wave = isFlipped ? 0 : 
                            Math.sin(distance - time * ANIMATION_CONFIG.speed * 0.5) * 
                            ANIMATION_CONFIG.waveIntensity * 0.25;
                  
                  // Apply height adjustment to chess piece
                  const config = pieces.find(p => p.positions.includes(position));
                  if (config && instance) {
                    instance.position.y = wave + (config.height || 0.3);
                    instance.rotation.x = wave * 0.02;
                    instance.rotation.z = wave * 0.02;
                  }
                }
              }
            }
          });
        }
      }
      
      // Track performance metrics in development
      if (process.env.NODE_ENV === 'development' && perfNow) {
        const frameTime = performance.now() - perfNow;
        if (frameTime > 16.67) { // If frame takes longer than 60fps budget
          console.warn(`Slow frame detected: ${frameTime.toFixed(2)}ms`);
        }
      }
    }
  });

  // Initialize animation on mount
  useEffect(() => {
    setAnimationEnabled(true);
    // Force a re-render to start animation
    const timer = setTimeout(() => {
      if (groupRef.current) {
        groupRef.current.position.y += 0.0001; // Tiny change to force update
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      setAnimationEnabled(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (tileGeometry) {
        tileGeometry.dispose();
      }
      if (blackMaterial) blackMaterial.dispose();
      if (whiteMaterial) whiteMaterial.dispose();
    };
  }, [tileGeometry, blackMaterial, whiteMaterial]);

  return (
    <group
      ref={groupRef}
      rotation={[0, 0, 0]}
      position={[0, isMobile ? -0.5 : -0.25, isMobile ? -2 : -2.5]}
      scale={isMobile ? 0.8 : 1.0}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <instancedMesh
        ref={instancedMeshRef}
        args={[tileGeometry, blackMaterial, 64]}
        frustumCulled
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={whiteInstancedMeshRef}
        args={[tileGeometry, whiteMaterial, 64]}
        frustumCulled
        castShadow
        receiveShadow
      />

      {/* Add characters */}
      <Suspense fallback={null}>
        {pieces.map((config) => (
          <CharacterInstances
            key={config.positions[0]}
            modelPath={config.model}
            positions={config.positions}
            scale={config.scale}
            height={config.height}
            ref={el => characterRefs.current[config.positions[0]] = el}
          />
        ))}
      </Suspense>
    </group>
  );
};

// Character Instances Component
const CharacterInstances = forwardRef(({ modelPath, positions, scale, height }, ref) => {
  const { scene } = useGLTF(modelPath);
  const instances = useRef({});
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(null);

  useEffect(() => {
    // Try-catch block to handle model loading errors
    try {
      if (!scene) throw new Error(`Failed to load model: ${modelPath}`);
      
      positions.forEach(position => {
        const [x, y, z] = chessToCoords(position);
        const instance = scene.clone();
        
        // Apply single material instances to improve performance
        instance.traverse(child => {
          if (child.isMesh) {
            // Determine if this is a white or black piece based on position
            const isWhite = position.charAt(1) === '1' || position.charAt(1) === '2';
            child.material = isWhite ? materialStore.white.clone() : materialStore.black.clone();
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        instance.position.set(x, height, z);
        instance.scale.setScalar(scale);
        instances.current[position] = instance;
      });
      
      console.log('Successfully loaded model:', modelPath);
      setModelLoaded(true);
    } catch (error) {
      console.error('Error loading model:', modelPath, error);
      setModelError(error.message);
    }
    
    // Clean up function to prevent memory leaks
    return () => {
      Object.values(instances.current).forEach(instance => {
        instance.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, [positions, scale, height, scene, modelPath]);

  // Fallback rendering for model errors
  if (modelError) {
    console.warn('Rendering fallback for:', modelPath);
  }

  useImperativeHandle(ref, () => ({
    mesh: scene,
    instances: instances.current,
    loaded: modelLoaded,
    error: modelError
  }));

  return null;
});

// Enhanced Scene with Stability Monitoring
const Scene = () => {
  const { scene, gl, camera } = useThree();
  const [highQuality, setHighQuality] = useState(!isMobile);
  
  // Camera targeting
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 3.5, 5.5);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // WebGL context handling with improved recovery
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.error('WebGL context lost - attempting recovery');
      
      // Log diagnostics information
      console.info('WebGL state before recovery attempt:', {
        memory: gl.info?.memory,
        renderer: gl.info?.renderer
      });
      
      // Try to restore context
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) {
        // Create recovery attempt counter to prevent infinite loops
        let recoveryAttempts = window.__glRecoveryAttempts || 0;
        window.__glRecoveryAttempts = recoveryAttempts + 1;
        
        if (recoveryAttempts < 3) {
          console.log(`WebGL recovery attempt ${recoveryAttempts + 1}`);
          
          setTimeout(() => {
            try {
              ext.restoreContext();
              setupEnvironment(); // Re-initialize scene
            } catch (err) {
              console.error('Failed to restore WebGL context:', err);
              // Force a page refresh as last resort after multiple failures
              if (recoveryAttempts >= 2) {
                alert('3D rendering encountered an issue. The page will refresh.');
                setTimeout(() => window.location.reload(), 2000);
              }
            }
          }, 1000);
        } else {
          console.error('Too many WebGL recovery attempts, switching to fallback mode');
          // Here we could render a simplified 2D fallback if needed
        }
      } else {
        console.error('WEBGL_lose_context extension not available');
      }
    };

    const handleContextRestored = () => {
      console.log('WebGL context successfully restored');
      window.__glRecoveryAttempts = 0;
      setupEnvironment();
    };

    const setupEnvironment = () => {
      // Cache these expensive objects for reuse
      if (!window.__envCache) {
        window.__envCache = {};
      }
      
      let pmremGenerator;
      let environment;
      
      try {
        pmremGenerator = new THREE.PMREMGenerator(gl);
        pmremGenerator.compileEquirectangularShader();
        
        environment = window.__envCache.environment || new RoomEnvironment();
        window.__envCache.environment = environment;
        
        const envMap = pmremGenerator.fromScene(environment).texture;
        scene.environment = envMap;
        scene.background = new THREE.Color('#000000');
        
        // Add subtle fog for depth
        scene.fog = new THREE.Fog('#000000', 8, 20);
      } catch (err) {
        console.error('Error setting up environment:', err);
      } finally {
        // Clean up resources
        if (pmremGenerator && !window.__envCache.pmremGenerator) {
          window.__envCache.pmremGenerator = pmremGenerator;
        }
      }
    };

    setupEnvironment();
    
    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
      gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      
      // Clean up environment resources
      if (window.__envCache) {
        if (window.__envCache.environment) {
          window.__envCache.environment.dispose();
        }
        if (window.__envCache.pmremGenerator) {
          window.__envCache.pmremGenerator.dispose();
        }
        delete window.__envCache;
      }
    };
  }, [gl, scene]);
  
  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && window.PerformanceObserver) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 16.67) {
            console.warn('Performance issue detected:', entry);
          }
        }
      });
      
      try {
        perfObserver.observe({ entryTypes: ['measure'] });
        return () => perfObserver.disconnect();
      } catch (e) {
        console.warn('PerformanceObserver not supported');
      }
    }
  }, []);

  // WebGL capability testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      console.log('WebGL capabilities:', {
        maxTextureSize: gl?.getParameter(gl.MAX_TEXTURE_SIZE),
        renderer: gl?.getParameter(gl.RENDERER),
        vendor: gl?.getParameter(gl.VENDOR)
      });
    }
  }, []);

  // Frame performance monitoring (development only)
  useFrame(() => {
    if (process.env.NODE_ENV === 'development') {
      const now = performance.now();
      if (now % 60 < 1) { // Log every ~1 second
        console.log('Frame time:', now % 1000);
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      
      {/* Enhanced lighting for characters */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.5}
        castShadow={!isMobile}
        shadow-mapSize-width={highQuality ? 2048 : 1024}
        shadow-mapSize-height={highQuality ? 2048 : 1024}
        shadow-camera-far={50}
        shadow-camera-near={0.1}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      
      {/* Character spotlight */}
      <spotLight
        position={[-5, 6, -5]}
        angle={0.15}
        penumbra={1}
        intensity={1.2}
        color="#ffa500"
        castShadow={true}
        target-position={[0, 0, 0]}
      />
      
      <Chessboard pieces={CHESS_PIECES} />
      
      {/* Ground plane with enhanced shadows */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshPhysicalMaterial
          color="#000000"
          metalness={0.2}
          roughness={0.8}
          envMapIntensity={0.5}
          opacity={0.4}
          transparent
        />
      </mesh>
    </>
  );
};

// Main Component Export
const HeroComponent = ({
  title = 'BBYM Community Center for The Humanities',
  subtitle = 'Strategic Discourse. Cultural Wisdom.',
  ctaText = 'Explore Programs',
}) => {
  const [keyboardControlsEnabled, setKeyboardControlsEnabled] = useState(false);
  const canvasRef = useRef();
  
  // Detect and respect motion preferences
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    if (!keyboardControlsEnabled) return;
    
    // Handle keyboard navigation
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault(); // Prevent page scrolling
        // The orbit controls will pick up these events
        break;
      case 'Tab':
        // Allow Tab to naturally move through focusable elements
        break;
      case 'Space':
      case 'Enter':
        // Toggle animation or interact with focused element
        e.preventDefault();
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        document.activeElement.dispatchEvent(event);
        break;
      default:
        break;
    }
  }, [keyboardControlsEnabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle keyboard controls when canvas receives focus
  const handleCanvasFocus = () => setKeyboardControlsEnabled(true);
  const handleCanvasBlur = () => setKeyboardControlsEnabled(false);

  return (
    <div className="relative w-full h-screen">
      <TextOverlay 
        title={title} 
        subtitle={subtitle} 
        ctaText={ctaText} 
      />
      
      <ErrorBoundary>
        <div 
          className="absolute inset-0"
          onFocus={handleCanvasFocus}
          onBlur={handleCanvasBlur}
          ref={canvasRef}
        >
          <Canvas
            shadows
            dpr={isMobile ? MOBILE_DPR : DESKTOP_DPR}
            gl={{ 
              antialias: !isMobile,
              alpha: false,
              stencil: false,
              depth: true,
              powerPreference: "high-performance",
            }}
            camera={{ 
              position: [0, 3.5, 5.5], 
              fov: 45, 
              near: 0.1, 
              far: 1000 
            }}
            style={{ background: '#000000' }}
            aria-label="3D Chess Board Interactive Display"
            role="img"
            tabIndex={0}
            className="outline-none focus:outline-offset-2 focus:outline-blue-500 focus:outline-2"
          >
            {/* Provide accessibility information about the scene */}
            <Html>
              <div className="sr-only" aria-live="polite" id="scene-description">
                Interactive 3D Chess board with animated pieces. You can use arrow keys to navigate when the board is focused.
              </div>
            </Html>
            
            <Suspense fallback={<LoadingIndicator />}>
              {/* Performance monitoring */}
              <PerformanceMonitor
                onDecline={() => {
                  console.log('Performance declining, activating optimizations');
                }}
              />
              
              {/* Optimization and context loss prevention */}
              <PerformanceOptimizer />
              
              <Scene />
              
              {/* Camera controls with keyboard support */}
              <OrbitControls 
                enablePan={!isMobile}
                enableZoom={true}
                minDistance={2}
                maxDistance={10}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                keyPanSpeed={7}
                enableKeys={keyboardControlsEnabled}
                makeDefault
              />
              
              {/* Post-processing effects - conditionally render based on device capability */}
              {!isMobile && (
                <EffectComposer multisampling={0} enabled={!prefersReducedMotion}>
                  <Bloom 
                    intensity={0.15}
                    luminanceThreshold={0.8}
                    luminanceSmoothing={0.9}
                    height={300}
                  />
                  <SMAA />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>
          
          {/* Accessibility controls explanation */}
          <div 
            className="absolute bottom-4 left-4 text-white/70 text-xs md:text-sm px-2 py-1 bg-black/30 rounded-md backdrop-blur-sm"
            aria-live="polite"
          >
            {keyboardControlsEnabled ? 
              'Keyboard controls active. Use arrow keys to rotate view, Enter to interact.' : 
              'Click scene and use Tab to enable keyboard controls.'}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default HeroComponent;
