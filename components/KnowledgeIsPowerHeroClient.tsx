'use client';

// Assuming this code is based on the version the user provided BEFORE v8/v10 errors
// Key changes: Correct OptimizedChessKing implementation, piece removal.

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration & Types ---
type Vector3Array = [number, number, number];
interface ChessCoordinate { file: string; rank: number; }
// Define interface at the top level
interface ChessPieceProps { position: Vector3Array; isWhite: boolean; scale: Vector3Array; modelPath?: string; additionalGeometry?: React.ReactNode; isHighlighted?: boolean; }

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

const userPreferences = {
  rotationSpeed: 0.0, // Rotation disabled
  colorScheme: {
    primary: '#8B0000',
    secondary: '#006400',
    boardDark: '#000000',
    boardLight: '#FFFFFF',
    // King Colors
    kingWhiteColor: '#FFFFFF',
    kingBlackColor: '#010101',
     // Queen Accent Color (used in placeholder Queen)
    queenAccentColor: '#facc15',
    // Fallbacks for other placeholders
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


// --- Optimized King Component (v15 - Correct Scale, Placement, Safe Material) ---
interface OptimizedKingProps { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean; }

function OptimizedChessKing({ position, isWhite, isHighlighted }: OptimizedKingProps) {
  const modelPath = '/models/newking.glb';
  useGLTF.preload(modelPath);
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);

  // --- IMPORTANT: VERIFY THESE NAMES ---
  // Check browser console logs for actual mesh names found in your GLB.
  const whiteMeshName = "King_Mesh_White"; // Example name - UPDATE FROM CONSOLE LOGS
  const blackMeshName = "King_Mesh_Black"; // Example name - UPDATE FROM CONSOLE LOGS

  // Create materials *without clearcoat* for visual appeal & error prevention
  const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: userPreferences.colorScheme.kingWhiteColor,
      metalness: 0.05, // Subtle sheen
      roughness: 0.1,  // Glossy
      side: THREE.FrontSide
  }), []);
  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: userPreferences.colorScheme.kingBlackColor,
      metalness: 0.05,
      roughness: 0.1,
      side: THREE.FrontSide
  }), []);

  // Clone, find meshes, set visibility AND material
  const processedScene = useMemo(() => {
    console.log(`--- Processing King GLB (${isWhite ? 'White' : 'Black'}) ---`);
    const clone = scene.clone();
    let foundWhite = false; let foundBlack = false;
    const foundMeshNames: string[] = [];

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
          foundMeshNames.push(child.name || '(no name)');
          child.castShadow = false; child.receiveShadow = false;
          // Try to match specific names FIRST
          if (child.name === whiteMeshName) {
              child.visible = isWhite; child.material = whiteMaterial; foundWhite = true;
          } else if (child.name === blackMeshName) {
              child.visible = !isWhite; child.material = blackMaterial; foundBlack = true;
          } else { child.visible = false; } // Hide non-matching meshes
      }
    });

    console.log(`King: Meshes found in GLB: [${foundMeshNames.join(', ')}]`);
    console.log(`King: Trying to match White='${whiteMeshName}', Black='${blackMeshName}'`);

    // Fallback if specific named meshes weren't found
    if (!foundWhite || !foundBlack) {
        console.warn(`King: Could not find one or both expected meshes by name. Check names! Applying fallback using first found mesh.`);
        let fallbackApplied = false;
        clone.traverse((child) => { // Traverse again for fallback
             if (child instanceof THREE.Mesh && !fallbackApplied) {
                 console.log(`King Fallback: Using mesh '${child.name || '(no name)'}'`);
                 child.visible = true; child.material = isWhite ? whiteMaterial : blackMaterial; fallbackApplied = true;
             } else if (child instanceof THREE.Mesh) { child.visible = false; }
        });
         if (!fallbackApplied) { console.error("King Fallback failed: No meshes found at all in GLB."); }
    } else { console.log(`King: Successfully configured meshes by name.`); }

    clone.rotation.set(0, 0, 0); // Ensure neutral base rotation
    clone.position.set(0, 0, 0); // Ensure neutral base position
    return clone;
  }, [scene, isWhite, whiteMeshName, blackMeshName, whiteMaterial, blackMaterial]);

  // --- POSITIONING (Y-axis) ---
  // Set Y position to 0. Adjust slightly ONLY if needed based on visual result.
  const pieceYPosition = 0; // <<--- STARTING AT 0, ADJUST *ONLY* IF FLOATING/SINKING

  // --- SCALING ---
  const kingScale: Vector3Array = [0.03, 0.03, 0.03]; // <<--- USING YOUR VALUE 0.03

  return (
    // Apply calculated position to the outer group
    <group position={[position[0], pieceYPosition, position[2]]} ref={pieceRef}>
        {/* Apply scale and ensure neutral rotation for the model primitive */}
        <primitive object={processedScene} scale={kingScale} rotation={[0,0,0]} />
    </group>
  );
}


