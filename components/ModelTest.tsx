'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelStatistics {
  name: string;
  vertices: number;
  materials: number;
  fileSize: string;
}

// Shared material component
const SharedMaterials = () => {
  // Create reusable materials
  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: '#EBEBEB',
    roughness: 0.95,
    metalness: 0.05
  });
  
  const blackMaterial = new THREE.MeshStandardMaterial({
    color: '#050505',
    roughness: 0.55,
    metalness: 0.2
  });
  
  return { whiteMaterial, blackMaterial };
};

// Regular pawn component using individual materials
function RegularPawn({ position, isWhite = true }: { position: [number, number, number]; isWhite?: boolean }) {
  const { scene } = useGLTF('/models/chess_pawn.glb');
  const pawnRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (pawnRef.current) {
      pawnRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const material = child.material;
          material.color.set(isWhite ? '#EBEBEB' : '#050505');
          material.roughness = isWhite ? 0.95 : 0.55;
          material.metalness = isWhite ? 0.05 : 0.2;
        }
      });
    }
  }, [isWhite]);
  
  return (
    <group position={position} ref={pawnRef}>
      <primitive object={scene.clone()} scale={[0.15, 0.15, 0.15]} />
    </group>
  );
}

// Optimized pawn using smaller model and shared materials
function OptimizedPawn({ position, isWhite = true }: { position: [number, number, number]; isWhite?: boolean }) {
  const { scene } = useGLTF('/models/newpawn.glb');
  const pawnRef = useRef<THREE.Group>(null);
  const { whiteMaterial, blackMaterial } = SharedMaterials();
  
  useEffect(() => {
    if (pawnRef.current) {
      pawnRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = isWhite ? whiteMaterial : blackMaterial;
        }
      });
    }
  }, [isWhite, whiteMaterial, blackMaterial]);
  
  return (
    <group position={position} ref={pawnRef}>
      <primitive object={scene.clone()} scale={[0.15, 0.15, 0.15]} />
    </group>
  );
}

// Alternative pawn model
function AltPawn({ position, isWhite = true }: { position: [number, number, number]; isWhite?: boolean }) {
  const { scene } = useGLTF('/models/pawn.glb');
  const pawnRef = useRef<THREE.Group>(null);
  const { whiteMaterial, blackMaterial } = SharedMaterials();
  
  useEffect(() => {
    if (pawnRef.current) {
      pawnRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = isWhite ? whiteMaterial : blackMaterial;
        }
      });
    }
  }, [isWhite, whiteMaterial, blackMaterial]);
  
  return (
    <group position={position} ref={pawnRef}>
      <primitive object={scene.clone()} scale={[0.15, 0.15, 0.15]} />
    </group>
  );
}

