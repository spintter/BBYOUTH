'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useGLTF, 
  Environment, 
  ContactShadows, 
  useTexture,
  OrbitControls, 
  Sparkles,
  useAnimations,
  MeshTransmissionMaterial,
  Trail,
  PerformanceMonitor,
  Detailed,
  useDetectGPU,
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { KenteClothMaterial, AfricanWoodMaterial, KnowledgeMaterial, AfricanSkinMaterial, AfrocentricMaterial } from './materials/AfrocentricMaterials';
import { suspend } from 'suspend-react';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { UseDraco } from '@react-three/drei/core/useGLTF';

// Constants for optimization
const CHESS_CONFIG = {
  boardSize: 8,
  squareSize: 0.5,
  lightSquareColor: '#D4B996',
  darkSquareColor: '#3D2314',
  boardElevation: 0.05,
  animationDuration: 5,
  rotationSpeed: 0.05,
  webGPUSettings: {
    sampleCount: 4,
    limits: {
      maxStorageBufferBindingSize: 512 * 1024 * 1024,
      maxBufferSize: 512 * 1024 * 1024,
      maxVertexBuffers: 8,
      maxVertexAttributes: 16,
      maxBindGroups: 4,
    }
  }
};

// Type definitions for GLTF models
type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
};

// Type guard for checking if an object is a mesh
function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return 'isMesh' in object && (object as any).isMesh === true;
}

// Type guard for checking if material is a standard material
function isStandardMaterial(material: THREE.Material | THREE.Material[]): material is THREE.MeshStandardMaterial {
  return !Array.isArray(material) && 'map' in material;
}

// Type guard for checking if material has maps
function hasMaps(material: THREE.Material): material is THREE.MeshStandardMaterial {
  return 'map' in material || 'normalMap' in material || 'roughnessMap' in material;
}

// Configure loaders for optimal performance
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/basis/');

// Enhanced WebGPU detection with capabilities check
const checkWebGPU = async () => {
  if (typeof navigator === 'undefined') return false;
  
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter({
        powerPreference: 'high-performance'
      });
      
      if (!adapter) return false;
      
      const device = await adapter.requestDevice({
        requiredFeatures: ['texture-compression-bc'],
        requiredLimits: CHESS_CONFIG.webGPUSettings.limits
      });
      
      const supportedFeatures = adapter.features;
      const hasRayTracing = supportedFeatures.has('ray-tracing');
      const hasSampledTexture3D = supportedFeatures.has('texture-3d');
      const hasFloat32 = supportedFeatures.has('float32');
      
      return { 
        supported: true, 
        rayTracing: hasRayTracing,
        device,
        features: {
          sampledTexture3D: hasSampledTexture3D,
          float32: hasFloat32
        }
      };
    } catch (e) {
      console.warn('WebGPU supported but failed to initialize:', e);
      return false;
    }
  }
  return false;
};

// Precomputed values for optimization
const precomputedGeometries = {
  square: new THREE.PlaneGeometry(CHESS_CONFIG.squareSize, CHESS_CONFIG.squareSize),
  pawn: new THREE.CapsuleGeometry(0.03, 0.08, 4, 8),
  base: new THREE.CylinderGeometry(0.04, 0.05, 0.02, 12),
  crown: new THREE.ConeGeometry(0.06, 0.08, 8, 1, true)
};

// Enhanced device capabilities hook
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    webGPU: false,
    rayTracing: false,
    highPerformance: false,
    adaptiveQuality: 'medium' as 'low' | 'medium' | 'high',
    gpuTier: 0,
    supportedFeatures: {} as any
  });

  useEffect(() => {
    const detectGPUTier = async () => {
      const cpuCores = navigator.hardwareConcurrency || 4;
      const isHighPerformance = cpuCores > 4;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      let quality: 'low' | 'medium' | 'high' = 'medium';
      if (isMobile || cpuCores <= 2) quality = 'low';
      if (cpuCores >= 8 && !isMobile) quality = 'high';
      
      const webGPUSupport = await checkWebGPU();
      const gpuTier = webGPUSupport && webGPUSupport.rayTracing ? 2 : 
                      webGPUSupport ? 1 : 0;
      
      setCapabilities({
        webGPU: webGPUSupport !== false && (webGPUSupport as any).supported === true,
        rayTracing: webGPUSupport !== false && (webGPUSupport as any).rayTracing === true,
        highPerformance: isHighPerformance,
        adaptiveQuality: quality,
        gpuTier,
        supportedFeatures: webGPUSupport !== false ? (webGPUSupport as any).features : {}
      });
    };
    
    detectGPUTier();
  }, []);
  
  return capabilities;
};