// --- Generic Chess Piece Component (Inefficient Placeholder - As provided by user) ---
// Used by Queen, Rook, Knight, Pawn placeholders. Loads heavy pawn model.
function ChessPiece({ position, isWhite, scale, modelPath = '/models/chess_pawn.glb', additionalGeometry, isHighlighted = false }: ChessPieceProps) {
  const { scene } = useGLTF(modelPath);
  const pieceRef = useRef<THREE.Group>(null);

  // Material override from user's original code structure (adjust if needed)
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback,
    metalness: 0.2, // Original values from user code
    roughness: 0.6,
    side: THREE.FrontSide // Changed from DoubleSide
  }), [isWhite]);

  const clonedScene = useMemo(() => {
    if (!scene) return undefined;
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

  useFrame((state, delta) => {
    // Keep original rotation logic if it was present
    if (pieceRef.current && userPreferences.rotationSpeed > 0) { // Check speed > 0
      pieceRef.current.rotation.y += delta * userPreferences.rotationSpeed;
    }
  });

  // Use original Y offset from user code if different
  const pieceYPosition = 0.05;

  return (
    <group position={[position[0], pieceYPosition, position[2]]} ref={pieceRef}>
      <group scale={scale}>
        {clonedScene && <primitive object={clonedScene} />}
        {additionalGeometry}
      </group>
    </group>
  );
}

// --- Placeholder Specific Piece Components (Unchanged from user code, except scale) ---
// Using original scales from user code (before my incorrect changes)
function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    return ( <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.15, 0.15]} /> ); // Original Scale
}
function ChessQueen({ position, isWhite, isHighlighted }: { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean }) {
  // Original crown logic from user code
  const crown = useMemo(() => ( <group position={[0, 0.5, 0]}> <mesh> <cylinderGeometry args={[0.05, 0.03, 0.1, 12]} /> <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} /> </mesh> <mesh position={[0, 0.05, 0]}> <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} /> <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} /> </mesh> </group>), [isWhite]);
  // Original Scale
  return ( <ChessPiece position={position} isWhite={isWhite} scale={[0.16, 0.2, 0.16]} additionalGeometry={crown} isHighlighted={isHighlighted} /> );
}
function ChessRook({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
 const crenelation = useMemo(() => ( <group position={[0, 0.4, 0]}> <mesh> <boxGeometry args={[0.15, 0.05, 0.15]} /> <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} /> </mesh> <mesh position={[0.05, 0.025, 0.05]}> <boxGeometry args={[0.05, 0.05, 0.05]} /> <meshStandardMaterial color="#000000" transparent opacity={0.3} /> </mesh> </group>), [isWhite]);
 // Original Scale
 return ( <ChessPiece position={position} isWhite={isWhite} scale={[0.17, 0.14, 0.17]} additionalGeometry={crenelation} /> );
}
function ChessKnight({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
 const horseHead = useMemo(() => ( <group position={[0, 0.4, 0]}> <mesh position={[0, 0.05, 0.05]}> <sphereGeometry args={[0.05, 12, 12]} /> <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} /> </mesh> <mesh position={[0, 0, 0.05]}> <cylinderGeometry args={[0.02, 0.02, 0.1, 10]} /> <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} /> </mesh> </group>), [isWhite]);
 // Original Scale
 return ( <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.17, 0.15]} additionalGeometry={horseHead} /> );
}


