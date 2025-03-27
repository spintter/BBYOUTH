'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

type Vector3Array = [number, number, number];

interface ChessCoordinate {
  file: string;
  rank: number;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

const userPreferences = {
  rotationSpeed: 0.05,
  colorScheme: {
    primary: '#8B0000',
    secondary: '#006400',
    boardDark: '#000000',
    boardLight: '#FFFFFF',
    whitePiece: '#FFFFFF',
    blackPiece: '#808080' // Adjusted for contrast
  }
};

MeshoptDecoder.ready.then(() => {
  console.log("MeshoptDecoder initialized successfully");
}).catch((error: Error) => {
  console.error("MeshoptDecoder initialization failed:", error);
});

function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  
  if (fileIndex === -1 || rankIndex === -1) {
    console.error("Invalid chess coordinate:", coord);
    return [0, 0, 0];
  }
  
  const x = BOARD_OFFSET[0] + (fileIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  const z = BOARD_OFFSET[2] + (rankIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  
  return [x, 0, z];
}

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
  const boardRef = useRef<THREE.Group>(null);

  // Use a simple plane with shader material for the checkerboard
  // This is more efficient than loading a GLB model and overlaying a shader
  const checkerShader = {
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
  };

  useFrame((state, delta) => {
    if (boardRef.current) {
      boardRef.current.rotation.y += delta * 0.05;
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
      rotation={[-Math.PI / 7, Math.PI / 24, Math.PI / 12]}
    >
      {/* Single shader plane for checkerboard instead of GLB model */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          uniforms={checkerShader.uniforms}
          vertexShader={checkerShader.vertexShader}
          fragmentShader={checkerShader.fragmentShader}
        />
      </mesh>
      {whitePieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        switch (piece.type) {
          case 'king':
            return <ChessKing key={`white-king-${index}`} position={pos} isWhite={true} />;
          case 'queen':
            return <ChessQueen key={`white-queen-${index}`} position={pos} isWhite={true} isHighlighted={true} />;
          case 'rook':
            return <ChessRook key={`white-rook-${index}`} position={pos} isWhite={true} />;
          case 'knight':
            return <ChessKnight key={`white-knight-${index}`} position={pos} isWhite={true} />;
          case 'pawn':
            return <ChessPawn key={`white-pawn-${index}`} position={pos} isWhite={true} />;
          default:
            return null;
        }
      })}
      {blackPieces.map((piece, index) => {
        const pos = chessToPosition(piece.coord);
        switch (piece.type) {
          case 'king':
            return <ChessKing key={`black-king-${index}`} position={pos} isWhite={false} isHighlighted={true} />;
          case 'queen':
            return <ChessQueen key={`black-queen-${index}`} position={pos} isWhite={false} />;
          case 'rook':
            return <ChessRook key={`black-rook-${index}`} position={pos} isWhite={false} />;
          case 'knight':
            return <ChessKnight key={`black-knight-${index}`} position={pos} isWhite={false} />;
          case 'pawn':
            return <ChessPawn key={`black-pawn-${index}`} position={pos} isWhite={false} />;
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

  const clonedScene = useRef<THREE.Group>();
  useEffect(() => {
    if (scene) {
      clonedScene.current = scene.clone();
      clonedScene.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece,
            metalness: 0.2,
            roughness: 0.6,
            side: THREE.DoubleSide
          });
        }
      });
    }
  }, [scene, isWhite]);

  useFrame((state, delta) => {
    if (pieceRef.current) {
      pieceRef.current.rotation.y += delta * userPreferences.rotationSpeed;
    }
  });

  return (
    <group position={[position[0], 0.05, position[2]]} ref={pieceRef}>
      <group scale={scale}>
        {clonedScene.current && <primitive object={clonedScene.current} />}
        {additionalGeometry}
      </group>
    </group>
  );
}

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.15, 0.15, 0.15]}
    />
  );
}

function ChessKing({ position, isWhite, isHighlighted }: { position: Vector3Array; isWhite: boolean; isHighlighted?: boolean }) {
  const cross = (
    <group position={[0, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.18, 0.22, 0.18]}
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
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} />
      </mesh>
    </group>
  );

  return (
    <ChessPiece
      position={position}
      isWhite={isWhite}
      scale={[0.16, 0.2, 0.16]}
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
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[0.05, 0.025, 0.05]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
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
  const horseHead = (
    <group position={[0, 0.4, 0]}>
      <mesh position={[0, 0.05, 0.05]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 10]} />
        <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePiece : userPreferences.colorScheme.blackPiece} />
      </mesh>
    </group>
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

function Scene() {
  const [isMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    console.log("Preloading 3D models...");
    try {
      useGLTF.preload('/models/chess_pawn.glb', true);
      console.log("Preloading complete");
    } catch (error) {
      console.error("Preloading failed:", error);
    }
  }, []);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.002} />
      <directionalLight 
        position={[0, 5, 0]}
        intensity={0.7}
        castShadow={false}
      />
      <group position={[0.5, -0.15, 0]}>
        <ChessboardModel position={[0, -0.1, 0]} />
      </group>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minDistance={2.0}
        maxDistance={2.0}
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
          Guiding Birmingham's youth through <span className="text-red-500">critical thinking</span>, <span className="text-green-500">cultural heritage</span>, and <span className="text-red-500">creative expression</span> to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
        </p>
        <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <a 
            href="#mission" 
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 hover:scale-105"
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
        <div className="w-16 h-16 border-4 border-t-red-700 border-b-green-700 border-l-white border-r-red-500 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-red-600 text-xl font-serif">Awakening wisdom...</p>
      </div>
    </div>
  );
}

export default function KnowledgeIsPowerHero() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Component mounting, starting to load resources...");
    try {
      useGLTF.preload('/models/chess_pawn.glb', true);
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
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          precision: 'highp',
        }}
        className="w-full h-full"
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