// Chess square with optimized PBR materials
interface ChessSquareProps {
  position: [number, number, number];
  isDark: boolean;
  qualitySettings: {
    textureSize: number;
    geometryDetail: number;
  };
}

function ChessSquare({ position, isDark, qualitySettings }: ChessSquareProps) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={precomputedGeometries.square} />
      <AfricanWoodMaterial 
        color={isDark ? CHESS_CONFIG.darkSquareColor : CHESS_CONFIG.lightSquareColor} 
      />
    </mesh>
  );
}

// Enhanced GLTF loader with fallbacks and optimizations
function useOptimizedGLTF(path: string, draco = true, ktx2 = true): GLTFResult {
  const result = useGLTF(path, draco ? '/draco/' : undefined) as GLTFResult;
  
  useEffect(() => {
    // Apply KTX2 textures if supported
    if (ktx2 && result.scene) {
      const ktx2Path = path.replace('.glb', '.ktx2');
      // Check if KTX2 version exists
      fetch(ktx2Path, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            // Apply KTX2 textures
            result.scene.traverse((node: THREE.Object3D) => {
              if (isMesh(node) && node.material) {
                if (isStandardMaterial(node.material)) {
                  const material = node.material;
                  
                  if (material.map) {
                    const texture = material.map;
                    const ktx2TexturePath = texture.image?.src.replace(/\.(png|jpg|jpeg)$/, '.ktx2') || '';
                    ktx2Loader.load(ktx2TexturePath, (ktx2Texture) => {
                      material.map = ktx2Texture;
                      material.needsUpdate = true;
                    }, undefined, () => {
                      // Fallback is already in place (original texture)
                      console.log('KTX2 texture not available, using fallback');
                    });
                  }
                }
              }
            });
          }
        })
        .catch(() => {
          // Fallback to standard textures (already loaded)
        });
    }
    
    // Apply optimizations to the scene
    if (result.scene) {
      result.scene.traverse((node: THREE.Object3D) => {
        if (isMesh(node)) {
          // Optimize shadows
          node.castShadow = true;
          node.receiveShadow = true;
          
          // Optimize geometry
          if (node.geometry) {
            node.geometry.computeBoundingBox();
            node.geometry.computeBoundingSphere();
          }
          
          // Optimize materials
          if (node.material && isStandardMaterial(node.material)) {
            if (node.material.map) {
              node.material.map.anisotropy = 4;
              node.material.map.needsUpdate = true;
            }
          }
        }
      });
    }
  }, [result, path, ktx2]);
  
  return result;
}

// Optimized African Girl model with transformation capabilities
interface AfricanGirlPawnProps {
  position: [number, number, number];
  transformToQueen: boolean;
  onTransformationComplete: () => void;
  qualitySettings: {
    geometryDetail: number;
  };
}

