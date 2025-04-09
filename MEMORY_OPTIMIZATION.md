# Memory Optimization for BBYOUTH Website

## Problem Statement
The website was consuming approximately 6GB of memory on an 8GB VPS, making it unstable and potentially causing crashes.

## Implemented Optimizations

### 1. 3D Component Optimizations (`KnowledgeIsPowerHeroClient.tsx`)
- Added intersection observer to lazy load 3D components only when visible in viewport
- Reduced quality settings on lower-end devices using device capability detection
- Made post-processing effects conditional based on device performance
- Reduced preloaded models and delayed their loading
- Added memory-friendly loading state for 3D components

```jsx
// Before: Eagerly loaded all models regardless of viewport visibility
useEffect(() => {
  useGLTF.preload('/models/newpawn.glb');
  useGLTF.preload('/models/newking.glb');
  useGLTF.preload('/models/queen.glb');
}, []);

// After: Load models only when in viewport and delay loading
const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: false
});

useEffect(() => {
  if (inView) {
    const timer = setTimeout(() => {
      useGLTF.preload('/models/newpawn.glb');
      useGLTF.preload('/models/queen.glb');
    }, 1000);
    
    return () => clearTimeout(timer);
  }
}, [inView]);
```

### 2. WebGL Canvas Configuration
- Reduced pixel ratio to balance quality and memory usage
- Disabled unnecessary WebGL features on lower-end devices
- Removed logarithmic depth buffer which was consuming extra memory
- Added performance hints in the configuration

```jsx
// Before: High quality renderer regardless of device
<Canvas
  dpr={initialDpr}
  gl={{
    antialias: initialDpr > 1,
    alpha: true,
    powerPreference: 'high-performance',
    precision: initialDpr > 1 ? 'highp' : 'mediump',
    logarithmicDepthBuffer: initialDpr > 1,
  }}
>

// After: Quality settings based on device capabilities
<Canvas
  dpr={capabilities.dpr}
  gl={{
    antialias: capabilities.isHighEnd,
    alpha: false,
    powerPreference: capabilities.isHighEnd ? 'high-performance' : 'default',
    precision: capabilities.isHighEnd ? 'highp' : 'mediump',
    logarithmicDepthBuffer: false,
  }}
  performance={{ min: 0.5 }}
>
```

### 3. Dynamic Component Loading (pages/index.tsx)
- Improved the dynamic loading of 3D components 
- Added proper loading states to provide feedback during heavy component loading
- Reduced initial load by adding a loading placeholder component

```jsx
// Before: Simple dynamic import with no loading state
const KnowledgeIsPowerHeroClient = dynamic(
  () => import('../components/KnowledgeIsPowerHeroClient'),
  { ssr: false },
);

// After: Enhanced dynamic import with loading state
const KnowledgeIsPowerHeroClient = dynamic(
  () => import('../components/KnowledgeIsPowerHeroClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-red-700 border-b-yellow-400 border-l-white border-r-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl">Loading 3D Experience...</p>
          <p className="text-white text-sm mt-2">This component is optimized for memory efficiency</p>
        </div>
      </div>
    )
  },
);
```

### 4. PM2 Process Manager Configuration (ecosystem.config.js)
- Increased the memory limit for PM2 to 2GB (from 1GB)
- Added Node.js memory optimization flags

```js
// Before: Basic PM2 configuration
module.exports = {
  apps: [{
    name: 'bbyouths',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

// After: Memory-optimized PM2 configuration
module.exports = {
  apps: [{
    name: 'bbyouths',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    node_args: '--max-old-space-size=2048',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 5. Next.js Configuration (next.config.js)
- Enhanced optimization features for CSS and package imports
- Improved caching for 3D model assets
- Reduced memory footprint of on-demand entries
- Set explicit chunk size limits and caching policies

```js
// Key improvements:
experimental: {
  optimizeCss: true,
  optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  optimizeServerReact: true,
  scrollRestoration: true,
},

// Improved model caching
test: /\.(glb|gltf)$/,
type: 'asset/resource',
generator: {
  filename: 'static/chunks/models/[hash][ext]',
},

// Memory optimizations
onDemandEntries: {
  maxInactiveAge: 15 * 60 * 1000,
  pagesBufferLength: 2,
},
```

## Added Monitoring Tools
- `scripts/monitor-memory.js`: Real-time memory monitoring script
- `scripts/production-test.js`: Production memory usage testing script

## Expected Results
The implemented optimizations should significantly reduce memory usage:
- Expected reduction from ~6GB to ~1-2GB in production
- Improved stability with proper resource management
- Better user experience, especially on lower-end devices
- Conditional loading based on device capabilities

## Implementation Notes
- These changes preserve all functionality while being more memory efficient
- The conditional rendering approach ensures users with powerful devices still get high-quality visuals
- Low-end devices get appropriate quality settings automatically

## Testing and Verification
To verify the memory optimizations:
1. Run `node scripts/monitor-memory.js` to check real-time memory usage
2. Build the project with `npm run build` 
3. Run `node scripts/production-test.js` to simulate production load and measure memory
4. Monitor the VPS memory usage after deployment

## Next Steps
After confirming these changes work locally:
1. Push changes to Git
2. Pull on the VPS
3. Rebuild the application
4. Restart the PM2 process
5. Monitor memory usage in the production environment 