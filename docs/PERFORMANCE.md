# Performance Optimization Guide

This document outlines the performance optimizations implemented in the project and provides guidance for maintaining optimal performance.

## Implemented Optimizations

### 3D Scene Optimizations

1. **Model Optimization**
   - Reduced polygon count in 3D models using mesh simplification
   - Optimized `african-girl.glb` (3.11% size reduction)
   - Optimized `african-queen.glb` (23.31% size reduction)
   - Added model preloading to prevent jank during initial load

2. **Rendering Optimizations**
   - Throttled animation updates to reduce CPU/GPU load
   - Simplified lighting setup (reduced from 5 lights to 3)
   - Lowered pixel density on high-DPI displays (`dpr={[1, 1.5]}` instead of `[1, 2]}`)
   - Added `frameloop="demand"` to only render when needed
   - Implemented performance mode for low-end devices

3. **CSS and Visual Effects**
   - Simplified particle effects using CSS background gradients
   - Removed expensive light ray effects
   - Added `will-change` hints for better GPU acceleration
   - Added slower animations for mobile/low-end devices

4. **Scroll and Interaction Optimizations**
   - Implemented debounced scroll handling
   - Throttled mouse move events to ~60fps
   - Rounded scroll values to reduce update frequency

## Maintenance Guidelines

### Adding New 3D Models

When adding new 3D models to the project:

1. Place the original model in `public/models/`
2. Run the optimization script:
   ```bash
   node scripts/optimize-models.js
   ```
3. Use the optimized model in your components:
   ```jsx
   const { scene } = useGLTF('/models/your-model-optimized.glb');
   ```
4. Add preloading for the model:
   ```jsx
   useGLTF.preload('/models/your-model-optimized.glb');
   ```

### Performance Testing

Test your changes on various devices and browsers:

1. **Low-end Mobile Devices**
   - Check for smooth animations and transitions
   - Verify that the fallback component loads when WebGL is not supported

2. **High-end Devices**
   - Ensure visual quality is maintained
   - Check that animations are smooth and responsive

3. **Browser DevTools**
   - Use Chrome DevTools Performance panel to identify bottlenecks
   - Monitor memory usage and frame rate

## Troubleshooting

### Common Issues

1. **High CPU/GPU Usage**
   - Check for unnecessary animations or effects
   - Consider further throttling animation updates
   - Reduce lighting complexity

2. **Memory Leaks**
   - Ensure all resources are properly disposed
   - Check for event listeners that aren't removed

3. **Slow Initial Load**
   - Implement code splitting for large components
   - Consider using smaller, optimized textures
   - Add loading indicators for better user experience

## Scripts

The project includes several scripts to help with performance optimization:

- `scripts/optimize-models.js` - Optimizes 3D models
- `scripts/copy-optimized-models.js` - Copies optimized models from desktop to project

## Resources

- [React Three Fiber Performance Tips](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance)
- [Three.js Performance](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html) 