function AfricanGirlPawn({ 
  position, 
  transformToQueen, 
  onTransformationComplete,
  qualitySettings 
}: AfricanGirlPawnProps) {
  const group = useRef<THREE.Group>(null);
  const [transformStage, setTransformStage] = useState(0);
  const clock = new THREE.Clock();
  
  // GPU capabilities detection for adaptive quality
  const gpu = useDetectGPU();
  const isHighEnd = useMemo(() => gpu.tier > 2, [gpu.tier]);
  const isMidTier = useMemo(() => gpu.tier > 1 && gpu.tier <= 2, [gpu.tier]);
  
  // Load models with LOD based on GPU capabilities
  const girlModelHigh = useOptimizedGLTF('/models/african-girl.glb', true, isHighEnd);
  const queenModelHigh = useOptimizedGLTF('/models/african-queen.glb', true, isHighEnd);
  
  // Track memory usage
  const [memoryUsage, setMemoryUsage] = useState({
    geometries: 0,
    textures: 0
  });
  
  // Calculate and monitor memory usage
  useEffect(() => {
    const calculateMemory = () => {
      let geometryMemory = 0;
      let textureMemory = 0;
      
      // Calculate for girl model
      girlModelHigh.scene.traverse((node: THREE.Object3D) => {
        if (isMesh(node) && node.geometry) {
          const attributes = node.geometry.attributes;
          // Estimate geometry memory
          if (attributes.position) {
            geometryMemory += attributes.position.array.byteLength;
          }
          if (attributes.normal) {
            geometryMemory += attributes.normal.array.byteLength;
          }
          if (attributes.uv) {
            geometryMemory += attributes.uv.array.byteLength;
          }
          
          // Estimate texture memory
          if (node.material && isStandardMaterial(node.material)) {
            if (node.material.map) {
              const width = node.material.map.image?.width || 1024;
              const height = node.material.map.image?.height || 1024;
              // Estimate 4 bytes per pixel (RGBA)
              textureMemory += width * height * 4;
            }
          }
        }
      });
      
      // Calculate for queen model
      queenModelHigh.scene.traverse((node: THREE.Object3D) => {
        if (isMesh(node) && node.geometry) {
          const attributes = node.geometry.attributes;
          if (attributes.position) {
            geometryMemory += attributes.position.array.byteLength;
          }
          if (attributes.normal) {
            geometryMemory += attributes.normal.array.byteLength;
          }
          if (attributes.uv) {
            geometryMemory += attributes.uv.array.byteLength;
          }
          
          if (node.material && isStandardMaterial(node.material)) {
            if (node.material.map) {
              const width = node.material.map.image?.width || 1024;
              const height = node.material.map.image?.height || 1024;
              textureMemory += width * height * 4;
            }
          }
        }
      });
      
      setMemoryUsage({
        geometries: geometryMemory / (1024 * 1024), // Convert to MB
        textures: textureMemory / (1024 * 1024) // Convert to MB
      });
    };
    
    // Calculate after models are loaded
    calculateMemory();
    
    // Log memory usage in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Memory usage:', memoryUsage);
    }
  }, [girlModelHigh, queenModelHigh]);
  
  // Handle transformation stages
  useEffect(() => {
    if (transformToQueen) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setTransformStage(3);
          onTransformationComplete();
        }
      });
      
      timeline
        .to(group.current?.position || {}, {
          y: position[1] + 0.5,
          duration: 1,
          ease: "power2.out",
          onStart: () => setTransformStage(1)
        })
        .to(group.current?.rotation || {}, {
          y: Math.PI * 2,
          duration: 2,
          ease: "power1.inOut"
        })
        .to(group.current?.position || {}, {
          y: position[1],
          duration: 1,
          ease: "power2.in",
          onStart: () => setTransformStage(2)
        });
    }
  }, [transformToQueen, position, onTransformationComplete]);
  
  // Animation loop for hover effect
  useFrame(() => {
    if (group.current && !transformToQueen) {
      group.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.01;
    }
  });
  
  // Apply cultural materials to models
  useEffect(() => {
    // Apply African skin material to girl model
    girlModelHigh.scene.traverse((node: THREE.Object3D) => {
      if (isMesh(node)) {
        const materialName = node.material && !Array.isArray(node.material) ? node.material.name.toLowerCase() : '';
        
        // Detect skin materials by name or properties
        if (node.name.toLowerCase().includes('skin') || materialName.includes('skin')) {
          node.material = new THREE.MeshPhysicalMaterial({
            color: '#5C4033',
            roughness: 0.7,
            metalness: 0.0,
            clearcoat: 0.2,
            clearcoatRoughness: 0.4,
            sheen: 0.2,
            sheenRoughness: 0.4,
            sheenColor: '#8B4513',
            transmission: 0.05,
            thickness: 0.5,
            emissive: transformStage === 1 ? '#FFD700' : '#000000',
            emissiveIntensity: transformStage === 1 ? 0.5 : 0
          });
        }
        // Detect clothing materials
        else if (node.name.toLowerCase().includes('cloth') || materialName.includes('cloth')) {
          node.material = new THREE.MeshPhysicalMaterial({
            color: '#800020', // Maroon for traditional clothing
            roughness: 0.9,
            metalness: 0.0,
            sheen: 0.5,
            sheenRoughness: 0.2,
            sheenColor: '#FFD700'
          });
        }
      }
    });
    
    // Apply royal materials to queen model
    queenModelHigh.scene.traverse((node: THREE.Object3D) => {
      if (isMesh(node)) {
        const materialName = node.material && !Array.isArray(node.material) ? node.material.name.toLowerCase() : '';
        
        // Detect skin materials
        if (node.name.toLowerCase().includes('skin') || materialName.includes('skin')) {
          node.material = new THREE.MeshPhysicalMaterial({
            color: '#5C4033',
            roughness: 0.7,
            metalness: 0.0,
            clearcoat: 0.3,
            clearcoatRoughness: 0.3,
            sheen: 0.3,
            sheenRoughness: 0.3,
            sheenColor: '#8B4513',
            transmission: 0.05,
            thickness: 0.5,
            emissive: '#FFD700',
            emissiveIntensity: 0.3
          });
        }
        // Detect crown or royal elements
        else if (
          node.name.toLowerCase().includes('crown') || 
          node.name.toLowerCase().includes('royal') ||
          materialName.includes('crown') || 
          materialName.includes('royal')
        ) {
          node.material = new THREE.MeshPhysicalMaterial({
            color: '#FFD700',
            roughness: 0.2,
            metalness: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 1.0,
            emissive: '#FFD700',
            emissiveIntensity: 0.5
          });
        }
        // Detect clothing materials
        else if (node.name.toLowerCase().includes('cloth') || materialName.includes('cloth')) {
          node.material = new THREE.MeshPhysicalMaterial({
            color: '#4B0082', // Royal purple
            roughness: 0.8,
            metalness: 0.1,
            sheen: 0.7,
            sheenRoughness: 0.2,
            sheenColor: '#FFD700'
          });
        }
      }
    });
  }, [girlModelHigh, queenModelHigh, transformStage]);
  
  // Clean up resources
  useEffect(() => {
    return () => {
      // Dispose textures and geometries when component unmounts
      girlModelHigh.scene.traverse((node: THREE.Object3D) => {
        if (isMesh(node)) {
          if (node.geometry) node.geometry.dispose();
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach(material => {
                if (hasMaps(material)) {
                  if (material.map) material.map.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  if (material.roughnessMap) material.roughnessMap.dispose();
                }
                material.dispose();
              });
            } else {
              if (hasMaps(node.material)) {
                if (node.material.map) node.material.map.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.roughnessMap) node.material.roughnessMap.dispose();
              }
              node.material.dispose();
            }
          }
        }
      });
      
      queenModelHigh.scene.traverse((node: THREE.Object3D) => {
        if (isMesh(node)) {
          if (node.geometry) node.geometry.dispose();
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach(material => {
                if (hasMaps(material)) {
                  if (material.map) material.map.dispose();
                  if (material.normalMap) material.normalMap.dispose();
                  if (material.roughnessMap) material.roughnessMap.dispose();
                }
                material.dispose();
              });
            } else {
              if (hasMaps(node.material)) {
                if (node.material.map) node.material.map.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.roughnessMap) node.material.roughnessMap.dispose();
              }
              node.material.dispose();
            }
          }
        }
      });
    };
  }, [girlModelHigh, queenModelHigh]);
  
  return (
    <group position={position} ref={group}>
      {/* Girl model with LOD */}
      <group visible={transformStage < 2}>
        <primitive 
          object={girlModelHigh.scene.clone()} 
          scale={0.1}
        />
      </group>
      
      {/* Queen model with LOD */}
      <group visible={transformStage >= 2}>
        <primitive 
          object={queenModelHigh.scene.clone()} 
          scale={0.15}
        />
      </group>
      
      {/* Transformation effects */}
      {transformStage === 1 && (
        <Sparkles 
          count={20} 
          scale={[0.5, 0.5, 0.5]} 
          size={5} 
          speed={0.3} 
          color="#FFD700" 
        />
      )}
      
      {transformStage >= 2 && (
        <group>
          <Sparkles 
            count={isHighEnd ? 50 : 25} 
            scale={[1, 1, 1]} 
            size={6} 
            speed={0.5} 
            color="#FFD700" 
          />
          <Trail
            width={1}
            length={isHighEnd ? 8 : 4}
            color="#FFD700"
            attenuation={(t) => t * t}
          >
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          </Trail>
        </group>
      )}
    </group>
  );
}

