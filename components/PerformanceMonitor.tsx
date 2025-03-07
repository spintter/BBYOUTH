'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useDetectGPU } from '@react-three/drei';
import * as THREE from 'three';

// Performance targets from 3D standards
const PERFORMANCE_TARGETS = {
  TARGET_FPS: 60,
  MAX_FRAME_TIME: 16, // ms
  MAX_FRAME_TIME_VARIANCE: 1, // ms
  MAX_GPU_MEMORY: 500, // MB
  MAX_DRAW_CALLS: 100,
  MIN_PSNR: 40, // dB
  MAX_COLOR_DELTA_E: 1.0,
  ANISOTROPY_LEVELS: {
    HIGH: 16,
    MEDIUM: 8,
    LOW: 4
  },
  SHADOW_MAP_SIZES: {
    HIGH: 2048,
    MEDIUM: 1024,
    LOW: 512
  },
  TEXTURE_RESOLUTIONS: {
    HIGH: 8192, // 8K
    MEDIUM: 4096, // 4K
    LOW: 2048 // 2K
  },
  RAY_TRACING_SAMPLES: {
    HIGH: 4,
    MEDIUM: 2,
    LOW: 1
  }
};

// Quality presets
export enum QualityLevel {
  ULTRA = 'ultra',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  MINIMUM = 'minimum'
}

// Quality settings interface
export interface QualitySettings {
  textureResolution: number;
  anisotropy: number;
  shadowMapSize: number;
  shadowSamples: number;
  rayTracingSamples: number;
  effectsIntensity: number;
  geometryDetail: number;
  maxDrawCalls: number;
  useHDR: boolean;
  useRayTracing: boolean;
  useGlobalIllumination: boolean;
  useTemporalAA: boolean;
  useBloom: boolean;
  useSSAO: boolean;
  useSSR: boolean;
  useMotionBlur: boolean;
  useDOF: boolean;
}

// Performance metrics interface
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  frameTimeVariance: number;
  drawCalls: number;
  triangles: number;
  textureMem: number;
  geometryMem: number;
  totalMem: number;
  gpuUtilization: number;
}

