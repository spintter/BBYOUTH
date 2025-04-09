'use client';

import React, { Suspense, useState, useEffect, useRef, useMemo, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Html,
  Environment,
  useDetectGPU,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { ErrorBoundary } from 'react-error-boundary';
import { useInView } from 'react-intersection-observer';

// --- Configuration & Types ---
type Vector3Array = [number, number, number];
interface ChessCoordinate {
  file: string;
  rank: number;
}
interface ChessPiece {
  type: string;
  coord: ChessCoordinate;
  isWhite: boolean;
}
interface ChessPieceProps {
  position: Vector3Array;
  isWhite: boolean;
  scale: Vector3Array;
  modelPath?: string;
  additionalGeometry?: React.ReactNode;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

// --- Refined User Preferences ---
const userPreferences = {
  rotationSpeed: 0.0,
  colorScheme: {
    primary: '#dc2626',
    secondary: '#16a34a',
    boardDark: '#080808',
    boardLight: '#FFFFFF',
    kingWhiteColor: '#D9D9D9', // Even less bright white for kings
    kingBlackColor: '#010101',
    queenAccentColor: '#facc15',
    whitePieceFallback: '#D6D6D6', // Even less bright white for all pieces
    blackPieceFallback: '#050505',
    highlightColor: '#f59e0b',
  },
  materials: {
    whiteRoughness: 0.95, // Further increased roughness for more realistic white pieces
    whiteMetalness: 0.05, // Further decreased metalness for more realistic white pieces
    blackRoughness: 0.55,
    blackMetalness: 0.2,
    kingRoughness: 0.85, // Further increased roughness for more realistic king
    kingMetalness: 0.03,
  },
};

// --- Device Capability Detection ---
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isHighEnd: false,
    isMobile: false,
    shouldUseEffects: false,
    dpr: 1.0,
  });

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
    const isHighEnd =
      typeof window !== 'undefined' && navigator.hardwareConcurrency > 4 && !isMobile;

    setCapabilities({
      isHighEnd,
      isMobile,
      shouldUseEffects: isHighEnd,
      dpr,
    });
  }, []);

  return capabilities;
}

// --- Utility Functions ---
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  if (fileIndex === -1 || rankIndex === -1) {
    console.error('Invalid chess coordinate:', coord);
    return [0, 0, 0];
  }

  // Calculate the position on the board
  const x = BOARD_OFFSET[0] + fileIndex * SQUARE_SIZE + SQUARE_SIZE * 0.5;
  const z = BOARD_OFFSET[2] + rankIndex * SQUARE_SIZE + SQUARE_SIZE * 0.5;

  // Return the adjusted position, accounting for the board position [0.5, 0.1, 0.3]
  return [x, 0.1, z]; // Increased Y value to raise the model
}

// --- Piece Components (Includes Map Preservation) ---
function ChessPiece({
  position,
  isWhite,
  scale,
  modelPath = '/models/chess_pawn.glb',
  additionalGeometry,
}: ChessPieceProps) {
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);
  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const originalMaterial = child.material;
        child.material = originalMaterial.clone();
        child.material.color.set(
          isWhite
            ? userPreferences.colorScheme.whitePieceFallback
            : userPreferences.colorScheme.blackPieceFallback,
        );
        child.material.metalness = isWhite
          ? userPreferences.materials.whiteMetalness
          : userPreferences.materials.blackMetalness;
        child.material.roughness = isWhite
          ? userPreferences.materials.whiteRoughness
          : userPreferences.materials.blackRoughness;
        child.material.emissive.set(0x000000);
        child.material.emissiveIntensity = 0;
        child.material.map = originalMaterial.map;
        child.material.normalMap = originalMaterial.normalMap;
        child.material.aoMap = originalMaterial.aoMap;
        child.material.roughnessMap = originalMaterial.roughnessMap;
        child.material.metalnessMap = originalMaterial.metalnessMap;
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.side = THREE.FrontSide;
        if (child.material.aoMap) {
          child.material.aoMapIntensity = 1.0;
        }
      }
    });
    return clone;
  }, [scene, isWhite]);
  return (
    <group
      position={position}
      ref={pieceRef}
    >
      <group scale={scale}>
        {processedScene && <primitive object={processedScene} />}
        {additionalGeometry}
      </group>
    </group>
  );
}

