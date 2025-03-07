'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Create a canvas texture with Adinkra symbols
const createAdinkraTexture = (
  symbol: string,
  foreground: string = '#000000',
  background: string = '#FFFFFF',
  size: number = 512
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);
  
  // Fill background
  context.fillStyle = background;
  context.fillRect(0, 0, size, size);
  
  // Draw symbol pattern
  context.fillStyle = foreground;
  context.strokeStyle = foreground;
  context.lineWidth = size / 50;
  
  // Draw Adinkra symbols based on the selected pattern
  switch (symbol) {
    case 'sankofa':
      // Sankofa symbol (learn from the past)
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          context.save();
          context.translate(size * (x + 0.5) / 4, size * (y + 0.5) / 4);
          context.scale(size / 16, size / 16);
          
          // Draw Sankofa bird symbol
          context.beginPath();
          context.moveTo(-2, 0);
          context.bezierCurveTo(-2, 2, 0, 2, 0, 0);
          context.bezierCurveTo(0, -2, 2, -2, 2, 0);
          context.stroke();
          
          context.beginPath();
          context.arc(0, 0, 1, 0, Math.PI * 2);
          context.fill();
          
          context.restore();
        }
      }
      break;
      
    case 'nea-onnim':
      // Nea Onnim symbol (knowledge)
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          context.save();
          context.translate(size * (x + 0.5) / 4, size * (y + 0.5) / 4);
          context.scale(size / 16, size / 16);
          
          // Draw Nea Onnim symbol
          context.beginPath();
          context.moveTo(-3, -3);
          context.lineTo(3, -3);
          context.lineTo(3, 3);
          context.lineTo(-3, 3);
          context.closePath();
          context.stroke();
          
          context.beginPath();
          context.moveTo(0, -1.5);
          context.lineTo(1.5, 0);
          context.lineTo(0, 1.5);
          context.lineTo(-1.5, 0);
          context.closePath();
          context.fill();
          
          context.restore();
        }
      }
      break;
      
    case 'adinkrahene':
      // Adinkrahene symbol (leadership)
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          context.save();
          context.translate(size * (x + 0.5) / 4, size * (y + 0.5) / 4);
          context.scale(size / 16, size / 16);
          
          // Draw concentric circles
          context.beginPath();
          context.arc(0, 0, 3, 0, Math.PI * 2);
          context.stroke();
          
          context.beginPath();
          context.arc(0, 0, 2, 0, Math.PI * 2);
          context.stroke();
          
          context.beginPath();
          context.arc(0, 0, 1, 0, Math.PI * 2);
          context.fill();
          
          context.restore();
        }
      }
      break;
      
    default:
      // Default pattern
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          if ((x + y) % 2 === 0) {
            context.fillRect(
              size * x / 8,
              size * y / 8,
              size / 8,
              size / 8
            );
          }
        }
      }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  return texture;
};

interface MaterialPropsBase {
  [key: string]: any;
}

interface KenteClothMaterialProps extends MaterialPropsBase {
  color?: string;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
}

interface AfricanWoodMaterialProps extends MaterialPropsBase {
  color?: string;
  map?: THREE.Texture;
}

