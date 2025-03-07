'use client';

import { useState, useEffect, useRef, Suspense, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  useTexture, 
  AccumulativeShadows,
  RandomizedLight,
  Center,
  Loader,
  useDetectGPU
} from '@react-three/drei';
import * as THREE from 'three';
import { WebGPUProvider } from './WebGPUDetection';
import { PerformanceMonitor, QualityLevel } from './PerformanceMonitor';
import { MemoryManager, useMemoryManager } from './memory/MemoryManager';
import { useKTX2Texture, TextureOptions } from './textures/KTX2TextureLoader';
import { OptimizedModelLoader } from './OptimizedModelLoader';
import { AfricanSkinMaterial } from './materials/AfricanSkinMaterial';
import { TransformationLighting } from './TransformationLighting';

// Preload models and textures
useGLTF.preload('/models/chessboard.glb');

// Interface for the main component props
interface OptimizedChessboardProps {
  initialQualityLevel?: QualityLevel;
  enablePerformanceMonitoring?: boolean;
  enableMemoryManagement?: boolean;
  enableWebGPU?: boolean;
  backgroundColor?: string;
  environmentMap?: string;
  cameraPosition?: [number, number, number];
  showStats?: boolean;
}

/**
 * Optimized 3D Chessboard Component
 * 
 * This component integrates all optimization systems:
 * - WebGPU detection and fallback
 * - Performance monitoring and adaptive quality
 * - Memory management and garbage collection
 * - KTX2 texture loading with compression
 * - LOD model loading
 * - PBR materials for African skin tones
 * - Dramatic transformation lighting
 * 
 * It implements the standards from 3d-standard.mdc, ensuring:
 * - 60+ FPS with frame times under 16ms
 * - Memory usage under 500MB
 * - High-quality visuals with 8K textures on capable devices
 * - Adaptive quality based on device capabilities
 */
