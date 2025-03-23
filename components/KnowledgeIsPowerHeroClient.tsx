'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  PerspectiveCamera, 
  Stars,
  Html
} from '@react-three/drei';
import { 
  EffectComposer,
  Bloom,
  Vignette
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

// Define proper type for Vector3 arrays
type Vector3Array = [number, number, number];

// Define the chess board coordinate system
interface ChessCoordinate {
  file: string; // a-h
  rank: number; // 1-8
}

// Constants for chess board
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

// User preferences for styling
const userPreferences = {
  glowIntensity: 1.5,
  rotationSpeed: 0.1,
  colorScheme: {
    primary: '#FFD700', // Gold
    secondary: '#800080', // Purple
    highlight: '#FF00FF', // Magenta
    boardDark: '#323232', // Dark gray for dark squares 
    boardLight: '#E8E8E8', // Light gray for light squares
  }
};

// Initialize the MeshoptDecoder - required for compressed GLB files
MeshoptDecoder.ready.then(() => {
  console.log("MeshoptDecoder initialized successfully");
}).catch((error: Error) => {
  console.error("MeshoptDecoder initialization failed:", error);
});

// Convert chess notation to 3D position
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  
  if (fileIndex === -1 || rankIndex === -1) {
    console.error("Invalid chess coordinate:", coord);
    return [0, 0, 0];
  }
  
  const x = BOARD_OFFSET[0] + fileIndex * SQUARE_SIZE;
  const z = BOARD_OFFSET[2] + rankIndex * SQUARE_SIZE;
  
  return [x, 0, z];
}

