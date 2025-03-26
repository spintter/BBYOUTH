'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  useGLTF, 
  PerspectiveCamera, 
  Environment,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Import the chess coordinate types and functions from the existing component
type Vector3Array = [number, number, number];

interface ChessCoordinate {
  file: string; // a-h
  rank: number; // 1-8
}

// Constants for chess board
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const SQUARE_SIZE = 0.125;
const BOARD_OFFSET: Vector3Array = [-0.5, 0, -0.5];

// Animation timing constants
const TOTAL_ANIMATION_DURATION = 10; // seconds

// User preferences for styling - matching the original
const userPreferences = {
  glowIntensity: 1.5,
  rotationSpeed: 0.1,
  colorScheme: {
    primary: '#FFD700', // Gold
    secondary: '#800080', // Purple
    highlight: '#FF00FF', // Magenta
    boardDark: '#323232', // Dark gray for dark squares 
    boardLight: '#E8E8E8', // Light gray for light squares
  }
};

// Convert chess notation to 3D position
function chessToPosition(coord: ChessCoordinate): Vector3Array {
  const fileIndex = FILES.indexOf(coord.file);
  const rankIndex = RANKS.indexOf(coord.rank);
  
  if (fileIndex === -1 || rankIndex === -1) {
    console.error("Invalid chess coordinate:", coord);
    return [0, 0, 0];
  }
  
  const x = BOARD_OFFSET[0] + fileIndex * SQUARE_SIZE;
  const z = BOARD_OFFSET[2] + rankIndex * SQUARE_SIZE;
  
  return [x, 0, z];
}

// Animation timeline segments
const timelineSegments = [
  { name: 'castling', start: 0, duration: 2, end: 2 },
  { name: 'd2-d3', start: 2, duration: 1, end: 3 },
  { name: 'd3-d4', start: 3, duration: 1, end: 4 },
  { name: 'd4-d5', start: 4, duration: 1, end: 5 },
  { name: 'd5-d6', start: 5, duration: 1, end: 6 },
  { name: 'd6-d7', start: 6, duration: 1, end: 7 },
  { name: 'd7-d8', start: 7, duration: 1, end: 8 },
  { name: 'transform', start: 8, duration: 2, end: 10 }
];

// Animation waypoints
const castlingWaypoints = {
  king: {
    start: chessToPosition({ file: 'e', rank: 1 }),
    end: chessToPosition({ file: 'c', rank: 1 })
  },
  rook: {
    start: chessToPosition({ file: 'a', rank: 1 }),
    end: chessToPosition({ file: 'd', rank: 1 })
  }
};

const pawnJourney = [
  { position: chessToPosition({ file: 'd', rank: 2 }), notation: 'd2' },
  { position: chessToPosition({ file: 'd', rank: 3 }), notation: 'd3' },
  { position: chessToPosition({ file: 'd', rank: 4 }), notation: 'd4' },
  { position: chessToPosition({ file: 'd', rank: 5 }), notation: 'd5' },
  { position: chessToPosition({ file: 'd', rank: 6 }), notation: 'd6' },
  { position: chessToPosition({ file: 'd', rank: 7 }), notation: 'd7' },
  { position: chessToPosition({ file: 'd', rank: 8 }), notation: 'd8' }
];

// Camera keyframes for dynamic movement
const cameraKeyframes = [
  // Starting wide angle view of the board (castling)
  { 
    time: 0, 
    position: [0.5, 0.35, 0.9], // Full board view
    target: [0, 0, 0], // Center of board
    fov: 40
  },
  // Close-up of castling move
  { 
    time: 1.7, 
    position: [0, 0.25, 0.6], 
    target: [chessToPosition({ file: 'c', rank: 1 })[0], 0, chessToPosition({ file: 'c', rank: 1 })[2]], 
    fov: 35
  },
  // Transition to pawn at d2
  { 
    time: 2.5, 
    position: [chessToPosition({ file: 'd', rank: 2 })[0] + 0.2, 0.15, chessToPosition({ file: 'd', rank: 2 })[2] + 0.3], 
    target: [chessToPosition({ file: 'd', rank: 2 })[0], 0, chessToPosition({ file: 'd', rank: 2 })[2]], 
    fov: 35
  },
  // Tracking pawn journey midpoint
  { 
    time: 5, 
    position: [chessToPosition({ file: 'd', rank: 5 })[0] - 0.2, 0.2, chessToPosition({ file: 'd', rank: 5 })[2] + 0.2], 
    target: [chessToPosition({ file: 'd', rank: 5 })[0], 0, chessToPosition({ file: 'd', rank: 5 })[2]], 
    fov: 32
  },
  // Anticipation of transformation
  { 
    time: 7.5, 
    position: [chessToPosition({ file: 'd', rank: 8 })[0] - 0.15, 0.12, chessToPosition({ file: 'd', rank: 8 })[2] - 0.2], 
    target: [chessToPosition({ file: 'd', rank: 8 })[0], 0, chessToPosition({ file: 'd', rank: 8 })[2]], 
    fov: 30
  },
  // Final dramatic view of queen
  { 
    time: 9.5, 
    position: [chessToPosition({ file: 'd', rank: 8 })[0] + 0.25, 0.25, chessToPosition({ file: 'd', rank: 8 })[2] - 0.15], 
    target: [chessToPosition({ file: 'd', rank: 8 })[0], 0.05, chessToPosition({ file: 'd', rank: 8 })[2]], 
    fov: 35
  }
];

