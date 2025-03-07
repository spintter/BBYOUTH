# Birmingham-Bessemer Youth Ministries - 3D Chessboard

This project features a highly optimized 3D chessboard component for the Birmingham-Bessemer Youth Ministries website. The chessboard represents knowledge and strategy, featuring culturally authentic African design elements and materials.

## Features

- **WebGPU Support**: Automatically detects and uses WebGPU when available, with fallback to WebGL
- **Adaptive Quality**: Dynamically adjusts rendering quality based on device capabilities and performance
- **Memory Management**: Prevents memory leaks and optimizes resource usage
- **KTX2 Texture Compression**: Reduces texture memory usage by up to 80%
- **Level of Detail (LOD)**: Automatically switches between high, medium, and low-poly models based on distance
- **PBR Materials**: Physically-based rendering with culturally authentic African materials
- **Performance Monitoring**: Real-time monitoring of FPS, frame time, memory usage, and more
- **Optimized Lighting**: HDR environment mapping, dramatic spotlights, and accumulative shadows

## Technical Specifications

The 3D implementation follows strict performance and quality standards:

- **Frame Rate**: Maintains 60+ FPS with frame times under 16ms and variance below 1ms
- **Memory Usage**: Keeps memory footprint under 500MB
- **Texture Quality**: Uses 8K textures on high-end devices, scaling down to 2K on mobile
- **Geometry Optimization**: Caps poly counts at 20,000 triangles, using instancing and LODs
- **Compression**: Applies KTX2 compression targeting an 80% size reduction with <5% quality loss

## Components

The implementation consists of several specialized components:

### Core Components

- `OptimizedChessboard.tsx`: Main component that integrates all optimization systems
- `WebGPUDetection.tsx`: Detects WebGPU support and provides appropriate renderer
- `PerformanceMonitor.tsx`: Monitors performance metrics and adapts quality settings
- `MemoryManager.tsx`: Manages memory usage and implements garbage collection

### Asset Management

- `OptimizedModelLoader.tsx`: Loads 3D models with LOD support and optimizations
- `KTX2TextureLoader.tsx`: Loads compressed textures with fallback for unsupported devices

### Materials and Lighting

- `AfricanSkinMaterial.tsx`: PBR material for realistic African skin tones
- `TransformationLighting.tsx`: Advanced lighting setup for dramatic effects

## Usage

### Basic Usage

```tsx
import { OptimizedChessboard } from '@/components/OptimizedChessboard';

export default function ChessboardPage() {
  return (
    <div className="h-screen">
      <OptimizedChessboard />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { OptimizedChessboard } from '@/components/OptimizedChessboard';
import { QualityLevel } from '@/components/PerformanceMonitor';

export default function ChessboardPage() {
  return (
    <div className="h-screen">
      <OptimizedChessboard
        initialQualityLevel={QualityLevel.HIGH}
        enableWebGPU={true}
        enablePerformanceMonitoring={true}
        enableMemoryManagement={true}
        backgroundColor="#1a1a2e"
        environmentMap="/hdri/african_sunset.hdr"
        cameraPosition={[5, 5, 5]}
        showStats={true}
      />
    </div>
  );
}
```

## Props

The `OptimizedChessboard` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialQualityLevel` | `QualityLevel` | `QualityLevel.HIGH` | Initial quality level |
| `enableWebGPU` | `boolean` | `true` | Enable WebGPU detection and usage |
| `enablePerformanceMonitoring` | `boolean` | `true` | Enable performance monitoring and adaptive quality |
| `enableMemoryManagement` | `boolean` | `true` | Enable memory management and garbage collection |
| `backgroundColor` | `string` | `'#1a1a2e'` | Background color |
| `environmentMap` | `string` | `'/hdri/african_sunset.hdr'` | Path to environment map |
| `cameraPosition` | `[number, number, number]` | `[5, 5, 5]` | Initial camera position |
| `showStats` | `boolean` | `false` | Show performance stats |

## Quality Levels

The component supports five quality levels:

- `QualityLevel.ULTRA`: 8K textures, 16x anisotropy, ray tracing, global illumination
- `QualityLevel.HIGH`: 8K textures, 16x anisotropy, ray tracing
- `QualityLevel.MEDIUM`: 4K textures, 8x anisotropy, no ray tracing
- `QualityLevel.LOW`: 2K textures, 4x anisotropy, minimal effects
- `QualityLevel.MINIMUM`: 2K textures, 1x anisotropy, no effects

## Performance Optimization

The implementation includes several performance optimization techniques:

1. **Adaptive Quality**: Automatically adjusts quality settings based on device capabilities and performance
2. **Memory Management**: Tracks and disposes of unused resources to prevent memory leaks
3. **Texture Compression**: Uses KTX2 texture compression to reduce memory usage
4. **Level of Detail**: Switches between high, medium, and low-poly models based on distance
5. **Instancing**: Uses instancing for repeated geometry to reduce draw calls
6. **Shader Optimization**: Optimizes shaders for performance and visual quality
7. **Lazy Loading**: Loads assets only when needed to reduce initial load time

## Cultural Authenticity

The implementation emphasizes cultural authenticity through:

1. **African Materials**: PBR materials based on authentic African woods, fabrics, and skin tones
2. **Cultural Symbolism**: Integration of Adinkra symbols and patterns
3. **Realistic Lighting**: Environment maps based on African landscapes and lighting conditions
4. **Authentic Design**: Chess pieces designed with African cultural elements

## Browser Support

- **Modern Browsers**: Chrome 113+, Edge 113+, Firefox 113+ (WebGL fallback)
- **WebGPU Support**: Chrome 113+, Edge 113+ with WebGPU flag enabled
- **Mobile Support**: Adaptive quality ensures good performance on mobile devices

## Development

### Prerequisites

- Node.js 18+
- Next.js 14+
- Three.js 0.159.0+
- React 18+

### Installation

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js team for the 3D rendering library
- React Three Fiber for the React integration
- KTX2 and Basis Universal for texture compression
- Birmingham-Bessemer Youth Ministries for the opportunity to create this project