// Main Chessboard with transformation sequence
interface ChessboardProps {
  transformationActive?: boolean;
  onTransformationComplete?: () => void;
}

function Chessboard({ 
  transformationActive = false, 
  onTransformationComplete = () => {} 
}: ChessboardProps) {
  const boardRef = useRef<THREE.Group>(null);
  const [squareRefs] = useState(() => 
    Array(CHESS_CONFIG.boardSize * CHESS_CONFIG.boardSize)
      .fill(0)
      .map(() => React.createRef<THREE.Mesh>())
  );
  
  // Device capabilities for adaptive rendering
  const capabilities = useDeviceCapabilities();
  
  // Quality settings based on device capabilities
  const qualitySettings = useMemo(() => ({
    textureSize: capabilities.adaptiveQuality === 'high' ? 2048 : 
                capabilities.adaptiveQuality === 'medium' ? 1024 : 512,
    geometryDetail: capabilities.adaptiveQuality === 'high' ? 16 : 
                  capabilities.adaptiveQuality === 'medium' ? 8 : 4,
    shadows: capabilities.adaptiveQuality !== 'low',
    effectsIntensity: capabilities.adaptiveQuality === 'high' ? 1 : 
                    capabilities.adaptiveQuality === 'medium' ? 0.7 : 0.4,
  }), [capabilities.adaptiveQuality]);
  
  // Board rotation animation
  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.rotation.y = state.clock.getElapsedTime() * CHESS_CONFIG.rotationSpeed;
    }
  });
  
  // Create board squares
  const squares = useMemo(() => {
    const result = [];
    
    const offset = CHESS_CONFIG.boardSize / 2 - CHESS_CONFIG.squareSize / 2;
    
    for (let row = 0; row < CHESS_CONFIG.boardSize; row++) {
      for (let col = 0; col < CHESS_CONFIG.boardSize; col++) {
        const isDark = (row + col) % 2 === 1;
        const position: [number, number, number] = [
          (col - offset) * CHESS_CONFIG.squareSize,
          0,
          (row - offset) * CHESS_CONFIG.squareSize
        ];
        
        result.push(
          <ChessSquare 
            key={`${row}-${col}`}
            position={position} 
            isDark={isDark} 
            qualitySettings={qualitySettings}
          />
        );
      }
    }
    
    return result;
  }, [qualitySettings]);
  
  // African girl pawn position
  const pawnPosition: [number, number, number] = [
    0,
    CHESS_CONFIG.boardElevation,
    CHESS_CONFIG.boardSize / 2 * CHESS_CONFIG.squareSize - CHESS_CONFIG.squareSize * 1.5
  ];
  
  // Handle when transformation completes
  const handleTransformComplete = () => {
    onTransformationComplete();
  };
  
  return (
    <group ref={boardRef}>
      {/* Board base */}
      <mesh 
        position={[0, -0.025, 0]} 
        receiveShadow
      >
        <boxGeometry 
          args={[
            CHESS_CONFIG.boardSize * CHESS_CONFIG.squareSize + 0.2, 
            0.05, 
            CHESS_CONFIG.boardSize * CHESS_CONFIG.squareSize + 0.2
          ]} 
        />
        <AfrocentricMaterial 
          color="#5E3A22" 
          roughness={0.8}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Chess squares */}
      <group position={[0, 0, 0]}>
        {squares}
      </group>
      
      {/* African girl pawn that transforms */}
      <AfricanGirlPawn 
        position={pawnPosition}
        transformToQueen={transformationActive}
        onTransformationComplete={handleTransformComplete}
        qualitySettings={qualitySettings}
      />
    </group>
  );
}