interface KnowledgeMaterialProps extends MaterialPropsBase {
  emissiveIntensity?: number;
  map?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

interface AfricanSkinMaterialProps extends MaterialPropsBase {
  baseColor?: string;
  subsurfaceColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  map?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

interface KnowledgeTransformationMaterialProps extends MaterialPropsBase {
  progress?: number;
  intensity?: number;
  map?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

interface QueenCrownMaterialProps extends MaterialPropsBase {
  glowIntensity?: number;
  knowledgePower?: number;
  map?: THREE.Texture;
  emissiveMap?: THREE.Texture;
}

interface AfrocentricMaterialProps extends MaterialPropsBase {
  color?: string;
  roughness?: number;
  envMapIntensity?: number;
}

// Kente cloth material with PBR properties
export function KenteClothMaterial({ color = '#800020', map, normalMap, ...props }: KenteClothMaterialProps) {
  // Create procedural textures if actual textures aren't available
  const baseTexture = useMemo(() => {
    if (map) return map;
    return createAdinkraTexture('adinkrahene', '#000000', color);
  }, [color, map]);
  
  const normalTexture = useMemo(() => {
    if (normalMap) return normalMap;
    const texture = createAdinkraTexture('adinkrahene', '#888888', '#444444');
    return texture;
  }, [normalMap]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      normalMap={normalTexture}
      color={color}
      roughness={0.8}
      metalness={0.1}
      envMapIntensity={1.0}
      clearcoat={0.2}
      clearcoatRoughness={0.4}
      {...props}
    />
  );
}

// Wood material with African patterns
export function AfricanWoodMaterial({ color = '#8B4513', map, ...props }: AfricanWoodMaterialProps) {
  const baseTexture = useMemo(() => {
    if (map) return map;
    const texture = createAdinkraTexture('sankofa', '#3D2314', color, 2048); // Reduced from 8K to 2K
    texture.anisotropy = 8; // Reduced anisotropy
    texture.encoding = THREE.sRGBEncoding;
    texture.generateMipmaps = true;
    return texture;
  }, [color, map]);

  // Create normal map for enhanced detail
  const normalTexture = useMemo(() => {
    const texture = createAdinkraTexture('sankofa', '#808080', '#404040', 1024);
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Create roughness map for surface variation
  const roughnessTexture = useMemo(() => {
    const texture = createAdinkraTexture('sankofa', '#FFFFFF', '#000000', 1024);
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Create AO map for enhanced shadows
  const aoTexture = useMemo(() => {
    const texture = createAdinkraTexture('sankofa', '#000000', '#FFFFFF', 1024);
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      baseTexture.dispose();
      normalTexture.dispose();
      roughnessTexture.dispose();
      aoTexture.dispose();
    };
  }, [baseTexture, normalTexture, roughnessTexture, aoTexture]);

  return (
    <meshPhysicalMaterial
      map={baseTexture}
      normalMap={normalTexture}
      roughnessMap={roughnessTexture}
      aoMap={aoTexture}
      color={color}
      roughness={0.35}
      metalness={0.2}
      envMapIntensity={2.5}
      clearcoat={1.0}
      clearcoatRoughness={0.2}
      ior={1.5}
      transmission={0.15}
      thickness={2.0}
      attenuationDistance={2.0}
      attenuationColor={new THREE.Color('#3D2314')}
      reflectivity={1}
      sheen={0.35}
      sheenRoughness={0.4}
      sheenColor={new THREE.Color('#A67B5B')}
      iridescence={0.3}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
      {...props}
    />
  );
}

// Knowledge material with glowing properties
export function KnowledgeMaterial({ emissiveIntensity = 0.5, map, emissiveMap, ...props }: KnowledgeMaterialProps) {
  // Create procedural texture with knowledge symbol
  const baseTexture = useMemo(() => {
    if (map) return map;
    return createAdinkraTexture('nea-onnim', '#FFD700', '#FFFFFF');
  }, [map]);
  
  const emissiveTexture = useMemo(() => {
    if (emissiveMap) return emissiveMap;
    return baseTexture;
  }, [baseTexture, emissiveMap]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color="#FFD700"
      emissive="#FFD700"
      emissiveIntensity={emissiveIntensity}
      emissiveMap={emissiveTexture}
      roughness={0.2}
      metalness={0.9}
      envMapIntensity={2.0}
      clearcoat={0.8}
      clearcoatRoughness={0.1}
      {...props}
    />
  );
}

// Enhanced skin material with advanced subsurface scattering and transformation capabilities
export function AfricanSkinMaterial({ 
  baseColor = '#5C4033',
  subsurfaceColor = '#A52A2A',
  emissiveColor = '#000000',
  emissiveIntensity = 0,
  map,
  emissiveMap,
  ...props 
}: AfricanSkinMaterialProps) {
  // Create procedural texture for skin
  const baseTexture = useMemo(() => {
    if (map) return map;
    
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d');
    if (!context) return new THREE.CanvasTexture(canvas);
    
    // Fill background with base skin tone
    context.fillStyle = baseColor;
    context.fillRect(0, 0, size, size);
    
    // Add subtle variation to simulate skin texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 2 + 0.5;
      
      // Random color variation
      const colorShift = Math.random() * 20 - 10;
      const r = parseInt(baseColor.substring(1, 3), 16) + colorShift;
      const g = parseInt(baseColor.substring(3, 5), 16) + colorShift;
      const b = parseInt(baseColor.substring(5, 7), 16) + colorShift;
      
      context.fillStyle = `rgb(${Math.min(255, Math.max(0, r))}, ${Math.min(255, Math.max(0, g))}, ${Math.min(255, Math.max(0, b))})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }, [baseColor, map]);
  
  // Dynamic emissive properties for transformation effects
  const [time, setTime] = useState(0);
  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });
  
  // Calculate emissive intensity with subtle pulsing
  const currentEmissiveIntensity = useMemo(() => {
    return emissiveIntensity + Math.sin(time * 2) * 0.1 * emissiveIntensity;
  }, [time, emissiveIntensity]);
  
  const emissiveTexture = useMemo(() => {
    if (emissiveMap) return emissiveMap;
    return baseTexture;
  }, [baseTexture, emissiveMap]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color={baseColor}
      emissive={emissiveColor}
      emissiveIntensity={currentEmissiveIntensity}
      emissiveMap={emissiveTexture}
      roughness={0.7}
      metalness={0.1}
      clearcoat={0.3}
      clearcoatRoughness={0.5}
      ior={1.4}
      transmission={0.05}
      transparent={emissiveIntensity > 0}
      {...props}
    />
  );
}

// Knowledge transformation material with dynamic properties
export function KnowledgeTransformationMaterial({ 
  progress = 0,
  intensity = 1.0,
  map,
  emissiveMap,
  ...props 
}: KnowledgeTransformationMaterialProps) {
  // Create base knowledge texture
  const baseTexture = useMemo(() => {
    if (map) return map;
    return createAdinkraTexture('nea-onnim', '#FFD700', '#FFFFFF');
  }, [map]);
  
  const emissiveTexture = useMemo(() => {
    if (emissiveMap) return emissiveMap;
    return baseTexture;
  }, [baseTexture, emissiveMap]);
  
  // Animation state
  const [time, setTime] = useState(0);
  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });
  
  // Calculate dynamic properties based on progress
  const dynamicProps = useMemo(() => {
    // Color transitions from subtle to intense as progress increases
    const baseColor = new THREE.Color('#FFD700');
    const targetColor = new THREE.Color('#FFFFFF');
    const lerpedColor = baseColor.clone().lerp(targetColor, progress * 0.7);
    
    // Emissive intensity increases with progress
    const emissiveIntensity = 0.2 + progress * 1.8 * intensity;
    
    // Roughness decreases with progress (becomes smoother/more refined)
    const roughness = Math.max(0.05, 0.3 - progress * 0.25);
    
    // Metalness increases with progress (becomes more valuable/golden)
    const metalness = 0.3 + progress * 0.6;
    
    // Clearcoat increases for more polished look
    const clearcoat = 0.2 + progress * 0.8;
    
    return { 
      color: lerpedColor, 
      emissiveIntensity, 
      roughness, 
      metalness, 
      clearcoat 
    };
  }, [progress, intensity, time]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color={dynamicProps.color}
      emissive="#FFD700"
      emissiveIntensity={dynamicProps.emissiveIntensity + Math.sin(time * 4) * 0.1}
      emissiveMap={emissiveTexture}
      roughness={dynamicProps.roughness}
      metalness={dynamicProps.metalness}
      envMapIntensity={1.5 + progress}
      clearcoat={dynamicProps.clearcoat}
      clearcoatRoughness={0.2}
      transparent={true}
      opacity={0.8 + progress * 0.2}
      {...props}
    />
  );
}

// Enhanced crown/queen material for final transformation
export function QueenCrownMaterial({ 
  glowIntensity = 1.0,
  knowledgePower = 1.0,
  map,
  emissiveMap,
  ...props 
}: QueenCrownMaterialProps) {
  // Create crown texture with Adinkra symbols of leadership and wisdom
  const baseTexture = useMemo(() => {
    if (map) return map;
    return createAdinkraTexture('adinkrahene', '#FFD700', '#8B4513');
  }, [map]);
  
  const emissiveTexture = useMemo(() => {
    if (emissiveMap) return emissiveMap;
    return baseTexture;
  }, [baseTexture, emissiveMap]);
  
  // Animation state for dynamic effects
  const [time, setTime] = useState(0);
  useFrame((state) => {
    setTime(state.clock.getElapsedTime());
  });
  
  // Dynamic glow with subtle pulsing
  const currentGlowIntensity = useMemo(() => {
    const baseGlow = glowIntensity * knowledgePower;
    const pulseFactor = Math.sin(time * 2) * 0.15 + 1;
    return baseGlow * pulseFactor;
  }, [time, glowIntensity, knowledgePower]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color="#FFD700"
      emissive="#FFD700"
      emissiveIntensity={currentGlowIntensity}
      emissiveMap={emissiveTexture}
      roughness={0.15}
      metalness={0.9}
      envMapIntensity={2.0 * knowledgePower}
      clearcoat={0.9}
      clearcoatRoughness={0.1}
      reflectivity={0.9}
      ior={1.8}
      transmission={0.1}
      transparent={true}
      opacity={0.95}
      {...props}
    />
  );
}

// Afrocentric material with cultural patterns and optimized rendering
export function AfrocentricMaterial({ 
  color = '#8B4513',
  roughness = 0.8,
  envMapIntensity = 1.2,
  ...props 
}: AfrocentricMaterialProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      envMapIntensity={envMapIntensity}
      {...props}
    />
  );
}