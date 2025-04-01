'use client';

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// --- Configuration & Types ---
type Vector3Array = [number, number, number];
interface ChessCoordinate { file: string; rank: number; }
interface ChessPiece { type: string; coord: ChessCoordinate; isWhite: boolean; }
interface ChessPieceProps { position: Vector3Array; isWhite: boolean; scale: Vector3Array; modelPath?: string; additionalGeometry?: React.ReactNode; }

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

// --- Refined User Preferences ---
const userPreferences = {
  rotationSpeed: 0.0,
  colorScheme: {
    primary: '#dc2626',
    secondary: '#16a34a',
    boardDark: '#080808',
    boardLight: '#FFFFFF',
    kingWhiteColor: '#D9D9D9',  // Even less bright white for kings
    kingBlackColor: '#010101',
    queenAccentColor: '#facc15',
    whitePieceFallback: '#D6D6D6',  // Even less bright white for all pieces
    blackPieceFallback: '#050505',
    highlightColor: '#f59e0b',
  },
  materials: {
    whiteRoughness: 0.95,  // Further increased roughness for more realistic white pieces
    whiteMetalness: 0.05,  // Further decreased metalness for more realistic white pieces
    blackRoughness: 0.55,
    blackMetalness: 0.2,
    kingRoughness: 0.85,  // Further increased roughness for more realistic king
    kingMetalness: 0.03,
  }
};

// --- Utility Functions ---
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  if (fileIndex === -1 || rankIndex === -1) { console.error("Invalid chess coordinate:", coord); return [0, 0, 0]; }
  const x = BOARD_OFFSET[0] + (fileIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  const z = BOARD_OFFSET[2] + (rankIndex * SQUARE_SIZE) + (SQUARE_SIZE * 0.5);
  return [x, 0.001, z];
}

// --- Piece Components (Includes Map Preservation) ---
function ChessPiece({ position, isWhite, scale, modelPath = '/models/chess_pawn.glb', additionalGeometry }: ChessPieceProps) {
    const { scene } = useGLTF(modelPath);
    const pieceRef = useRef<THREE.Group>(null);
    const processedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                const originalMaterial = child.material;
                child.material = originalMaterial.clone();
                child.material.color.set(isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback);
                child.material.metalness = isWhite ? userPreferences.materials.whiteMetalness : userPreferences.materials.blackMetalness;
                child.material.roughness = isWhite ? userPreferences.materials.whiteRoughness : userPreferences.materials.blackRoughness;
                child.material.emissive.set(0x000000);
                child.material.emissiveIntensity = 0;
                child.material.map = originalMaterial.map;
                child.material.normalMap = originalMaterial.normalMap;
                child.material.aoMap = originalMaterial.aoMap;
                child.material.roughnessMap = originalMaterial.roughnessMap;
                child.material.metalnessMap = originalMaterial.metalnessMap;
                child.castShadow = false;
                child.receiveShadow = false;
                child.material.side = THREE.FrontSide;
                if (child.material.aoMap) { child.material.aoMapIntensity = 1.0; }
            }
        });
        return clone;
    }, [scene, isWhite]);
    return (
        <group position={position} ref={pieceRef}>
            <group scale={scale}>
                {processedScene && <primitive object={processedScene} />}
                {additionalGeometry}
            </group>
        </group>
    );
}

function OptimizedChessKing({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    const modelPath = '/models/newking.glb';
    useGLTF.preload(modelPath);
    const { scene } = useGLTF(modelPath);
    const pieceRef = useRef<THREE.Group>(null);
    const processedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                const originalMaterial = child.material;
                child.material = originalMaterial.clone();
                child.material.color.set(isWhite ? userPreferences.colorScheme.kingWhiteColor : userPreferences.colorScheme.kingBlackColor);
                child.material.metalness = userPreferences.materials.kingMetalness;
                child.material.roughness = userPreferences.materials.kingRoughness;
                child.material.emissive.set(0x000000);
                child.material.emissiveIntensity = 0;
                child.material.map = originalMaterial.map;
                child.material.normalMap = originalMaterial.normalMap;
                child.material.aoMap = originalMaterial.aoMap;
                child.material.roughnessMap = originalMaterial.roughnessMap;
                child.material.metalnessMap = originalMaterial.metalnessMap;
                if (child.material.aoMap) { child.material.aoMapIntensity = 1.0; }
                child.castShadow = false;
                child.receiveShadow = false;
                child.material.side = THREE.FrontSide;
            }
        });
        return clone;
    }, [scene, isWhite]);
    return (
        <group position={position} ref={pieceRef}>
            <primitive object={processedScene} scale={[0.03, 0.03, 0.03]} rotation={[0, 0, 0]} />
        </group>
    );
}