// Light transition effect
interface LightEffectsProps {
  active: boolean;
  qualitySettings: {
    effectsIntensity: number;
  };
}

function LightEffects({ active, qualitySettings }: LightEffectsProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  
  // Animate lights based on active state
  useEffect(() => {
    if (active && spotLightRef.current && rimLightRef.current) {
      // Transition from dark to enlightened
      gsap.timeline()
        .to(spotLightRef.current, {
          intensity: 2 * qualitySettings.effectsIntensity,
          duration: 2,
          ease: "power2.out"
        })
        .to(rimLightRef.current, {
          intensity: 1.5 * qualitySettings.effectsIntensity,
          duration: 1.5,
          ease: "power1.inOut"
        }, "-=1.5");
    }
  }, [active, qualitySettings.effectsIntensity]);
  
  return (
    <group>
      <spotLight 
        ref={spotLightRef}
        position={[0, 8, 0]} 
        intensity={0.2}
        angle={0.5}
        penumbra={1}
        castShadow={qualitySettings.effectsIntensity > 0.5}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      
      <directionalLight
        ref={rimLightRef}
        position={[5, 3, 5]}
        intensity={0.3}
        color="#FFD700"
      />
    </group>
  );
}

// Performance monitoring and adaptive rendering
function PerformanceAdaptation({ children }: { children: React.ReactNode }) {
  const [dpr, setDpr] = useState(1.5);
  
  return (
    <PerformanceMonitor
      onIncline={() => setDpr(Math.min(dpr + 0.25, 2))}
      onDecline={() => setDpr(Math.max(dpr - 0.25, 0.75))}
    >
      {children}
    </PerformanceMonitor>
  );
}

