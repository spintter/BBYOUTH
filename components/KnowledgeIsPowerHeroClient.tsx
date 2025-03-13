'use client';

import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MeshoptDecoder } from 'meshoptimizer';
import gsap from 'gsap';
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Define the shader material with proper uniforms structure
const skyMaterialShader = shaderMaterial(
  { uniforms: { uTime: { value: 0 } } },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec3 color = vec3(0.1, 0.1, 0.18); // Dark base color
      float stars = fract(sin(dot(uv * 1000.0, vec2(12.9898, 78.233))) * 43758.5453);
      color += vec3(stars * 0.3);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Wrap the shader material in a React component using forwardRef
const SkyMaterial = forwardRef((props: { uTime: number }, ref: React.Ref<THREE.ShaderMaterial>) => {
  const material = useRef(new skyMaterialShader({ uniforms: { uTime: { value: props.uTime } } }));
  return <primitive object={material.current} ref={ref} {...props} />;
});
extend({ SkyMaterial });

// Define props interface
interface KnowledgeIsPowerHeroProps {
  title?: string;
  subtitle?: string;
}

// Chess piece props interface
interface ChessPieceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  type: 'african-girl' | 'african-queen';
  onClick?: () => void;
}

// Chessboard props interface
interface ChessboardProps {
  onPieceClick: () => void;
}

// Scene props interface
interface SceneProps {
  onPieceClick: () => void;
}

// Preload models
useGLTF.preload('/models/african-girl-optimized.glb');
useGLTF.preload('/models/african-queen-optimized.glb');
useGLTF.preload('/models/stars-optimized.glb');
useGLTF.preload('/models/chessboard-optimized.glb');

// Chess Piece Component
const ChessPiece: React.FC<ChessPieceProps> = ({ position, rotation, scale, type, onClick }) => {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF(`/models/${type}-optimized.glb`);

  useFrame(() => {
    if (group.current && type === 'african-girl') {
      group.current.rotation.y += 0.005;
    }
  });

  const meshNode = Object.values(nodes).find((node) => node instanceof THREE.Mesh) as THREE.Mesh | undefined;

  if (!meshNode) {
    console.error(`No mesh found in ${type}-optimized.glb`);
    return null;
  }

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={meshNode.geometry}
      >
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Chessboard Component
const Chessboard: React.FC<ChessboardProps> = ({ onPieceClick }) => {
  const boardRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF('/models/chessboard-optimized.glb');

  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      boardRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  const meshNode = nodes.Object_0 as THREE.Mesh;

  if (!meshNode || !meshNode.geometry) {
    console.error('No valid mesh found in chessboard-optimized.glb');
    return null;
  }

  return (
    <group ref={boardRef}>
      <mesh
        receiveShadow
        geometry={meshNode.geometry}
      >
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <ChessPiece
        type="african-girl"
        position={[-2, 0.5, 2]}
        rotation={[0, 0, 0]}
        scale={0.5}
        onClick={onPieceClick}
      />
    </group>
  );
};

// Scene Component
const Scene: React.FC<SceneProps> = ({ onPieceClick }) => {
  const skyRef = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF('/models/stars-optimized.glb');

  useFrame((state) => {
    if (skyRef.current) {
      const material = skyRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const meshNode = nodes['l_TeethDown__Body_Low_0'] as THREE.Mesh;

  if (!meshNode || !meshNode.geometry) {
    console.error('No valid mesh found in stars-optimized.glb');
    return null;
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} castShadow />
      {/* Background Sky with Shader */}
      <mesh ref={skyRef} position={[0, 0, -5]} scale={[10, 10, 1]}>
        <bufferGeometry attach="geometry" {...meshNode.geometry} />
        <SkyMaterial uTime={0} />
      </mesh>
      <Chessboard onPieceClick={onPieceClick} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.5}
      />
      {/* Dispersion Effect */}
      <EffectComposer>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
          radialModulation={false}
          modulationOffset={0.5}
        />
      </EffectComposer>
    </>
  );
};

// Main Component
const KnowledgeIsPowerHero: React.FC<KnowledgeIsPowerHeroProps> = ({
  title = "Knowledge Is Power",
  subtitle = "Empowering youth through chess and cultural education",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformStage, setTransformStage] = useState(0);
  const [message, setMessage] = useState("Click the pawn to transform");

  const handlePieceClick = () => {
    if (transformStage === 0) {
      setTransformStage(1);
      setMessage("From Pawn to Queen: The Journey Begins");
      gsap.timeline()
        .to({}, { duration: 2, onComplete: () => setMessage("Developing Skills & Knowledge") })
        .to({}, { duration: 2, onComplete: () => setMessage("Embracing Leadership & Empowerment") })
        .to({}, { duration: 2, onComplete: () => setMessage("Transformation Complete") });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      gsap.to(container, {
        rotationX: scrollY * 0.02,
        rotationY: scrollY * 0.01,
        ease: 'power2.out',
      });
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative w-full flex flex-col lg:flex-row">
      <div ref={containerRef} className="relative w-full lg:w-1/2 h-[70vh]">
        <Canvas shadows dpr={[1, 2]}>
          {transformStage === 0 ? (
            <Scene onPieceClick={handlePieceClick} />
          ) : (
            <>
              <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <directionalLight position={[-10, 10, -5]} intensity={0.5} castShadow />
              <ChessPiece
                type="african-queen"
                position={[-2, 0.5, 2]}
                rotation={[0, 0, 0]}
                scale={0.5}
              />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.5}
                rotateSpeed={0.5}
              />
              <EffectComposer>
                <ChromaticAberration
                  blendFunction={BlendFunction.NORMAL}
                  offset={new THREE.Vector2(0.001, 0.001)}
                  radialModulation={false}
                  modulationOffset={0.5}
                />
              </EffectComposer>
            </>
          )}
        </Canvas>
      </div>
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
        <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border-l-4 border-[#D4AF37]">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">{title}</h2>
          <p className="text-white/90 mb-4">{subtitle}</p>
          <p className="text-white/70 text-sm italic">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeIsPowerHero;