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
  PerformanceMonitor
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { KenteClothMaterial, AfricanWoodMaterial, KnowledgeMaterial, AfricanSkinMaterial } from './materials/AfrocentricMaterials';
import { suspend } from 'suspend-react';

// Constants for optimization
const CHESS_CONFIG = {
  boardSize: 8,
  squareSize: 0.5,
  lightSquareColor: '#D4B996',
  darkSquareColor: '#3D2314',
  boardElevation: 0.05,
  animationDuration: 5,
  rotationSpeed: 0.05
};

// WebGPU support detection - asynchronous operation
const checkWebGPU = async () => {
  if (typeof navigator === 'undefined') return false;
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (!adapter) return false;
      const supportedFeatures = adapter.features;
      const hasRayTracing = supportedFeatures.has('ray-tracing');
      return { supported: true, rayTracing: hasRayTracing };
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

// Detect device capabilities for adaptive rendering
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    webGPU: false,
    rayTracing: false,
    highPerformance: false,
    adaptiveQuality: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    // Detect device performance profile
    const cpuCores = navigator.hardwareConcurrency || 4;
    const isHighPerformance = cpuCores > 4;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Set initial quality based on device
    let quality: 'low' | 'medium' | 'high' = 'medium';
    if (isMobile || cpuCores <= 2) quality = 'low';
    if (cpuCores >= 8 && !isMobile) quality = 'high';
    
    // Check WebGPU support
    checkWebGPU().then(webGPUSupport => {
      setCapabilities({
        webGPU: webGPUSupport !== false && (webGPUSupport as any).supported === true,
        rayTracing: webGPUSupport !== false && (webGPUSupport as any).rayTracing === true,
        highPerformance: isHighPerformance,
        adaptiveQuality: quality
      });
    });
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
  const texture = useMemo(() => {
    const symbol = isDark ? 'sankofa' : 'nea-onnim';
    return new THREE.CanvasTexture(
      suspend(() => {
        const canvas = document.createElement('canvas');
        const size = qualitySettings.textureSize;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        
        // Draw Adinkra symbol
        ctx.fillStyle = isDark ? CHESS_CONFIG.darkSquareColor : CHESS_CONFIG.lightSquareColor;
        ctx.fillRect(0, 0, size, size);
        
        // Add subtle grain texture
        for (let i = 0; i < size * 0.2; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 2 + 0.5;
          ctx.fillStyle = isDark ? 
            `rgba(255,255,255,${Math.random() * 0.05 + 0.02})` : 
            `rgba(0,0,0,${Math.random() * 0.05 + 0.02})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        return canvas;
      }, [isDark, qualitySettings.textureSize])
    );
  }, [isDark, qualitySettings]);
  
  // Configure texture properties for optimal rendering
  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    
    return () => {
      texture.dispose();
    };
  }, [texture]);
  
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={precomputedGeometries.square} />
      {isDark ? (
        <AfricanWoodMaterial color={CHESS_CONFIG.darkSquareColor} map={texture} />
      ) : (
        <AfricanWoodMaterial color={CHESS_CONFIG.lightSquareColor} map={texture} />
      )}
    </mesh>
  );
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
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clock = new THREE.Clock();
  const [transformStage, setTransformStage] = useState(0);
  const { scene: modelScene, animations } = useGLTF('/models/african-girl.glb');
  
  // Track transformation progress
  const transformProgress = useRef(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  
  // Create animation mixer on first render
  useEffect(() => {
    if (modelScene && animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(modelScene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
    }
    
    // Clean up
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [modelScene, animations]);
  
  // Handle transformation when triggered
  useEffect(() => {
    if (transformToQueen && group.current) {
      // Create GSAP animation timeline
      timeline.current = gsap.timeline({
        onComplete: () => {
          setTransformStage(3); // Final queen stage
          onTransformationComplete();
        }
      });
      
      // Initial scale
      gsap.set(group.current.scale, { x: 0.1, y: 0.1, z: 0.1 });
      
      // Stage 1: Rise up
      timeline.current.to(group.current.position, {
        y: position[1] + 0.3,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => setTransformStage(1)
      });
      
      // Stage 2: Begin transformation
      timeline.current.to(transformProgress, {
        current: 1,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: () => setTransformStage(2),
      });
      
      // Stage 3: Final form and crown appearance
      timeline.current.to(group.current.scale, {
        x: 0.15,
        y: 0.15,
        z: 0.15,
        duration: 1,
        ease: "power3.out"
      }, "-=0.5");
      
      // Add glow effect during transformation
      timeline.current.fromTo('glowIntensity', {
        value: 0
      }, {
        value: 2,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
      }, "<");
    }
  }, [transformToQueen, position, onTransformationComplete]);
  
  // Animation loop
  useFrame(() => {
    const delta = clock.getDelta();
    
    // Update animation mixer
    if (mixer.current) {
      mixer.current.update(delta);
    }
    
    // Add subtle hover animation when not transforming
    if (group.current && !transformToQueen) {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.01;
    }
  });
  
  // Switch rendering based on transformation stage
  return (
    <group position={position} ref={group}>
      {transformStage < 2 && (
        // Pawn stage
        <group scale={[0.1, 0.1, 0.1]}>
          <primitive object={modelScene.clone()} />
          {transformStage === 1 && (
            <Sparkles 
              count={20} 
              scale={[0.5, 0.5, 0.5]} 
              size={5} 
              speed={0.3} 
              color="#FFD700" 
            />
          )}
        </group>
      )}
      
      {transformStage >= 2 && (
        // Queen transformation stage
        <group scale={[0.15, 0.15, 0.15]}>
          <primitive object={modelScene.clone()} />
          <mesh position={[0, 1.2, 0]}>
            <torusGeometry args={[0.5, 0.1, 16, 32]} />
            <MeshTransmissionMaterial 
              color="#FFD700"
              metalness={1}
              roughness={0}
              ior={1.5}
              thickness={0.2}
              transmission={0.9}
              chromaticAberration={0.06}
              emissive="#FFD700"
              emissiveIntensity={transformStage === 3 ? 2 : 0.5}
            />
          </mesh>
          <Sparkles 
            count={50} 
            scale={[1, 1, 1]} 
            size={6} 
            speed={0.5} 
            color="#FFD700" 
          />
          {transformStage === 3 && (
            <Trail 
              width={5}
              color="#FFD700"
              length={10}
              decay={1}
              local={false}
              stride={10}
              interval={1}
            >
              <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
            </Trail>
          )}
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
        <AfricanWoodMaterial 
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
          }}
          camera={{ 
            position: [0, 3, 5], 
            fov: 45, 
            near: 0.1, 
            far: 100
          }}
          onCreated={handleSceneLoaded}
        >
          <PerformanceAdaptation>
            <Environment preset="sunset" background={false} />
            
            <ambientLight intensity={0.2} />
            
            <LightEffects 
              active={transformationActive} 
              qualitySettings={{
                effectsIntensity: capabilities.adaptiveQuality === 'high' ? 1 : 
                                  capabilities.adaptiveQuality === 'medium' ? 0.7 : 0.4,
              }}
            />
            
            <Chessboard 
              transformationActive={transformationActive}
              onTransformationComplete={handleTransformationComplete}
            />
            
            <ContactShadows
              position={[0, -0.49, 0]}
              opacity={0.6}
              scale={10}
              blur={1.5}
              far={5}
              resolution={capabilities.adaptiveQuality === 'low' ? 256 : 512}
              color="#000000"
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

// Preload assets
useGLTF.preload('/models/african-girl.glb'); 