export function OptimizedChessboard({
  initialQualityLevel = QualityLevel.LOW,
  enablePerformanceMonitoring = true,
  enableMemoryManagement = true,
  enableWebGPU = true,
  backgroundColor = '#1a1a2e',
  environmentMap = '/hdri/african_sunset.hdr',
  cameraPosition = [5, 5, 5],
  showStats = false
}: OptimizedChessboardProps) {
  const [qualitySettings, setQualitySettings] = useState({
    shadowMapSize: 1024,
    environmentIntensity: 0.7,
    aoIntensity: 0.3
  });
  const [isWebGPU, setIsWebGPU] = useState<boolean | null>(null);
  const gpuInfo = useDetectGPU();
  
  // Progressive loading state
  const [loadingStage, setLoadingStage] = useState<'initial' | 'basic' | 'complete'>('initial');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Handle quality changes from performance monitor
  const handleQualityChange = (settings: any) => {
    setQualitySettings({
      shadowMapSize: settings.shadowMapSize,
      environmentIntensity: settings.useHDR ? 0.7 : 0.5,
      aoIntensity: settings.useSSAO ? 0.3 : 0.1
    });
  };
  
  // Handle WebGPU detection
  const handleWebGPUDetection = (isSupported: boolean) => {
    setIsWebGPU(isSupported);
    console.log(`WebGPU support: ${isSupported ? 'Enabled' : 'Disabled, using WebGL fallback'}`);
  };
  
  // Progressive loading effect
  useEffect(() => {
    // Start with minimal assets
    setLoadingStage('initial');
    
    // After a short delay, load basic assets
    const basicTimer = setTimeout(() => {
      setLoadingStage('basic');
    }, 500);
    
    // After the scene is stable, load complete assets
    const completeTimer = setTimeout(() => {
      setLoadingStage('complete');
    }, 3000);
    
    return () => {
      clearTimeout(basicTimer);
      clearTimeout(completeTimer);
    };
  }, []);
  
  // Handle asset loading completion
  const handleAssetsLoaded = () => {
    setAssetsLoaded(true);
  };
  
  return (
    <div className="relative w-full h-full">
      {/* WebGPU Provider */}
      {enableWebGPU ? (
        <WebGPUProvider>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: cameraPosition, fov: 45 }}
            gl={{ 
              antialias: true,
              alpha: false,
              stencil: false,
              depth: true,
              powerPreference: 'high-performance'
            }}
            style={{ background: backgroundColor }}
          >
            {/* Performance monitoring */}
            {enablePerformanceMonitoring && (
              <PerformanceMonitor
                initialQualityLevel={initialQualityLevel}
                isWebGPU={true}
                onQualityChange={handleQualityChange}
              >
                {/* Memory management */}
                {enableMemoryManagement ? (
                  <MemoryManager
                    initialQualityLevel={initialQualityLevel}
                    gcInterval={15}
                    enableAutoGC={true}
                  >
                    <ChessboardContent
                      isWebGPU={true}
                      qualitySettings={qualitySettings}
                      environmentMap={environmentMap}
                      loadingStage={loadingStage}
                      onAssetsLoaded={handleAssetsLoaded}
                    />
                  </MemoryManager>
                ) : (
                  <ChessboardContent
                    isWebGPU={true}
                    qualitySettings={qualitySettings}
                    environmentMap={environmentMap}
                    loadingStage={loadingStage}
                    onAssetsLoaded={handleAssetsLoaded}
                  />
                )}
              </PerformanceMonitor>
            )}
            
            {/* No performance monitoring */}
            {!enablePerformanceMonitoring && (
              enableMemoryManagement ? (
                <MemoryManager
                  initialQualityLevel={initialQualityLevel}
                  gcInterval={15}
                  enableAutoGC={true}
                >
                  <ChessboardContent
                    isWebGPU={true}
                    qualitySettings={qualitySettings}
                    environmentMap={environmentMap}
                    loadingStage={loadingStage}
                    onAssetsLoaded={handleAssetsLoaded}
                  />
                </MemoryManager>
              ) : (
                <ChessboardContent
                  isWebGPU={true}
                  qualitySettings={qualitySettings}
                  environmentMap={environmentMap}
                  loadingStage={loadingStage}
                  onAssetsLoaded={handleAssetsLoaded}
                />
              )
            )}
            
            {/* Camera controls */}
            <OrbitControls 
              makeDefault 
              minDistance={3} 
              maxDistance={10}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </WebGPUProvider>
      ) : (
        <ChessboardScene
          isWebGPU={false}
          initialQualityLevel={initialQualityLevel}
          enablePerformanceMonitoring={enablePerformanceMonitoring}
          enableMemoryManagement={enableMemoryManagement}
          backgroundColor={backgroundColor}
          environmentMap={environmentMap}
          cameraPosition={cameraPosition}
          qualitySettings={qualitySettings}
          onQualityChange={handleQualityChange}
          showStats={showStats}
          loadingStage={loadingStage}
          onAssetsLoaded={handleAssetsLoaded}
        />
      )}
      
      {/* Loading indicator */}
      <Loader 
        containerStyles={{ background: backgroundColor }}
        dataInterpolation={(p) => `Loading: ${p.toFixed(0)}%`}
        initialState={(active) => active}
      />
      
      {/* Memory usage warning */}
      {enableMemoryManagement && (
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 p-1 rounded">
          Press F9 to toggle performance stats
        </div>
      )}
    </div>
  );
}

// Interface for the scene component props
interface ChessboardSceneProps {
  isWebGPU: boolean;
  initialQualityLevel: QualityLevel;
  enablePerformanceMonitoring: boolean;
  enableMemoryManagement: boolean;
  backgroundColor: string;
  environmentMap: string;
  cameraPosition: [number, number, number];
  qualitySettings: {
    shadowMapSize: number;
    environmentIntensity: number;
    aoIntensity: number;
  };
  onQualityChange: (settings: any) => void;
  showStats: boolean;
  loadingStage: 'initial' | 'basic' | 'complete';
  onAssetsLoaded: () => void;
}

