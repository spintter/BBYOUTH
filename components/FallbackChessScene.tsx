'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// Simple fallback chess scene with basic geometry instead of GLB models
export default function FallbackChessScene({ position = [0, 0, 0] }) {
  const sceneRef = useRef<THREE.Group>(null);

  // Add simple animation
  useFrame((state, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position} ref={sceneRef} rotation={[-Math.PI / 6, 0, Math.PI / 12]}>
      {/* Chessboard */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>
      
      {/* Checkerboard pattern */}
      {Array.from({ length: 8 }).map((_, fileIdx) =>
        Array.from({ length: 8 }).map((_, rankIdx) => {
          const isBlack = (fileIdx + rankIdx) % 2 === 1;
          if (!isBlack) return null;
          
          const x = (fileIdx / 8) - 0.5 + (1/16);
          const z = (rankIdx / 8) - 0.5 + (1/16);
          
          return (
            <mesh 
              key={`${fileIdx}-${rankIdx}`}
              position={[x, 0.051, z]} 
              receiveShadow
            >
              <boxGeometry args={[0.125, 0.01, 0.125]} />
              <meshStandardMaterial color="#323232" />
            </mesh>
          );
        })
      )}
      
      {/* King - simplified as a cylinder with a cross */}
      <group position={[-0.3, 0.1, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Rook - simplified as a cylinder with a flat top */}
      <group position={[-0.4, 0.1, -0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.08, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Pawn - simplified as a sphere on a cylinder */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.06, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Highlight under pawn */}
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
        </mesh>
      </group>
      
      {/* Queen - simplified as a cylinder with a crown */}
      <group position={[0, 0.1, 0.4]} visible={false}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.09, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>
      
      {/* Environment and lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 7, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="night" />
    </group>
  );
}
