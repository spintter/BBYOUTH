'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { QualityLevel } from '../PerformanceMonitor';
import { clearTextureCache, getTextureCacheSize } from '../textures/KTX2TextureLoader';

// Memory thresholds in MB - significantly lowered to prevent excessive memory usage
const MEMORY_THRESHOLDS = {
  CRITICAL: 300, // 60% of 500MB target (lowered from 450MB)
  HIGH: 250,     // 50% of 500MB target (lowered from 400MB)
  MEDIUM: 200,   // 40% of 500MB target (lowered from 300MB)
  LOW: 150       // 30% of 500MB target (lowered from 200MB)
};

// Resource types for tracking
export enum ResourceType {
  GEOMETRY = 'geometry',
  TEXTURE = 'texture',
  MATERIAL = 'material',
  SHADER = 'shader',
  ANIMATION = 'animation',
  OTHER = 'other'
}

// Resource tracking interface
interface TrackedResource {
  id: string;
  type: ResourceType;
  resource: any;
  size: number; // Size in bytes
  lastUsed: number; // Timestamp
  priority: number; // 0-10, higher = more important
  isDisposable: boolean;
  disposeCallback?: () => void;
}

// Memory stats interface
export interface MemoryStats {
  totalMemory: number; // MB
  geometryMemory: number; // MB
  textureMemory: number; // MB
  materialMemory: number; // MB
  otherMemory: number; // MB
  resourceCount: number;
  disposedCount: number;
  memoryLevel: 'low' | 'medium' | 'high' | 'critical';
  lastGCTime: number | null;
}

// Memory manager context
interface MemoryManagerContextType {
  stats: MemoryStats;
  registerResource: (resource: Omit<TrackedResource, 'lastUsed'>) => string;
  unregisterResource: (id: string) => void;
  updateResourceUsage: (id: string) => void;
  forceGarbageCollection: () => void;
  setQualityLevel: (level: QualityLevel) => void;
}

// Create context
const MemoryManagerContext = createContext<MemoryManagerContextType | null>(null);

// Default memory stats
const DEFAULT_MEMORY_STATS: MemoryStats = {
  totalMemory: 0,
  geometryMemory: 0,
  textureMemory: 0,
  materialMemory: 0,
  otherMemory: 0,
  resourceCount: 0,
  disposedCount: 0,
  memoryLevel: 'low',
  lastGCTime: null
};

// Props for memory manager
interface MemoryManagerProps {
  children: React.ReactNode;
  initialQualityLevel?: QualityLevel;
  onMemoryWarning?: (stats: MemoryStats) => void;
  gcInterval?: number; // Seconds between garbage collection checks
  enableAutoGC?: boolean;
}

/**
 * Memory Manager Component
 * 
 * Provides comprehensive memory management for Three.js resources:
 * - Tracks memory usage by resource type
 * - Implements automatic garbage collection
 * - Provides hooks for manual resource management
 * - Adapts quality settings based on memory pressure
 * - Prevents memory leaks through resource tracking
 */