// Cubic bezier easing for natural movement
function calculateEasedProgress(t: number, easingFn = [0.33, 1, 0.68, 1]) {
  // Cubic-bezier calculation (approximation)
  const [p0, p1, p2, p3] = easingFn;
  const t2 = t * t;
  const t3 = t2 * t;
  
  return (
    3 * (1-t) * (1-t) * t * p1 +
    3 * (1-t) * t2 * p2 +
    t3
  );
}

// Position interpolation with natural arc
function interpolatePosition(startPos: Vector3Array, endPos: Vector3Array, progress: number, withHeight = true): Vector3Array {
  // Add slight height during movement for natural arcs
  const height = withHeight 
    ? 0.01 + 0.03 * Math.sin(progress * Math.PI) // Reaches 0.04 at midpoint
    : 0.01; // Fixed height if no arc desired
  
  return [
    startPos[0] + (endPos[0] - startPos[0]) * progress,
    height,
    startPos[2] + (endPos[2] - startPos[2]) * progress
  ];
}

// Calculate the current movement state based on elapsed time
function calculateMovementState(elapsedTime: number) {
  // Find the current segment in the timeline
  const currentSegment = timelineSegments.find(segment => 
    elapsedTime >= segment.start && elapsedTime < segment.end
  );
  
  if (!currentSegment) {
    return { isComplete: true };
  }
  
  // Calculate normalized progress through current segment (0-1)
  const segmentProgress = (elapsedTime - currentSegment.start) / currentSegment.duration;
  const easedProgress = calculateEasedProgress(Math.min(1, Math.max(0, segmentProgress)));
  
  // Calculate overall progress through the whole animation (0-1)
  const overallProgress = elapsedTime / TOTAL_ANIMATION_DURATION;
  
  return {
    isComplete: false,
    stage: currentSegment.name,
    rawProgress: segmentProgress,
    easedProgress: easedProgress,
    overallProgress: overallProgress
  };
}

// Calculate camera parameters based on keyframes
function calculateCameraParameters(elapsedTime: number) {
  // Find the appropriate keyframes for the current time
  let startIndex = 0;
  let endIndex = 0;
  
  for (let i = 0; i < cameraKeyframes.length - 1; i++) {
    if (elapsedTime >= cameraKeyframes[i].time && elapsedTime < cameraKeyframes[i+1].time) {
      startIndex = i;
      endIndex = i + 1;
      break;
    }
  }
  
  // Handle the case where we're past the last keyframe
  if (elapsedTime >= cameraKeyframes[cameraKeyframes.length - 1].time) {
    startIndex = cameraKeyframes.length - 1;
    endIndex = cameraKeyframes.length - 1;
  }
  
  const startFrame = cameraKeyframes[startIndex];
  const endFrame = cameraKeyframes[endIndex];
  
  // If at the same keyframe, return that frame's parameters
  if (startIndex === endIndex) {
    return {
      position: startFrame.position,
      target: startFrame.target,
      fov: startFrame.fov
    };
  }
  
  // Calculate interpolation progress between the two keyframes
  const frameDuration = endFrame.time - startFrame.time;
  const frameProgress = (elapsedTime - startFrame.time) / frameDuration;
  const easedProgress = calculateEasedProgress(frameProgress, [0.46, 0, 0.54, 1]); // easeInOutQuad
  
  // Interpolate camera properties
  return {
    position: [
      startFrame.position[0] + (endFrame.position[0] - startFrame.position[0]) * easedProgress,
      startFrame.position[1] + (endFrame.position[1] - startFrame.position[1]) * easedProgress,
      startFrame.position[2] + (endFrame.position[2] - startFrame.position[2]) * easedProgress
    ],
    target: [
      startFrame.target[0] + (endFrame.target[0] - startFrame.target[0]) * easedProgress,
      startFrame.target[1] + (endFrame.target[1] - startFrame.target[1]) * easedProgress,
      startFrame.target[2] + (endFrame.target[2] - startFrame.target[2]) * easedProgress
    ],
    fov: startFrame.fov + (endFrame.fov - startFrame.fov) * easedProgress
  };
}

