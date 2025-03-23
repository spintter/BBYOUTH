//components/ChessboardScene.tsx
'use client';

import { useRef, useState, useEffect, createContext, useContext, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  PerspectiveCamera, 
  useTexture, 
  Environment, 
  Trail, 
  useAnimations,
  MeshTransmissionMaterial,
  Text3D,
  useHelper,
  MeshReflectorMaterial,
  Float,
  Preload,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';
import { Group, SpotLight, Vector3, Euler, Object3D, Mesh, DirectionalLightHelper, SpotLightHelper } from 'three';
import { gsap } from 'gsap';

// Define performance context type
interface PerformanceContextType {
  qualityLevel: 'high' | 'medium' | 'low';
  devicePerformance: 'high' | 'medium' | 'low';
}

// Create a context for performance management
const PerformanceContext = createContext<PerformanceContextType>({ 
  qualityLevel: 'high',
  devicePerformance: 'high' 
});

// Custom hook to use performance context
const usePerformance = () => useContext(PerformanceContext);

// Define types for particle data
interface ParticleData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: THREE.Color;
}

// Preload models
useGLTF.preload('/models/chessboard-optimized.glb');
useGLTF.preload('/models/african-girl-optimized.glb');
useGLTF.preload('/models/african-girl.glb');
useGLTF.preload('/models/stars.glb');

// Define prop types for the Sankofa symbol component
interface SankofaSymbolProps {
  position: [number, number, number] | Vector3;
  rotation: [number, number, number] | Euler;
  scale: number | [number, number, number] | Vector3;
  visible: boolean;
}

// Adinkra symbol - Sankofa (represents learning from the past)
function SankofaSymbol({ position, rotation, scale, visible }: SankofaSymbolProps) {
  const sankofaMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      emissive: '#D4AF37',
      emissiveIntensity: 2,
      metalness: 0.8,
      roughness: 0.2,
    });
  }, []);

  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      position={position} 
      rotation={rotation} 
      scale={scale} 
      visible={visible}
    >
      <mesh>
        <torusGeometry args={[0.5, 0.1, 16, 100, Math.PI * 1.5]} />
        <primitive object={sankofaMaterial} attach="material" />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI * 0.25]}>
        <torusGeometry args={[0.3, 0.08, 16, 100, Math.PI]} />
        <primitive object={sankofaMaterial} attach="material" />
      </mesh>
    </Float>
  );
}

// Define prop types for the Kente particles component
interface KenteParticlesProps {
  count?: number;
  visible: boolean;
  target: React.RefObject<Group>;
}

// Kente pattern particles
function KenteParticles({ count = 100, visible, target }: KenteParticlesProps) {
  const { devicePerformance } = usePerformance();
  const actualCount = devicePerformance === 'low' ? Math.floor(count / 3) : count;
  
  // Memoize particle data to prevent recreation on each render
  const particles = useMemo<ParticleData[]>(() => {
    const temp: ParticleData[] = [];
    for (let i = 0; i < actualCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      );
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = Math.random() * 0.1 + 0.05;
      const color = new THREE.Color(
        // Kente colors: gold, green, red, black
        ['#D4AF37', '#006400', '#8B0000', '#000000'][Math.floor(Math.random() * 4)]
      );
      temp.push({ position, rotation, scale, color });
    }
    return temp;
  }, [actualCount]);

  const particleRef = useRef<Group>(null);
  const lastUpdateRef = useRef(0);
  
  useFrame((state, delta) => {
    if (!particleRef.current || !visible || !target.current) return;
    
    // Throttle updates for better performance
    const now = state.clock.getElapsedTime();
    const shouldUpdate = now - lastUpdateRef.current > 0.05; // Update at max 20 times per second
    
    if (shouldUpdate) {
      lastUpdateRef.current = now;
      
      particleRef.current.children.forEach((particle: Object3D, i: number) => {
        // Orbit around the queen
        const time = state.clock.getElapsedTime() * 0.5;
        const angle = (i / actualCount) * Math.PI * 2 + time;
        const radius = 1 + Math.sin(time * 0.5 + i) * 0.3;
        
        // Use optional chaining and nullish coalescing to safely access target.current properties
        const targetX = target.current?.position.x ?? 0;
        const targetY = target.current?.position.y ?? 0;
        const targetZ = target.current?.position.z ?? 0;
        
        particle.position.x = targetX + Math.cos(angle) * radius;
        particle.position.y = targetY + Math.sin(time + i) * 0.2 + 0.5;
        particle.position.z = targetZ + Math.sin(angle) * radius;
        
        particle.rotation.x += delta * 0.5;
        particle.rotation.y += delta * 0.3;
      });
    }
  });

  // Create a shared material for particles to reduce draw calls
  const particleMaterials = useMemo(() => {
    const materials: THREE.MeshStandardMaterial[] = [];
    // Kente colors: gold, green, red, black
    const colors = ['#D4AF37', '#006400', '#8B0000', '#000000'];
    
    colors.forEach(color => {
      materials.push(
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 2,
          transparent: true,
          opacity: 0.7
        })
      );
    });
    
    return materials;
  }, []);

  return (
    <group ref={particleRef} visible={visible}>
      {particles.map((data, i) => (
        <mesh 
          key={i} 
          position={data.position} 
          rotation={data.rotation} 
          scale={data.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <primitive 
            object={particleMaterials[Math.floor(i % 4)]} 
            attach="material" 
          />
        </mesh>
      ))}
    </group>
  );
}