export function MemoryManager({
  children,
  initialQualityLevel = QualityLevel.HIGH,
  onMemoryWarning,
  gcInterval = 30,
  enableAutoGC = true
}: MemoryManagerProps) {
  // State for memory stats
  const [stats, setStats] = useState<MemoryStats>(DEFAULT_MEMORY_STATS);
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>(initialQualityLevel);
  
  // Refs for resource tracking
  const resources = useRef<Map<string, TrackedResource>>(new Map());
  const disposedResources = useRef<Set<string>>(new Set());
  const lastGCTime = useRef<number>(0);
  const gcIntervalRef = useRef<number>(gcInterval);
  const { scene } = useThree();
  
  // Register a resource for tracking
  const registerResource = (resource: Omit<TrackedResource, 'lastUsed'>): string => {
    const id = resource.id || `${resource.type}_${Math.random().toString(36).substr(2, 9)}`;
    resources.current.set(id, {
      ...resource,
      lastUsed: Date.now()
    });
    return id;
  };
  
  // Unregister a resource
  const unregisterResource = (id: string): void => {
    if (resources.current.has(id)) {
      const resource = resources.current.get(id)!;
      
      // Dispose if needed
      if (resource.isDisposable && resource.resource && typeof resource.resource.dispose === 'function') {
        resource.resource.dispose();
      }
      
      // Call custom dispose callback if provided
      if (resource.disposeCallback) {
        resource.disposeCallback();
      }
      
      resources.current.delete(id);
      disposedResources.current.add(id);
    }
  };
  
  // Update last used timestamp for a resource
  const updateResourceUsage = (id: string): void => {
    if (resources.current.has(id)) {
      const resource = resources.current.get(id)!;
      resources.current.set(id, {
        ...resource,
        lastUsed: Date.now()
      });
    }
  };
  
  // Force garbage collection - more aggressive approach
  const forceGarbageCollection = (): void => {
    const now = Date.now();
    let disposedCount = 0;
    let disposedSize = 0;
    
    // Sort resources by priority (ascending) and last used (ascending)
    const resourcesArray = Array.from(resources.current.values())
      .filter(r => r.isDisposable)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.lastUsed - b.lastUsed;
      });
    
    // Calculate current memory usage
    const currentMemory = calculateTotalMemory();
    
    // Determine how aggressive to be with GC based on memory pressure - more aggressive values
    let disposalTarget = 0;
    if (currentMemory > MEMORY_THRESHOLDS.CRITICAL) {
      // Critical: dispose up to 60% of disposable resources (increased from 40%)
      disposalTarget = 0.6;
    } else if (currentMemory > MEMORY_THRESHOLDS.HIGH) {
      // High: dispose up to 45% of disposable resources (increased from 30%)
      disposalTarget = 0.45;
    } else if (currentMemory > MEMORY_THRESHOLDS.MEDIUM) {
      // Medium: dispose up to 30% of disposable resources (increased from 20%)
      disposalTarget = 0.3;
    } else if (currentMemory > MEMORY_THRESHOLDS.LOW) {
      // Low: dispose up to 15% of disposable resources (increased from 10%)
      disposalTarget = 0.15;
    }
    
    // Calculate how many resources to dispose
    const targetCount = Math.ceil(resourcesArray.length * disposalTarget);
    
    // Dispose resources
    for (let i = 0; i < targetCount && i < resourcesArray.length; i++) {
      const resource = resourcesArray[i];
      
      // Skip recently used high-priority resources - reduced time threshold
      if (resource.priority > 7 && now - resource.lastUsed < 30000) { // Reduced from 60000ms (60s) to 30000ms (30s)
        continue;
      }
      
      // Dispose the resource
      if (resource.resource && typeof resource.resource.dispose === 'function') {
        resource.resource.dispose();
      }
      
      // Call custom dispose callback if provided
      if (resource.disposeCallback) {
        resource.disposeCallback();
      }
      
      resources.current.delete(resource.id);
      disposedResources.current.add(resource.id);
      disposedCount++;
      disposedSize += resource.size;
    }
    
    // Update stats
    setStats(prev => ({
      ...prev,
      disposedCount: prev.disposedCount + disposedCount,
      lastGCTime: now
    }));
    
    // Log GC results
    console.log(`Memory GC: Disposed ${disposedCount} resources (${(disposedSize / (1024 * 1024)).toFixed(2)}MB)`);
    
    // Force texture cache cleanup
    clearTextureCache();
    
    // Force Three.js garbage collection
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        THREE.Cache.clear();
        // Force browser garbage collection if possible
        if (window.gc) {
          try {
            (window as any).gc();
          } catch (e) {
            console.log('Browser GC not available');
          }
        }
      }, 100);
    }
    
    lastGCTime.current = now;
  };
  
  // Calculate total memory usage
  const calculateTotalMemory = (): number => {
    let geometryMem = 0;
    let textureMem = 0;
    let materialMem = 0;
    let otherMem = 0;
    
    // Sum up memory from tracked resources
    resources.current.forEach(resource => {
      switch (resource.type) {
        case ResourceType.GEOMETRY:
          geometryMem += resource.size;
          break;
        case ResourceType.TEXTURE:
          textureMem += resource.size;
          break;
        case ResourceType.MATERIAL:
          materialMem += resource.size;
          break;
        default:
          otherMem += resource.size;
          break;
      }
    });
    
    // Add texture cache size
    textureMem += getTextureCacheSize() * 1024 * 1024;
    
    // Convert to MB
    const geometryMemMB = geometryMem / (1024 * 1024);
    const textureMemMB = textureMem / (1024 * 1024);
    const materialMemMB = materialMem / (1024 * 1024);
    const otherMemMB = otherMem / (1024 * 1024);
    const totalMemMB = geometryMemMB + textureMemMB + materialMemMB + otherMemMB;
    
    // Determine memory level
    let memoryLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (totalMemMB > MEMORY_THRESHOLDS.CRITICAL) {
      memoryLevel = 'critical';
    } else if (totalMemMB > MEMORY_THRESHOLDS.HIGH) {
      memoryLevel = 'high';
    } else if (totalMemMB > MEMORY_THRESHOLDS.MEDIUM) {
      memoryLevel = 'medium';
    }
    
    // Update stats
    setStats({
      totalMemory: totalMemMB,
      geometryMemory: geometryMemMB,
      textureMemory: textureMemMB,
      materialMemory: materialMemMB,
      otherMemory: otherMemMB,
      resourceCount: resources.current.size,
      disposedCount: disposedResources.current.size,
      memoryLevel,
      lastGCTime: lastGCTime.current || null
    });
    
    return totalMemMB;
  };
  
  // Scan scene for untracked resources
  const scanSceneForResources = () => {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    
    // Traverse scene to find resources
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Track geometry
        if (object.geometry && !geometries.has(object.geometry)) {
          geometries.add(object.geometry);
          
          // Calculate geometry size
          let geometrySize = 0;
          if (object.geometry.attributes) {
            Object.keys(object.geometry.attributes).forEach(key => {
              const attribute = object.geometry.attributes[key as keyof typeof object.geometry.attributes];
              if (attribute && attribute.array) {
                geometrySize += attribute.array.byteLength;
              }
            });
          }
          
          // Register if not already tracked
          const geometryId = object.geometry.uuid;
          if (!resources.current.has(geometryId) && !disposedResources.current.has(geometryId)) {
            registerResource({
              id: geometryId,
              type: ResourceType.GEOMETRY,
              resource: object.geometry,
              size: geometrySize,
              priority: 5, // Medium priority
              isDisposable: true
            });
          }
        }
        
        // Track materials
        if (object.material) {
          // Handle both single materials and arrays of materials
          if (Array.isArray(object.material)) {
            // It's an array of materials
            for (const material of object.material) {
              if (material && !materials.has(material)) {
                materials.add(material);
                
                // Estimate material size (base size + textures)
                let materialSize = 1024; // Base size
                
                // Track textures in material
                const textureProps = [
                  'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
                  'emissiveMap', 'aoMap', 'displacementMap', 'envMap'
                ];
                
                textureProps.forEach(prop => {
                  const texture = (material as any)[prop];
                  if (texture && !textures.has(texture)) {
                    textures.add(texture);
                    
                    // Calculate texture size
                    let textureSize = 0;
                    if (texture.image) {
                      const width = texture.image.width || 1024;
                      const height = texture.image.height || 1024;
                      // Estimate 4 bytes per pixel (RGBA)
                      textureSize = width * height * 4;
                    } else {
                      // Default estimate if image not loaded
                      textureSize = 1024 * 1024 * 4;
                    }
                    
                    // Register texture if not already tracked
                    const textureId = texture.uuid;
                    if (!resources.current.has(textureId) && !disposedResources.current.has(textureId)) {
                      registerResource({
                        id: textureId,
                        type: ResourceType.TEXTURE,
                        resource: texture,
                        size: textureSize,
                        priority: 6, // Medium-high priority
                        isDisposable: true
                      });
                    }
                    
                    materialSize += 512; // Add reference size
                  }
                });
                
                // Register material if not already tracked
                const materialId = material.uuid;
                if (!resources.current.has(materialId) && !disposedResources.current.has(materialId)) {
                  registerResource({
                    id: materialId,
                    type: ResourceType.MATERIAL,
                    resource: material,
                    size: materialSize,
                    priority: 7, // High priority
                    isDisposable: true
                  });
                }
              }
            }
          } else {
            // It's a single material
            const material = object.material;
            if (material && !materials.has(material)) {
              materials.add(material);
              
              // Estimate material size (base size + textures)
              let materialSize = 1024; // Base size
              
              // Track textures in material
              const textureProps = [
                'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
                'emissiveMap', 'aoMap', 'displacementMap', 'envMap'
              ];
              
              textureProps.forEach(prop => {
                const texture = (material as any)[prop];
                if (texture && !textures.has(texture)) {
                  textures.add(texture);
                  
                  // Calculate texture size
                  let textureSize = 0;
                  if (texture.image) {
                    const width = texture.image.width || 1024;
                    const height = texture.image.height || 1024;
                    // Estimate 4 bytes per pixel (RGBA)
                    textureSize = width * height * 4;
                  } else {
                    // Default estimate if image not loaded
                    textureSize = 1024 * 1024 * 4;
                  }
                  
                  // Register texture if not already tracked
                  const textureId = texture.uuid;
                  if (!resources.current.has(textureId) && !disposedResources.current.has(textureId)) {
                    registerResource({
                      id: textureId,
                      type: ResourceType.TEXTURE,
                      resource: texture,
                      size: textureSize,
                      priority: 6, // Medium-high priority
                      isDisposable: true
                    });
                  }
                  
                  materialSize += 512; // Add reference size
                }
              });
              
              // Register material if not already tracked
              const materialId = material.uuid;
              if (!resources.current.has(materialId) && !disposedResources.current.has(materialId)) {
                registerResource({
                  id: materialId,
                  type: ResourceType.MATERIAL,
                  resource: material,
                  size: materialSize,
                  priority: 7, // High priority
                  isDisposable: true
                });
              }
            }
          }
        }
      }
    });
  };
  
  // Update memory stats and check for GC - more frequent checks
  useFrame((state) => {
    // Run more frequently - every 30 frames (about 0.5 second at 60fps) instead of 60 frames
    if (state.clock.elapsedTime - lastGCTime.current > gcIntervalRef.current / 2 && enableAutoGC) {
      // Scan for new resources
      scanSceneForResources();
      
      // Calculate memory usage
      const totalMemory = calculateTotalMemory();
      
      // Check if we need to run garbage collection - lower threshold
      if (totalMemory > MEMORY_THRESHOLDS.MEDIUM) { // Lowered from HIGH to MEDIUM
        forceGarbageCollection();
        
        // Notify about memory warning
        if (onMemoryWarning) {
          onMemoryWarning(stats);
        }
        
        // Adjust quality level based on memory pressure - more aggressive
        if (totalMemory > MEMORY_THRESHOLDS.CRITICAL) {
          // Critical: reduce to minimum quality
          if (qualityLevel !== QualityLevel.MINIMUM) {
            setQualityLevel(QualityLevel.MINIMUM);
            console.log('Memory pressure critical: Setting quality to MINIMUM');
          }
        } else if (totalMemory > MEMORY_THRESHOLDS.HIGH) {
          // High: reduce quality by one level
          const qualityLevels = Object.values(QualityLevel);
          const currentIndex = qualityLevels.indexOf(qualityLevel);
          if (currentIndex < qualityLevels.length - 1) {
            setQualityLevel(qualityLevels[currentIndex + 1] as QualityLevel);
            console.log(`Memory pressure high: Reducing quality to ${qualityLevels[currentIndex + 1]}`);
          }
        }
      }
    }
  });
  
  // Context value
  const contextValue: MemoryManagerContextType = {
    stats,
    registerResource,
    unregisterResource,
    updateResourceUsage,
    forceGarbageCollection,
    setQualityLevel
  };
  
  return (
    <MemoryManagerContext.Provider value={contextValue}>
      {children}
      {stats.memoryLevel === 'critical' && <MemoryWarning stats={stats} />}
    </MemoryManagerContext.Provider>
  );
}

