'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Simple type definitions
type Vector3Array = [number, number, number];

// A simplified chess scene that just shows a rotating board with pieces
export default function SimpleChessScene({ position = [0, 0, 0] as Vector3Array }) {
  console.log('SimpleChessScene rendering with position:', position);
  
  // Scene refs
  const boardRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Load basic models - adding error logging
  console.log('Loading chessboard model...');
  const { scene: chessboardScene } = useGLTF('/models/chessboard.glb', undefined, 
    (e) => console.error('Error loading chessboard:', e));
  
  console.log('Loading pawn model...');
  const pawnGltf = useGLTF('/models/pawn.glb', undefined, 
    (e) => console.error('Error loading pawn:', e));
  
  // Simple animation
  useFrame((state, delta) => {
    if (boardRef.current) {
      // Simple rotation
      boardRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Simple camera */}
      <PerspectiveCamera 
        ref={cameraRef} 
        makeDefault 
        position={[0.5, 0.5, 1]} 
        fov={40}
        near={0.1}
        far={100}
      />
      
      {/* Chessboard with fixed rotation */}
      <group
        ref={boardRef}
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 6, 0, Math.PI / 12]}
      >
        {/* Chessboard */}
        <primitive object={chessboardScene} scale={[0.03, 0.03, 0.03]} />
        
        {/* Single pawn */}
        <group position={[0, 0.01, 0]} scale={[0.144, 0.144, 0.144]}>
          <primitive object={pawnGltf.scene} />
        </group>
      </group>
      
      {/* Basic lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <Environment preset="night" />
    </group>
  );
}