// Chess square helper to calculate positions
const getSquarePosition = (file: string, rank: number, boardScale = 3): { x: number, z: number } => {
  // Chess board is 8x8, with a1 at bottom left
  // Convert file (a-h) to number (0-7)
  const fileNum = file.charCodeAt(0) - 'a'.charCodeAt(0);
  // Convert rank (1-8) to number (0-7)
  const rankNum = rank - 1;
  
  // Calculate position on board
  // Assuming board is centered at origin and each square is 1 unit
  // Adjust for board scale and center offset
  const squareSize = 1 / 8; // Each square is 1/8 of the board
  const x = (fileNum - 3.5) * squareSize * boardScale;
  const z = (rankNum - 3.5) * squareSize * boardScale;
  
  return { x, z };
};

// Custom morphing component for smooth model transitions
function MorphingModel({ 
  sourceModel, 
  targetModel, 
  progress, 
  position, 
  rotation, 
  scale, 
  visible 
}: {
  sourceModel: THREE.Group;
  targetModel: THREE.Group;
  progress: number;
  position: [number, number, number] | Vector3;
  rotation: [number, number, number] | Euler;
  scale: number;
  visible: boolean;
}) {
  const modelRef = useRef<Group>(null);
  
  useFrame(() => {
    if (!modelRef.current) return;
    
    // Apply scale based on progress
    const currentScale = THREE.MathUtils.lerp(scale, scale, progress);
    modelRef.current.scale.setScalar(currentScale);
    
    // Apply opacity based on progress
    modelRef.current.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh && (child as Mesh).material) {
        const material = (child as Mesh).material as THREE.Material;
        if ('opacity' in material) {
          (material as THREE.Material & { opacity: number }).opacity = 
            progress < 0.5 ? 1 - progress * 2 : 0;
        }
      }
    });
  });
  
  return (
    <group position={position} rotation={rotation} visible={visible}>
      <group ref={modelRef} scale={scale}>
        <primitive object={sourceModel} />
      </group>
    </group>
  );
}

// Types
interface PawnProps {
  position: [number, number, number];
  index: number;
  totalPawns: number;
  transformToQueen: boolean;
  color?: string;
  highlight?: boolean;
}