// --- Chessboard Component ---
interface ChessboardModelProps { position?: Vector3Array; }
function ChessboardModel({ position = [0, 0, 0] }: ChessboardModelProps) {
  const boardRef = useRef<THREE.Group>(null);
  const checkerShader = useMemo(() => ({ /* ... */ uniforms: { color1: { value: new THREE.Color(userPreferences.colorScheme.boardLight) }, color2: { value: new THREE.Color(userPreferences.colorScheme.boardDark) }, scale: { value: 8.0 }, }, vertexShader: ` varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); } `, fragmentShader: ` uniform vec3 color1; uniform vec3 color2; uniform float scale; varying vec2 vUv; void main() { vec2 pos = vUv * scale; float pattern = mod(floor(pos.x) + floor(pos.y), 2.0); gl_FragColor = vec4(mix(color1, color2, pattern), 1.0); } `, }), []);

  useFrame((state, delta) => { if (boardRef.current && userPreferences.rotationSpeed > 0) { boardRef.current.rotation.y += delta * userPreferences.rotationSpeed; } });

  // --- Piece arrays with 4 pieces removed ---
  // Removed g2, a7 pawns and e3 knight for white (assuming b1 knight exists)
  // Removed a2, g6 pawns and assumed g8 knight for black
  const whitePieces = useMemo(() => [
    { type: 'king', coord: { file: 'g', rank: 1 } },
    { type: 'queen', coord: { file: 'd', rank: 1 } }, // Standard Queen position
    { type: 'rook', coord: { file: 'a', rank: 1 } },
    { type: 'rook', coord: { file: 'h', rank: 1 } },
    { type: 'knight', coord: { file: 'b', rank: 1 } }, // Standard Knight
    // { type: 'knight', coord: { file: 'g', rank: 1 } }, // Removed Knight
    { type: 'bishop', coord: { file: 'c', rank: 1 } }, // Added missing Bishops
    { type: 'bishop', coord: { file: 'f', rank: 1 } },
    // { type: 'pawn', coord: { file: 'a', rank: 2 } }, // Removed Pawn
    { type: 'pawn', coord: { file: 'b', rank: 2 } },
    { type: 'pawn', coord: { file: 'c', rank: 2 } },
    { type: 'pawn', coord: { file: 'd', rank: 2 } },
    { type: 'pawn', coord: { file: 'e', rank: 2 } },
    { type: 'pawn', coord: { file: 'f', rank: 2 } },
    // { type: 'pawn', coord: { file: 'g', rank: 2 } }, // Removed Pawn
    { type: 'pawn', coord: { file: 'h', rank: 2 } },
  ], []);

  const blackPieces = useMemo(() => [
    { type: 'king', coord: { file: 'e', rank: 8 } }, // Standard King position
    { type: 'queen', coord: { file: 'd', rank: 8 } }, // Standard Queen position
    { type: 'rook', coord: { file: 'a', rank: 8 } },
    { type: 'rook', coord: { file: 'h', rank: 8 } },
    { type: 'knight', coord: { file: 'b', rank: 8 } }, // Standard Knight
    // { type: 'knight', coord: { file: 'g', rank: 8 } }, // Removed Knight
    { type: 'bishop', coord: { file: 'c', rank: 8 } }, // Added missing Bishops
    { type: 'bishop', coord: { file: 'f', rank: 8 } },
    // { type: 'pawn', coord: { file: 'a', rank: 7 } }, // Removed Pawn
    { type: 'pawn', coord: { file: 'b', rank: 7 } },
    { type: 'pawn', coord: { file: 'c', rank: 7 } },
    { type: 'pawn', coord: { file: 'd', rank: 7 } },
    { type: 'pawn', coord: { file: 'e', rank: 7 } },
    { type: 'pawn', coord: { file: 'f', rank: 7 } },
    // { type: 'pawn', coord: { file: 'g', rank: 7 } }, // Removed Pawn
    { type: 'pawn', coord: { file: 'h', rank: 7 } },
  ], []);
  // NOTE: Removed 4 pieces total (2 pawns, 2 knights). Added Bishops for realism. Adjust if needed.


  // Separate pawns for instancing (using the original heavy pawn for now)
  // ** THIS NEEDS TO BE UPDATED TO USE InstancedOptimizedPawns once newpawn.glb is ready **
  const whitePawnPositions = useMemo(() => whitePieces.filter(p => p.type === 'pawn').map(p => chessToPosition(p.coord)), [whitePieces]);
  const blackPawnPositions = useMemo(() => blackPieces.filter(p => p.type === 'pawn').map(p => chessToPosition(p.coord)), [blackPieces]);


  return (
    <group position={position} ref={boardRef} rotation={[-Math.PI / 7, Math.PI / 24, Math.PI / 12]} >
      {/* Checkerboard Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}> <planeGeometry args={[1, 1, 1, 1]} /> <shaderMaterial args={[checkerShader]} /> </mesh>

      {/* Render all pieces using the components */}
      {/* ** This uses OptimizedChessKing for kings, but original inefficient components for others ** */}
      {whitePieces.map((piece) => {
          const pos = chessToPosition(piece.coord);
          const key = `white-${piece.type}-${piece.coord.file}${piece.coord.rank}`;
          switch (piece.type) {
              case 'king': return <OptimizedChessKing key={key} position={pos} isWhite={true} />;
              case 'queen': return <ChessQueen key={key} position={pos} isWhite={true} />;
              case 'rook': return <ChessRook key={key} position={pos} isWhite={true} />;
              case 'knight': return <ChessKnight key={key} position={pos} isWhite={true} />;
              // Render pawns individually for now using the old component
              case 'pawn': return <ChessPawn key={key} position={pos} isWhite={true} />;
              // Add Bishop rendering if you create a ChessBishop component
              // case 'bishop': return <ChessBishop key={key} position={pos} isWhite={true} />;
              default: return null;
          }
      })}
      {blackPieces.map((piece) => {
          const pos = chessToPosition(piece.coord);
          const key = `black-${piece.type}-${piece.coord.file}${piece.coord.rank}`;
           switch (piece.type) {
              case 'king': return <OptimizedChessKing key={key} position={pos} isWhite={false} />;
              case 'queen': return <ChessQueen key={key} position={pos} isWhite={false} />;
              case 'rook': return <ChessRook key={key} position={pos} isWhite={false} />;
              case 'knight': return <ChessKnight key={key} position={pos} isWhite={false} />;
              // Render pawns individually for now using the old component
              case 'pawn': return <ChessPawn key={key} position={pos} isWhite={false} />;
               // Add Bishop rendering if you create a ChessBishop component
              // case 'bishop': return <ChessBishop key={key} position={pos} isWhite={false} />;
              default: return null;
          }
      })}
    </group>
  );
}