// Transformation effect component
function TransformationEffects({ position, visible, progress }: { 
  position: Vector3Array, 
  visible: boolean, 
  progress: number 
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current && visible) {
      glowRef.current.scale.setScalar(0.1 + 0.1 * Math.sin(state.clock.elapsedTime * 5));
      glowRef.current.material.opacity = 0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
    }
  });
  
  return (
    <group position={[position[0], position[1] + 0.02, position[2]]} visible={visible}>
      {/* Glow effect */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial 
          color={userPreferences.colorScheme.primary} 
          transparent 
          opacity={0.5} 
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Main component for the chess transformation scene
export default function ChessTransformationScene({ position = [0, 0, 0] as Vector3Array }) {
  // Debug log for component initialization
  console.log('ChessTransformationScene is being rendered with position:', position);
  // Time and animation state
  const elapsedTimeRef = useRef(0);
  const isPlayingRef = useRef(true);
  
  // Refs for scene objects
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const boardRef = useRef<THREE.Group>(null);
  const kingRef = useRef<THREE.Group>(null);
  const rookRef = useRef<THREE.Group>(null);
  const pawnRef = useRef<THREE.Group>(null);
  const queenRef = useRef<THREE.Group>(null);
  
  // Load models with error handling
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  
  const { scene: chessboardScene } = useGLTF('/models/chessboard.glb', undefined, (e) => {
    console.error('Error loading chessboard model:', e);
    setModelLoadError('Failed to load chessboard model');
  });
  
  const kingGltf = useGLTF('/models/chess_king.glb', undefined, (e) => {
    console.error('Error loading king model:', e);
    setModelLoadError('Failed to load king model');
  });
  
  const rookGltf = useGLTF('/models/chess_rook.glb', undefined, (e) => {
    console.error('Error loading rook model:', e);
    setModelLoadError('Failed to load rook model');
  });
  
  // Try using the optimized pawn model instead
  const pawnGltf = useGLTF('/models/pawn.glb', undefined, (e) => {
    console.error('Error loading pawn model:', e);
    setModelLoadError('Failed to load pawn model');
  });
  
  const queenGltf = useGLTF('/models/chess_queen.glb', undefined, (e) => {
    console.error('Error loading queen model:', e);
    setModelLoadError('Failed to load queen model');
  });
  
  // Add detailed debugging for models
  useEffect(() => {
    // Log model details for debugging
    console.log('Chessboard model:', chessboardScene);
    console.log('King model:', kingGltf.scene);
    console.log('Rook model:', rookGltf.scene);
    console.log('Pawn model:', pawnGltf.scene);
    console.log('Queen model:', queenGltf.scene);
  }, [chessboardScene, kingGltf.scene, rookGltf.scene, pawnGltf.scene, queenGltf.scene]);
  
  // Preload models
  useEffect(() => {
    useGLTF.preload('/models/chessboard.glb');
    useGLTF.preload('/models/chess_king.glb');
    useGLTF.preload('/models/chess_rook.glb');
    useGLTF.preload('/models/pawn.glb'); // Use optimized pawn model
    useGLTF.preload('/models/chess_queen.glb');
    
    return () => {
      console.log("ChessTransformationScene unmounting, cleaning up");
    };
  }, []);
  
  // Setup materials on component mount
  useEffect(() => {
    // Skip material setup if models failed to load
    if (modelLoadError) return;
    // Set up king material
    if (kingGltf.scene) {
      kingGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF, // White
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0x222222,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    
    // Set up rook material
    if (rookGltf.scene) {
      rookGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF, // White
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0x222222,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    
    // Set up pawn material
    if (pawnGltf.scene) {
      pawnGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x222222, // Black
            metalness: 0.3,
            roughness: 0.4,
            emissive: 0x444444,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
    
    // Set up queen material
    if (queenGltf.scene) {
      queenGltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x222222, // Black
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x884444, // Slight purple-red glow
            emissiveIntensity: 0.8,
            side: THREE.DoubleSide,
            toneMapped: false
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [kingGltf.scene, rookGltf.scene, pawnGltf.scene, queenGltf.scene]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!isPlayingRef.current) return;
    
    // Update animation time
    elapsedTimeRef.current += delta;
    
    // Loop animation every 10 seconds
    if (elapsedTimeRef.current > TOTAL_ANIMATION_DURATION) {
      elapsedTimeRef.current = 0;
    }
    
    // Calculate current animation state
    const movementState = calculateMovementState(elapsedTimeRef.current);
    if (movementState.isComplete) return;
    
    // Handle castling intro (0-2s)
    if (movementState.stage === 'castling') {
      const t = movementState.easedProgress;
      
      // Move king from e1 to c1
      if (kingRef.current) {
        kingRef.current.position.set(
          castlingWaypoints.king.start[0] + (castlingWaypoints.king.end[0] - castlingWaypoints.king.start[0]) * t,
          0.01, // Slight elevation
          castlingWaypoints.king.start[2] + (castlingWaypoints.king.end[2] - castlingWaypoints.king.start[2]) * t
        );
      }
      
      // Move rook from a1 to d1
      if (rookRef.current) {
        rookRef.current.position.set(
          castlingWaypoints.rook.start[0] + (castlingWaypoints.rook.end[0] - castlingWaypoints.rook.start[0]) * t,
          0.01, // Slight elevation
          castlingWaypoints.rook.start[2] + (castlingWaypoints.rook.end[2] - castlingWaypoints.rook.start[2]) * t
        );
      }
    }
    
    // Handle pawn movement (2-8s)
    if (movementState.stage && movementState.stage.includes('-')) {
      const [fromSquare, toSquare] = movementState.stage.split('-');
      const fromIndex = parseInt(fromSquare.charAt(1)) - 2; // d2 -> index 0
      const toIndex = parseInt(toSquare.charAt(1)) - 2;     // d3 -> index 1
      
      if (pawnRef.current && fromIndex >= 0 && toIndex >= 0) {
        const startPos = pawnJourney[fromIndex].position;
        const endPos = pawnJourney[toIndex].position;
        const newPos = interpolatePosition(startPos, endPos, movementState.easedProgress);
        
        pawnRef.current.position.set(newPos[0], newPos[1], newPos[2]);
      }
    }
    
    // Handle transformation (8-10s)
    if (movementState.stage === 'transform') {
      const t = movementState.easedProgress;
      
      if (pawnRef.current) {
        pawnRef.current.visible = t < 0.5;
        pawnRef.current.scale.setScalar(0.144 * (1 - t * 2)); // Shrink pawn
      }
      
      if (queenRef.current) {
        queenRef.current.visible = t > 0.5;
        queenRef.current.scale.setScalar(0.144 * ((t - 0.5) * 2)); // Grow queen
        queenRef.current.rotation.y = t * Math.PI * 4; // Two full rotations
      }
    }
    
    // Update camera
    if (cameraRef.current) {
      const camParams = calculateCameraParameters(elapsedTimeRef.current);
      cameraRef.current.position.set(
        camParams.position[0], 
        camParams.position[1], 
        camParams.position[2]
      );
      cameraRef.current.lookAt(
        camParams.target[0], 
        camParams.target[1], 
        camParams.target[2]
      );
      cameraRef.current.fov = camParams.fov;
      cameraRef.current.updateProjectionMatrix();
    }
    
    // Add slight board rotation
    if (boardRef.current) {
      boardRef.current.rotation.y = -Math.PI / 6 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });
  
  // Show error message if models failed to load
  if (modelLoadError) {
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Html position={[0, 0.5, 0]} center>
          <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px' }}>
            {modelLoadError}
          </div>
        </Html>
      </group>
    );
  }
  
  return (
    <group position={position}>
      {/* Camera */}
      <PerspectiveCamera 
        ref={cameraRef} 
        makeDefault 
        position={[0.5, 0.35, 0.9]} 
        fov={40}
        near={0.01}
        far={100}
      />
      
      {/* Chessboard */}
      <group
        ref={boardRef}
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 6, 0, Math.PI / 12]} // Similar to original board slant
      >
        <primitive object={chessboardScene.clone()} scale={[0.03, 0.03, 0.03]} />
      </group>
      
      {/* Chess Pieces */}
      <group ref={kingRef} position={castlingWaypoints.king.start} scale={[0.144, 0.144, 0.144]}>
        <primitive object={kingGltf.scene.clone()} />
      </group>
      
      <group ref={rookRef} position={castlingWaypoints.rook.start} scale={[0.144, 0.144, 0.144]}>
        <primitive object={rookGltf.scene.clone()} />
      </group>
      
      <group ref={pawnRef} position={pawnJourney[0].position} scale={[0.144, 0.144, 0.144]}>
        <primitive object={pawnGltf.scene.clone()} />
      </group>
      
      <group 
        ref={queenRef} 
        position={pawnJourney[6].position} 
        scale={[0, 0, 0]} // Start invisible
        visible={false}
      >
        <primitive object={queenGltf.scene.clone()} />
      </group>
      
      {/* Transformation Effects */}
      <TransformationEffects 
        position={pawnJourney[6].position} 
        visible={false} // Start with effects not visible
        progress={0} // Start with 0 progress
      />
      
      {/* Environment */}
      <Environment preset="night" />
    </group>
  );
}