/**
 * Chessboard Scene Component
 * 
 * This component renders the actual 3D scene with all optimizations applied.
 */
function ChessboardScene({
  isWebGPU,
  initialQualityLevel,
  enablePerformanceMonitoring,
  enableMemoryManagement,
  backgroundColor,
  environmentMap,
  cameraPosition,
  qualitySettings,
  onQualityChange,
  showStats,
  loadingStage,
  onAssetsLoaded
}: ChessboardSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: 45 }}
      gl={{ 
        antialias: true,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: 'high-performance'
      }}
      style={{ background: backgroundColor }}
    >
      {/* Performance monitoring */}
      {enablePerformanceMonitoring && (
        <PerformanceMonitor
          initialQualityLevel={initialQualityLevel}
          isWebGPU={isWebGPU}
          onQualityChange={onQualityChange}
        >
          {/* Memory management */}
          {enableMemoryManagement ? (
            <MemoryManager
              initialQualityLevel={initialQualityLevel}
              gcInterval={15}
              enableAutoGC={true}
            >
              <ChessboardContent
                isWebGPU={isWebGPU}
                qualitySettings={qualitySettings}
                environmentMap={environmentMap}
                loadingStage={loadingStage}
                onAssetsLoaded={onAssetsLoaded}
              />
            </MemoryManager>
          ) : (
            <ChessboardContent
              isWebGPU={isWebGPU}
              qualitySettings={qualitySettings}
              environmentMap={environmentMap}
              loadingStage={loadingStage}
              onAssetsLoaded={onAssetsLoaded}
            />
          )}
        </PerformanceMonitor>
      )}
      
      {/* No performance monitoring */}
      {!enablePerformanceMonitoring && (
        enableMemoryManagement ? (
          <MemoryManager
            initialQualityLevel={initialQualityLevel}
            gcInterval={15}
            enableAutoGC={true}
          >
            <ChessboardContent
              isWebGPU={isWebGPU}
              qualitySettings={qualitySettings}
              environmentMap={environmentMap}
              loadingStage={loadingStage}
              onAssetsLoaded={onAssetsLoaded}
            />
          </MemoryManager>
        ) : (
          <ChessboardContent
            isWebGPU={isWebGPU}
            qualitySettings={qualitySettings}
            environmentMap={environmentMap}
            loadingStage={loadingStage}
            onAssetsLoaded={onAssetsLoaded}
          />
        )
      )}
      
      {/* Camera controls */}
      <OrbitControls 
        makeDefault 
        minDistance={3} 
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

// Interface for the content component props
interface ChessboardContentProps {
  isWebGPU: boolean;
  qualitySettings: {
    shadowMapSize: number;
    environmentIntensity: number;
    aoIntensity: number;
  };
  environmentMap: string;
  loadingStage: 'initial' | 'basic' | 'complete';
  onAssetsLoaded: () => void;
}

/**
 * Chessboard Content Component
 * 
 * This component contains the actual 3D content of the scene.
 */
