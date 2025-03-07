'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { AdaptiveRenderer } from './AdaptiveRenderer';
import { TransformationSequence } from './TransformationSequence';
import { LightTransition } from './LightTransition';
import { AfricanWoodMaterial, KenteClothMaterial } from './materials/AfrocentricMaterials';
import * as THREE from 'three';

interface AfrocentricChessSceneProps {
  onLoaded?: () => void;
  transformationActive?: boolean;
}

export function AfrocentricChessScene({ 
  onLoaded, 
  transformationActive = false 
}: AfrocentricChessSceneProps) {
  const chessboardRef = useRef<THREE.Group>(null);
  
  // Rotate the chessboard slowly
  useFrame((state) => {
    if (chessboardRef.current) {
      chessboardRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });
  
  // Handle transformation completion
  const handleTransformationComplete = () => {
    console.log('Transformation complete');
  };
  
  // Start the transformation
  const startTransformation = () => {
    transformationActive = true;
  };
  
  return (
    <AdaptiveRenderer>
      {/* Environment and lighting */}
      <Environment preset="sunset" background blur={0.8} />
      <ambientLight intensity={0.3} />
      
      {/* Light transition effect */}
      <LightTransition 
        active={transformationActive}
        startColor="#331800"
        endColor="#FFD700"
        startIntensity={0.2}
        endIntensity={1.5}
        position={[0, 3, 0]}
        duration={5}
      />
      
      {/* Chessboard */}
      <group ref={chessboardRef}>
        {/* Dark squares */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            if ((row + col) % 2 === 0) {
              return (
                <mesh
                  key={`dark-${row}-${col}`}
                  position={[
                    (col - 3.5) * 0.5,
                    0,
                    (row - 3.5) * 0.5
                  ]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[0.5, 0.5]} />
                  <AfricanWoodMaterial color="#3D2314" />
                </mesh>
              );
            }
            return null;
          })
        )}
        
        {/* Light squares */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            if ((row + col) % 2 === 1) {
              return (
                <mesh
                  key={`light-${row}-${col}`}
                  position={[
                    (col - 3.5) * 0.5,
                    0,
                    (row - 3.5) * 0.5
                  ]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[0.5, 0.5]} />
                  <AfricanWoodMaterial color="#D4B996" />
                </mesh>
              );
            }
            return null;
          })
        )}
        
        {/* Transformation sequence */}
        <TransformationSequence 
          active={transformationActive}
          onComplete={handleTransformationComplete}
          position={[0, 0.1, 0]}
        />
      </group>
      
      {/* Ground with contact shadows */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.5}
        scale={10}
        blur={1}
        far={5}
        resolution={256}
        color="#000000"
      />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      {/* Start transformation button (HTML overlay) */}
      <Html position={[0, -1, 0]}>
        <button
          onClick={startTransformation}
          style={{
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Start Transformation
        </button>
      </Html>
    </AdaptiveRenderer>
  );
} 