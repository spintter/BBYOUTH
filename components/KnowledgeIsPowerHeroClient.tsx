'use client';

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration & Types ---
type Vector3Array = [number, number, number];
interface ChessCoordinate { file: string; rank: number; }
interface ChessPiece { type: string; coord: ChessCoordinate; isWhite: boolean; }
interface ChessPieceProps { position: Vector3Array; isWhite: boolean; scale: Vector3Array; modelPath?: string; additionalGeometry?: React.ReactNode; isHighlighted?: boolean; }

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

const userPreferences = {
  rotationSpeed: 0.0,
  colorScheme: {
    primary: '#8B0000',
    secondary: '#006400',
    boardDark: '#000000',
    boardLight: '#FFFFFF',
    kingWhiteColor: '#FFFFFF',
    kingBlackColor: '#010101',
    queenAccentColor: '#facc15',
    whitePieceFallback: '#FFFFFF',
    blackPieceFallback: '#010101'
  }
};

// --- Utility Functions ---
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  if (fileIndex === -1 || rankIndex === -1) { console.error("Invalid chess coordinate:", coord); return [0, 0, 0]; }
  const x = BOARD_OFFSET[0] + (fileIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  const z = BOARD_OFFSET[2] + (rankIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  return [x, 0, z];
}

// --- Piece Components ---
function OptimizedChessKing({ position, isWhite, isHighlighted }: { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean }) {
  const modelPath = '/models/newking.glb';
  useGLTF.preload(modelPath);
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);

  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: userPreferences.colorScheme.kingWhiteColor,
    metalness: 0.05,
    roughness: 0.1,
    side: THREE.FrontSide
  }), []);
  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: userPreferences.colorScheme.kingBlackColor,
    metalness: 0.05,
    roughness: 0.1,
    side: THREE.FrontSide
  }), []);

  const processedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = isWhite ? whiteMaterial : blackMaterial;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [scene, isWhite, whiteMaterial, blackMaterial]);

  return (
    <group position={position} ref={pieceRef}>
      <primitive object={processedScene} scale={[0.03, 0.03, 0.03]} rotation={[0, 0, 0]} />
    </group>
  );
}

function ChessPiece({ position, isWhite, scale, modelPath = '/models/chess_pawn.glb', additionalGeometry }: ChessPieceProps) {
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback,
    metalness: 0.2,
    roughness: 0.6,
    side: THREE.FrontSide
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

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.15, 0.15]} />;
}

function ChessQueen({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const crown = useMemo(() => (
    <group position={[0, 0.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.03, 0.1, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  ), [isWhite]);
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
  ), [isWhite]);
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
  ), [isWhite]);
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
  ), [isWhite]);
  return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.16, 0.15]} additionalGeometry={mitre} />;
}