function ChessboardContent({
  isWebGPU,
  qualitySettings,
  environmentMap,
  loadingStage,
  onAssetsLoaded
}: ChessboardContentProps) {
  // Use memory manager if available
  const memoryManager = useMemoryManager();
  
  // Load environment map with KTX2 if supported
  const envMap = useKTX2Texture({
    url: `${environmentMap.replace('.hdr', '.ktx2')}`,
    fallbackUrl: environmentMap,
    options: {
      flipY: true
    } as TextureOptions
  });
  
  return (
    <Suspense fallback={null}>
      {/* Lighting */}
      <TransformationLighting
        active={true}
        intensity={1.2}
        color="#FFD700"
        position={[3, 5, 2]}
        targetPosition={[0, 0, 0]}
        envMapPath={environmentMap}
        qualitySettings={{
          shadowMapSize: qualitySettings.shadowMapSize,
          samples: isWebGPU ? 16 : 8,
          aoIntensity: qualitySettings.aoIntensity,
          envMapIntensity: qualitySettings.environmentIntensity
        }}
      />
      
      {/* Shadows */}
      <AccumulativeShadows
        temporal
        frames={30}
        alphaTest={0.85}
        scale={10}
        position={[0, -0.005, 0]}
        color="#d9b99b"
        opacity={0.8}
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.55}
          ambient={0.25}
          position={[5, 5, -10]}
        />
      </AccumulativeShadows>
      
      {/* Chessboard */}
      <Center>
        <OptimizedModelLoader
          modelPath="/models/chessboard.glb"
          position={[0, 0, 0]}
          scale={1}
          lodDistances={[10, 20]}
          castShadow={true}
          receiveShadow={true}
        />
      </Center>
      
      {/* Chess pieces */}
      <ChessPieces isWebGPU={isWebGPU} />
    </Suspense>
  );
}

/**
 * Chess Pieces Component
 * 
 * This component renders the chess pieces with optimized materials.
 */
function ChessPieces({ isWebGPU }: { isWebGPU: boolean }) {
  // Define piece positions with proper typing
  const positions: Array<{
    type: 'king' | 'queen' | 'bishop' | 'knight' | 'pawn';
    color: 'black' | 'white';
    position: [number, number, number];
  }> = [
    // Kings
    { type: 'king' as const, color: 'black' as const, position: [-1.5, 0, -1.5] },
    { type: 'king' as const, color: 'white' as const, position: [-1.5, 0, 1.5] },
    // Queens
    { type: 'queen' as const, color: 'black' as const, position: [-0.5, 0, -1.5] },
    { type: 'queen' as const, color: 'white' as const, position: [-0.5, 0, 1.5] },
    // Bishops
    { type: 'bishop' as const, color: 'black' as const, position: [0.5, 0, -1.5] },
    { type: 'bishop' as const, color: 'white' as const, position: [0.5, 0, 1.5] },
    // Knights
    { type: 'knight' as const, color: 'black' as const, position: [1.5, 0, -1.5] },
    { type: 'knight' as const, color: 'white' as const, position: [1.5, 0, 1.5] },
    // Pawns
    { type: 'pawn' as const, color: 'black' as const, position: [0, 0, -0.5] },
    { type: 'pawn' as const, color: 'white' as const, position: [0, 0, 0.5] },
  ];
  
  return (
    <>
      {positions.map((piece, index) => (
        <ChessPiece
          key={index}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isWebGPU={isWebGPU}
        />
      ))}
    </>
  );
}

// Interface for chess piece props
interface ChessPieceProps {
  type: 'king' | 'queen' | 'bishop' | 'knight' | 'pawn';
  color: 'black' | 'white';
  position: [number, number, number];
  isWebGPU: boolean;
}

/**
 * Chess Piece Component
 * 
 * This component renders a single chess piece with optimized materials.
 */
function ChessPiece({ type, color, position, isWebGPU }: ChessPieceProps) {
  // Generate model path based on type and color
  const modelPath = `/models/chess/${color}_${type}.glb`;
  
  // Determine melanin level based on color
  const melaninLevel = color === 'black' ? 0.85 : 0.3;
  
  return (
    <group position={position}>
      <OptimizedModelLoader
        modelPath={modelPath}
        position={[0, 0, 0]}
        scale={0.5}
        lodDistances={[5, 10]}
        castShadow={true}
        receiveShadow={true}
      />
      
      {/* Apply African skin material for human figures */}
      {(type === 'king' || type === 'queen' || type === 'pawn') && (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <AfricanSkinMaterial
            melaninLevel={melaninLevel}
            roughness={0.7}
            subsurfaceIntensity={0.5}
            emissiveIntensity={0}
            emissiveColor="#FFD700"
          />
        </mesh>
      )}
    </group>
  );
} 