interface ChessboardProps {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

interface QueenTransformationProps {
  active: boolean;
  position: [number, number, number];
  color?: string;
  onComplete?: () => void;
}

// Chess Pawn Component
const Pawn = ({ position, index, totalPawns, transformToQueen, color = '#D4AF37', highlight = false }: PawnProps) => {
  const { nodes, materials } = useGLTF('/models/pawn.glb') as any;
  const meshRef = useRef<Group>(null);
  const startPosition = useRef<Vector3>(new Vector3(...position));
  const isSelected = index === Math.floor(totalPawns / 2);
  
  // Material with customizable color
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.7,
      roughness: 0.3,
      emissive: highlight ? new THREE.Color(color).multiplyScalar(0.2) : new THREE.Color('#000000'),
    });
    return mat;
  }, [color, highlight]);
  
  // Formation patterns based on transformation state
  const getFormationPosition = () => {
    if (transformToQueen && isSelected) {
      return new Vector3(0, 1.5, 0);
    } 
    
    if (transformToQueen) {
      const angle = (index / (totalPawns - 1)) * Math.PI * 2;
      return new Vector3(
        Math.sin(angle) * 3,
        0.5,
        Math.cos(angle) * 3
      );
    }
    
    // Default grid formation
    const gridSize = Math.ceil(Math.sqrt(totalPawns));
    const col = index % gridSize;
    const row = Math.floor(index / gridSize);
    return new Vector3(
      (col - gridSize / 2 + 0.5) * 1.2,
      0.5,
      (row - gridSize / 2 + 0.5) * 1.2
    );
  };
  
  // Animation effects
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Floating animation for normal state
    if (!transformToQueen || !isSelected) {
      meshRef.current.rotation.y += delta * 0.3;
      
      if (!transformToQueen) {
        meshRef.current.position.y = startPosition.current.y + 
          Math.sin(state.clock.elapsedTime * (0.5 + index * 0.1)) * 0.3;
      }
    }
    
    // Special effects for selected pawn during transformation
    if (transformToQueen && isSelected) {
      meshRef.current.rotation.y += delta * 1.5;
    }
  });
  
  // Formation transitions
  useEffect(() => {
    if (!meshRef.current) return;
    
    const targetPosition = getFormationPosition();
    
    gsap.to(meshRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut"
    });
    
    // Scaling effect for selected pawn
    if (isSelected) {
      gsap.to(meshRef.current.scale, {
        x: transformToQueen ? 0 : 0.5,
        y: transformToQueen ? 0 : 0.5,
        z: transformToQueen ? 0 : 0.5,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }, [transformToQueen, isSelected, index, totalPawns]);
  
  return (
    <group ref={meshRef} position={position} scale={[0.5, 0.5, 0.5]}>
      <mesh
        geometry={nodes.Mesh_0.geometry}
        material={material}
        castShadow
      />
      
      {/* Glow effect for highlighted pawns */}
      {highlight && (
        <pointLight 
          color={color} 
          intensity={1.5} 
          distance={2}
          decay={2}
        />
      )}
    </group>
  );
};

// Chessboard Component
const Chessboard = ({ position, scale = 1.5, rotation = [0, 0, 0] }: ChessboardProps) => {
  const { nodes, materials } = useGLTF('/models/Chessboard.glb') as any;
  const meshRef = useRef<Group>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Subtle rotation animation
    gsap.to(meshRef.current.rotation, {
      y: rotation[1] + Math.PI * 2,
      duration: 30,
      repeat: -1,
      ease: "none"
    });
  }, [rotation]);
  
  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      <mesh
        geometry={nodes.Mesh_0?.geometry || nodes.Mesh?.geometry}
        material={materials.Material || materials.ChessboardMaterial}
        scale={[scale, scale, scale]}
        receiveShadow
      />
    </group>
  );
};