function OptimizedChessKing({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const modelPath = '/models/newking.glb';
  useGLTF.preload(modelPath);
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);
  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const originalMaterial = child.material;
        child.material = originalMaterial.clone();
        child.material.color.set(
          isWhite
            ? userPreferences.colorScheme.kingWhiteColor
            : userPreferences.colorScheme.kingBlackColor,
        );
        child.material.metalness = userPreferences.materials.kingMetalness;
        child.material.roughness = userPreferences.materials.kingRoughness;
        child.material.emissive.set(0x000000);
        child.material.emissiveIntensity = 0;
        child.material.map = originalMaterial.map;
        child.material.normalMap = originalMaterial.normalMap;
        child.material.aoMap = originalMaterial.aoMap;
        child.material.roughnessMap = originalMaterial.roughnessMap;
        child.material.metalnessMap = originalMaterial.metalnessMap;
        if (child.material.aoMap) {
          child.material.aoMapIntensity = 1.0;
        }
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.side = THREE.FrontSide;
      }
    });
    return clone;
  }, [scene, isWhite]);
  return (
    <group
      position={position}
      ref={pieceRef}
    >
      <primitive
        object={processedScene}
        scale={[0.03, 0.03, 0.03]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function OptimizedChessQueen({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const modelPath = '/models/queen.glb';
  useGLTF.preload(modelPath);
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);

  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const originalMaterial = child.material;
        child.material = originalMaterial.clone();
        // Color override removed - model uses its own textures/colors

        // Material properties - keep for now for consistency, can be removed if model looks odd
        // child.material.metalness = isWhite
        //   ? userPreferences.materials.whiteMetalness
        //   : userPreferences.materials.blackMetalness;
        // child.material.roughness = isWhite
        //   ? userPreferences.materials.whiteRoughness
        //   : userPreferences.materials.blackRoughness;
        // -- REMOVED metalness/roughness overrides --

        child.material.emissive.set(0x000000);
        child.material.emissiveIntensity = 0;
        // Preserve maps from original material
        child.material.map = originalMaterial.map;
        child.material.normalMap = originalMaterial.normalMap;
        child.material.aoMap = originalMaterial.aoMap;
        child.material.roughnessMap = originalMaterial.roughnessMap;
        child.material.metalnessMap = originalMaterial.metalnessMap;
        if (child.material.aoMap) {
          child.material.aoMapIntensity = 1.0;
        }
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.side = THREE.FrontSide;
      }
    });
    // Apply rotation directly to the cloned scene object
    clone.rotation.set(0, Math.PI, 0); // Rotate 180 degrees around Y
    return clone;
  }, [scene, isWhite]); // Dependency on isWhite remains in case we re-add conditional logic

  return (
    <group
      position={position}
      ref={pieceRef}
      rotation={[0, 0, 0]} // Reset group rotation
    >
      <primitive
        object={processedScene} // This now includes the rotation
        scale={[0.25, 0.25, 0.25]} // Keep increased scale
        rotation={[0, 0, 0]} // Reset primitive rotation
      />
    </group>
  );
}

function ChessRook({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const crenelation = useMemo(
    () => (
      <group position={[0, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.05, 0.15]} />
          <meshStandardMaterial
            color={
              isWhite
                ? userPreferences.colorScheme.whitePieceFallback
                : userPreferences.colorScheme.blackPieceFallback
            }
            roughness={
              isWhite
                ? userPreferences.materials.whiteRoughness
                : userPreferences.materials.blackRoughness
            }
            metalness={
              isWhite
                ? userPreferences.materials.whiteMetalness
                : userPreferences.materials.blackMetalness
            }
          />
        </mesh>
      </group>
    ),
    [isWhite],
  );
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.17, 0.14, 0.17]}
      additionalGeometry={crenelation}
    />
  );
}

function ChessKnight({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const horseHead = useMemo(
    () => (
      <group position={[0, 0.4, 0]}>
        <mesh position={[0, 0.05, 0.05]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={
              isWhite
                ? userPreferences.colorScheme.whitePieceFallback
                : userPreferences.colorScheme.blackPieceFallback
            }
            roughness={
              isWhite
                ? userPreferences.materials.whiteRoughness
                : userPreferences.materials.blackRoughness
            }
            metalness={
              isWhite
                ? userPreferences.materials.whiteMetalness
                : userPreferences.materials.blackMetalness
            }
          />
        </mesh>
      </group>
    ),
    [isWhite],
  );
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.15, 0.17, 0.15]}
      additionalGeometry={horseHead}
    />
  );
}

