// components/TransformationSequence.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Narrative stages of the transformation journey
enum TransformationStage {
  POTENTIAL = 'potential', // Beginning stage - pawn form
  AWAKENING = 'awakening', // First awareness of potential
  LEARNING = 'learning',   // Acquisition of knowledge
  GROWTH = 'growth',       // Personal development
  WISDOM = 'wisdom',       // Integration of knowledge
  EMPOWERMENT = 'empowerment', // Final transformation - queen form
}

// Narrative events that can occur during transformation
interface TransformationEvent {
  stage: TransformationStage;
  timestamp: number;
  progress: number; // 0-1 progress through the transformation
  message: string;  // Narrative message for this event
}

// Properties for the transformation sequence
interface TransformationSequenceProps {
  active: boolean;
  onComplete?: () => void;
  onStageChange?: (stage: TransformationStage, event: TransformationEvent) => void;
  position?: [number, number, number];
  duration?: number; // Total duration in seconds
  transformationJourney?: TransformationStorybeat[]; // Custom narrative journey
}

// Storybeat structure for narrative progression
interface TransformationStorybeat {
  stage: TransformationStage;
  progressPoint: number; // When this stage occurs (0-1)
  message: string;
  visualEffect?: string; // Type of visual effect to accompany this storybeat
  emotionalTone?: string; // Emotional tone for this beat
}

// Default narrative journey
const defaultTransformationJourney: TransformationStorybeat[] = [
  { 
    stage: TransformationStage.POTENTIAL, 
    progressPoint: 0,
    message: "Every journey begins with potential, waiting to be discovered.",
    visualEffect: "gentle-pulse",
    emotionalTone: "curiosity"
  },
  { 
    stage: TransformationStage.AWAKENING, 
    progressPoint: 0.2,
    message: "The spark of knowledge awakens consciousness to new possibilities.",
    visualEffect: "light-flare",
    emotionalTone: "wonder"
  },
  { 
    stage: TransformationStage.LEARNING, 
    progressPoint: 0.4,
    message: "Through study and reflection, wisdom begins to take root.",
    visualEffect: "knowledge-symbols",
    emotionalTone: "determination"
  },
  { 
    stage: TransformationStage.GROWTH, 
    progressPoint: 0.6,
    message: "Growth transforms potential into tangible power and capabilities.",
    visualEffect: "expansion-glow",
    emotionalTone: "confidence"
  },
  { 
    stage: TransformationStage.WISDOM, 
    progressPoint: 0.8,
    message: "Wisdom integrates knowledge into profound understanding.",
    visualEffect: "golden-aura",
    emotionalTone: "serenity"
  },
  { 
    stage: TransformationStage.EMPOWERMENT, 
    progressPoint: 1.0,
    message: "Fully realized, knowledge transforms into true empowerment.",
    visualEffect: "radiant-crown",
    emotionalTone: "triumph"
  }
];