// Queen Transformation Effect
const QueenTransformation = ({ active, position, color = '#FFD700', onComplete }: QueenTransformationProps) => {
  const { nodes, materials } = useGLTF('/models/queen-optimized.glb') as any;
  const groupRef = useRef<Group>(null);
  const [visible, setVisible] = useState(false);
  
  // Custom material for the queen
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(color).multiplyScalar(0.3),
    });
  }, [color]);
  
  // Animation sequence
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (active) {
      // Start with zero scale
      groupRef.current.scale.set(0, 0, 0);
      setVisible(true);
      
      // Grow and rise animation
      const timeline = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
      
      timeline.to(groupRef.current.scale, {
        x: 0.4,
        y: 0.4,
        z: 0.4,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
      }, 0);
      
      timeline.to(groupRef.current.position, {
        y: position[1] + 1,
        duration: 2,
        ease: "power2.out"
      }, 0);
      
      timeline.to(groupRef.current.rotation, {
        y: Math.PI * 4,
        duration: 3,
        ease: "power1.inOut"
      }, 0);
    } else {
      // Disappearing animation
      gsap.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        onComplete: () => setVisible(false)
      });
    }
  }, [active, position, onComplete]);
  
  if (!visible && !active) return null;
  
  return (
    <group ref={groupRef} position={position} scale={[0, 0, 0]}>
      <mesh
        geometry={nodes.Mesh_0.geometry}
        material={material}
        castShadow
      />
      
      {/* Light effects */}
      <pointLight color={color} intensity={2} distance={4} decay={2} />
      <pointLight color="#FFFFFF" intensity={1} distance={1} decay={2} />
    </group>
  );
};