// Main component exported
interface KnowledgeIsPowerChessboardProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onExplore?: () => void;
}

export function KnowledgeIsPowerChessboard({
  title = 'Knowledge is Power',
  subtitle = 'From Potential to Wisdom',
  ctaText = 'Explore Our Programs',
  onExplore = () => {}
}: KnowledgeIsPowerChessboardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [transformationActive, setTransformationActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const capabilities = useDeviceCapabilities();
  
  // Start transformation after a delay
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setTransformationActive(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);
  
  // Handle scene loaded
  const handleSceneLoaded = () => {
    setIsLoaded(true);
  };
  
  // Handle transformation complete
  const handleTransformationComplete = () => {
    console.log('Transformation complete');
  };
  
  return (
    <div className="relative w-full h-screen" ref={containerRef}>
      {/* 3D Scene */}
      <div className="absolute inset-0 bg-black">
        <Canvas
          shadows={capabilities.adaptiveQuality !== 'low'}
          dpr={capabilities.adaptiveQuality === 'high' ? 2 : 
               capabilities.adaptiveQuality === 'medium' ? 1.5 : 1}
          gl={{ 
            antialias: true,
            alpha: false,
            stencil: false,
            depth: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: 'srgb',
            logarithmicDepthBuffer: true,
            precision: 'highp'
          }}
          camera={{ 
            position: [0, 3, 5], 
            fov: 45, 
            near: 0.1, 
            far: 100
          }}
          onCreated={({ gl, scene }) => {
            gl.useLegacyLights = false;
            const pmremGenerator = new THREE.PMREMGenerator(gl);
            const envMap = pmremGenerator.fromScene(
              new THREE.Scene().add(
                new THREE.AmbientLight(0xffffff, 0.5),
                new THREE.DirectionalLight(0xffffff, 1.0)
              ), 1.5
            ).texture;
            scene.environment = envMap;
            handleSceneLoaded();
          }}
        >
          <PerformanceAdaptation>
            <Environment 
              preset="sunset" 
              background={false}
              blur={0.5}
              resolution={1024}
              ground={{
                height: 15,
                radius: 40,
                scale: 20
              }}
            />
            
            <ambientLight intensity={0.2} />
            
            <spotLight
              position={[5, 5, 0]}
              angle={0.4}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.001}
            />
            
            <LightEffects 
              active={transformationActive} 
              qualitySettings={{
                effectsIntensity: capabilities.adaptiveQuality === 'high' ? 1.2 : 
                                 capabilities.adaptiveQuality === 'medium' ? 0.8 : 0.5,
              }}
            />
            
            <Chessboard 
              transformationActive={transformationActive}
              onTransformationComplete={handleTransformationComplete}
            />
            
            <ContactShadows
              position={[0, -0.49, 0]}
              opacity={0.8}
              scale={10}
              blur={2.5}
              far={5}
              resolution={capabilities.adaptiveQuality === 'low' ? 256 : 2048}
              color="#000000"
              frames={capabilities.adaptiveQuality === 'high' ? 60 : 1}
            />
            
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3}
              maxDistance={10}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </PerformanceAdaptation>
        </Canvas>
      </div>
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 text-white max-w-xl z-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="inline-block bg-gradient-to-r from-orange-500 via-orange-400 to-red-600 
                         bg-clip-text text-transparent 
                         filter drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]
                         hover:scale-[1.02] transition-transform duration-300">
            {title.split(' ').map((word, i) => (
              <span 
                key={i}
                className="inline-block hover:translate-y-[-2px] transition-transform duration-200"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {word}{' '}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-normal mb-6 animate-fade-in">
          {subtitle}
        </p>
        <button
          onClick={onExplore}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 animate-fade-in"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}

// Preload models to ensure <500ms initial load
useGLTF.preload('/models/african-girl.glb');
useGLTF.preload('/models/african-queen.glb'); 