// Default quality settings for each level
const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  [QualityLevel.ULTRA]: {
    textureResolution: PERFORMANCE_TARGETS.TEXTURE_RESOLUTIONS.HIGH,
    anisotropy: PERFORMANCE_TARGETS.ANISOTROPY_LEVELS.HIGH,
    shadowMapSize: PERFORMANCE_TARGETS.SHADOW_MAP_SIZES.HIGH,
    shadowSamples: 16,
    rayTracingSamples: PERFORMANCE_TARGETS.RAY_TRACING_SAMPLES.HIGH,
    effectsIntensity: 1.0,
    geometryDetail: 1.0,
    maxDrawCalls: PERFORMANCE_TARGETS.MAX_DRAW_CALLS,
    useHDR: true,
    useRayTracing: true,
    useGlobalIllumination: true,
    useTemporalAA: true,
    useBloom: true,
    useSSAO: true,
    useSSR: true,
    useMotionBlur: true,
    useDOF: true
  },
  [QualityLevel.HIGH]: {
    textureResolution: PERFORMANCE_TARGETS.TEXTURE_RESOLUTIONS.MEDIUM,
    anisotropy: PERFORMANCE_TARGETS.ANISOTROPY_LEVELS.MEDIUM,
    shadowMapSize: PERFORMANCE_TARGETS.SHADOW_MAP_SIZES.MEDIUM,
    shadowSamples: 4,
    rayTracingSamples: 0,
    effectsIntensity: 0.7,
    geometryDetail: 0.8,
    maxDrawCalls: 75,
    useHDR: true,
    useRayTracing: false,
    useGlobalIllumination: false,
    useTemporalAA: true,
    useBloom: true,
    useSSAO: false,
    useSSR: false,
    useMotionBlur: false,
    useDOF: false
  },
  [QualityLevel.MEDIUM]: {
    textureResolution: PERFORMANCE_TARGETS.TEXTURE_RESOLUTIONS.MEDIUM,
    anisotropy: PERFORMANCE_TARGETS.ANISOTROPY_LEVELS.MEDIUM,
    shadowMapSize: PERFORMANCE_TARGETS.SHADOW_MAP_SIZES.MEDIUM,
    shadowSamples: 4,
    rayTracingSamples: PERFORMANCE_TARGETS.RAY_TRACING_SAMPLES.LOW,
    effectsIntensity: 0.6,
    geometryDetail: 0.75,
    maxDrawCalls: 75,
    useHDR: true,
    useRayTracing: false,
    useGlobalIllumination: false,
    useTemporalAA: true,
    useBloom: true,
    useSSAO: true,
    useSSR: false,
    useMotionBlur: false,
    useDOF: false
  },
  [QualityLevel.LOW]: {
    textureResolution: PERFORMANCE_TARGETS.TEXTURE_RESOLUTIONS.LOW,
    anisotropy: PERFORMANCE_TARGETS.ANISOTROPY_LEVELS.LOW,
    shadowMapSize: PERFORMANCE_TARGETS.SHADOW_MAP_SIZES.LOW,
    shadowSamples: 2,
    rayTracingSamples: 0,
    effectsIntensity: 0.4,
    geometryDetail: 0.5,
    maxDrawCalls: 50,
    useHDR: true,
    useRayTracing: false,
    useGlobalIllumination: false,
    useTemporalAA: false,
    useBloom: false,
    useSSAO: false,
    useSSR: false,
    useMotionBlur: false,
    useDOF: false
  },
  [QualityLevel.MINIMUM]: {
    textureResolution: PERFORMANCE_TARGETS.TEXTURE_RESOLUTIONS.LOW,
    anisotropy: 1,
    shadowMapSize: 256,
    shadowSamples: 1,
    rayTracingSamples: 0,
    effectsIntensity: 0.2,
    geometryDetail: 0.25,
    maxDrawCalls: 30,
    useHDR: false,
    useRayTracing: false,
    useGlobalIllumination: false,
    useTemporalAA: false,
    useBloom: false,
    useSSAO: false,
    useSSR: false,
    useMotionBlur: false,
    useDOF: false
  }
};

// Context for sharing quality settings and performance metrics
export interface PerformanceContextType {
  qualityLevel: QualityLevel;
  qualitySettings: QualitySettings;
  performanceMetrics: PerformanceMetrics;
  isWebGPU: boolean;
  gpuTier: number;
  setQualityLevel: (level: QualityLevel) => void;
  isStatsVisible: boolean;
  toggleStats: () => void;
}

// Default performance metrics
const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  fps: 0,
  frameTime: 0,
  frameTimeVariance: 0,
  drawCalls: 0,
  triangles: 0,
  textureMem: 0,
  geometryMem: 0,
  totalMem: 0,
  gpuUtilization: 0
};

interface PerformanceMonitorProps {
  children: React.ReactNode;
  initialQualityLevel?: QualityLevel;
  isWebGPU?: boolean;
  onQualityChange?: (settings: QualitySettings) => void;
}

/**
 * Advanced performance monitoring and adaptive quality system
 * 
 * This component monitors performance metrics and dynamically adjusts
 * rendering quality to maintain target frame rates across different devices.
 * It implements the standards from 3d-standard.mdc, ensuring 60+ FPS with
 * frame times under 16ms and variance below 1ms.
 */