// Hook to use memory manager
export function useMemoryManager() {
  const context = useContext(MemoryManagerContext);
  if (!context) {
    throw new Error('useMemoryManager must be used within a MemoryManager');
  }
  return context;
}

// Memory warning component
interface MemoryWarningProps {
  stats: MemoryStats;
}

function MemoryWarning({ stats }: MemoryWarningProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-2 text-center text-sm font-bold">
      Memory usage critical: {stats.totalMemory.toFixed(1)}MB. Performance may be affected.
    </div>
  );
}

// Helper to estimate size of a Three.js object
export function estimateObjectSize(object: THREE.Object3D): number {
  let totalSize = 0;
  
  // Base object size
  totalSize += 1024; // Base object overhead
  
  // Add geometry size if present
  if ((object as THREE.Mesh).geometry) {
    const geometry = (object as THREE.Mesh).geometry;
    let geometrySize = 1024; // Base geometry overhead
    
    // Add attribute sizes
    if (geometry.attributes) {
      Object.keys(geometry.attributes).forEach(key => {
        const attribute = geometry.attributes[key as keyof typeof geometry.attributes];
        if (attribute && attribute.array) {
          geometrySize += attribute.array.byteLength;
        }
      });
    }
    
    // Add index size if present
    if (geometry.index && geometry.index.array) {
      geometrySize += geometry.index.array.byteLength;
    }
    
    totalSize += geometrySize;
  }
  
  // Add material size if present
  if ((object as THREE.Mesh).material) {
    const materials = Array.isArray((object as THREE.Mesh).material) 
      ? (object as THREE.Mesh).material 
      : [(object as THREE.Mesh).material];
    
    materials.forEach(material => {
      let materialSize = 1024; // Base material overhead
      
      // Add texture sizes
      const textureProps = [
        'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
        'emissiveMap', 'aoMap', 'displacementMap', 'envMap'
      ];
      
      textureProps.forEach(prop => {
        const texture = (material as any)[prop];
        if (texture) {
          let textureSize = 1024; // Base texture overhead
          
          // Add image size if present
          if (texture.image) {
            const width = texture.image.width || 1024;
            const height = texture.image.height || 1024;
            // Estimate 4 bytes per pixel (RGBA)
            textureSize += width * height * 4;
          }
          
          materialSize += textureSize;
        }
      });
      
      totalSize += materialSize;
    });
  }
  
  return totalSize;
} 