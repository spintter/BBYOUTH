/**
 * Performance monitoring and debugging utilities
 * This file provides tools for measuring and optimizing application performance
 */

import { useEffect, useState } from 'react';

// Performance marker types
export type PerformanceMarker = {
  name: string;
  startTime: number;
  duration?: number;
  data?: Record<string, any>;
};

// Global performance markers store
const performanceMarkers: Record<string, PerformanceMarker> = {};

// Debug mode control
let debugMode = process.env.NODE_ENV === 'development' || false;

/**
 * Enable or disable debug mode
 */
export function setDebugMode(enabled: boolean): void {
  debugMode = enabled;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('debugMode', enabled ? 'true' : 'false');
  }
  console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Get current debug mode status
 */
export function getDebugMode(): boolean {
  // Initialize from localStorage if available
  if (typeof localStorage !== 'undefined' && typeof debugMode === 'undefined') {
    debugMode = localStorage.getItem('debugMode') === 'true';
  }
  return debugMode;
}

/**
 * Start measuring performance for a named operation
 */
export function startMeasure(name: string, data?: Record<string, any>): void {
  if (!debugMode) return;
  
  performanceMarkers[name] = {
    name,
    startTime: performance.now(),
    data
  };
  
  // Use browser Performance API when available
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${name}:start`);
  }
  
  console.debug(`[PERF] Started: ${name}`);
}

/**
 * End measuring performance for a named operation
 */
export function endMeasure(name: string, additionalData?: Record<string, any>): number | undefined {
  if (!debugMode) return;
  
  const marker = performanceMarkers[name];
  if (!marker) {
    console.warn(`[PERF] No matching start marker found for: ${name}`);
    return;
  }
  
  const endTime = performance.now();
  const duration = endTime - marker.startTime;
  
  // Update marker with duration and additional data
  marker.duration = duration;
  if (additionalData) {
    marker.data = { ...marker.data, ...additionalData };
  }
  
  // Use browser Performance API for more accurate metrics
  if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
    performance.mark(`${name}:end`);
    try {
      performance.measure(name, `${name}:start`, `${name}:end`);
    } catch (e) {
      console.error('Performance measurement error:', e);
    }
  }
  
  console.debug(`[PERF] Completed: ${name} (${duration.toFixed(2)}ms)`, marker.data);
  return duration;
}

/**
 * Log all performance markers to console
 */
export function logPerformanceMarkers(): void {
  if (!debugMode) return;
  
  console.group('Performance Markers');
  Object.values(performanceMarkers)
    .sort((a, b) => (b.duration || 0) - (a.duration || 0))
    .forEach(marker => {
      if (marker.duration) {
        console.log(`${marker.name}: ${marker.duration.toFixed(2)}ms`, marker.data || '');
      } else {
        console.log(`${marker.name}: Not completed`, marker.data || '');
      }
    });
  console.groupEnd();
}

/**
 * Clear all performance markers
 */
export function clearPerformanceMarkers(): void {
  if (!debugMode) return;
  
  Object.keys(performanceMarkers).forEach(key => {
    delete performanceMarkers[key];
  });
  
  // Also clear browser performance entries if available
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
  
  console.debug('[PERF] All markers cleared');
}

/**
 * React hook to measure component render time
 */
export function useRenderTime(componentName: string, dependencies: any[] = []): void {
  useEffect(() => {
    if (!debugMode) return;
    
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      console.debug(`[RENDER] ${componentName}: ${duration.toFixed(2)}ms`);
    };
  }, dependencies);
}

/**
 * React hook to track metrics related to component visibility
 */
export function useVisibilityMetrics(elementRef: React.RefObject<HTMLElement>, name: string): Record<string, any> {
  const [metrics, setMetrics] = useState<Record<string, any>>({
    visible: false,
    visibleSince: 0,
    timeToVisible: 0
  });
  
  useEffect(() => {
    if (!debugMode || !elementRef.current) return;
    
    const pageLoadTime = performance.timing?.navigationStart || 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metrics.visible) {
          const now = performance.now();
          const timeToVisible = pageLoadTime ? now - pageLoadTime : 0;
          
          setMetrics({
            visible: true,
            visibleSince: now,
            timeToVisible
          });
          
          console.debug(`[VISIBILITY] ${name} became visible after ${timeToVisible.toFixed(0)}ms`);
        }
      });
    });
    
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef, name, metrics.visible]);
  
  return metrics;
}

/**
 * Add device tier and debug info to the window object for browser console access
 */
export function initDebugTools(): void {
  if (typeof window === 'undefined' || !debugMode) return;
  
  // Add debugging tools to window object
  (window as any).__DEBUG__ = {
    performanceMarkers,
    startMeasure,
    endMeasure,
    logPerformanceMarkers,
    clearPerformanceMarkers,
    setDebugMode,
    getDeviceTier: () => {
      const ua = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isOldBrowser = !('IntersectionObserver' in window);
      
      if (isOldBrowser) return 'low';
      if (isMobile) return 'medium';
      return 'high';
    },
    // Add memory info if available
    getMemoryInfo: () => {
      if ((performance as any).memory) {
        return (performance as any).memory;
      }
      return 'Not available';
    }
  };
  
  console.debug('[DEBUG] Debug tools initialized - use window.__DEBUG__ in console');
}

// Export a cache helper to manage cache in client components
export const cacheHelpers = {
  // Save data to localStorage with expiration
  set: (key: string, data: any, expirationHours = 24): void => {
    if (typeof localStorage === 'undefined') return;
    
    const item = {
      data,
      expiry: new Date().getTime() + (expirationHours * 60 * 60 * 1000)
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },
  
  // Get data from localStorage with expiration check
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    if (typeof localStorage === 'undefined') return defaultValue;
    
    const itemStr = localStorage.getItem(`cache_${key}`);
    if (!itemStr) return defaultValue;
    
    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      
      // Check if expired
      if (now > item.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return defaultValue;
      }
      
      return item.data;
    } catch (e) {
      return defaultValue;
    }
  },
  
  // Clear specific or all cache items
  clear: (key?: string): void => {
    if (typeof localStorage === 'undefined') return;
    
    if (key) {
      localStorage.removeItem(`cache_${key}`);
    } else {
      // Clear all cache items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      }
    }
  }
};

// Auto-initialize debug tools if in development environment
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  initDebugTools();
} 