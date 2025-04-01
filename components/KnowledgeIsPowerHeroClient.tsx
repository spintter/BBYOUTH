'use client';

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// --- Configuration & Types ---
type Vector3Array = [number, number, number];
interface ChessCoordinate { file: string; rank: number; }
interface ChessPiece { type: string; coord: ChessCoordinate; isWhite: boolean; }
interface ChessPieceProps { position: Vector3Array; isWhite: boolean; scale: Vector3Array; modelPath?: string; additionalGeometry?: React.ReactNode; }

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

// --- Refined User Preferences ---
const userPreferences = {
  rotationSpeed: 0.0, // Keep manual rotation
  colorScheme: {
    primary: '#dc2626', // Use brand red consistently
    secondary: '#16a34a', // Example green (adjust if needed for contrast)
    boardDark: '#080808', // Slightly off-black for board
    boardLight: '#FFFFFF',
    kingWhiteColor: '#FFFFFF',
    kingBlackColor: '#010101',
    queenAccentColor: '#facc15', // Yellow accent
    whitePieceFallback: '#E5E5E5', // Slightly off-white
    blackPieceFallback: '#050505', // Slightly off-black
    highlightColor: '#f59e0b', // Amber highlight for visual interest
  },
  materials: {
    whiteRoughness: 0.65,
    whiteMetalness: 0.15,
    blackRoughness: 0.55,
    blackMetalness: 0.2,
    kingRoughness: 0.1, // Make king slightly shinier
    kingMetalness: 0.05,
    // Added subtle emissive glow for pieces
    emissiveIntensity: 0.05,
  }
};

// --- Utility Functions ---
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  if (fileIndex === -1 || rankIndex === -1) { console.error("Invalid chess coordinate:", coord); return [0, 0, 0]; }
  const x = BOARD_OFFSET[0] + (fileIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  const z = BOARD_OFFSET[2] + (rankIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  return [x, 0.001, z]; // Add tiny y offset to prevent z-fighting with board
}

// --- Piece Components (with Material Refinements) ---
function ChessPiece({ position, isWhite, scale, modelPath = '/models/chess_pawn.glb', additionalGeometry }: ChessPieceProps) {
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);
  
  // Add subtle hover animation
  useFrame((state) => {
    if (pieceRef.current) {
      const t = state.clock.getElapsedTime();
      pieceRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0] * 5) * 0.005;
    }
  });

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback,
    metalness: isWhite ? userPreferences.materials.whiteMetalness : userPreferences.materials.blackMetalness,
    roughness: isWhite ? userPreferences.materials.whiteRoughness : userPreferences.materials.blackRoughness,
    side: THREE.FrontSide,
    emissive: isWhite ? new THREE.Color(0xaaaaaa) : new THREE.Color(0x222222),
    emissiveIntensity: userPreferences.materials.emissiveIntensity,
  }), [isWhite]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [scene, material]);

  return (
    <group position={position} ref={pieceRef}>
      <group scale={scale}>
        {clonedScene && <primitive object={clonedScene} />}
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

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: isWhite ? userPreferences.colorScheme.kingWhiteColor : userPreferences.colorScheme.kingBlackColor,
    metalness: userPreferences.materials.kingMetalness,
    roughness: userPreferences.materials.kingRoughness,
    side: THREE.FrontSide
  }), [isWhite]);

  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [scene, material]);

  return (
    <group position={position} ref={pieceRef}>
      <primitive object={processedScene} scale={[0.03, 0.03, 0.03]} rotation={[0, 0, 0]} />
    </group>
  );
}

// FIX: Added correct dependency arrays to useMemo
function ChessQueen({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const crown = useMemo(() => (
    <group position={[0, 0.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.03, 0.1, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  ), [isWhite]); // FIX: Added dependency
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.16, 0.2, 0.16]} additionalGeometry={crown} />;
}

function ChessRook({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const crenelation = useMemo(() => (
    <group position={[0, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[0.15, 0.05, 0.15]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} />
      </mesh>
    </group>
  ), [isWhite]); // FIX: Added dependency
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.17, 0.14, 0.17]} additionalGeometry={crenelation} />;
}

function ChessKnight({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const horseHead = useMemo(() => (
    <group position={[0, 0.4, 0]}>
      <mesh position={[0, 0.05, 0.05]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} />
      </mesh>
    </group>
  ), [isWhite]); // FIX: Added dependency
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.17, 0.15]} additionalGeometry={horseHead} />;
}

function ChessBishop({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const mitre = useMemo(() => (
    <group position={[0, 0.4, 0]}>
      <mesh>
        <coneGeometry args={[0.05, 0.15, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} />
      </mesh>
    </group>
  ), [isWhite]); // FIX: Added dependency
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.16, 0.15]} additionalGeometry={mitre} />;
}

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.15, 0.15]} />;
}

