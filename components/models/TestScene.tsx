'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { AfricanPawn, AfricanQueen } from './AfricanChessPieces';

export function TestScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 5] }}
        shadows
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
        />

        {/* Display pawn and queen side by side */}
        <AfricanPawn position={[-1, 0, 0]} />
        <AfricanQueen position={[1, 0, 0]} />

        {/* Ground plane */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#444444" />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  );
} 