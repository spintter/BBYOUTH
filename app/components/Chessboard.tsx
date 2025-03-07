'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { PerformanceMonitor } from '@/utils/performanceUtils';

interface ChessPieceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  modelPath: string;
}

function ChessPiece({ position, rotation, scale, modelPath }: ChessPieceProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5; // Rotate 0.5 radians per second
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
}

function ChessSquare({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function Chessboard() {
  const [performanceMonitor] = useState(() => new PerformanceMonitor(60));
  const boardRef = useRef<Group>(null);
  const lastTimeRef = useRef(0);

  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime() * 1000;
    performanceMonitor.update();
    
    const currentFPS = performanceMonitor.getCurrentFPS();
    if (currentFPS < 30) {
      console.log('Low FPS detected:', currentFPS);
      // Implement quality adjustment logic here
    }
  });

  const renderBoard = () => {
    const squares = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = (i + j) % 2 === 0 ? '#ffffff' : '#4a4a4a';
        squares.push(
          <ChessSquare
            key={`${i}-${j}`}
            position={[i - 3.5, 0, j - 3.5]}
            color={color}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={2048}
        />
        <group ref={boardRef}>
          {renderBoard()}
          <ChessPiece
            position={[-2.5, 0.5, -2.5]}
            rotation={[0, 0, 0]}
            scale={0.5}
            modelPath="/models/optimized/african-girl-pawn.glb"
          />
          <ChessPiece
            position={[2.5, 0.5, 2.5]}
            rotation={[0, 0, 0]}
            scale={0.5}
            modelPath="/models/optimized/african-girl-queen.glb"
          />
        </group>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
} 