export function TransformationSequence({ 
  active = false, 
  onComplete, 
  onStageChange,
  position = [0, 0, 0],
  duration = 10,
  transformationJourney = defaultTransformationJourney
}: TransformationSequenceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<TransformationStage>(TransformationStage.POTENTIAL);
  const [transformationEvents, setTransformationEvents] = useState<TransformationEvent[]>([]);
  const [emissionIntensity, setEmissionIntensity] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(0.1);
  const [scale, setScale] = useState(1);
  
  // Timeline for the transformation animation
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Set up the GSAP timeline for the transformation
  useEffect(() => {
    if (active && !timelineRef.current) {
      // Create a new timeline
      const tl = gsap.timeline({
        paused: true,
        onUpdate: () => {
          // Update progress based on timeline position
          const newProgress = tl.progress();
          setProgress(newProgress);
          
          // Find the current stage based on progress
          const currentStorybeat = transformationJourney.find((storybeat, index) => {
            return newProgress >= storybeat.progressPoint && 
                  (index === transformationJourney.length - 1 || 
                   newProgress < transformationJourney[index + 1].progressPoint);
          });
          
          if (currentStorybeat && currentStorybeat.stage !== currentStage) {
            // Stage has changed, trigger the event
            const newEvent: TransformationEvent = {
              stage: currentStorybeat.stage,
              timestamp: Date.now(),
              progress: newProgress,
              message: currentStorybeat.message
            };
            
            setCurrentStage(currentStorybeat.stage);
            setTransformationEvents(prev => [...prev, newEvent]);
            
            if (onStageChange) {
              onStageChange(currentStorybeat.stage, newEvent);
            }
          }
        },
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
      
      // Add animations to the timeline
      
      // 1. Initial awakening phase
      tl.to({}, { duration: duration * 0.2 }); // First 20% - potential to awakening
      
      // 2. Learning phase - increase glow, subtle growth
      tl.to({ emission: 0.5, scale: 1.1, rotation: 0.3 }, {
        duration: duration * 0.2,
        emission: 1.5,
        scale: 1.1,
        rotation: 0.3,
        onUpdate: function() {
          setEmissionIntensity(this.targets()[0].emission);
          setScale(this.targets()[0].scale);
          setRotationSpeed(this.targets()[0].rotation);
        }
      });
      
      // 3. Growth phase - more substantial changes
      tl.to({ emission: 1.5, scale: 1.1, rotation: 0.3 }, {
        duration: duration * 0.2,
        emission: 2.5,
        scale: 1.2,
        rotation: 0.5,
        onUpdate: function() {
          setEmissionIntensity(this.targets()[0].emission);
          setScale(this.targets()[0].scale);
          setRotationSpeed(this.targets()[0].rotation);
        }
      });
      
      // 4. Wisdom phase - integration and harmony
      tl.to({ emission: 2.5, scale: 1.2, rotation: 0.5 }, {
        duration: duration * 0.2,
        emission: 3.5,
        scale: 1.3,
        rotation: 0.2,
        onUpdate: function() {
          setEmissionIntensity(this.targets()[0].emission);
          setScale(this.targets()[0].scale);
          setRotationSpeed(this.targets()[0].rotation);
        }
      });
      
      // 5. Final empowerment phase - dramatic transformation
      tl.to({ emission: 3.5, scale: 1.3, rotation: 0.2 }, {
        duration: duration * 0.2,
        emission: 5.0,
        scale: 1.5,
        rotation: 0.8,
        onUpdate: function() {
          setEmissionIntensity(this.targets()[0].emission);
          setScale(this.targets()[0].scale);
          setRotationSpeed(this.targets()[0].rotation);
        }
      });
      
      timelineRef.current = tl;
    }
    
    // Start or pause the timeline based on active state
    if (timelineRef.current) {
      if (active) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    }
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [active, duration, onComplete, onStageChange, transformationJourney, currentStage]);
  
  // Rotate the transformation effect
  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * rotationSpeed;
      
      // Add subtle floating motion
      const floatY = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      groupRef.current.position.y = position[1] + floatY;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Transformation visual effects would go here */}
      {/* These would vary based on the current stage */}
      
      {/* Base glow effect */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={emissionIntensity}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Knowledge symbols - only visible during learning stage */}
      {(currentStage === TransformationStage.LEARNING || 
        currentStage === TransformationStage.GROWTH || 
        currentStage === TransformationStage.WISDOM) && (
        <group>
          {/* Knowledge symbols circling around */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={`symbol-${i}`}
              position={[
                Math.cos(i * Math.PI / 4) * 0.8,
                0.2,
                Math.sin(i * Math.PI / 4) * 0.8
              ]}
              rotation={[0, i * Math.PI / 4, 0]}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial 
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={emissionIntensity * 0.8}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Wisdom aura - only visible during wisdom and empowerment stages */}
      {(currentStage === TransformationStage.WISDOM || 
        currentStage === TransformationStage.EMPOWERMENT) && (
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            emissive="#FFD700"
            emissiveIntensity={emissionIntensity * 0.6}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Crown effect - only visible during empowerment stage */}
      {currentStage === TransformationStage.EMPOWERMENT && (
        <group position={[0, 0.8, 0]}>
          {/* Crown points */}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh 
              key={`crown-${i}`}
              position={[
                Math.cos(i * Math.PI * 2 / 5) * 0.3,
                Math.sin(i * Math.PI * 2 / 5) * 0.1 + 0.1,
                Math.sin(i * Math.PI * 2 / 5) * 0.3
              ]}
            >
              <coneGeometry args={[0.06, 0.2, 8]} />
              <meshStandardMaterial 
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={emissionIntensity}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
          
          {/* Crown base */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.25, 0.06, 16, 32]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={emissionIntensity * 0.8}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}