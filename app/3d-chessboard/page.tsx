'use client';

import { useState } from 'react';
import { OptimizedChessboard } from '@/components/OptimizedChessboard';
import { QualityLevel } from '@/components/PerformanceMonitor';

export default function ChessboardPage() {
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>(QualityLevel.HIGH);
  const [enableWebGPU, setEnableWebGPU] = useState(true);
  const [enablePerformanceMonitoring, setEnablePerformanceMonitoring] = useState(true);
  const [enableMemoryManagement, setEnableMemoryManagement] = useState(true);
  const [showStats, setShowStats] = useState(false);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-indigo-900 text-white p-4">
        <h1 className="text-2xl font-bold">Birmingham-Bessemer Youth Ministries</h1>
        <p className="text-sm">Knowledge is Power: Interactive 3D Chessboard</p>
      </header>
      
      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        {/* 3D Chessboard */}
        <div className="flex-1 relative">
          <OptimizedChessboard
            initialQualityLevel={qualityLevel}
            enableWebGPU={enableWebGPU}
            enablePerformanceMonitoring={enablePerformanceMonitoring}
            enableMemoryManagement={enableMemoryManagement}
            backgroundColor="#1a1a2e"
            environmentMap="/hdri/african_sunset.hdr"
            cameraPosition={[5, 5, 5]}
            showStats={showStats}
          />
        </div>
        
        {/* Controls panel */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          
          {/* Quality settings */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quality Level</label>
            <select
              className="w-full p-2 border rounded"
              value={qualityLevel}
              onChange={(e) => setQualityLevel(e.target.value as QualityLevel)}
            >
              <option value={QualityLevel.ULTRA}>Ultra</option>
              <option value={QualityLevel.HIGH}>High</option>
              <option value={QualityLevel.MEDIUM}>Medium</option>
              <option value={QualityLevel.LOW}>Low</option>
              <option value={QualityLevel.MINIMUM}>Minimum</option>
            </select>
          </div>
          
          {/* WebGPU toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableWebGPU}
                onChange={(e) => setEnableWebGPU(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enable WebGPU (if available)</span>
            </label>
          </div>
          
          {/* Performance monitoring toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enablePerformanceMonitoring}
                onChange={(e) => setEnablePerformanceMonitoring(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enable Performance Monitoring</span>
            </label>
          </div>
          
          {/* Memory management toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableMemoryManagement}
                onChange={(e) => setEnableMemoryManagement(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enable Memory Management</span>
            </label>
          </div>
          
          {/* Stats toggle */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show Performance Stats</span>
            </label>
          </div>
          
          {/* Information */}
          <div className="mt-8 text-xs text-gray-600">
            <h3 className="font-semibold mb-1">Keyboard Controls:</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>F9: Toggle performance stats</li>
              <li>Mouse drag: Rotate camera</li>
              <li>Mouse wheel: Zoom in/out</li>
              <li>Right mouse drag: Pan camera</li>
            </ul>
          </div>
          
          {/* About */}
          <div className="mt-4 text-xs text-gray-600">
            <h3 className="font-semibold mb-1">About:</h3>
            <p>
              This interactive 3D chessboard represents knowledge and strategy, 
              featuring culturally authentic African design elements and materials.
              It demonstrates how learning chess can empower youth with critical 
              thinking skills.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 