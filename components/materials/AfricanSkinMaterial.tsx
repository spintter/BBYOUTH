'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

interface AfricanSkinMaterialProps {
  melaninLevel?: number; // 0.0 to 1.0, controls skin tone darkness
  roughness?: number;
  subsurfaceIntensity?: number;
  emissiveIntensity?: number;
  emissiveColor?: string;
  baseTexturePath?: string;
  normalTexturePath?: string;
  roughnessTexturePath?: string;
  aoTexturePath?: string;
}

/**
 * Enhanced PBR material for realistic African skin tones
 * 
 * This material uses physically-based rendering techniques to create
 * realistic skin with subsurface scattering effects, melanin-based
 * coloration, and proper light interaction.
 */
export function AfricanSkinMaterial({
  melaninLevel = 0.8,
  roughness = 0.7,
  subsurfaceIntensity = 0.5,
  emissiveIntensity = 0,
  emissiveColor = '#FFD700',
  baseTexturePath,
  normalTexturePath,
  roughnessTexturePath,
  aoTexturePath
}: AfricanSkinMaterialProps) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { gl } = useThree();
  
  // Load textures if paths are provided
  const textures = {
    baseTexture: baseTexturePath ? useTexture(baseTexturePath) : null,
    normalMap: normalTexturePath ? useTexture(normalTexturePath) : null,
    roughnessMap: roughnessTexturePath ? useTexture(roughnessTexturePath) : null,
    aoMap: aoTexturePath ? useTexture(aoTexturePath) : null
  };
  
  // Generate procedural skin texture if no base texture is provided
  const proceduralTexture = useRef<THREE.CanvasTexture | null>(null);
  
  useEffect(() => {
    if (!baseTexturePath && !proceduralTexture.current) {
      // Create procedural skin texture
      const size = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Base skin tone based on melanin level
        // Convert melanin level to RGB color
        // Higher melanin = darker, warmer tones
        const r = Math.floor(255 * (1 - melaninLevel * 0.7));
        const g = Math.floor(255 * (1 - melaninLevel * 0.8));
        const b = Math.floor(255 * (1 - melaninLevel * 0.9));
        
        // Fill with base color
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.fillRect(0, 0, size, size);
        
        // Add subtle variation to simulate skin texture
        for (let i = 0; i < 5000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 2 + 0.5;
          
          // Random color variation
          const colorShift = Math.random() * 20 - 10;
          const rShift = Math.min(255, Math.max(0, r + colorShift));
          const gShift = Math.min(255, Math.max(0, g + colorShift));
          const bShift = Math.min(255, Math.max(0, b + colorShift));
          
          context.fillStyle = `rgb(${rShift}, ${gShift}, ${bShift})`;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
        
        // Add pore details
        for (let i = 0; i < 8000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 0.8 + 0.2;
          
          context.fillStyle = `rgba(0, 0, 0, 0.1)`;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
        
        // Create texture
        proceduralTexture.current = new THREE.CanvasTexture(canvas);
        proceduralTexture.current.wrapS = THREE.RepeatWrapping;
        proceduralTexture.current.wrapT = THREE.RepeatWrapping;
        proceduralTexture.current.anisotropy = 4;
      }
    }
    
    // Cleanup
    return () => {
      if (proceduralTexture.current) {
        proceduralTexture.current.dispose();
      }
      
      // Dispose loaded textures
      Object.values(textures).forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, [baseTexturePath, melaninLevel, textures]);
  
  // Animate subtle skin tone variations
  useFrame((state) => {
    if (materialRef.current) {
      // Subtle pulsing of subsurface effect to simulate blood flow
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1;
      materialRef.current.transmission = 0.15 * subsurfaceIntensity * pulse;
      
      // Update emissive intensity if needed (for transformation effects)
      if (emissiveIntensity > 0) {
        materialRef.current.emissiveIntensity = 
          emissiveIntensity * (0.9 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      }
    }
  });
  
  // Custom shader modifications for subsurface scattering
  const onBeforeCompile = (shader: THREE.Shader) => {
    // Add custom uniforms
    shader.uniforms.melaninLevel = { value: melaninLevel };
    shader.uniforms.subsurfaceIntensity = { value: subsurfaceIntensity };
    
    // Add custom code to fragment shader
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `
      // Custom subsurface scattering effect based on melanin level
      vec3 subsurfaceColor = vec3(0.44, 0.22, 0.13) * melaninLevel;
      float sss = subsurfaceIntensity * (1.0 - roughnessFactor);
      
      // Mix subsurface effect with base color
      outgoingLight = mix(outgoingLight, outgoingLight * subsurfaceColor, sss * (1.0 - metalnessFactor));
      
      // Add subtle rim lighting effect
      float rim = 1.0 - max(dot(normal, viewDir), 0.0);
      rim = smoothstep(0.6, 1.0, rim);
      outgoingLight += rim * subsurfaceColor * 0.2;
      
      // Original output
      #include <output_fragment>
      `
    );
  };
  
  return (
    <meshPhysicalMaterial
      ref={materialRef}
      map={textures.baseTexture || proceduralTexture.current || undefined}
      normalMap={textures.normalMap}
      roughnessMap={textures.roughnessMap}
      aoMap={textures.aoMap}
      roughness={roughness}
      metalness={0.0}
      clearcoat={0.2}
      clearcoatRoughness={0.4}
      sheen={0.1}
      sheenRoughness={0.4}
      sheenColor={new THREE.Color('#8B4513')}
      transmission={0.15 * subsurfaceIntensity}
      thickness={0.5}
      ior={1.4}
      emissive={new THREE.Color(emissiveColor)}
      emissiveIntensity={emissiveIntensity}
      onBeforeCompile={onBeforeCompile}
      customProgramCacheKey={() => `african-skin-${melaninLevel.toFixed(2)}`}
    />
  );
} 