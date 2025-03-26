'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

// Initialize the MeshoptDecoder - required for compressed GLB files
MeshoptDecoder.ready.then(() => {
  console.log("MeshoptDecoder initialized successfully");
}).catch((error: Error) => {
  console.error("MeshoptDecoder initialization failed:", error);
});

// Simple type definitions
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
  colorScheme: {
    primary: '#FFD700', // Gold
    secondary: '#800080', // Purple
    highlight: '#FF00FF', // Magenta
    boardDark: '#323232', // Dark gray for dark squares 
    boardLight: '#E8E8E8', // Light gray for light squares
  }
};

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

// Simplified chess piece component that uses basic geometry
function ChessPiece({ 
  type, 
  color, 
  position,
  highlight = false
}: { 
  type: string; 
  color: string; 
  position: Vector3Array; 
  highlight?: boolean; 
}) {
  // Material colors
  const materialColor = color === 'white' ? 0xDDDDDD : 0x222222;
  
  return (
    <group position={position}>
      {type === 'pawn' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.06, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      {type === 'king' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.1, 12]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      {type === 'queen' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.09, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      {type === 'rook' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.08, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      {type === 'bishop' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.08, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      {type === 'knight' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.07, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      )}
      
      {/* Add highlight under the special piece if needed */}
      {highlight && (
        <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial
            color={userPreferences.colorScheme.primary}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

// Chess board component with primitive geometry for testing
function ChessBoard() {
  return (
    <group>
      {/* Main board */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 0.05]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
      
      {/* Black squares */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          // Only create black squares
          if ((row + col) % 2 !== 0) return null;
          
          const x = (col / 8) - 0.4375;
          const z = (row / 8) - 0.4375;
          
          return (
            <mesh
              key={`${row}-${col}`}
              position={[x, 0.025, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <boxGeometry args={[0.125, 0.125, 0.01]} />
              <meshStandardMaterial color="#323232" />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// Test spheres - to verify scene is working
function TestSpheres() {
  // Add a rotating sphere
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta;
    }
  });
  
  return (
    <group>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      
      <mesh position={[0.5, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#00FF00" />
      </mesh>
      
      <mesh position={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#0000FF" />
      </mesh>
    </group>
  );
}

// Main Optimized Scene Component
export default function OptimizedChessScene() {
  const [isMobile, setIsMobile] = useState(false);
  console.log("OptimizedChessScene rendering");
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      {/* Log when rendering */}
      <group onUpdate={() => console.log("Scene group updated")}>
        {/* Dark background */}
        <color attach="background" args={['#030310']} />
        
        {/* Simple lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 7, 5]}
          intensity={1.2}
          castShadow 
        />
        
        {/* Test objects to verify scene is working */}
        <TestSpheres />
        
        {/* Fixed camera */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 2, 5]} 
          fov={45}
          near={0.1}
          far={100}
        />
      </group>
    </>
  );
}
