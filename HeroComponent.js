// HeroComponent.js
'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader, RepeatWrapping, LinearSRGBColorSpace, Color, Vector3 } from 'three';
import { Environment, OrbitControls, Html, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Error Boundary with Retry Mechanism
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleError = (error) => {
      console.error("3D Scene Error:", error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleRetry = () => {
    if (retryCount < 2) {
      setHasError(false);
      setRetryCount(retryCount + 1);
    }
  };

  if (hasError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="text-center p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-bold text-amber-600 mb-2">Visualization Error</h2>
          <p className="text-white mb-4">Unable to load 3D content.</p>
          {retryCount < 2 && (
            <button
              onClick={handleRetry}
              className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  return children;
};

// Loading Indicator with Progress
const LoadingIndicator = ({ progress }) => (
  <Html center>
    <div className="flex flex-col items-center text-white">
      <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold">Loading: {Math.round(progress * 100)}%</p>
    </div>
  </Html>
);

// Text Overlay with Animation and Accessibility
const TextOverlay = ({ title, subtitle, ctaText }) => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.5,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/4 left-4 md:top-1/3 md:left-12 text-white max-w-lg z-10"
      aria-label="Hero Section Content"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg bg-black bg-opacity-50 p-2 rounded">
        {title}
      </h1>
      <p className="text-lg md:text-xl mb-6 opacity-90 bg-black bg-opacity-50 p-2 rounded">
        {subtitle}
      </p>
      <button
        className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        aria-label="Explore Programs Button"
      >
        {ctaText}
      </button>
    </div>
  );
};

// Chessboard with Animation and Optimization
const Chessboard = ({ textureUrls, fallbackTextureUrls }) => {
  const [textures, setTextures] = useState(null);
  const { clock } = useThree();

  useEffect(() => {
    const loadTextures = async (urls, isFallback = false) => {
      try {
        const loadedTextures = await Promise.all(
          urls.map(url => new TextureLoader().loadAsync(url))
        );
        loadedTextures.forEach(texture => {
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.repeat.set(0.25, 0.25);
          texture.colorSpace = LinearSRGBColorSpace;
        });
        setTextures(loadedTextures);
      } catch (err) {
        console.error(`Texture Load Error${isFallback ? ' (fallback)' : ''}:`, err);
        if (!isFallback) loadTextures(fallbackTextureUrls, true);
      }
    };
    loadTextures(textureUrls);
  }, [textureUrls, fallbackTextureUrls]);

  const tilesRef = useRef([]);
  useFrame(() => {
    tilesRef.current.forEach((tile, idx) => {
      if (tile) {
        const time = clock.getElapsedTime();
        tile.position.y = Math.sin(time + idx) * 0.05; // Subtle pulse effect
      }
    });
  });

  if (!textures) return null;
  const [baseColor, roughness, normal] = textures;

  return (
    <group rotation={[-Math.PI / 8, 0, 0]}>
      {Array.from({ length: 64 }).map((_, index) => {
        const x = (index % 8) * 2 - 7;
        const z = Math.floor(index / 8) * 2 - 7;
        const isDark = ((index % 8) + Math.floor(index / 8)) % 2 === 0;
        return (
          <mesh
            ref={el => (tilesRef.current[index] = el)}
            position={[x, 0, z]}
            key={index}
            receiveShadow
          >
            <boxGeometry args={[1.9, 0.2, 1.9]} />
            <meshStandardMaterial
              color={isDark ? '#121212' : '#ffffff'}
              map={baseColor}
              roughnessMap={roughness}
              normalMap={normal}
              metalness={0.1}
              emissive={isDark ? '#000000' : '#333333'}
              emissiveIntensity={isDark ? 0 : 0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Black Panther Figure with Transformation Effects
const BlackPantherFigure = ({ phase }) => {
  const groupRef = useRef();
  const materialRef = useRef();
  const model = useGLTF('/models/black_panther.glb');

  useEffect(() => {
    if (model.nodes) materialRef.current = model.materials.suit;
  }, [model.nodes]);

  useGSAP(() => {
    if (!materialRef.current || !groupRef.current) return;
    const initialColor = new Color('#182445');
    const transformedColor = new Color('#5a2a17');

    gsap.to(materialRef.current.color, {
      r: phase === 'transformed' ? transformedColor.r : initialColor.r,
      g: phase === 'transformed' ? transformedColor.g : initialColor.g,
      b: phase === 'transformed' ? transformedColor.b : initialColor.b,
      duration: 2,
      ease: 'power2.inOut',
    });

    // Add emissive glow when transformed
    gsap.to(materialRef.current, {
      emissiveIntensity: phase === 'transformed' ? 0.3 : 0,
      duration: 2,
      ease: 'power2.inOut',
    });

    gsap.to(groupRef.current.position, {
      y: phase === 'transformed' ? 2 : 1.5,
      duration: 1.5,
      ease: 'elastic.out(1, 0.3)',
    });

    gsap.to(groupRef.current.rotation, {
      y: phase === 'transformed' ? Math.PI * 0.75 : Math.PI / 4,
      duration: 2,
      ease: 'power2.out',
    });
  }, [phase]);

  return (
    <group ref={groupRef} position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
      <mesh geometry={model.nodes?.body.geometry} material={materialRef.current} castShadow receiveShadow />
    </group>
  );
};

// Particle System for Transformation
const TransformationParticles = ({ active, position }) => {
  const particlesRef = useRef();
  const { clock } = useThree();

  const particleCount = 150; // Increased particle count
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2; // Wider spread
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (active && particlesRef.current) {
      const time = clock.getElapsedTime();
      particlesRef.current.position.y += 0.02;
      particlesRef.current.rotation.y += 0.01;
      particlesRef.current.material.opacity = Math.max(0, 1 - (time % 2));
    }
  });

  if (!active) return null;

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#f59e0b" size={0.08} transparent />
    </points>
  );
};

// Added rim lights to highlight edge contours
const RimLights = () => {
  return (
    <>
      <spotLight
        position={[-10, 5, 5]}
        angle={0.2}
        penumbra={0.8}
        intensity={3}
        color="#3b82f6"
        castShadow={false}
      />
      <spotLight
        position={[10, 5, -5]}
        angle={0.2}
        penumbra={0.8}
        intensity={3}
        color="#f43f5e"
        castShadow={false}
      />
    </>
  );
};

// Hero Scene with Enhanced Lighting and Environment
const HeroScene = ({ textureUrls, fallbackTextureUrls }) => {
  const [animationPhase, setAnimationPhase] = useState('initial');
  const blackPantherRef = useRef();

  // Scene background color reference
  const sceneRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (scene) {
      // Set a very dark background
      scene.background = new Color('#050505');
      scene.fog = null; // Remove fog if any
      sceneRef.current = scene;
    }

    const timer = setTimeout(() => setAnimationPhase('transformed'), 3000);
    return () => clearTimeout(timer);
  }, [scene]);

  return (
    <>
      {/* Reduced ambient light for more dramatic shadows */}
      <ambientLight intensity={0.3} color="#202020" />

      {/* Main directional light with shadows */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Spotlight that follows the character */}
      <spotLight
        position={[5, 15, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={animationPhase === 'transformed' ? 4 : 1}
        color="#f59e0b"
        castShadow
        target={blackPantherRef.current}
        shadow-bias={-0.0001}
      />

      {/* Add dramatic rim lighting */}
      <RimLights />

      {/* Chessboard with improved contrast */}
      <Chessboard textureUrls={textureUrls} fallbackTextureUrls={fallbackTextureUrls} />

      {/* Character with reference for spotlight targeting */}
      <BlackPantherFigure ref={blackPantherRef} phase={animationPhase} />

      {/* Enhanced particle effects */}
      <TransformationParticles active={animationPhase === 'transformed'} position={[0, 1.5, 0]} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 4}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Scene environment */}
      <Environment files="/hdr/wakanda.hdr" />
    </>
  );
};

// Main Hero Component with Configurability
export default function HeroComponent({
  modelPath = '/models/black_panther.glb',
  textureUrls = [
    '/textures/african-wood-base.jpg',
    '/textures/african-wood-roughness.jpg',
    '/textures/african-wood-normal.jpg',
  ],
  fallbackTextureUrls = [
    '/textures/fallback-base.jpg',
    '/textures/fallback-roughness.jpg',
    '/textures/fallback-normal.jpg',
  ],
  title = 'BBYM Community Center for The Humanities',
  subtitle = 'Strategic Discourse. Cultural Wisdom.',
  ctaText = 'Explore Programs',
}) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    let loaded = 0;
    const total = textureUrls.length + 1; // Textures + model

    const updateProgress = () => {
      loaded++;
      setLoadingProgress(loaded / total);
    };

    Promise.all([
      loader.loadAsync(modelPath, updateProgress),
      ...textureUrls.map(url => textureLoader.loadAsync(url, updateProgress)),
    ]).catch(err => console.error('Asset Preload Error:', err));
  }, [modelPath, textureUrls]);

  return (
    <ErrorBoundary>
      <div className="relative h-screen w-full overflow-hidden">
        {/* Canvas with improved shadow settings */}
        <Canvas
          shadows={{ type: 'PCFSoftShadowMap', enabled: true }}
          camera={{ position: [0, 8, 12], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            logarithmicDepthBuffer: true,
            toneMappingExposure: 1.2
          }}
          dpr={[1, 2]} // Better performance on high-DPI screens
        >
          <Suspense fallback={<LoadingIndicator progress={loadingProgress} />}>
            <HeroScene textureUrls={textureUrls} fallbackTextureUrls={fallbackTextureUrls} />
          </Suspense>
        </Canvas>
        <TextOverlay title={title} subtitle={subtitle} ctaText={ctaText} />
      </div>
    </ErrorBoundary>
  );
}