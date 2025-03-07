import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Types
export interface QualitySettings {
  textureSize: number;
  shadowMapSize: number;
  maxLights: number;
  enablePostProcessing: boolean;
  enableRayTracing: boolean;
  enableSSAO: boolean;
  enableBloom: boolean;
  anisotropy: number;
  compression: {
    format: string;
    quality: string;
    targetPSNR: number;
  };
  rayTracing: {
    enabled: boolean;
    samples: number;
    bounces: number;
    denoising: boolean;
  };
  performance: {
    targetFPS: number;
    maxFrameTime: number;
    maxVariance: number;
    adaptiveRange: {
      min: number;
      max: number;
    };
  };
  lod: {
    distances: {
      high: number;
      medium: number;
      low: number;
    };
    thresholds: {
      quality: number;
      performance: number;
    };
  };
}

export interface ModelOptimizationSettings {
  textureSize: number;
  anisotropy: number;
  compression: {
    format: string;
    quality: string;
    targetPSNR: number;
  };
  rayTracing: {
    enabled: boolean;
    samples: number;
    bounces: number;
    denoising: boolean;
  };
  performance: {
    useInstancing: boolean;
    useOcclusionCulling: boolean;
    useMipMaps: boolean;
  };
}

// WebGPU capability assessment with enhanced metrics
export async function isWebGPUSupported(): Promise<{
  supported: boolean;
  rayTracing: boolean;
  tier: number;
  sampleCount: number;
  maxTextureSize: number;
  shaderPerformance: {
    pixelTime: number;
    giQuality: number;
  };
}> {
  if (typeof navigator === 'undefined') {
    return getDefaultCapabilities();
  }
  
  if ('gpu' in navigator) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter({
        powerPreference: 'high-performance'
      });
      
      if (!adapter) return getDefaultCapabilities();
      
      const device = await adapter.requestDevice({
        requiredFeatures: ['ray-tracing'],
        requiredLimits: {
          maxStorageBufferBindingSize: 1024 * 1024 * 1024,
          maxBufferSize: 256 * 1024 * 1024,
          maxTextureDimension2D: 16384,
        }
      });
      
      const hasRayTracing = device.features.has('ray-tracing');
      const adapterInfo = await adapter.requestAdapterInfo();
      
      const tier = calculatePerformanceTier(adapterInfo, hasRayTracing);
      const sampleCount = calculateSampleCount(tier);
      const maxTextureSize = calculateMaxTextureSize(tier);
      const shaderPerformance = await measureShaderPerformance(device);
      
      return {
        supported: true,
        rayTracing: hasRayTracing,
        tier,
        sampleCount,
        maxTextureSize,
        shaderPerformance
      };
    } catch (e) {
      console.warn('WebGPU initialization failed:', e);
      return getDefaultCapabilities();
    }
  }
  
  return getDefaultCapabilities();
}

// Helper functions
function getDefaultCapabilities() {
  return {
    supported: false,
    rayTracing: false,
    tier: 0,
    sampleCount: 1,
    maxTextureSize: 2048,
    shaderPerformance: {
      pixelTime: 0,
      giQuality: 0
    }
  };
}

function calculatePerformanceTier(adapterInfo: any, hasRayTracing: boolean): number {
  let tier = 1;
  if (hasRayTracing && adapterInfo.device.includes('RTX')) {
    tier = 3;
  } else if (adapterInfo.device.includes('RTX') || 
             adapterInfo.device.includes('Radeon RX') || 
             adapterInfo.device.includes('Arc')) {
    tier = 2;
  }
  return tier;
}

function calculateSampleCount(tier: number): number {
  return tier === 3 ? 8 : tier === 2 ? 4 : 2;
}

function calculateMaxTextureSize(tier: number): number {
  return tier === 3 ? 16384 : tier === 2 ? 8192 : 4096;
}

async function measureShaderPerformance(device: any) {
  return {
    pixelTime: 50,
    giQuality: 0.8
  };
}

// Unified adaptive quality settings function
export function getAdaptiveQualitySettings(fps?: number, gpuTier?: number): QualitySettings {
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const cpuCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  
  const isHighPerformance = (gpuTier === undefined ? cpuCores > 8 : gpuTier >= 2) && !isMobile;
  const isMidPerformance = (gpuTier === undefined ? cpuCores > 6 : gpuTier >= 1) && !isMobile;
  
  const targetFrameTimeMs = 16.66; // 60 FPS
  const maxVarianceMs = 1.0;
  
  const settings: QualitySettings = {
    textureSize: isHighPerformance ? 8192 : isMidPerformance ? 4096 : 2048,
    shadowMapSize: isHighPerformance ? 4096 : isMidPerformance ? 2048 : 1024,
    maxLights: isHighPerformance ? 8 : 4,
    enablePostProcessing: fps ? fps >= 45 : true,
    enableRayTracing: isHighPerformance,
    enableSSAO: fps ? fps >= 30 : isMidPerformance,
    enableBloom: fps ? fps >= 40 : true,
    anisotropy: isHighPerformance ? 16 : isMidPerformance ? 8 : 4,
    compression: {
      format: 'ktx2',
      quality: isHighPerformance ? 'high' : 'medium',
      targetPSNR: 40
    },
    rayTracing: {
      enabled: isHighPerformance,
      samples: isHighPerformance ? 4 : 2,
      bounces: isHighPerformance ? 3 : 1,
      denoising: true
    },
    performance: {
      targetFPS: 60,
      maxFrameTime: targetFrameTimeMs,
      maxVariance: maxVarianceMs,
      adaptiveRange: {
        min: targetFrameTimeMs - maxVarianceMs,
        max: targetFrameTimeMs + maxVarianceMs
      }
    },
    lod: {
      distances: {
        high: 50,
        medium: 150,
        low: 300
      },
      thresholds: {
        quality: isHighPerformance ? 0.8 : 0.6,
        performance: isHighPerformance ? 0.9 : 0.7
      }
    }
  };

  // Adjust based on FPS if provided
  if (fps !== undefined && fps < 30) {
    settings.textureSize = Math.min(settings.textureSize, 1024);
    settings.shadowMapSize = Math.min(settings.shadowMapSize, 1024);
    settings.maxLights = Math.min(settings.maxLights, 4);
    settings.enablePostProcessing = false;
    settings.enableRayTracing = false;
    settings.enableSSAO = false;
    settings.enableBloom = false;
    settings.anisotropy = 1;
  }

  return settings;
}

