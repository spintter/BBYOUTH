'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AfricanSkinMaterial, KenteClothMaterial } from '../materials/AfrocentricMaterials';

interface AfricanPawnProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  knowledgeLevel?: number;
}

export function AfricanPawn({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1,
  knowledgeLevel = 0 
}: AfricanPawnProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group 
      ref={groupRef}
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
      scale={scale}
    >
      {/* Head - African features */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <AfricanSkinMaterial tone="#8B4513" knowledgeLevel={knowledgeLevel} />
      </mesh>

      {/* Hair - Afro style */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Body - Traditional dress */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 1.2, 32]} />
        <KenteClothMaterial color="#800020" />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial 
          color="#2a1810"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

interface AfricanQueenProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  knowledgeLevel?: number;
}

export function AfricanQueen({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1,
  knowledgeLevel = 1 
}: AfricanQueenProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group 
      ref={groupRef}
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
      scale={scale}
    >
      {/* Crown */}
      <group position={[0, 2.2, 0]}>
        {/* Crown base */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.45, 0.2, 32]} />
          <meshStandardMaterial 
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Crown points */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh 
            key={i}
            position={[
              Math.cos(i * Math.PI * 2 / 5) * 0.3,
              0.2,
              Math.sin(i * Math.PI * 2 / 5) * 0.3
            ]}
          >
            <coneGeometry args={[0.08, 0.3, 8]} />
            <meshStandardMaterial 
              color="#FFD700"
              metalness={0.8}
              roughness={0.2}
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Head - African features */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <AfricanSkinMaterial tone="#8B4513" knowledgeLevel={knowledgeLevel} />
      </mesh>

      {/* Hair - Elaborate African style */}
      <group position={[0, 2, 0]}>
        {/* Base hair */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a"
            roughness={1}
            metalness={0}
          />
        </mesh>

        {/* Decorative braids */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={i}
            position={[
              Math.cos(i * Math.PI / 4) * 0.3,
              -0.2,
              Math.sin(i * Math.PI / 4) * 0.3
            ]}
          >
            <torusGeometry args={[0.1, 0.03, 8, 16]} />
            <meshStandardMaterial 
              color="#1a1a1a"
              roughness={1}
              metalness={0}
            />
          </mesh>
        ))}
      </group>

      {/* Body - Royal dress */}
      <group position={[0, 0.9, 0]}>
        {/* Upper body */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.8, 32]} />
          <KenteClothMaterial color="#800020" />
        </mesh>

        {/* Lower body - wider dress */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.45, 0.6, 0.8, 32]} />
          <KenteClothMaterial color="#800020" />
        </mesh>
      </group>

      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
        <meshStandardMaterial 
          color="#2a1810"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
} 