function Scene() {
  const { devicePerformance } = usePerformance();
  const sceneRef = useRef<Group>(null);
  const spotLightRef = useRef<SpotLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const queenRef = useRef<Group>(null);
  const pawnRef = useRef<Group>(null);
  const starsRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);
  
  // Debug helpers in development
  // useHelper(spotLightRef, SpotLightHelper, 'white');
  // useHelper(directionalLightRef, DirectionalLightHelper, 1, 'red');
  
  // Load models
  const { nodes: boardNodes } = useGLTF('/models/chessboard-optimized.glb') as any;
  const { nodes: pawnNodes, animations: pawnAnimations } = useGLTF('/models/african-girl-optimized.glb') as any;
  const { nodes: queenNodes, animations: queenAnimations } = useGLTF('/models/african-girl.glb') as any;
  const { nodes: starsNodes } = useGLTF('/models/stars.glb') as any;
  
  // Animation state
  const [animationPhase, setAnimationPhase] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  
  // Animation mixer for the pawn and queen
  const pawnMixer = useMemo(() => new THREE.AnimationMixer(new THREE.Group()), []);
  const queenMixer = useMemo(() => new THREE.AnimationMixer(new THREE.Group()), []);
  
  // Set up animations
  useEffect(() => {
    if (pawnAnimations && pawnAnimations.length > 0) {
      const walkAction = pawnMixer.clipAction(pawnAnimations[0]);
      walkAction.play();
    }
    
    if (queenAnimations && queenAnimations.length > 0) {
      const idleAction = queenMixer.clipAction(queenAnimations[0]);
      idleAction.play();
    }
    
    return () => {
      pawnMixer.stopAllAction();
      queenMixer.stopAllAction();
    };
  }, [pawnAnimations, queenAnimations, pawnMixer, queenMixer]);
  
  // Animation sequence
  useEffect(() => {
    // Phase 0: Initial state - pawn at starting position
    // Phase 1: Pawn moves forward
    // Phase 2: Pawn begins transformation
    // Phase 3: Queen appears, particles activate
    // Phase 4: Final state with symbols
    
    const phaseTimeline = [0, 3000, 6000, 9000, 12000]; // Timing in ms
    
    const animationSequence = () => {
      phaseTimeline.forEach((time, phase) => {
        setTimeout(() => {
          setAnimationPhase(phase);
          
          if (phase === 2) {
            // Start morphing
            const morphDuration = phaseTimeline[3] - phaseTimeline[2];
            const startTime = performance.now();
            
            const updateMorph = () => {
              const elapsed = performance.now() - startTime;
              const progress = Math.min(elapsed / morphDuration, 1);
              setMorphProgress(progress);
              
              if (progress < 1) {
                requestAnimationFrame(updateMorph);
              }
            };
            
            requestAnimationFrame(updateMorph);
          }
          
          if (phase === 3) {
            setShowParticles(true);
          }
          
          if (phase === 4) {
            setShowSymbols(true);
          }
        }, time);
      });
    };
    
    animationSequence();
    
    // Reset animation after completion
    const resetTimeout = setTimeout(() => {
      setAnimationPhase(0);
      setMorphProgress(0);
      setShowParticles(false);
      setShowSymbols(false);
      animationSequence();
    }, phaseTimeline[phaseTimeline.length - 1] + 3000);
    
    return () => {
      clearTimeout(resetTimeout);
    };
  }, []);
  
  // Calculate positions based on animation phase
  const pawnStartPosition = getSquarePosition('e', 2, 3);
  const pawnMidPosition = getSquarePosition('e', 4, 3);
  const queenPosition = getSquarePosition('e', 8, 3);
  
  // Spring animations for smooth movement
  const pawnSpring = useSpring({
    position: animationPhase >= 1 
      ? [pawnMidPosition.x, 0, pawnMidPosition.z] 
      : [pawnStartPosition.x, 0, pawnStartPosition.z],
    rotation: animationPhase >= 1 ? [0, Math.PI, 0] : [0, 0, 0],
    scale: animationPhase >= 2 ? 0 : 0.5,
    opacity: animationPhase >= 3 ? 0 : 1,
    config: config.gentle
  });
  
  const queenSpring = useSpring({
    position: [queenPosition.x, 0, queenPosition.z],
    scale: animationPhase >= 3 ? 0.6 : 0,
    rotation: [0, Math.PI, 0],
    opacity: animationPhase >= 3 ? 1 : 0,
    config: config.gentle
  });
  
  // Particle system for cosmic effect
  const particleCount = devicePerformance === 'low' ? 1000 : 3000;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = Math.random() * 15 - 5;
      const z = (Math.random() - 0.5) * 15;
      
      // Vary the particle sizes for more realistic starry sky
      const size = Math.random() * 0.03 + 0.01;
      
      // Alternate between white and cosmic blue for stars
      const colorIndex = Math.random() > 0.7 ? 1 : 0;
      
      temp.push({ 
        x, 
        y, 
        z, 
        size,
        colorIndex
      });
    }
    return temp;
  }, [particleCount]);
  
  // Update animation and effects
  useFrame((state, delta) => {
    // Update mixers
    pawnMixer.update(delta);
    queenMixer.update(delta);
    
    // Rotate scene slightly for dynamic view
    if (sceneRef.current) {
      sceneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
    
    // Animate spotlight
    if (spotLightRef.current) {
      const time = state.clock.getElapsedTime();
      spotLightRef.current.position.x = Math.sin(time * 0.2) * 3;
      spotLightRef.current.position.z = Math.cos(time * 0.2) * 3;
      spotLightRef.current.intensity = 1 + Math.sin(time) * 0.2;
    }
    
    // Animate particles
    if (particlesRef.current && particlesRef.current.children.length > 0) {
      particlesRef.current.children.forEach((particle: any, i) => {
        const time = state.clock.getElapsedTime();
        
        // Twinkle effect
        if (i % 20 === 0) {
          const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
          particle.material.opacity = 0.3 + twinkle * 0.7;
          particle.material.emissiveIntensity = 0.5 + twinkle;
        }
        
        // Subtle movement
        particle.position.y -= (0.05 + (i % 5) * 0.01) * delta;
        particle.position.x += Math.sin(time * 0.1 + i) * 0.001;
        particle.position.z += Math.cos(time * 0.1 + i) * 0.001;
        
        // Reset particles that fall below the scene
        if (particle.position.y < -5) {
          particle.position.y = 10;
          particle.position.x = (Math.random() - 0.5) * 15;
          particle.position.z = (Math.random() - 0.5) * 15;
        }
      });
    }
    
    // Rotate stars
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.05;
    }
  });
  
  // Create materials
  const boardMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1A1A2E',
      metalness: 0.7,
      roughness: 0.2,
    });
  }, []);
  
  const whiteTileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      metalness: 0.5,
      roughness: 0.3,
    });
  }, []);
  
  const blackTileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2E3192', // Cosmic blue
      metalness: 0.6,
      roughness: 0.2,
    });
  }, []);
  
  const goldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#D4A017',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#D4A017',
      emissiveIntensity: 0.2,
    });
  }, []);
  
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#2E3192',
      transmission: 0.95,
      opacity: 1,
      metalness: 0,
      roughness: 0.2,
      ior: 1.5,
      thickness: 0.5,
      specularIntensity: 1,
      specularColor: '#FFFFFF',
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
  }, []);
  
  const particleMaterials = useMemo(() => {
    return [
      // White stars
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FFFFFF',
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.7,
      }),
      // Cosmic blue stars
      new THREE.MeshStandardMaterial({
        color: '#2E3192',
        emissive: '#2E3192',
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.7,
      })
    ];
  }, []);
  
  const starsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#FFFFFF',
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.8,
    });
  }, []);
  
  return (
    <group ref={sceneRef}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        ref={directionalLightRef}
        position={[5, 5, 5]} 
        intensity={0.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      <spotLight 
        ref={spotLightRef}
        position={[0, 5, 0]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        color="#D4A017"
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Stars background */}
      <group ref={starsRef} scale={2}>
        {starsNodes && starsNodes.Stars && (
          <mesh geometry={starsNodes.Stars.geometry}>
            <primitive object={starsMaterial} attach="material" />
          </mesh>
        )}
      </group>
      
      {/* Particle system */}
      <group ref={particlesRef} visible={showParticles}>
        {particles.map((particle, i) => (
          <mesh 
            key={i} 
            position={[particle.x, particle.y, particle.z]}
            scale={[particle.size, particle.size, particle.size]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <primitive 
              object={particleMaterials[particle.colorIndex]} 
              attach="material" 
            />
          </mesh>
        ))}
      </group>
      
      {/* Chessboard */}
      <group position={[0, -1, 0]} receiveShadow>
        {/* Board base */}
        {boardNodes && boardNodes.Board && (
          <mesh 
            geometry={boardNodes.Board.geometry} 
            position={boardNodes.Board.position}
            rotation={boardNodes.Board.rotation}
            scale={boardNodes.Board.scale}
            castShadow
            receiveShadow
          >
            <primitive object={boardMaterial} attach="material" />
          </mesh>
        )}
        
        {/* White tiles */}
        {boardNodes && boardNodes.WhiteTiles && (
          <mesh 
            geometry={boardNodes.WhiteTiles.geometry}
            position={boardNodes.WhiteTiles.position}
            rotation={boardNodes.WhiteTiles.rotation}
            scale={boardNodes.WhiteTiles.scale}
            receiveShadow
          >
            <primitive object={whiteTileMaterial} attach="material" />
          </mesh>
        )}
        
        {/* Black tiles */}
        {boardNodes && boardNodes.BlackTiles && (
          <mesh 
            geometry={boardNodes.BlackTiles.geometry}
            position={boardNodes.BlackTiles.position}
            rotation={boardNodes.BlackTiles.rotation}
            scale={boardNodes.BlackTiles.scale}
            receiveShadow
          >
            <primitive object={blackTileMaterial} attach="material" />
          </mesh>
        )}
        
        {/* Border */}
        {boardNodes && boardNodes.Border && (
          <mesh 
            geometry={boardNodes.Border.geometry}
            position={boardNodes.Border.position}
            rotation={boardNodes.Border.rotation}
            scale={boardNodes.Border.scale}
            castShadow
          >
            <primitive object={goldMaterial} attach="material" />
          </mesh>
        )}
      </group>
      
      {/* Pawn (African Girl) */}
      <animated.group 
        ref={pawnRef}
        position={pawnSpring.position as any}
        rotation={pawnSpring.rotation as any}
        scale={pawnSpring.scale}
        visible={animationPhase < 3}
      >
        {pawnNodes && pawnNodes.Girl && (
          <group>
            <mesh 
              geometry={pawnNodes.Girl.geometry}
              castShadow
            >
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.7} 
                metalness={0.1}
              />
            </mesh>
            <mesh 
              geometry={pawnNodes.Dress.geometry}
              castShadow
            >
              <meshStandardMaterial 
                color="#D4A017" 
                roughness={0.5} 
                metalness={0.3}
                emissive="#D4A017"
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        )}
      </animated.group>
      
      {/* Queen (African Queen) */}
      <animated.group 
        ref={queenRef}
        position={queenSpring.position as any}
        rotation={queenSpring.rotation as any}
        scale={queenSpring.scale}
        visible={animationPhase >= 3}
      >
        {queenNodes && queenNodes.Queen && (
          <group>
            <mesh 
              geometry={queenNodes.Queen.geometry}
              castShadow
            >
              <meshStandardMaterial 
                color="#8B4513" 
                roughness={0.7} 
                metalness={0.1}
              />
            </mesh>
            <mesh 
              geometry={queenNodes.Crown.geometry}
              castShadow
            >
              <primitive object={goldMaterial} attach="material" />
            </mesh>
            <mesh 
              geometry={queenNodes.Dress.geometry}
              castShadow
            >
              <meshStandardMaterial 
                color="#800080" 
                roughness={0.5} 
                metalness={0.3}
                emissive="#800080"
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        )}
      </animated.group>
      
      {/* Adinkra symbols */}
      <SankofaSymbol 
        position={[1.5, 1, 1.5]} 
        rotation={[0, 0, 0]} 
        scale={0.3}
        visible={showSymbols}
      />
      
      {/* Kente particles around the queen */}
      <KenteParticles 
        count={50} 
        visible={showParticles} 
        target={queenRef}
      />
      
      {/* Glass dome */}
      <mesh position={[0, 0, 0]} scale={3} visible={devicePerformance !== 'low'}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      
      {/* Text */}
      <Float 
        speed={2} 
        rotationIntensity={0.2} 
        floatIntensity={0.5}
        position={[0, 1.5, -2]}
        visible={animationPhase >= 4}
      >
        <Text3D
          font="/fonts/Montserrat_Bold.json"
          size={0.2}
          height={0.05}
          curveSegments={12}
        >
          Knowledge is Power
          <meshStandardMaterial 
            color="#D4A017" 
            emissive="#D4A017"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Float>
    </group>
  );
}