export function PerformanceMonitor({
  children,
  initialQualityLevel,
  isWebGPU = false,
  onQualityChange
}: PerformanceMonitorProps) {
  const { gl, scene, camera } = useThree();
  const gpuInfo = useDetectGPU();
  
  // State for quality and performance
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>(
    initialQualityLevel || determineInitialQualityLevel(gpuInfo.tier, isWebGPU)
  );
  const [qualitySettings, setQualitySettings] = useState<QualitySettings>(
    QUALITY_PRESETS[qualityLevel]
  );
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(
    DEFAULT_PERFORMANCE_METRICS
  );
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  
  // Refs for performance tracking
  const frameTimeHistory = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const memoryUpdateInterval = useRef<number>(0);
  
  // Toggle stats visibility
  const toggleStats = useCallback(() => {
    setIsStatsVisible(prev => !prev);
  }, []);
  
  // Determine initial quality level based on GPU tier and WebGPU support
  function determineInitialQualityLevel(gpuTier: number, isWebGPU: boolean): QualityLevel {
    if (isWebGPU && gpuTier >= 3) return QualityLevel.HIGH;
    if (gpuTier >= 3) return QualityLevel.MEDIUM;
    if (gpuTier >= 2) return QualityLevel.LOW;
    if (gpuTier >= 1) return QualityLevel.MINIMUM;
    return QualityLevel.MINIMUM;
  }
  
  // Update quality settings when quality level changes
  useEffect(() => {
    const newSettings = QUALITY_PRESETS[qualityLevel];
    setQualitySettings(newSettings);
    
    // Apply global settings
    if (gl) {
      // Set pixel ratio based on quality
      const pixelRatio = Math.min(window.devicePixelRatio, 
        qualityLevel === QualityLevel.ULTRA ? 2 :
        qualityLevel === QualityLevel.HIGH ? 1.5 :
        qualityLevel === QualityLevel.MEDIUM ? 1.25 : 1
      );
      gl.setPixelRatio(pixelRatio);
      
      // Set shadow map type based on quality
      if (gl.shadowMap) {
        gl.shadowMap.enabled = qualityLevel !== QualityLevel.MINIMUM;
        gl.shadowMap.type = qualityLevel >= QualityLevel.HIGH 
          ? THREE.PCFSoftShadowMap 
          : THREE.PCFShadowMap;
      }
      
      // Set tone mapping based on quality
      gl.toneMapping = newSettings.useHDR 
        ? THREE.ACESFilmicToneMapping 
        : THREE.LinearToneMapping;
      gl.toneMappingExposure = newSettings.useHDR ? 1.2 : 1.0;
      
      // Set output encoding
      gl.outputColorSpace = newSettings.useHDR 
        ? THREE.SRGBColorSpace 
        : THREE.LinearSRGBColorSpace;
    }
    
    // Notify parent component
    if (onQualityChange) {
      onQualityChange(newSettings);
    }
  }, [qualityLevel, gl, onQualityChange]);
  
  // Set up keyboard shortcut for toggling stats
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        toggleStats();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleStats]);
  
  // Monitor performance and adapt quality
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;
    frameCount.current++;
    
    // Calculate frame time
    const deltaTime = state.clock.getDelta();
    const frameTime = deltaTime * 1000; // Convert to ms
    frameTimeHistory.current.push(frameTime);
    
    // Keep only the last 60 frames for variance calculation
    if (frameTimeHistory.current.length > 60) {
      frameTimeHistory.current.shift();
    }
    
    // Update FPS counter every second
    if (currentTime - lastFpsUpdateTime.current >= 1) {
      const fps = frameCount.current / (currentTime - lastFpsUpdateTime.current);
      
      // Calculate frame time variance
      const avgFrameTime = frameTimeHistory.current.reduce((sum, time) => sum + time, 0) / 
        frameTimeHistory.current.length;
      const frameTimeVariance = Math.sqrt(
        frameTimeHistory.current.reduce((sum, time) => sum + Math.pow(time - avgFrameTime, 2), 0) / 
        frameTimeHistory.current.length
      );
      
      // Get renderer info
      const rendererInfo = (gl as any).info;
      const drawCalls = rendererInfo?.render?.calls || 0;
      const triangles = rendererInfo?.render?.triangles || 0;
      
      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        fps,
        frameTime: avgFrameTime,
        frameTimeVariance,
        drawCalls,
        triangles
      }));
      
      // Reset counters
      frameCount.current = 0;
      lastFpsUpdateTime.current = currentTime;
      
      // More aggressive adaptive quality adjustment
      if (fps < PERFORMANCE_TARGETS.TARGET_FPS - 5 || avgFrameTime > PERFORMANCE_TARGETS.MAX_FRAME_TIME) {
        // Performance is poor, decrease quality more aggressively
        if (qualityLevel !== QualityLevel.MINIMUM) {
          const qualityLevels = Object.values(QualityLevel);
          const currentIndex = qualityLevels.indexOf(qualityLevel);
          if (currentIndex < qualityLevels.length - 1) {
            // If performance is very poor, drop two quality levels at once
            if (fps < PERFORMANCE_TARGETS.TARGET_FPS - 15 || avgFrameTime > PERFORMANCE_TARGETS.MAX_FRAME_TIME * 1.5) {
              const newIndex = Math.min(currentIndex + 2, qualityLevels.length - 1);
              setQualityLevel(qualityLevels[newIndex] as QualityLevel);
              console.log(`Performance critical: Decreasing quality to ${qualityLevels[newIndex]}`);
            } else {
              setQualityLevel(qualityLevels[currentIndex + 1] as QualityLevel);
              console.log(`Performance adaptive: Decreasing quality to ${qualityLevels[currentIndex + 1]}`);
            }
          }
        }
      } else if (fps > PERFORMANCE_TARGETS.TARGET_FPS + 15 && 
                avgFrameTime < PERFORMANCE_TARGETS.MAX_FRAME_TIME / 2 &&
                frameTimeVariance < PERFORMANCE_TARGETS.MAX_FRAME_TIME_VARIANCE) {
        // Performance is excellent, can increase quality (but be more conservative)
        if (qualityLevel !== QualityLevel.ULTRA) {
          const qualityLevels = Object.values(QualityLevel);
          const currentIndex = qualityLevels.indexOf(qualityLevel);
          // Only increase quality if we've been stable for a while (10 seconds)
          if (currentIndex > 0 && memoryUpdateInterval.current % 10 === 0) { 
            setQualityLevel(qualityLevels[currentIndex - 1] as QualityLevel);
            console.log(`Performance adaptive: Increasing quality to ${qualityLevels[currentIndex - 1]}`);
          }
        }
      }
      
      // Update memory usage every 5 seconds
      memoryUpdateInterval.current++;
      if (memoryUpdateInterval.current % 5 === 0) {
        // Estimate memory usage
        let textureMem = 0;
        let geometryMem = 0;
        
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // Estimate geometry memory
            if (object.geometry) {
              const attributes = object.geometry.attributes;
              // Use a type assertion to handle the attributes properly
              Object.keys(attributes).forEach(key => {
                const attribute = attributes[key as keyof typeof attributes];
                if (attribute && attribute.array) {
                  geometryMem += attribute.array.byteLength;
                }
              });
            }
            
            // Estimate texture memory
            if (object.material) {
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach(material => {
                const maps = [
                  'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
                  'emissiveMap', 'aoMap', 'displacementMap'
                ];
                
                maps.forEach(mapName => {
                  if ((material as any)[mapName]) {
                    const texture = (material as any)[mapName];
                    const width = texture.image?.width || 1024;
                    const height = texture.image?.height || 1024;
                    // Estimate 4 bytes per pixel (RGBA)
                    textureMem += width * height * 4;
                  }
                });
              });
            }
          }
        });
        
        // Convert to MB
        textureMem = textureMem / (1024 * 1024);
        geometryMem = geometryMem / (1024 * 1024);
        
        setPerformanceMetrics(prev => ({
          ...prev,
          textureMem,
          geometryMem,
          totalMem: textureMem + geometryMem
        }));
        
        // Check if memory usage is too high
        if (textureMem + geometryMem > PERFORMANCE_TARGETS.MAX_GPU_MEMORY * 0.9) {
          // Memory usage is too high, decrease quality
          if (qualityLevel !== QualityLevel.MINIMUM) {
            const qualityLevels = Object.values(QualityLevel);
            const currentIndex = qualityLevels.indexOf(qualityLevel);
            if (currentIndex < qualityLevels.length - 1) {
              setQualityLevel(qualityLevels[currentIndex + 1] as QualityLevel);
              console.log(`Memory adaptive: Decreasing quality to ${qualityLevels[currentIndex + 1]}`);
            }
          }
        }
      }
    }
    
    lastFrameTime.current = currentTime;
  });
  
  return (
    <>
      {children}
      {isStatsVisible && <PerformanceStats metrics={performanceMetrics} qualityLevel={qualityLevel} isWebGPU={isWebGPU} gpuTier={gpuInfo.tier} />}
    </>
  );
}

