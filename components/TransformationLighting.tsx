'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture, Environment, BakeShadows, AccumulativeShadows, RandomizedLight, SpotLight } from '@react-three/drei';

interface TransformationLightingProps {
  active?: boolean;
  intensity?: number;
  color?: string;
  position?: [number, number, number];
  targetPosition?: [number, number, number];
  envMapPath?: string;
  projectionTexturePath?: string;
  qualitySettings?: {
    shadowMapSize?: number;
    samples?: number;
    aoIntensity?: number;
    envMapIntensity?: number;
  };
}

/**
 * Enhanced lighting setup for dramatic transformation effects
 * 
 * This component provides a sophisticated lighting environment with:
 * - HDR environment mapping
 * - Dramatic spotlights with texture projection
 * - Accumulative shadows for realistic soft shadows
 * - Dynamic lighting animation during transformations
 */
export function TransformationLighting({
  active = false,
  intensity = 1.0,
  color = '#FFD700',
  position = [3, 5, 2],
  targetPosition = [0, 0, 0],
  envMapPath = '/hdri/african_sunset.hdr',
  projectionTexturePath = '/textures/adinkra-projection.ktx2',
  qualitySettings = {
    shadowMapSize: 2048,
    samples: 16,
    aoIntensity: 0.5,
    envMapIntensity: 1.2
  }
}: TransformationLightingProps) {
  // References to lights for animation
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // Load projection texture if provided
  const projectionMap = projectionTexturePath ? useTexture(projectionTexturePath) : null;
  
  // Set up initial light properties
  useEffect(() => {
    if (spotLightRef.current) {
      // Configure spotlight
      spotLightRef.current.shadow.bias = -0.001;
      spotLightRef.current.shadow.normalBias = 0.1;
      spotLightRef.current.shadow.radius = 4;
      
      // Set target position
      spotLightRef.current.target.position.set(
        targetPosition[0], 
        targetPosition[1], 
        targetPosition[2]
      );
      
      // Apply projection texture if available
      if (projectionMap) {
        spotLightRef.current.map = projectionMap;
      }
    }
    
    // Clean up
    return () => {
      if (projectionMap) {
        projectionMap.dispose();
      }
    };
  }, [projectionMap, targetPosition]);
  
  // Animate lights during transformation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (spotLightRef.current) {
      if (active) {
        // Dramatic pulsing during transformation
        spotLightRef.current.intensity = (Math.sin(t * 2) * 0.5 + 1.5) * intensity;
        spotLightRef.current.angle = THREE.MathUtils.lerp(
          spotLightRef.current.angle,
          0.3 + Math.sin(t) * 0.1,
          0.05
        );
        
        // Animate color
        const hue = (Math.sin(t * 0.5) * 0.1 + 0.55);
        spotLightRef.current.color.setHSL(hue, 0.8, 0.6);
      } else {
        // Subtle ambient movement when inactive
        spotLightRef.current.intensity = 0.2 * intensity;
        spotLightRef.current.angle = 0.5;
        spotLightRef.current.color.set(color);
      }
    }
    
    if (rimLightRef.current) {
      if (active) {
        // Increase rim light during transformation
        rimLightRef.current.intensity = (Math.sin(t * 1.5) * 0.3 + 1.2) * intensity;
      } else {
        // Subtle rim light when inactive
        rimLightRef.current.intensity = 0.3 * intensity;
      }
    }
    
    if (ambientLightRef.current) {
      if (active) {
        // Reduce ambient light during transformation for more dramatic shadows
        ambientLightRef.current.intensity = 0.1 * intensity;
      } else {
        // Normal ambient light when inactive
        ambientLightRef.current.intensity = 0.2 * intensity;
      }
    }
  });
  
  return (
    <>
      {/* Environment map for realistic reflections */}
      <Environment
        files={envMapPath}
        background={false}
        resolution={256}
        ground={{
          height: 10,
          radius: 40,
          scale: 20
        }}
      />
      
      {/* Ambient light for base illumination */}
      <ambientLight 
        ref={ambientLightRef}
        intensity={0.2 * intensity}
        color="#FFFFFF"
      />
      
      {/* Main spotlight for dramatic lighting */}
      <SpotLight
        ref={spotLightRef}
        position={position}
        angle={0.5}
        penumbra={1}
        distance={50}
        attenuation={5}
        anglePower={5}
        intensity={0.2 * intensity}
        color={color}
        castShadow
        shadow-mapSize={[qualitySettings.shadowMapSize, qualitySettings.shadowMapSize]}
        shadow-bias={-0.001}
      />
      
      {/* Rim light for edge highlighting */}
      <directionalLight
        ref={rimLightRef}
        position={[5, 3, 5]}
        intensity={0.3 * intensity}
        color={color}
      />
      
      {/* Accumulative shadows for realistic soft shadows */}
      <AccumulativeShadows
        temporal
        frames={30}
        alphaTest={0.85}
        opacity={0.8}
        scale={10}
        position={[0, -0.01, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          ambient={0.5}
          intensity={1}
          position={position}
          bias={0.001}
        />
      </AccumulativeShadows>
      
      {/* Bake shadows for performance */}
      <BakeShadows />
    </>
  );
} 