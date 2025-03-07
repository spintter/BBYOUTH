'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useDetectGPU, Detailed } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

// Configure loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/basis/');

// Texture cache to prevent memory leaks
const textureCache = new WeakMap<THREE.Texture, boolean>();

// Type definitions
interface ModelLoaderProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  lodDistances?: [number, number]; // [medium, low] distances
  onLoad?: () => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

interface LODConfig {
  high: string;
  medium: string;
  low: string;
}

// Helper to generate LOD paths
function generateLODPaths(basePath: string): LODConfig {
  const extension = basePath.split('.').pop();
  const baseName = basePath.substring(0, basePath.lastIndexOf('.'));
  
  return {
    high: basePath, // Original path for high quality
    medium: `${baseName}-medium.${extension}`,
    low: `${baseName}-low.${extension}`
  };
}

// Check if LOD files exist
async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function OptimizedModelLoader({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  lodDistances = [10, 20],
  onLoad,
  castShadow = true,
  receiveShadow = true
}: ModelLoaderProps) {
  const [lodLevel, setLodLevel] = useState<0 | 1 | 2>(0); // 0: high, 1: medium, 2: low
  const [lodPaths, setLodPaths] = useState<LODConfig | null>(null);
  const [useLOD, setUseLOD] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const gpuTier = useDetectGPU();
  
  // Determine if we should use LOD based on GPU tier
  useEffect(() => {
    const checkLODFiles = async () => {
      const paths = generateLODPaths(modelPath);
      
      // Check if medium and low LOD files exist
      const mediumExists = await checkFileExists(paths.medium);
      const lowExists = await checkFileExists(paths.low);
      
      // Only use LOD if both medium and low files exist
      setUseLOD(mediumExists && lowExists);
      setLodPaths(paths);
    };
    
    checkLODFiles();
  }, [modelPath]);
  
  // Load the model with the appropriate LOD level
  const { scene: highModel } = useGLTF(modelPath, true, false, (loader) => {
    // Apply Draco compression if available
    (loader as any).setDRACOLoader?.(dracoLoader);
    
    // Apply KTX2 textures if GPU tier is high enough
    if (gpuTier.tier > 1) {
      (loader as any).setKTX2Loader?.(ktx2Loader);
    }
  });
  
  // Load medium and low LOD models if available and needed
  const { scene: mediumModel } = useLOD && lodPaths ? 
    useGLTF(lodPaths.medium, true) : { scene: null };
    
  const { scene: lowModel } = useLOD && lodPaths ? 
    useGLTF(lodPaths.low, true) : { scene: null };
  
  // Apply shadows and optimizations to the model
  useEffect(() => {
    const applyOptimizations = (model: THREE.Group) => {
      model.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          // Apply shadows
          if (castShadow) node.castShadow = true;
          if (receiveShadow) node.receiveShadow = true;
          
          // Optimize geometry
          if (node.geometry) {
            node.geometry.computeBoundingBox();
            node.geometry.computeBoundingSphere();
          }
          
          // Optimize materials
          if (node.material) {
            // Handle both single and array materials
            const materials = Array.isArray(node.material) ? node.material : [node.material];
            
            materials.forEach(material => {
              // Apply anisotropic filtering to textures
              if ('map' in material && material.map) {
                // Get max anisotropy from renderer
                const renderer = THREE.WebGLRenderer ? new THREE.WebGLRenderer() : null;
                const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
                material.map.anisotropy = Math.min(16, maxAnisotropy);
                
                // Dispose temporary renderer
                if (renderer) renderer.dispose();
                
                // Cache texture to prevent memory leaks
                if (!textureCache.has(material.map)) {
                  textureCache.set(material.map, true);
                }
              }
              
              // Set reasonable defaults for PBR materials
              if (material instanceof THREE.MeshStandardMaterial) {
                material.envMapIntensity = 1.0;
                material.needsUpdate = true;
              }
            });
          }
        }
      });
    };
    
    // Apply optimizations to all LOD levels
    if (highModel) applyOptimizations(highModel);
    if (mediumModel) applyOptimizations(mediumModel);
    if (lowModel) applyOptimizations(lowModel);
    
    // Notify when loaded
    if (onLoad) onLoad();
    
  }, [highModel, mediumModel, lowModel, castShadow, receiveShadow, onLoad]);
  
  // Update LOD level based on camera distance
  useFrame(() => {
    if (!modelRef.current || !useLOD) return;
    
    const modelPosition = new THREE.Vector3(position[0], position[1], position[2]);
    const distance = camera.position.distanceTo(modelPosition);
    
    // Update LOD level based on distance
    if (distance < lodDistances[0]) {
      setLodLevel(0); // High
    } else if (distance < lodDistances[1]) {
      setLodLevel(1); // Medium
    } else {
      setLodLevel(2); // Low
    }
  });
  
  // Apply scale correctly whether it's a number or array
  const scaleValue = Array.isArray(scale) 
    ? scale 
    : [scale, scale, scale];
  
  // If LOD is available, use the Detailed component
  if (useLOD && mediumModel && lowModel) {
    return (
      <group 
        ref={modelRef}
        position={position}
        rotation={[rotation[0], rotation[1], rotation[2]]}
        scale={scaleValue as [number, number, number]}
      >
        <Detailed distances={[lodDistances[0], lodDistances[1]]}>
          <primitive object={highModel.clone()} />
          <primitive object={mediumModel.clone()} />
          <primitive object={lowModel.clone()} />
        </Detailed>
      </group>
    );
  }
  
  // Fallback to just the high-quality model if LOD is not available
  return (
    <primitive 
      ref={modelRef}
      object={highModel.clone()} 
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={scaleValue as [number, number, number]}
    />
  );
}

// Preload common models
export function preloadModels() {
  useGLTF.preload('/models/african-girl.glb');
  useGLTF.preload('/models/african-queen.glb');
} 