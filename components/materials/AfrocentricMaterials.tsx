'use client';

import React, { useMemo, useState } from 'react';
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

// Kente cloth material with PBR properties
export function KenteClothMaterial({ color = '#800020', ...props }) {
  // Create procedural textures if actual textures aren't available
  const baseTexture = useMemo(() => createAdinkraTexture('adinkrahene', '#000000', color), [color]);
  const normalTexture = useMemo(() => {
    const texture = createAdinkraTexture('adinkrahene', '#888888', '#444444');
    return texture;
  }, []);
  
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
export function AfricanWoodMaterial({ color = '#8B4513', ...props }) {
  // Create procedural textures if actual textures aren't available
  const baseTexture = useMemo(() => {
    const texture = createAdinkraTexture('sankofa', '#3D2314', color);
    return texture;
  }, [color]);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color={color}
      roughness={0.7}
      metalness={0.1}
      envMapIntensity={1.0}
      {...props}
    />
  );
}

// Knowledge material with glowing properties
export function KnowledgeMaterial({ emissiveIntensity = 0.5, ...props }) {
  // Create procedural texture with knowledge symbol
  const baseTexture = useMemo(() => createAdinkraTexture('nea-onnim', '#FFD700', '#FFFFFF'), []);
  
  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color="#FFD700"
      emissive="#FFD700"
      emissiveIntensity={emissiveIntensity}
      emissiveMap={baseTexture}
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
  tone = '#8B5A2B', 
  knowledgeLevel = 0,
  ...props 
}) {
  // Create base skin texture with high resolution
  const baseTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096; // 4K resolution for detail
    canvas.height = 4096;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    
    // Create realistic skin texture pattern
    ctx.fillStyle = tone;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle skin detail variations
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2 + 0.5;
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, [tone]);

  // Calculate enhanced properties based on knowledge level
  const enhancedTone = useMemo(() => {
    if (knowledgeLevel <= 0) return tone;
    const baseColor = new THREE.Color(tone);
    const enlightenedColor = new THREE.Color('#D4AF37');
    return baseColor.lerp(enlightenedColor, knowledgeLevel).getStyle();
  }, [tone, knowledgeLevel]);

  // Advanced subsurface properties
  const subsurfaceProps = useMemo(() => {
    const baseTransmission = 0.3; // Increased for more realistic skin
    const baseThickness = 0.4;
    const baseIor = 1.4;
    
    return {
      transmission: baseTransmission + (knowledgeLevel * 0.2),
      thickness: baseThickness - (knowledgeLevel * 0.2),
      ior: baseIor + (knowledgeLevel * 0.3),
      transmissionSampler: true,
      backside: true,
      clearcoat: 0.1 + (knowledgeLevel * 0.4),
      clearcoatRoughness: 0.4 - (knowledgeLevel * 0.2),
      attenuationDistance: 0.5 - (knowledgeLevel * 0.2),
      attenuationColor: new THREE.Color(enhancedTone).multiplyScalar(1.2),
      anisotropy: 0.1 + (knowledgeLevel * 0.2),
      roughness: Math.max(0.2, 0.6 - (knowledgeLevel * 0.4)),
      metalness: Math.min(0.4, knowledgeLevel * 0.4),
      envMapIntensity: 1.0 + knowledgeLevel
    };
  }, [knowledgeLevel, enhancedTone]);

  return (
    <meshPhysicalMaterial
      map={baseTexture}
      color={enhancedTone}
      {...subsurfaceProps}
      {...props}
    />
  );
}

// Knowledge transformation material with dynamic properties
export function KnowledgeTransformationMaterial({ 
  progress = 0, // 0 to 1 - represents transformation progress
  intensity = 1.0,
  ...props 
}) {
  // Create dynamic Adinkra knowledge symbol texture
  const symbolTexture = useMemo(() => {
    // Use different symbols based on transformation stage
    const symbol = progress < 0.3 ? 'sankofa' : 
                  progress < 0.7 ? 'nea-onnim' : 'adinkrahene';
                  
    // Colors evolve with transformation progress
    const bgColor = new THREE.Color(0x331800).lerp(new THREE.Color(0xFFD700), progress).getStyle();
    const fgColor = new THREE.Color(0xFFD700).lerp(new THREE.Color(0xFFFFFF), progress).getStyle();
    
    return createAdinkraTexture(symbol, fgColor, bgColor, 2048); // Higher resolution texture
  }, [progress]);
  
  // Dynamic emissive properties based on progress
  const emissiveIntensity = useMemo(() => {
    // Pulses during transformation with increasing baseline
    const baseline = 0.5 + (progress * 1.5);
    return baseline * intensity;
  }, [progress, intensity]);

  return (
    <meshPhysicalMaterial
      map={symbolTexture}
      emissive="#FFD700"
      emissiveMap={symbolTexture}
      emissiveIntensity={emissiveIntensity}
      roughness={0.2 - (progress * 0.15)} // Gets smoother
      metalness={0.2 + (progress * 0.7)} // Gets more metallic
      envMapIntensity={2.0 + progress}
      clearcoat={0.8 + (progress * 0.2)}
      clearcoatRoughness={0.1 * (1 - progress)} // Gets clearer
      transmission={progress * 0.3} // Becomes more translucent
      ior={1.5 + (progress * 0.5)} // Increases refraction
      {...props}
    />
  );
}

// Enhanced crown/queen material for final transformation
export function QueenCrownMaterial({ 
  glowIntensity = 1.0, 
  knowledgePower = 1.0, // How much knowledge power is being channeled 
  ...props 
}) {
  const crownTexture = useMemo(() => {
    return createAdinkraTexture('adinkrahene', '#FFFFFF', '#D4AF37', 4096); // Higher resolution
  }, []);
  
  // Subtle animation of emissive properties
  const [pulsePhase, setPulsePhase] = useState(0);
  
  useFrame((_, delta) => {
    setPulsePhase((prev) => (prev + delta * 0.5) % (Math.PI * 2));
  });
  
  // Calculate pulsing emission
  const emission = useMemo(() => {
    const baseIntensity = 1.0 + knowledgePower;
    // Subtle pulsing effect
    const pulse = 0.2 * Math.sin(pulsePhase) * knowledgePower;
    return baseIntensity + pulse;
  }, [pulsePhase, knowledgePower]);

  return (
    <meshPhysicalMaterial
      color="#D4AF37" // Royal gold
      map={crownTexture}
      emissive="#FFD700"
      emissiveMap={crownTexture}
      emissiveIntensity={emission * glowIntensity}
      roughness={0.05}
      metalness={0.9}
      envMapIntensity={3.0}
      clearcoat={1.0}
      clearcoatRoughness={0.03}
      ior={2.0}
      {...props}
    />
  );
} 