function ChessQueen({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    const crown = useMemo(() => (
        <group position={[0, 0.5, 0]}>
            <mesh>
                <cylinderGeometry args={[0.05, 0.03, 0.1, 12]} />
                <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.primary : userPreferences.colorScheme.secondary} roughness={0.4} metalness={0.1}/>
            </mesh>
        </group>
    ), [isWhite]);
    return <ChessPiece position={position} isWhite={isWhite} scale={[0.16, 0.2, 0.16]} additionalGeometry={crown} />;
}

function ChessRook({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    const crenelation = useMemo(() => (
        <group position={[0, 0.4, 0]}>
            <mesh>
                <boxGeometry args={[0.15, 0.05, 0.15]} />
                <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} roughness={isWhite ? userPreferences.materials.whiteRoughness : userPreferences.materials.blackRoughness} metalness={isWhite ? userPreferences.materials.whiteMetalness : userPreferences.materials.blackMetalness}/>
            </mesh>
        </group>
    ), [isWhite]);
    return <ChessPiece position={position} isWhite={isWhite} scale={[0.17, 0.14, 0.17]} additionalGeometry={crenelation} />;
}

function ChessKnight({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    const horseHead = useMemo(() => (
        <group position={[0, 0.4, 0]}>
            <mesh position={[0, 0.05, 0.05]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} roughness={isWhite ? userPreferences.materials.whiteRoughness : userPreferences.materials.blackRoughness} metalness={isWhite ? userPreferences.materials.whiteMetalness : userPreferences.materials.blackMetalness}/>
            </mesh>
        </group>
    ), [isWhite]);
    return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.17, 0.15]} additionalGeometry={horseHead} />;
}

function ChessBishop({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    const mitre = useMemo(() => (
        <group position={[0, 0.4, 0]}>
            <mesh>
                <coneGeometry args={[0.05, 0.15, 12]} />
                <meshStandardMaterial color={isWhite ? userPreferences.colorScheme.whitePieceFallback : userPreferences.colorScheme.blackPieceFallback} roughness={isWhite ? userPreferences.materials.whiteRoughness : userPreferences.materials.blackRoughness} metalness={isWhite ? userPreferences.materials.whiteMetalness : userPreferences.materials.blackMetalness}/>
            </mesh>
        </group>
    ), [isWhite]);
    return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.16, 0.15]} additionalGeometry={mitre} />;
}

function ChessPawn({ position, isWhite }: { position: Vector3Array; isWhite: boolean }) {
    return <ChessPiece position={position} isWhite={isWhite} scale={[0.15, 0.15, 0.15]} />;
}