// Unified PerformanceMonitor class
export class PerformanceMonitor {
  private frameTimeSamples: number[] = [];
  private readonly maxSamples: number = 120;
  private lastTime: number = 0;
  private quality: number = 0.5;
  private qualityChangeCallbacks: ((quality: number) => void)[] = [];
  private frameTimeHistory: { timestamp: number; duration: number; }[] = [];
  private adaptiveSettings: QualitySettings;
  private targetFPS: number;
  private fpsVariance: number = 0;

  constructor(targetFPS: number = 60) {
    this.targetFPS = targetFPS;
    this.lastTime = performance.now();
    this.adaptiveSettings = getAdaptiveQualitySettings();
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.processPerformanceEntries(entries);
      });
      
      observer.observe({ entryTypes: ['frame', 'measure'] });
    }
  }

  private processPerformanceEntries(entries: PerformanceEntry[]): void {
    entries.forEach(entry => {
      if (entry.entryType === 'frame') {
        this.frameTimeHistory.push({
          timestamp: entry.startTime,
          duration: entry.duration
        });
        
        const cutoffTime = performance.now() - 5000;
        this.frameTimeHistory = this.frameTimeHistory.filter(
          frame => frame.timestamp >= cutoffTime
        );
      }
    });
  }

  public update(): void {
    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    this.frameTimeSamples.push(deltaTime);
    if (this.frameTimeSamples.length > this.maxSamples) {
      this.frameTimeSamples.shift();
    }

    if (this.frameTimeSamples.length >= this.maxSamples) {
      this.updateQualityWithStrictMetrics();
    }
  }

  public getCurrentFPS(): number {
    if (this.frameTimeSamples.length === 0) return this.targetFPS;
    const averageFrameTime = this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length;
    return 1000 / averageFrameTime;
  }

  public getFPSVariance(): number {
    return this.fpsVariance;
  }

  public shouldAdjustQuality(): boolean {
    const currentFPS = this.getCurrentFPS();
    return currentFPS < this.targetFPS * 0.9 || this.fpsVariance > 16.67;
  }

  private updateQualityWithStrictMetrics(): void {
    const stats = this.calculateDetailedStats();
    
    if (stats.stdDev < this.adaptiveSettings.performance.maxVariance) {
      if (stats.avg > this.adaptiveSettings.performance.maxFrameTime) {
        this.quality = Math.max(0, this.quality - 0.05);
        this.notifyQualityChange();
      } else if (stats.avg < this.adaptiveSettings.performance.targetFPS) {
        this.quality = Math.min(1, this.quality + 0.025);
        this.notifyQualityChange();
      }
    }
  }

  private calculateDetailedStats() {
    const avg = this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length;
    const variance = this.frameTimeSamples.reduce((sum, time) => {
      const diff = time - avg;
      return sum + (diff * diff);
    }, 0) / this.frameTimeSamples.length;
    
    this.fpsVariance = Math.sqrt(variance);
    
    return {
      avg,
      stdDev: Math.sqrt(variance),
      samples: this.frameTimeSamples.length,
      percentile95: this.calculatePercentile(95),
      percentile99: this.calculatePercentile(99)
    };
  }

  private calculatePercentile(percentile: number): number {
    const sorted = [...this.frameTimeSamples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  public onQualityChange(callback: (quality: number) => void): void {
    this.qualityChangeCallbacks.push(callback);
  }

  private notifyQualityChange(): void {
    for (const callback of this.qualityChangeCallbacks) {
      callback(this.quality);
    }
  }

  public getQuality(): number {
    return this.quality;
  }

  public getFrameStats(): { avg: number; stdDev: number; samples: number; } {
    return this.calculateDetailedStats();
  }
}

// Model optimization utilities
export function getModelOptimizationSettings(): ModelOptimizationSettings {
  const quality = getAdaptiveQualitySettings();
  return {
    textureSize: quality.textureSize,
    anisotropy: quality.anisotropy,
    compression: quality.compression,
    rayTracing: quality.rayTracing,
    performance: {
      useInstancing: true,
      useOcclusionCulling: true,
      useMipMaps: true
    }
  };
}

export async function optimizeGeometry(geometry: THREE.BufferGeometry): Promise<THREE.BufferGeometry> {
  geometry.deleteAttribute('uv2');
  geometry = mergeVertices(geometry);
  
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }
  
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  
  return geometry;
} 