export default function ChessboardScene() {
  const [devicePerformance, setDevicePerformance] = useState<'high' | 'medium' | 'low'>('high');
  const [isVisible, setIsVisible] = useState(false);
  
  // Detect device performance on component mount
  useEffect(() => {
    const detectPerformance = () => {
      // Enhanced performance detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isLowPowerDevice = isMobile && isSmallScreen;
      
      // Check for hardware concurrency as an additional indicator
      const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      
      if (isLowPowerDevice || lowConcurrency) {
        setDevicePerformance('low');
      } else if (window.innerWidth < 1024) {
        setDevicePerformance('medium');
      } else {
        setDevicePerformance('high');
      }
    };
    
    detectPerformance();
    window.addEventListener('resize', detectPerformance);
    
    // Use IntersectionObserver to only render when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          // Optional: pause rendering when not visible
          // setIsVisible(false);
          // Keeping always true for now to prevent flickering when scrolling
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    const container = document.querySelector('.animation-container');
    if (container) {
      observer.observe(container);
    }
    
    return () => {
      window.removeEventListener('resize', detectPerformance);
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);
  
  return (
    <PerformanceContext.Provider value={{ qualityLevel: 'high', devicePerformance }}>
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          zIndex: 1
        }}
        camera={{ position: [0, 2, 6], fov: 45 }}
        shadows={devicePerformance !== 'low'}
        dpr={devicePerformance === 'low' ? [0.6, 1] : devicePerformance === 'medium' ? [0.8, 1.5] : [1, 2]}
        frameloop={!isVisible ? 'demand' : devicePerformance === 'low' ? 'demand' : 'always'}
        gl={{ 
          antialias: devicePerformance !== 'low',
          alpha: true,
          powerPreference: devicePerformance === 'low' ? 'low-power' : 'high-performance',
          stencil: false,
          logarithmicDepthBuffer: true,
        }}
        onCreated={({ gl }) => {
          // Set clear color directly on the renderer
          gl.setClearColor('#000000', 0);
          
          // Enable tone mapping for better color reproduction
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.5;
        }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 20]} />
        <Suspense fallback={null}>
          {isVisible && <Scene />}
          <Preload all />
        </Suspense>
      </Canvas>
    </PerformanceContext.Provider>
  );
} 