// --- Chessboard Component ---
function ChessboardModel({ position = [0, 0, 0] }: { position?: Vector3Array }) {
    const boardRef = useRef<THREE.Group>(null);
    const rotationSpeed = 0.05; // Increased from 0.035 to 0.05 for more dynamic rotation
    const initialRotation: Vector3Array = [-Math.PI / 7.5, Math.PI / 28, Math.PI / 14];
    useFrame((state, delta) => {
        if (boardRef.current) {
            boardRef.current.rotation.y += rotationSpeed * delta;
        }
    });
    const checkerShader = useMemo(() => ({
        uniforms: {
            color1: { value: new THREE.Color(userPreferences.colorScheme.boardLight) },
            color2: { value: new THREE.Color(userPreferences.colorScheme.boardDark) },
            scale: { value: 8.0 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float scale;
            varying vec2 vUv;
            void main() {
                vec2 pos = vUv * scale;
                float pattern = mod(floor(pos.x) + floor(pos.y), 2.0);
                gl_FragColor = vec4(mix(color1, color2, pattern), 1.0);
            }
        `
    }), []);
    const initialPieces: ChessPiece[] = useMemo(() => [
        { type: 'queen', coord: { file: 'd', rank: 1 }, isWhite: true },
        { type: 'rook', coord: { file: 'a', rank: 1 }, isWhite: true },
        { type: 'rook', coord: { file: 'h', rank: 1 }, isWhite: true },
        { type: 'knight', coord: { file: 'b', rank: 1 }, isWhite: true },
        { type: 'knight', coord: { file: 'g', rank: 1 }, isWhite: true },
        { type: 'bishop', coord: { file: 'c', rank: 1 }, isWhite: true },
        { type: 'bishop', coord: { file: 'f', rank: 1 }, isWhite: true },
        ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 2 }, isWhite: true } as ChessPiece)),
        { type: 'queen', coord: { file: 'd', rank: 8 }, isWhite: false },
        { type: 'rook', coord: { file: 'a', rank: 8 }, isWhite: false },
        { type: 'rook', coord: { file: 'h', rank: 8 }, isWhite: false },
        { type: 'knight', coord: { file: 'b', rank: 8 }, isWhite: false },
        { type: 'knight', coord: { file: 'g', rank: 8 }, isWhite: false },
        { type: 'bishop', coord: { file: 'c', rank: 8 }, isWhite: false },
        { type: 'bishop', coord: { file: 'f', rank: 8 }, isWhite: false },
        ...FILES.map(file => ({ type: 'pawn', coord: { file, rank: 7 }, isWhite: false } as ChessPiece)),
    ], []);
    const finalPieces = useMemo(() => {
        let pieces = initialPieces;
        for (let i = 0; i < 15 && pieces.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * pieces.length);
            pieces.splice(randomIndex, 1);
        }
        const allSquares: ChessCoordinate[] = [];
        FILES.forEach(file => RANKS.forEach(rank => allSquares.push({ file, rank })));
        for (let i = allSquares.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allSquares[i], allSquares[j]] = [allSquares[j], allSquares[i]];
        }
        return pieces.map((piece, index) => ({ ...piece, coord: allSquares[index] }));
    }, [initialPieces]);
    return (
        <group position={position} ref={boardRef} rotation={initialRotation}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1, 1, 1, 1]} />
                <shaderMaterial args={[checkerShader]} side={THREE.DoubleSide} />
            </mesh>
            {finalPieces.map((piece, index) => {
                const pos = chessToPosition(piece.coord);
                const key = `${piece.isWhite ? 'w' : 'b'}-${piece.type}-${piece.coord.file}${piece.coord.rank}-${index}`;
                switch (piece.type) {
                    case 'queen': return <ChessQueen key={key} position={pos} isWhite={piece.isWhite} />;
                    case 'rook': return <ChessRook key={key} position={pos} isWhite={piece.isWhite} />;
                    case 'knight': return <ChessKnight key={key} position={pos} isWhite={piece.isWhite} />;
                    case 'bishop': return <ChessBishop key={key} position={pos} isWhite={piece.isWhite} />;
                    case 'pawn': return <ChessPawn key={key} position={pos} isWhite={piece.isWhite} />;
                    default: return null;
                }
            })}
        </group>
    );
}

// --- Subtle Camera Animation ---
function Rig() {
    const { camera } = useThree();
    const speed = 0.01;
    const maxZoomIn = 1.8;
    useFrame(() => {
        if (camera.position.length() > maxZoomIn) {
            const target = new THREE.Vector3(0, 0.1, 0);
            const direction = target.clone().sub(camera.position).normalize();
            const targetPosition = target.clone().sub(direction.multiplyScalar(maxZoomIn));
            camera.position.lerp(targetPosition, speed * 0.02);
        }
        camera.lookAt(0, 0.1, 0);
        camera.updateProjectionMatrix();
    });
    return null;
}

// --- Scene Setup ---
function Scene() {
    const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
    useEffect(() => {
        useGLTF.preload('/models/chess_pawn.glb');
    }, []);
    const cameraPosition: Vector3Array = isMobile ? [1.9, 1.6, 1.9] : [2.1, 1.7, 2.1];
    const cameraFov = isMobile ? 45 : 35;
    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 2, 6]} />
            <ambientLight intensity={0.25} />
            <directionalLight position={[3, 4, 2.5]} intensity={1.5} color="#FFFAF0" castShadow={false} />
            {!isMobile && (
                <directionalLight position={[-2, 1, -2]} intensity={0.2} color="#E0FFFF" castShadow={false} />
            )}
            <Environment preset="studio" background={false} />
            {/* Raise the board position from [-0.2, 0.1] to [0.1, 0.3] */}
            <group position={[0.5, 0.1, 0.3]}>
                <ChessboardModel position={[0, 0, 0]} />
            </group>
            {!isMobile && (
                <EffectComposer multisampling={0} enabled={true}>
                    <Bloom intensity={0.03} luminanceThreshold={0.9} luminanceSmoothing={0.9} kernelSize={2} />
                </EffectComposer>
            )}
            <OrbitControls enableZoom={false} enablePan={false} minDistance={1.8} maxDistance={2.8} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} enableRotate={true} rotateSpeed={0.3} target={[0, 0.1, 0]} />
            <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} near={0.1} far={100} />
            <Rig />
        </>
    );
}

// --- Hero Content & Loading ---
function HeroContent() {
    return (
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 md:px-20 z-10 pointer-events-none">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(25px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 1.1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
                }
                .text-shadow-subtle {
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
                }
            `}</style>
            <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight leading-tight text-shadow-subtle">
                    <span className="block animate-fadeInUp" style={{ animationDelay: '0.1s' }}>Empowerment</span>
                    <span className="block animate-fadeInUp" style={{ animationDelay: '0.3s' }}>through</span>
                    <span className="block text-yellow-400 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>strategy</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-md sm:max-w-lg animate-fadeInUp text-shadow-subtle" style={{ animationDelay: '0.7s' }}>
                    Guiding Birmingham&apos;s youth through <span className="text-red-500 font-medium">critical thinking</span>, <span className="text-green-500 font-medium">cultural heritage</span>, and <span className="text-red-500 font-medium">creative expression</span> to cultivate the next generation of leaders, thinkers, and innovators in the humanities.
                </p>
                <div className="pointer-events-auto animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
                    <a
                        href="#mission"
                        className="bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md inline-flex items-center transition-all duration-300 ease-out transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500 group"
                    >
                        Join Our Program
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-red-700 border-b-yellow-400 border-l-white border-r-white rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="text-red-600 text-xl font-serif">Awakening strategy...</p>
            </div>
        </div>
    );
}

// --- Main Export ---
export default function KnowledgeIsPowerHero() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced starfield style with CSS stars
    const starFieldStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        background: `
            radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%)
        `,
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
    };

    // Detect device capabilities for initial settings
    const [initialDpr] = useState(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        return isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
    });

    return (
        <div
            className="relative w-full h-[90vh] md:h-screen overflow-hidden"
            style={{ background: '#000000' }}
        >
            {/* Enhanced Starfield Background with CSS stars */}
            <div style={starFieldStyle}>
                <style>{`
                    @keyframes twinkle {
                        0% { opacity: 0.2; }
                        50% { opacity: 1; }
                        100% { opacity: 0.2; }
                    }
                    
                    .star {
                        position: absolute;
                        background-color: white;
                        border-radius: 50%;
                    }

                    .star-tiny {
                        width: 1px;
                        height: 1px;
                    }

                    .star-small {
                        width: 2px;
                        height: 2px;
                    }

                    .star-medium {
                        width: 3px;
                        height: 3px;
                    }

                    .twinkle-slow {
                        animation: twinkle 6s infinite ease-in-out;
                    }

                    .twinkle-medium {
                        animation: twinkle 4s infinite ease-in-out;
                    }

                    .twinkle-fast {
                        animation: twinkle 2s infinite ease-in-out;
                    }
                `}</style>
                
                {/* Generate 50 small stars */}
                {Array.from({ length: 50 }).map((_, i) => {
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const animationDelay = Math.random() * 5;
                    const sizeClass = Math.random() > 0.7 ? 'star-medium' : (Math.random() > 0.5 ? 'star-small' : 'star-tiny');
                    const speedClass = Math.random() > 0.7 ? 'twinkle-fast' : (Math.random() > 0.5 ? 'twinkle-medium' : 'twinkle-slow');
                    
                    return (
                        <div 
                            key={`star-${i}`} 
                            className={`star ${sizeClass} ${speedClass}`}
                            style={{ 
                                top: `${top}%`, 
                                left: `${left}%`, 
                                animationDelay: `${animationDelay}s` 
                            }}
                        />
                    );
                })}
            </div>

            <Canvas
                dpr={initialDpr}
                gl={{ 
                    antialias: initialDpr > 1,
                    alpha: true, 
                    powerPreference: 'high-performance', 
                    precision: initialDpr > 1 ? 'highp' : 'mediump',
                    logarithmicDepthBuffer: initialDpr > 1 
                }}
                className="w-full h-full relative z-10"
            >
                <Suspense fallback={<Html center><div className="text-white text-lg font-serif">Loading Scene...</div></Html>}>
                    <Scene />
                </Suspense>
            </Canvas>

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <HeroContent />
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-[#000000] flex items-center justify-center z-30">
                    <LoadingFallback />
                </div>
            )}
        </div>
    );
}