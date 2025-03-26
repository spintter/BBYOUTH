'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  PerspectiveCamera, 
  Html
} from '@react-three/drei';
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
    boardDark: '#2A2A2A', // Darker gray for dark squares 
    boardLight: '#F0F0F0', // Lighter gray for light squares
    whitePiece: '#FFFFFF', // White pieces
    blackPiece: '#0A0A0A'  // Black pieces
  }
};

// Initialize the MeshoptDecoder
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

// Define props interfaces
interface ChessPieceProps {
  position: Vector3Array;
  isWhite: boolean;
  scale: Vector3Array;
  additionalGeometry?: React.ReactNode;
  isHighlighted?: boolean;
}

interface ChessboardModelProps {
  position?: Vector3Array;
}

function ChessboardModel({ position = [0, 0, 0] }: ChessboardModelProps) {
  const { scene } = useGLTF('/models/chessboard.glb');
  const boardRef = useRef<THREE.Group>(null);
  const highlightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.2,
            roughness: 0.5,
            emissive: new THREE.Color(0x111111),
            emissiveIntensity: 0.5
          });
          if (child.name.includes('dark')) {
            child.material.color.set(userPreferences.colorScheme.boardDark);
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;
          } else if (child.name.includes('light')) {
            child.material.color.set(userPreferences.colorScheme.boardLight);
            child.material.roughness = 0.4;
            child.material.metalness = 0.2;
          }
        }
      });
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (boardRef.current) {
      boardRef.current.rotation.y += delta * 0.05;
    }
    if (highlightMaterialRef.current) {
      highlightMaterialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  const whitePieces = [
    { type: 'king', coord: { file: 'g', rank: 1 } },
    { type: 'queen', coord: { file: 'h', rank: 7 } },
    { type: 'rook', coord: { file: 'f', rank: 1 } },
    { type: 'rook', coord: { file: 'h', rank: 1 } },
    { type: 'knight', coord: { file: 'e', rank: 3 } },
    { type: 'pawn', coord: { file: 'a', rank: 2 } },
    { type: 'pawn', coord: { file: 'b', rank: 2 } },
    { type: 'pawn', coord: { file: 'c', rank: 3 } },
    { type: 'pawn', coord: { file: 'd', rank: 4 } },
    { type: 'pawn', coord: { file: 'e', rank: 5 } },
    { type: 'pawn', coord: { file: 'f', rank: 2 } },
    { type: 'pawn', coord: { file: 'g', rank: 2 } },
  ];

  const blackPieces = [
    { type: 'king', coord: { file: 'h', rank: 4 } },
    { type: 'queen', coord: { file: 'f', rank: 5 } },
    { type: 'rook', coord: { file: 'f', rank: 8 } },
    { type: 'rook', coord: { file: 'h', rank: 8 } },
    { type: 'pawn', coord: { file: 'a', rank: 7 } },
    { type: 'pawn', coord: { file: 'b', rank: 7 } },
    { type: 'pawn', coord: { file: 'c', rank: 6 } },
    { type: 'pawn', coord: { file: 'd', rank: 5 } },
    { type: 'pawn', coord: { file: 'f', rank: 7 } },
    { type: 'pawn', coord: { file: 'g', rank: 6 } },
  ];

  return (
    <group
      position={position}
      ref={boardRef}
      rotation={[-Math.PI / 6, 0, Math.PI / 12]}
    >
      <primitive object={scene} scale={[0.03, 0.03, 0.03]} />
      <mesh
        position={[chessToPosition({ file: 'h', rank: 4 })[0], 0.01, chessToPosition({ file: 'h', rank: 4 })[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[SQUARE_SIZE * 0.7, SQUARE_SIZE * 0.7]} />
        <meshBasicMaterial
          ref={highlightMaterialRef}
          color={userPreferences.colorScheme.highlight}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {whitePieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        switch (piece.type) {
          case 'king':
            return <ChessKing key={index} position={pos} isWhite={true} />;
          case 'queen':
            return <ChessQueen key={index} position={pos} isWhite={true} isHighlighted={true} />;
          case 'rook':
            return <ChessRook key={index} position={pos} isWhite={true} />;
          case 'knight':
            return <ChessKnight key={index} position={pos} isWhite={true} />;
          case 'pawn':
            return <ChessPawn key={index} position={pos} isWhite={true} />;
          default:
            return null;
        }
      })}

      {blackPieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        switch (piece.type) {
          case 'king':
            return <ChessKing key={index} position={pos} isWhite={false} isHighlighted={true} />;
          case 'queen':
            return <ChessQueen key={index} position={pos} isWhite={false} />;
          case 'rook':
            return <ChessRook key={index} position={pos} isWhite={false} />;
          case 'knight':
            return <ChessKnight key={index} position={pos} isWhite={false} />;
          case 'pawn':
            return <ChessPawn key={index} position={pos} isWhite={false} />;
          default:
            return null;
        }
      })}
    </group>
  );
}