// --- Scene Setup ---
function Scene() {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => { useGLTF.preload('/models/newking.glb'); useGLTF.preload('/models/chess_pawn.glb'); }, []); // Preload king and old pawn
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow={false} />
      {/* Environment is crucial for reflections */}
      <Environment preset="studio" background={false} />
      <group position={[0.5, -0.15, 0]}> <ChessboardModel position={[0, -0.1, 0]} /> </group>
      <OrbitControls enableZoom={false} enablePan={false} minDistance={2.0} maxDistance={2.5} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} />
      <PerspectiveCamera makeDefault position={isMobile ? [1.8, 1.5, 1.8] : [2.2, 1.8, 2.2]} fov={isMobile ? 45 : 35} near={0.1} far={100} />
    </>
  );
}

// --- Hero Content & Loading (Keep as is) ---
function HeroContent() { /* ... */ return ( <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10 pointer-events-none"> {/* Style and content */} <style>{` @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeInUp { animation: fadeInUp 1s ease-out; } `}</style> <div className="max-w-3xl"> <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight"> <span className="block animate-fadeInUp" style={{ animationDelay: '0s' }}>Empowerment</span> <span className="block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>through</span> <span className="block text-yellow-400 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>strategy</span> </h1> <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg animate-fadeInUp" style={{ animationDelay: '0.6s' }}> Guiding Birmingham's youth through <span className="text-red-500">critical thinking</span>, <span className="text-green-500">cultural heritage</span>, and <span className="text-red-500">creative expression</span> to cultivate the next generation of leaders, thinkers, and innovators in the humanities. </p> <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}> <a href="#mission" className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 hover:scale-105" > Join Our Program <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /> </svg> </a> </div> </div> </div> ); }
function LoadingFallback() { /* ... */ return ( <div className="flex items-center justify-center h-screen bg-[#030310]"> <div className="text-center"> <div className="w-16 h-16 border-4 border-t-red-700 border-b-green-700 border-l-white border-r-red-500 rounded-full animate-spin mb-4 mx-auto"></div> <p className="text-red-600 text-xl font-serif">Awakening wisdom...</p> </div> </div> ); }


// --- Main Export ---
export default function KnowledgeIsPowerHero() { /* ... */ const [isLoading, setIsLoading] = useState(true); useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 1500); return () => clearTimeout(timer); }, []); return ( <div className="relative w-full h-[90vh] md:h-screen bg-[#030310]"> <Canvas shadows={false} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', precision: 'highp' }} className="w-full h-full" > <Suspense fallback={ <Html center><div className="text-white text-xl">Loading Strategy...</div></Html> }> <Scene /> </Suspense> </Canvas> <HeroContent /> {isLoading && ( <div className="absolute inset-0 bg-[#030310] flex items-center justify-center z-20"> <LoadingFallback /> </div> )} </div> ); }