// Performance stats display component
interface PerformanceStatsProps {
  metrics: PerformanceMetrics;
  qualityLevel: QualityLevel;
  isWebGPU: boolean;
  gpuTier: number;
}

function PerformanceStats({ metrics, qualityLevel, isWebGPU, gpuTier }: PerformanceStatsProps) {
  return (
    <div className="absolute bottom-2 left-2 bg-black/70 text-white p-2 rounded text-xs font-mono">
      <div className="grid grid-cols-2 gap-x-4">
        <div>FPS: <span className={metrics.fps >= PERFORMANCE_TARGETS.TARGET_FPS ? 'text-green-400' : 'text-red-400'}>{metrics.fps.toFixed(1)}</span></div>
        <div>Frame: <span className={metrics.frameTime <= PERFORMANCE_TARGETS.MAX_FRAME_TIME ? 'text-green-400' : 'text-red-400'}>{metrics.frameTime.toFixed(2)}ms</span></div>
        <div>Variance: <span className={metrics.frameTimeVariance <= PERFORMANCE_TARGETS.MAX_FRAME_TIME_VARIANCE ? 'text-green-400' : 'text-red-400'}>{metrics.frameTimeVariance.toFixed(2)}ms</span></div>
        <div>Draw Calls: <span className={metrics.drawCalls <= PERFORMANCE_TARGETS.MAX_DRAW_CALLS ? 'text-green-400' : 'text-red-400'}>{metrics.drawCalls}</span></div>
        <div>Triangles: {(metrics.triangles / 1000).toFixed(1)}K</div>
        <div>Quality: <span className="text-blue-400">{qualityLevel}</span></div>
        <div>Texture Mem: <span className={metrics.textureMem <= PERFORMANCE_TARGETS.MAX_GPU_MEMORY / 2 ? 'text-green-400' : 'text-yellow-400'}>{metrics.textureMem.toFixed(1)}MB</span></div>
        <div>Geo Mem: <span className={metrics.geometryMem <= PERFORMANCE_TARGETS.MAX_GPU_MEMORY / 2 ? 'text-green-400' : 'text-yellow-400'}>{metrics.geometryMem.toFixed(1)}MB</span></div>
        <div>Total Mem: <span className={metrics.totalMem <= PERFORMANCE_TARGETS.MAX_GPU_MEMORY ? 'text-green-400' : 'text-red-400'}>{metrics.totalMem.toFixed(1)}MB</span></div>
        <div>Renderer: <span className={isWebGPU ? 'text-green-400' : 'text-yellow-400'}>{isWebGPU ? 'WebGPU' : 'WebGL'}</span></div>
        <div>GPU Tier: <span className={gpuTier >= 2 ? 'text-green-400' : 'text-yellow-400'}>{gpuTier}</span></div>
      </div>
      <div className="mt-1 text-gray-400">Press F9 to hide</div>
    </div>
  );
} 