function ChessboardModel({ position = [0, 0, 0] as Vector3Array }) {
  const { scene } = useGLTF('/models/chessboard.glb');
  const boardRef = useRef<THREE.Group>(null);
  const highlightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Log loading status for debugging
  useEffect(() => {
    console.log("Chessboard model loaded:", scene ? "success" : "failed");
    if (scene) {
      console.log("Chessboard children count:", scene.children.length);
    }
  }, [scene]);

  // Continuous spin animation with a fixed slant
  useFrame((state, delta) => {
    if (boardRef.current) {
      boardRef.current.rotation.y += delta * 0.05 * (1 - Math.exp(-state.clock.elapsedTime * 0.5)); // Slow continuous spin with easing
    }
    
    // Animate the d4 square highlight
    if (highlightMaterialRef.current) {
      highlightMaterialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group
      position={position} // [0, -0.1, 0] from Scene, relative to parent at [0.5, -0.2, 0]
      ref={boardRef}
      rotation={[-Math.PI / 6, 0, Math.PI / 12]} // Maintain slant: tilt top backward, right side down
    >
      <primitive object={scene} scale={[0.03, 0.03, 0.03]} />
      
      {/* Highlight the d4 square where the pawn is */}
      <mesh
        position={[chessToPosition({ file: 'd', rank: 4 })[0], 0.01, chessToPosition({ file: 'd', rank: 4 })[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >≠
        <planeGeometry args={[SQUARE_SIZE * 0.7, SQUARE_SIZE * 0.7]} />
        <meshBasicMaterial
          ref={highlightMaterialRef}
          color={userPreferences.colorScheme.highlight}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Pawn parented to the chessboard, inheriting transformations */}
      <ChessPawn />
    </group>
  );
}

// Simple Chess Pawn component
function ChessPawn() {
  const pawnPosition = chessToPosition({file: 'd', rank: 4});
  const pawnGltf = useGLTF('/models/chess_pawn.glb');
  const pawnRef = useRef<THREE.Group>(null);
  const highlightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useEffect(() => {
    console.log("Pawn model loaded:", pawnGltf.scene ? "success" : "failed");
    if (pawnGltf.scene) {
      console.log("Pawn children count:", pawnGltf.scene.children.length);
    }
  }, [pawnGltf]);
  
  useEffect(() => {
    if (pawnGltf.scene) {
      pawnGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.3,
            roughness: 0.4,
            emissive: 0x444444,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [pawnGltf]);
  
  // Subtle rotation animation
  useFrame((state, delta) => {
    if (pawnRef.current) {
      // Remove hover effect to keep pawn attached to board
      // Maintain rotation for liveliness
      pawnRef.current.rotation.y += delta * userPreferences.rotationSpeed;
      pawnRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.02;
    }
    if (highlightMaterialRef.current) {
      highlightMaterialRef.current.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.0) * 0.2;
    }
    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });
  
  return (
    <group position={[pawnPosition[0], 0.01, pawnPosition[2]]} ref={pawnRef}>
      <group scale={[0.144, 0.144, 0.144]}>
        <primitive 
          object={pawnGltf.scene.clone()} 
          rotation={[0, 0, 0]}
          position={[0, 0, 0]}
        />
      </group>
      
      {/* Soft shadow under pawn */}
      <mesh position={[0, -0.0145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 16]} />
        <meshBasicMaterial
          ref={shadowMaterialRef}
          color="#000000"
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>
      
      {/* Highlight under pawn */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial
          ref={highlightMaterialRef}
          color={userPreferences.colorScheme.primary}
          transparent
          opacity={0.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Main scene setup
function Scene() {
  const [isMobile, setIsMobile] = useState(false);
  const starsRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log("Preloading 3D models...");
    useGLTF.preload('/models/chess_pawn.glb');
    useGLTF.preload('/models/chessboard.glb');
    console.log("Preloading complete");
  }, []);
  
  // Add subtle rotation to stars
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01; // Slow rotation
    }
  });
  
  return (
    <>
      <color attach="background" args={['#030310']} />
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 7, 5]}
        intensity={1.5} // Increased for better visibility
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={1.0}
      />
      <pointLight 
        position={[0, 3, 0]} 
        intensity={1.2}
        color={userPreferences.colorScheme.primary} 
      />
      <spotLight
        position={[0, 4, 0]} // Moved higher for dramatic shadows
        angle={0.2} // Tighter angle for focus
        penumbra={0.7}
        intensity={1.5} // Increased intensity
        color="#FFFFFF"
        castShadow
      />
      
      <group ref={starsRef}>
        <Stars 
          radius={100} 
          depth={50} 
          count={10000} // Increased count from 7000 to 10000
          factor={7} // Increased factor from 5 to 7 for larger stars
          saturation={0.8}
          fade 
        />
      </group>
      
      <group position={[0.5, -0.2, 0]}>
        <ChessboardModel position={[0, -0.1, 0]} />
      </group>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minDistance={2.0}
        maxDistance={2.0}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
      
      <PerspectiveCamera 
        makeDefault 
        position={isMobile ? [1.8, 1.5, 1.8] : [2.2, 1.8, 2.2]}
        fov={isMobile ? 45 : 35}
        near={0.1}
        far={100}
      />
      
      <Environment preset="night" />
      <EffectComposer>
        <Bloom 
          intensity={2.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Vignette
          darkness={0.7}
          offset={0.1}
        />
      </EffectComposer>
    </>
  );
}

// Hero section text overlay with improved spacing
function HeroContent() {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10 pointer-events-none">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight">
          <span className="block animate-fadeInUp" style={{ animationDelay: '0s' }}>Empowerment</span>
          <span className="block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>through</span>
          <span className="block text-yellow-400 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>strategy</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          Guiding Birmingham's youth through <span className="text-cyan-400">critical thinking</span>, <span className="text-purple-400">cultural heritage</span>, and <span className="text-pink-400">creative expression</span> to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
        </p>
        <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <a 
            href="#mission" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,215,0,0.5)]"
          >
            Join Our Program
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Loading component with Afrocentric design
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#030310]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-yellow-500 border-b-purple-500 border-l-pink-400 border-r-cyan-400 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-yellow-400 text-xl font-serif">Awakening wisdom...</p>
      </div>
    </div>
  );
}

// Main exported component
export default function KnowledgeIsPowerHero() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Component mounting, starting to load resources...");
    
    try {
      useGLTF.preload('/models/chess_pawn.glb');
      useGLTF.preload('/models/chessboard.glb');
      console.log("Models preloaded successfully");
    } catch (error: any) {
      console.error("Error preloading models:", error);
    }
    
    const timer = setTimeout(() => {
      console.log("Loading complete, showing 3D scene");
      setIsLoading(false);
    }, 2000);
    
    return () => {
      console.log("Component unmounting, cleaning up");
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <div className="relative w-full h-[90vh] md:h-screen">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
        onCreated={(state) => {
          console.log("Canvas created successfully");
        }}
      >
        <Suspense fallback={
          <Html center>
            <div className="text-white text-xl">Loading Chess Pawn...</div>
          </Html>
        }>
          <Scene />
        </Suspense>
      </Canvas>
      
      <HeroContent />
      
      {isLoading && (
        <div className="absolute inset-0 bg-[#030310] flex items-center justify-center z-20">
          <LoadingFallback />
        </div>
      )}
    </div>
  );
}