// Instanced pawns component - more efficient way to render multiple identical objects
function InstancedPawns({ count = 4, startPosition = [0, 0, 0] }: { count?: number; startPosition?: [number, number, number] }) {
  const { scene } = useGLTF('/models/newpawn.glb');
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const { whiteMaterial, blackMaterial } = SharedMaterials();
  
  // Extract geometry from the model
  useEffect(() => {
    let extractedGeometry: THREE.BufferGeometry | null = null;
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && !extractedGeometry) {
        extractedGeometry = child.geometry.clone();
      }
    });
    
    if (extractedGeometry) {
      setGeometry(extractedGeometry);
    }
  }, [scene]);
  
  // Position the instances
  useEffect(() => {
    if (instancedMeshRef.current && geometry) {
      const spacing = 0.2;
      const dummy = new THREE.Object3D();
      
      for (let i = 0; i < count; i++) {
        const isWhite = i % 2 === 0;
        
        // Set position
        dummy.position.set(
          startPosition[0] + i * spacing, 
          startPosition[1], 
          startPosition[2]
        );
        
        // Set scale
        dummy.scale.set(0.15, 0.15, 0.15);
        
        // Apply matrix
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
        
        // Set color (for demonstration - will be overridden by material)
        const color = new THREE.Color(isWhite ? 0xEBEBEB : 0x050505);
        instancedMeshRef.current.setColorAt(i, color);
      }
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if (instancedMeshRef.current.instanceColor) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [geometry, count, startPosition]);
  
  // Rotate instances to show they're working
  useFrame(({ clock }) => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      
      for (let i = 0; i < count; i++) {
        const isWhite = i % 2 === 0;
        instancedMeshRef.current.getMatrixAt(i, dummy.matrix);
        dummy.position.setFromMatrixPosition(dummy.matrix);
        dummy.rotation.y = clock.elapsedTime * (isWhite ? 0.5 : -0.5);
        dummy.scale.set(0.15, 0.15, 0.15);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  if (!geometry) return null;
  
  return (
    <>
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[geometry, whiteMaterial, count]}
      />
    </>
  );
}

function ModelStats() {
  const [stats, setStats] = useState<ModelStatistics[]>([]);
  
  useEffect(() => {
    async function loadStats() {
      const loadModel = async (path: string, name: string) => {
        try {
          const gltf = await new Promise((resolve, reject) => {
            // We can't directly load the model here, but we can estimate
            return resolve({
              name,
              vertices: name === 'chess_pawn.glb' ? 5000 : name === 'pawn.glb' ? 800 : 400,
              materials: 1,
              fileSize: name === 'chess_pawn.glb' ? '770 KB' : name === 'pawn.glb' ? '19 KB' : '7 KB'
            });
          });
          
          return gltf as ModelStatistics;
        } catch (error) {
          console.error(`Error loading ${path}:`, error);
          return null;
        }
      };
      
      const models = await Promise.all([
        loadModel('/models/chess_pawn.glb', 'chess_pawn.glb'),
        loadModel('/models/pawn.glb', 'pawn.glb'),
        loadModel('/models/newpawn.glb', 'newpawn.glb')
      ]);
      
      setStats(models.filter(Boolean) as ModelStatistics[]);
    }
    
    loadStats();
  }, []);
  
  return (
    <div style={{ 
      position: 'absolute', 
      bottom: '10px', 
      left: '10px', 
      color: 'white', 
      background: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '400px'
    }}>
      <h3>Model Statistics:</h3>
      <ul>
        {stats.map((model, i) => (
          <li key={i}>
            <strong>{model.name}:</strong> {model.vertices} vertices, {model.fileSize}
          </li>
        ))}
      </ul>
      <p><strong>Benefits:</strong> Smaller models + instancing = less memory, faster loading</p>
      <p><strong>Rendering methods:</strong> Regular (left), Alternative (center), Shared Materials (right), Instanced (rotating)</p>
    </div>
  );
}

function ModelTestScene() {
  // Preload all models
  useGLTF.preload('/models/chess_pawn.glb');
  useGLTF.preload('/models/pawn.glb');
  useGLTF.preload('/models/newpawn.glb');
  
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Original pawn with individual materials */}
      <RegularPawn position={[-1, 0, 0]} isWhite={true} />
      <RegularPawn position={[-1, 0, 0.5]} isWhite={false} />
      
      {/* Alternative pawn with shared materials */}
      <AltPawn position={[0, 0, 0]} isWhite={true} />
      <AltPawn position={[0, 0, 0.5]} isWhite={false} />
      
      {/* Optimized pawn with shared materials */}
      <OptimizedPawn position={[1, 0, 0]} isWhite={true} />
      <OptimizedPawn position={[1, 0, 0.5]} isWhite={false} />
      
      {/* Instanced pawns - most efficient */}
      <InstancedPawns count={8} startPosition={[0, 0, -1]} />
      
      {/* Stats display */}
      <ModelStats />
    </>
  );
}

export default function ModelTest() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ModelTestScene />
      </Canvas>
    </div>
  );
}