function ChessBishop({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const mitre = useMemo(
    () => (
      <group position={[0, 0.4, 0]}>
        <mesh>
          <coneGeometry args={[0.05, 0.15, 12]} />
          <meshStandardMaterial
            color={
              isWhite
                ? userPreferences.colorScheme.whitePieceFallback
                : userPreferences.colorScheme.blackPieceFallback
            }
            roughness={
              isWhite
                ? userPreferences.materials.whiteRoughness
                : userPreferences.materials.blackRoughness
            }
            metalness={
              isWhite
                ? userPreferences.materials.whiteMetalness
                : userPreferences.materials.blackMetalness
            }
          />
        </mesh>
      </group>
    ),
    [isWhite],
  );
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.15, 0.16, 0.15]}
      additionalGeometry={mitre}
    />
  );
}

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.15, 0.15, 0.15]}
      modelPath="/models/newpawn.glb"
    />
  );
}

// --- Chessboard Component ---
function ChessboardModel({ position = [0, 0, 0] }: { position?: Vector3Array }) {
  const boardRef = useRef<THREE.Group>(null);
  const rotationSpeed = 0.05;
  const initialRotation: Vector3Array = [-Math.PI / 7.5, Math.PI / 28, Math.PI / 14]; // Restore initial tilt

  useFrame((state, delta) => {
    if (boardRef.current) {
      boardRef.current.rotation.y += rotationSpeed * delta; // Restore board auto-rotation
    }
  });

  const checkerShader = useMemo(
    () => ({
      uniforms: {
        color1: { value: new THREE.Color(userPreferences.colorScheme.boardLight) },
        color2: { value: new THREE.Color(userPreferences.colorScheme.boardDark) },
        scale: { value: 8.0 },
      },
      vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float scale;
            varying vec2 vUv;
            void main() {
                vec2 pos = vUv * scale;
                float pattern = mod(floor(pos.x) + floor(pos.y), 2.0);
                gl_FragColor = vec4(mix(color1, color2, pattern), 1.0);
            }
        `,
    }),
    [],
  );

  const finalPieces: ChessPiece[] = useMemo(
    () => [
      { type: 'queen', coord: { file: 'd', rank: 8 }, isWhite: false }, // Back to d8
    ],
    [],
  );

  return (
    <group
      position={position} // Use prop or default [0,0,0] relative to parent
      ref={boardRef}
      rotation={initialRotation} // Restore initial tilt
    >
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          args={[checkerShader]}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Render the single queen piece */}
      {finalPieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        const key = `${piece.isWhite ? 'w' : 'b'}-${piece.type}-${piece.coord.file}${piece.coord.rank}-${index}`;

        // Only the queen logic is relevant now
        if (piece.type === 'queen' && !piece.isWhite) {
          return (
            <OptimizedChessQueen
              key={key}
              position={pos}
              isWhite={false}
            />
          );
        }
        return null; // No other pieces to render
      })}
    </group>
  );
}

// --- Subtle Camera Animation ---
function Rig() {
  const { camera } = useThree();
  const speed = 0.01;
  const maxZoomIn = 1.8;
  useFrame(() => {
    if (camera.position.length() > maxZoomIn) {
      const target = new THREE.Vector3(0, 0.1, 0);
      const direction = target.clone().sub(camera.position).normalize();
      const targetPosition = target.clone().sub(direction.multiplyScalar(maxZoomIn));
      camera.position.lerp(targetPosition, speed * 0.02);
    }
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

// --- Scene Component with Intersection Observer ---
function Scene() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const capabilities = useDeviceCapabilities();
  const GPUTier = useDetectGPU();
  const shouldUseEffects = capabilities.shouldUseEffects && GPUTier.tier > 1;

  // Set a fixed camera position for better performance
  const cameraPosition: Vector3Array = [1.5, 1.2, 1.5];
  const cameraFov = 50;

  // Only preload models when they are in view
  useEffect(() => {
    if (inView) {
      // Delayed preloading to reduce initial load
      const timer = setTimeout(() => {
        useGLTF.preload('/models/newpawn.glb');
        useGLTF.preload('/models/queen.glb');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inView]);

  // Rest of Scene component...

  // Return with a reference for intersection observer
  return (
    <ErrorBoundary fallback={<Html>Failed to load 3D scene</Html>}>
      <div
        ref={ref}
        style={{ width: '100%', height: '100%' }}
      >
        {inView && (
          <>
            <ChessboardModel />
            {/* Only render post-processing effects on high-end devices */}
            {shouldUseEffects && (
              <EffectComposer enabled={shouldUseEffects}>
                <Bloom
                  intensity={0.3}
                  luminanceThreshold={0.3}
                  luminanceSmoothing={0.9}
                  kernelSize={1}
                />
              </EffectComposer>
            )}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minDistance={1.8}
              maxDistance={2.8}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.1}
              enableRotate={true}
              rotateSpeed={0.3}
              target={[0, 0.1, 0]}
            />
            <PerspectiveCamera
              makeDefault
              position={cameraPosition}
              fov={cameraFov}
              near={0.1}
              far={100}
            />
            <Rig />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

// --- Loading Component ---
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-red-700 border-b-yellow-400 border-l-white border-r-white rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-red-600 text-xl font-serif">Loading...</p>
      </div>
    </div>
  );
}

// --- Main Export ---
export default function KnowledgeIsPowerHero(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [webGLError, setWebGLError] = useState<string | null>(null);
  const capabilities = useDeviceCapabilities();

  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setWebGLAvailable(false);
          setWebGLError('WebGL is not supported in your browser');
          return;
        }
        setWebGLAvailable(true);
      } catch (e) {
        setWebGLAvailable(false);
        setWebGLError('Error initializing WebGL: ' + (e as Error).message);
      }
    };

    checkWebGL();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced starfield style with CSS stars
  const starFieldStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    background: `
            radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%)
        `,
    backgroundAttachment: 'fixed',
    overflow: 'hidden',
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Enhanced Starfield Background with CSS stars */}
      <div style={starFieldStyle}>
        <style>{`
                    @keyframes twinkle {
                        0% { opacity: 0.2; }
                        50% { opacity: 1; }
                        100% { opacity: 0.2; }
                    }
                    
                    .star {
                        position: absolute;
                        background-color: white;
                        border-radius: 50%;
                    }

                    .star-tiny {
                        width: 1px;
                        height: 1px;
                    }

                    .star-small {
                        width: 2px;
                        height: 2px;
                    }

                    .star-medium {
                        width: 3px;
                        height: 3px;
                    }

                    .twinkle-slow {
                        animation: twinkle 6s infinite ease-in-out;
                    }

                    .twinkle-medium {
                        animation: twinkle 4s infinite ease-in-out;
                    }

                    .twinkle-fast {
                        animation: twinkle 2s infinite ease-in-out;
                    }
                `}</style>

        {/* Generate 50 small stars */}
        {Array.from({ length: 50 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const animationDelay = Math.random() * 5;
          const sizeClass =
            Math.random() > 0.7 ? 'star-medium' : Math.random() > 0.5 ? 'star-small' : 'star-tiny';
          const speedClass =
            Math.random() > 0.7
              ? 'twinkle-fast'
              : Math.random() > 0.5
                ? 'twinkle-medium'
                : 'twinkle-slow';

          return (
            <div
              key={`star-${i}`}
              className={`star ${sizeClass} ${speedClass}`}
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          );
        })}
      </div>

      {webGLAvailable ? (
        <Canvas
          dpr={capabilities.dpr}
          gl={{
            antialias: capabilities.isHighEnd,
            alpha: false,
            powerPreference: capabilities.isHighEnd ? 'high-performance' : 'default',
            precision: capabilities.isHighEnd ? 'highp' : 'mediump',
            logarithmicDepthBuffer: false,
          }}
          className="w-full h-full relative z-10"
          performance={{ min: 0.5 }}
          onError={(error) => {
            console.error('Canvas error:', error);
            setWebGLAvailable(false);
            setWebGLError(
              'Error creating WebGL context: ' +
                (error && typeof error === 'object' && 'message' in error
                  ? error.message
                  : 'Unknown error'),
            );
          }}
        >
          <Suspense
            fallback={
              <Html center>
                <div className="text-white text-lg font-serif">Loading Scene...</div>
              </Html>
            }
          >
            <Scene />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">3D Experience Unavailable</h2>
            <p className="mb-4">{webGLError || 'WebGL is not supported in your browser'}</p>
            <p className="text-sm opacity-75">
              Please try using a modern browser with WebGL support enabled.
              <br />
              Common solutions:
              <br />
              - Update your browser
              <br />
              - Enable hardware acceleration
              <br />- Check your graphics drivers
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#000000] flex items-center justify-center z-30">
          <LoadingFallback />
        </div>
      )}
    </div>
  );
}