function ChessPiece({ position, isWhite, scale, additionalGeometry, isHighlighted = false }: ChessPieceProps) {
  const { scene } = useGLTF('/models/chess_pawn.glb');
  const pieceRef = useRef<THREE.Group>(null);
  const highlightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Clone the entire scene and apply custom material to all meshes
  const clonedScene = useRef<THREE.Group>();
  useEffect(() => {
    if (scene) {
      clonedScene.current = scene.clone();
      clonedScene.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: isWhite ? '#FFFFFF' : '#0A0A0A',
            metalness: 0.5,
            roughness: 0.5,
            emissive: isWhite ? '#FFFFFF' : '#0A0A0A',
            emissiveIntensity: isWhite ? 0.1 : 0,
            map: null,
            vertexColors: false,
            side: THREE.DoubleSide
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene, isWhite]);

  useFrame((state, delta) => {
    if (pieceRef.current) {
      pieceRef.current.rotation.y += delta * userPreferences.rotationSpeed;
      pieceRef.current.position.y = 0.01 + Math.sin(state.clock.elapsedTime) * 0.005;
    }
    if (highlightMaterialRef.current) {
      highlightMaterialRef.current.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.0) * 0.2;
    }
    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]} ref={pieceRef}>
      <group scale={scale}>
        {clonedScene.current && <primitive object={clonedScene.current} />}
        {additionalGeometry}
      </group>
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

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.144, 0.144, 0.144]}
    />
  );
}

function ChessKing({ position, isWhite, isHighlighted }: { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean }) {
  const cross = (
    <group position={[0, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[0.05, 0.15, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[-0.05, 0.15, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.144, 0.18, 0.144]}
      additionalGeometry={cross}
      isHighlighted={isHighlighted}
    />
  );
}

function ChessQueen({ position, isWhite, isHighlighted }: { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean }) {
  const crown = (
    <group position={[0, 0.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.03, 0.1, 12]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.12, 0.2, 0.12]}
      additionalGeometry={crown}
      isHighlighted={isHighlighted}
    />
  );
}

function ChessRook({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const crenelation = (
    <group position={[0, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[0.15, 0.05, 0.15]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[0.05, 0.025, 0.05]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.025, -0.05]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.05, 0.025, -0.05]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.025, 0.05]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.16, 0.12, 0.16]}
      additionalGeometry={crenelation}
    />
  );
}

function ChessKnight({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  const horseHead = (
    <group position={[0, 0.4, 0]}>
      <mesh position={[0, 0.05, 0.05]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[0.03, 0.1, 0.05]}>
        <coneGeometry args={[0.02, 0.05, 8]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[-0.03, 0.1, 0.05]}>
        <coneGeometry args={[0.02, 0.05, 8]} />
        <meshBasicMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.14, 0.16, 0.14]}
      additionalGeometry={horseHead}
    />
  );
}

function Scene() {
  const [isMobile, setIsMobile] = useState(false);

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
    try {
      useGLTF.preload('/models/chess_pawn.glb');
      useGLTF.preload('/models/chessboard.glb');
      console.log("Preloading complete");
    } catch (error) {
      console.error("Preloading failed:", error);
    }
  }, []);

  return (
    <>
      <color attach="background" args={['#030310']} />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]}
        intensity={1.0}
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight
        position={[0, 2, 0]}
        intensity={0.5}
        castShadow
      />
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
      <Environment preset="studio" />
    </>
  );
}

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

export default function KnowledgeIsPowerHero() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Component mounting, starting to load resources...");
    try {
      useGLTF.preload('/models/chess_pawn.glb');
      useGLTF.preload('/models/chessboard.glb');
      console.log("Models preloaded successfully");
    } catch (error) {
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
            <div className="text-white text-xl">Loading Chess Scene...</div>
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