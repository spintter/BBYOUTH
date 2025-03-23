import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Html, 
  Environment, 
  PerspectiveCamera,
  Loader,
  Stars,
  useAnimations,
  Trail,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Initialize the MeshoptDecoder - required for compressed GLB files
MeshoptDecoder.ready.then(() => {
  console.log("MeshoptDecoder initialized successfully");
});

// Define proper types for position props
type Vector3Array = [number, number, number];

// Pawn model component with transition to Queen
function ChessPiece({ position }: { position: Vector3Array }) {
  const pawnGltf = useGLTF('/models/pawn.glb');
  const pieceRef = useRef<THREE.Group>(null);
  const [isPawn, setIsPawn] = useState(true);
  const [scale, setScale] = useState<Vector3Array>([0.02, 0.02, 0.02]);
  
  // Manage the animation with useEffect and setTimeout
  useEffect(() => {
    // Start transformation after 3 seconds
    const transformTimer = setTimeout(() => {
      // Grow during transformation
      setScale([0.03, 0.03, 0.03]);
      
      // After 3 more seconds, complete transformation
      const completionTimer = setTimeout(() => {
        setIsPawn(false);
        
        // Final queen form
        setScale([0.025, 0.025, 0.025]);
      }, 3000);
      
      return () => clearTimeout(completionTimer);
    }, 3000);
    
    return () => clearTimeout(transformTimer);
  }, []);
  
  // Animation for continuous rotation
  useFrame((state, delta) => {
    if (pieceRef.current) {
      // Basic rotation
      pieceRef.current.rotation.y += delta * 0.5;
      
      // Add more dramatic rotation during transformation phase
      if (!isPawn && scale[0] === 0.03) {
        pieceRef.current.rotation.y += delta * 2;
      }
    }
  });
  
  return (
    <group position={position}>
      <Trail
        width={1}
        color={isPawn ? "#ffffff" : "#ffd700"} 
        length={isPawn ? 2 : 5}
        decay={isPawn ? 1 : 4}
        attenuation={(width) => width}
      >
        <primitive 
          ref={pieceRef}
          object={pawnGltf.scene} 
          scale={scale}
          castShadow
        />
      </Trail>
      
      {!isPawn && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          QUEEN
        </Text>
      )}
    </group>
  );
}

// Chessboard model component
function ChessboardModel({ position }: { position: Vector3Array }) {
  const gltf = useGLTF('/models/chessboard.glb');
  
  return (
    <primitive 
      object={gltf.scene} 
      position={position}
      scale={[0.1, 0.1, 0.1]} 
      rotation={[0, 0, 0]}
      receiveShadow
    />
  );
}

// Scene setup with Afrocentric chess theme
function Scene() {
  // Preload models
  useEffect(() => {
    // Configure the GLTFLoader with the MeshoptDecoder
    GLTFLoader.prototype.setMeshoptDecoder(MeshoptDecoder);
    
    // Preload the models
    useGLTF.preload('/models/pawn.glb');
    useGLTF.preload('/models/chessboard.glb');
  }, []);
  
  return (
    <>
      {/* Dark blue background for night sky feel */}
      <color attach="background" args={['#0a0a24']} />
      
      {/* Enhanced lighting for dramatic effect */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.7} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.3} 
      />
      <pointLight 
        position={[0, 3, 0]} 
        intensity={0.5} 
        color="#ffd700" 
      />
      
      {/* Stars background for cosmic theme */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0.5} 
        fade 
      />
      
      {/* Chess elements */}
      <group>
        {/* Position the chessboard */}
        <ChessboardModel position={[0, -0.15, 0]} />
        
        {/* Position the transforming chess piece */}
        <ChessPiece position={[0, 0, 0]} />
      </group>
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={0.5}
        maxDistance={4}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Camera position */}
      <PerspectiveCamera 
        makeDefault 
        position={[0.8, 0.8, 0.8]} 
        fov={40} 
      />
      
      {/* Environment for better lighting and reflections */}
      <Environment preset="night" />
    </>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <Html center>
      <div style={{ color: 'white', textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid rgba(255, 255, 255, 0.3)', 
          borderTop: '4px solid white', 
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div>Loading Chess Scene...</div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Html>
  );
}

// Main exported component
export default function ChessScene() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Configure the GLTFLoader with the MeshoptDecoder
    GLTFLoader.prototype.setMeshoptDecoder(MeshoptDecoder);
    
    // Preload models
    useGLTF.preload('/models/pawn.glb');
    useGLTF.preload('/models/chessboard.glb');
    
    // Set loading to false after models are preloaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <React.Suspense fallback={<LoadingFallback />}>
          <Scene />
        </React.Suspense>
      </Canvas>
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          fontFamily: 'sans-serif'
        }}>
          Loading 3D models...
        </div>
      )}
      
      <Loader 
        containerStyles={{ 
          background: 'rgba(0,0,0,0.9)',
          display: isLoading ? 'flex' : 'none'
        }} 
      />
    </div>
  );
} 