// --- Chessboard Component (with refined shader colors) ---
function ChessboardModel({ position = [0, 0, 0] }: { position?: Vector3Array }) {
  const boardRef = useRef<THREE.Group>(null);
  const checkerShader = useMemo(() => ({
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
    `
  }), []);

  // Define initial 32 pieces
  const initialPieces: ChessPiece[] = useMemo(() => [
    // White pieces
    { type: 'king', coord: { file: 'e', rank: 1 }, isWhite: true }, { type: 'queen', coord: { file: 'd', rank: 1 }, isWhite: true },
    { type: 'rook', coord: { file: 'a', rank: 1 }, isWhite: true }, { type: 'rook', coord: { file: 'h', rank: 1 }, isWhite: true },
    { type: 'knight', coord: { file: 'b', rank: 1 }, isWhite: true }, { type: 'knight', coord: { file: 'g', rank: 1 }, isWhite: true },
    { type: 'bishop', coord: { file: 'c', rank: 1 }, isWhite: true }, { type: 'bishop', coord: { file: 'f', rank: 1 }, isWhite: true },
    ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 2 }, isWhite: true } as ChessPiece)), // Added type assertion
    // Black pieces
    { type: 'king', coord: { file: 'e', rank: 8 }, isWhite: false }, { type: 'queen', coord: { file: 'd', rank: 8 }, isWhite: false },
    { type: 'rook', coord: { file: 'a', rank: 8 }, isWhite: false }, { type: 'rook', coord: { file: 'h', rank: 8 }, isWhite: false },
    { type: 'knight', coord: { file: 'b', rank: 8 }, isWhite: false }, { type: 'knight', coord: { file: 'g', rank: 8 }, isWhite: false },
    { type: 'bishop', coord: { file: 'c', rank: 8 }, isWhite: false }, { type: 'bishop', coord: { file: 'f', rank: 8 }, isWhite: false },
    ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 7 }, isWhite: false } as ChessPiece)), // Added type assertion
  ], []);

  // Modified finalPieces calculation
  const finalPieces = useMemo(() => {
    // Step 1: Remove White King (e1) and Black King (e8)
    let pieces = initialPieces.filter(piece => 
      !(piece.type === 'king' && piece.coord.file === 'e' && (piece.coord.rank === 1 || piece.coord.rank === 8))
    );

    // Step 2: Randomly remove 15 more pieces (increased from 7)
    for (let i = 0; i < 15 && pieces.length > 0; i++) { 
      const randomIndex = Math.floor(Math.random() * pieces.length);
      pieces.splice(randomIndex, 1);
    }

    // Step 3: Generate all 64 squares and randomly assign to remaining pieces
    const allSquares: ChessCoordinate[] = [];
    FILES.forEach(file => RANKS.forEach(rank => allSquares.push({ file, rank })));

    // Shuffle squares
    for (let i = allSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSquares[i], allSquares[j]] = [allSquares[j], allSquares[i]];
    }

    // Assign shuffled squares to pieces
    return pieces.map((piece, index) => ({
      ...piece,
      coord: allSquares[index] // Assign the square at the current index
    }));
  }, [initialPieces]); // Depend on initialPieces

  return (
    <group position={position} ref={boardRef} rotation={[-Math.PI / 7.5, Math.PI / 28, Math.PI / 14]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial args={[checkerShader]} side={THREE.DoubleSide} />
      </mesh>

      {finalPieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        // Ensure key is unique even if multiple pieces of same type/color exist
        const key = `${piece.isWhite ? 'w' : 'b'}-${piece.type}-${piece.coord.file}${piece.coord.rank}-${index}`;
        switch (piece.type) {
          case 'queen': return <ChessQueen key={key} position={pos} isWhite={piece.isWhite} />;
          case 'rook': return <ChessRook key={key} position={pos} isWhite={piece.isWhite} />;
          case 'knight': return <ChessKnight key={key} position={pos} isWhite={piece.isWhite} />;
          case 'bishop': return <ChessBishop key={key} position={pos} isWhite={piece.isWhite} />;
          case 'pawn': return <ChessPawn key={key} position={pos} isWhite={piece.isWhite} />;
          default: return null; // Kings are excluded by filter logic
        }
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
      // Create a target vector slightly offset from the origin if needed
      const target = new THREE.Vector3(0, 0.1, 0); // Look slightly above board center
      camera.position.lerp(target, speed * 0.01);
    }
    camera.lookAt(0, 0.1, 0); // Look at the adjusted target
    camera.updateProjectionMatrix();
  });
  return null;
}

// --- Scene Setup ---
function Scene() {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    useGLTF.preload('/models/newking.glb');
    useGLTF.preload('/models/chess_pawn.glb');
  }, []);

  const cameraPosition: Vector3Array = isMobile ? [1.9, 1.6, 1.9] : [2.1, 1.7, 2.1];
  const cameraFov = isMobile ? 48 : 38;

  return (
    <>
      <fogExp2 attach="fog" args={['#030310', 0.15]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={1.0} color="#FFFAF0" castShadow={false} />
      <directionalLight position={[-4, 2, -3]} intensity={0.15} color="#E0FFFF" castShadow={false} />
      <pointLight position={[0.2, 0.5, -0.8]} intensity={0.4} distance={3} color="#FFFFFF" castShadow={false} />
      
      {/* Add subtle rim light for drama */}
      <pointLight position={[1.5, 0.5, -1.5]} intensity={0.15} distance={2} color="#E1C16E" castShadow={false} />

      <Environment preset="studio" background={false} />

      <group position={[0.5, -0.15, 0]}>
        <ChessboardModel position={[0, -0.1, 0]} />
      </group>

      {/* Add subtle atmospheric particles */}
      <Particles count={40} />

      {/* Add post-processing effects */}
      <EffectComposer multisampling={0} enabled={true}>
        {/* Subtle bloom effect for glow */}
        <Bloom 
          intensity={0.15} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          kernelSize={3}
        />
        {/* Vignette to focus attention */}
        <Vignette
          darkness={0.35}
          offset={0.1}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>

      <OrbitControls
        enableZoom={false} enablePan={false}
        minDistance={1.8} maxDistance={2.8}
        minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1}
        enableRotate={true}
        rotateSpeed={0.3}
        target={[0, 0.1, 0]} // Ensure controls target the same point camera looks at
      />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} near={0.1} far={100} />
      <Rig />
    </>
  );
}

// Add subtle dust particles to the scene
function Particles({ count = 50 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const position = [
        (Math.random() - 0.5) * 3,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 3,
      ];
      const speed = Math.random() * 0.01 + 0.002;
      const rotation = Math.random() * Math.PI;
      const scale = Math.random() * 0.04 + 0.01;
      temp.push({ position, speed, rotation, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const current = mesh.current;
    if (!current) return;
    
    particles.forEach((particle, i) => {
      const { position, speed, rotation, scale } = particle;
      const t = state.clock.getElapsedTime();
      
      dummy.position.set(
        position[0],
        position[1] + Math.sin(t * speed * 10) * 0.05 - t * speed * 0.05,
        position[2]
      );
      
      if (dummy.position.y < -0.5) {
        dummy.position.y = 1.5;
      }
      
      dummy.rotation.set(rotation, t * speed * 0.8, rotation);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      current.setMatrixAt(i, dummy.matrix);
    });
    current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  );
}

// Function to render the Hero content
function HeroContent() {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10 pointer-events-none">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 1.1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }
        .text-shadow-subtle { text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6); }
      `}</style>
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight text-shadow-subtle">
          <span className="block animate-fadeInUp" style={{ animationDelay: '0.1s' }}>Empowerment</span>
          <span className="block animate-fadeInUp" style={{ animationDelay: '0.3s' }}>through</span>
          <span className="block text-yellow-400 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>strategy</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg animate-fadeInUp text-shadow-subtle" style={{ animationDelay: '0.7s' }}>
          Guiding Birmingham's youth through <span className="text-red-500 font-medium">critical thinking</span>,
          <span className="text-green-500 font-medium"> cultural heritage</span>, and <span className="text-red-500 font-medium">creative expression</span>
          to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
        </p>
        <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
          <a
            href="#mission"
            className="bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 ease-out transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 group"
          >
            Join Our Program
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-red-700 border-b-yellow-400 border-l-white border-r-white rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-red-600 text-xl font-serif">Awakening strategy...</p>
      </div>
    </div>
  );
}

// Main component that combines everything
export default function KnowledgeIsPowerHero() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Slightly longer loading time to ensure models are loaded
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      className="relative w-full h-[90vh] md:h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #030310 40%, #000000 100%)' }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true, // Keep alpha true for CSS background
          powerPreference: 'high-performance',
          precision: 'highp',
          logarithmicDepthBuffer: true
        }}
        className="w-full h-full"
        // Optimize performance with limited frames per second on non-interacted scenes
        frameloop="demand"
      >
        <Suspense fallback={<Html center><div className="text-white text-lg font-serif">Loading Scene...</div></Html>}>
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