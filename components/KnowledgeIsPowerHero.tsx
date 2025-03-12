'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Group, Mesh, BufferGeometry } from 'three';

// Define props interface for TypeScript
interface KnowledgeIsPowerHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

function ChessScene() {
  const { scene: pawn } = useGLTF('/models/african-girl.glb');
  const { scene: queen } = useGLTF('/models/african-queen.glb');
  const groupRef = useRef<Group>(null);
  const boardRef = useRef<Mesh>(null);
  const [morphProgress, setMorphProgress] = useState(0);

  // Chessboard texture
  const boardTexture = new THREE.CanvasTexture(
    (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            ctx.fillStyle = (i + j) % 2 ? '#4A2C2A' : '#F5E6CC';
            ctx.fillRect(i * 32, j * 32, 32, 32);
          }
        }
      }
      return canvas;
    })()
  );
  boardTexture.colorSpace = THREE.SRGBColorSpace;

  // Animations
  useFrame((state, delta) => {
    if (morphProgress < 1) setMorphProgress(Math.min(morphProgress + delta / 3, 1)); // 3s morph
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2; // 360° orbit
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 + 0.2; // Spiral
    }
  });

  // Create BufferGeometry for Points
  const geometry = new BufferGeometry();
  const positions = new Float32Array(1000).map(() => (Math.random() - 0.5) * 2);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <>
      <mesh ref={boardRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial map={boardTexture} />
      </mesh>
      <group ref={groupRef} position={[0, 0.2, 0]}>
        <primitive object={pawn} scale={[1 - morphProgress, 1, 1]} />
        <primitive object={queen} scale={[morphProgress, 1, 1]} />
      </group>
      <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.5} penumbra={1} />
      <Points>
        <primitive object={geometry} attach="geometry" />
        <PointMaterial
          transparent
          color="#ff6200"
          size={0.05}
          sizeAttenuation
          opacity={0.5 * morphProgress}
        />
      </Points>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={10} />
    </>
  );
}

export default function KnowledgeIsPowerHero({
  title = "Knowledge Is Our Power",
  subtitle = "Afrocentric Wisdom for Tomorrow's Leaders",
  ctaText = "Begin Your Journey",
}: KnowledgeIsPowerHeroProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);

  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    if (!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')) {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>WebGL not supported.</p>
      </div>
    );
  }

  return (
    <div className="hero-container">
      <div className="canvas-wrapper">
        <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <ChessScene />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
      <div className="text-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <button aria-label={ctaText}>{ctaText}</button>
      </div>
    </div>
  );
}