// --- Chessboard Component ---
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
    { type: 'king', coord: { file: 'e', rank: 1 }, isWhite: true },
    { type: 'queen', coord: { file: 'd', rank: 1 }, isWhite: true },
    { type: 'rook', coord: { file: 'a', rank: 1 }, isWhite: true },
    { type: 'rook', coord: { file: 'h', rank: 1 }, isWhite: true },
    { type: 'knight', coord: { file: 'b', rank: 1 }, isWhite: true },
    { type: 'knight', coord: { file: 'g', rank: 1 }, isWhite: true },
    { type: 'bishop', coord: { file: 'c', rank: 1 }, isWhite: true },
    { type: 'bishop', coord: { file: 'f', rank: 1 }, isWhite: true },
    ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 2 }, isWhite: true })),
    // Black pieces
    { type: 'king', coord: { file: 'e', rank: 8 }, isWhite: false },
    { type: 'queen', coord: { file: 'd', rank: 8 }, isWhite: false },
    { type: 'rook', coord: { file: 'a', rank: 8 }, isWhite: false },
    { type: 'rook', coord: { file: 'h', rank: 8 }, isWhite: false },
    { type: 'knight', coord: { file: 'b', rank: 8 }, isWhite: false },
    { type: 'knight', coord: { file: 'g', rank: 8 }, isWhite: false },
    { type: 'bishop', coord: { file: 'c', rank: 8 }, isWhite: false },
    { type: 'bishop', coord: { file: 'f', rank: 8 }, isWhite: false },
    ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 7 }, isWhite: false })),
  ], []);

  // Process pieces: Remove kings, remove 7 random pieces, assign random positions
  const finalPieces = useMemo(() => {
    // Step 1: Remove White King (e1) and Black King (e8)
    let pieces = initialPieces.filter(piece => 
      !(piece.type === 'king' && piece.coord.file === 'e' && (piece.coord.rank === 1 || piece.coord.rank === 8))
    );

    // Step 2: Randomly remove 7 more pieces
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * pieces.length);
      pieces.splice(randomIndex, 1);
    }

    // Step 3: Generate all 64 squares and randomly assign to remaining 23 pieces
    const allSquares: ChessCoordinate[] = [];
    FILES.forEach(file => RANKS.forEach(rank => allSquares.push({ file, rank })));
    
    // Shuffle squares
    for (let i = allSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSquares[i], allSquares[j]] = [allSquares[j], allSquares[i]];
    }

    // Assign first 23 shuffled squares to pieces
    return pieces.map((piece, index) => ({
      ...piece,
      coord: allSquares[index]
    }));
  }, [initialPieces]);

  return (
    <group position={position} ref={boardRef} rotation={[-Math.PI / 7, Math.PI / 24, Math.PI / 12]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial args={[checkerShader]} />
      </mesh>

      {/* Render 23 pieces in their random positions */}
      {finalPieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        const key = `${piece.isWhite ? 'white' : 'black'}-${piece.type}-${piece.coord.file}${piece.coord.rank}-${index}`;
        switch (piece.type) {
          case 'queen': return <ChessQueen key={key} position={pos} isWhite={piece.isWhite} />;
          case 'rook': return <ChessRook key={key} position={pos} isWhite={piece.isWhite} />;
          case 'knight': return <ChessKnight key={key} position={pos} isWhite={piece.isWhite} />;
          case 'bishop': return <ChessBishop key={key} position={pos} isWhite={piece.isWhite} />;
          case 'pawn': return <ChessPawn key={key} position={pos} isWhite={piece.isWhite} />;
          default: return null; // Kings are excluded
        }
      })}
    </group>
  );
}

// --- Scene Setup ---
function Scene() {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    useGLTF.preload('/models/newking.glb');
    useGLTF.preload('/models/chess_pawn.glb');
  }, []);
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow={false} />
      <Environment preset="studio" background={false} />
      <group position={[0.5, -0.15, 0]}>
        <ChessboardModel position={[0, -0.1, 0]} />
      </group>
      <OrbitControls enableZoom={false} enablePan={false} minDistance={2.0} maxDistance={2.5} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} />
      <PerspectiveCamera makeDefault position={isMobile ? [1.8, 1.5, 1.8] : [2.2, 1.8, 2.2]} fov={isMobile ? 45 : 35} near={0.1} far={100} />
    </>
  );
}

// --- Hero Content & Loading ---
function HeroContent() {
  return (
    <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10 pointer-events-none">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
      `}</style>
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight">
          <span className="block animate-fadeInUp" style={{ animationDelay: '0s' }}>Empowerment</span>
          <span className="block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>through</span>
          <span className="block text-yellow-400 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>strategy</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          Guiding Birmingham's youth through <span className="text-red-500">critical thinking</span>,
          <span className="text-green-500">cultural heritage</span>, and <span className="text-red-500">creative expression</span>
          to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
        </p>
        <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <a href="#mission" className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 hover:scale-105">
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

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#030310]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-red-700 border-b-green-700 border-l-white border-r-red-500 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-red-600 text-xl font-serif">Awakening wisdom...</p>
      </div>
    </div>
  );
}

// --- Main Export ---
export default function KnowledgeIsPowerHero() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative w-full h-[90vh] md:h-screen bg-[#030310]">
      <Canvas shadows={false} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', precision: 'highp' }} className="w-full h-full">
        <Suspense fallback={<Html center><div className="text-white text-xl">Loading Strategy...</div></Html>}>
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