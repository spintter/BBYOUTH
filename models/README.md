# 3D Model Pipeline

This directory contains the model pipeline for the Birmingham-Bessemer Youth Ministries chess scene. The pipeline handles optimization and processing of 3D models, specifically the African girl character in both pawn and queen states.

## Directory Structure

```
models/
├── source/           # Source models (unoptimized)
│   ├── african-girl-pawn.glb
│   └── african-girl-queen.glb
└── public/           # Optimized models for production
    ├── african-girl-pawn.glb
    └── african-girl-queen.glb
```

## Model Requirements

- Triangle count: < 10,000 per model
- Texture resolution: ≤ 2K (2048x2048)
- PSNR: > 40 dB for textures
- Format: GLB with KTX2 textures
- LOD levels: 3 (high, medium, low)

## Optimization Pipeline

The pipeline performs the following optimizations:

1. Mesh optimization:
   - Vertex deduplication
   - Triangle reduction
   - LOD generation

2. Texture optimization:
   - KTX2 compression
   - Mipmap generation
   - Resolution adjustment

3. Performance features:
   - DRACO mesh compression
   - Adaptive quality settings
   - WebGPU support detection

## Usage

1. Place source models in `models/source/`:
   - `african-girl-pawn.glb`: Base pawn model
   - `african-girl-queen.glb`: Transformed queen model

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the optimization pipeline:
   ```bash
   npm run process-models
   ```

4. Optimized models will be available in `public/models/`

## Quality Settings

The pipeline supports three quality levels:

- **High**:
  - Full geometry (10,000 triangles)
  - 2K textures
  - UASTC compression

- **Medium**:
  - 50% geometry reduction
  - 1K textures
  - ETC1S compression

- **Low**:
  - 75% geometry reduction
  - 512px textures
  - ETC1S compression

Quality levels are automatically selected based on device capabilities and performance metrics.

## Development

The pipeline is implemented in TypeScript and uses the following tools:

- `@gltf-transform`: Core model processing
- `ktx2-encoder`: Texture compression
- `draco3d`: Mesh compression
- Three.js: Runtime optimization

See `utils/modelOptimizer.ts` and `scripts/processModels.ts` for implementation details. 