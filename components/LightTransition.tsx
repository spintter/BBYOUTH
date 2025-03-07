'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface LightTransitionProps {
  active?: boolean;
  duration?: number;
  startColor?: string;
  endColor?: string;
  startIntensity?: number;
  endIntensity?: number;
  position?: [number, number, number];
}

export function LightTransition({ 
  active = false, 
  duration = 3,
  startColor = '#000000',
  endColor = '#FFFFFF',
  startIntensity = 0.1,
  endIntensity = 1.5,
  position = [0, 2, 0]
}: LightTransitionProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  
  // Convert colors to THREE.Color objects
  const startColorObj = new THREE.Color(startColor);
  const endColorObj = new THREE.Color(endColor);
  
  // Initialize the light transition
  useEffect(() => {
    if (active && lightRef.current) {
      timeline.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (timeline.current) {
            timeline.current.kill();
          }
        }
      });
      
      // Set initial state
      lightRef.current.color.copy(startColorObj);
      lightRef.current.intensity = startIntensity;
      
      // Create animation for color transition
      timeline.current.to(
        lightRef.current.color,
        {
          r: endColorObj.r,
          g: endColorObj.g,
          b: endColorObj.b,
          duration: duration * 0.8,
          ease: "power2.inOut"
        },
        0
      );
      
      // Create animation for intensity transition
      timeline.current.to(
        lightRef.current,
        {
          intensity: endIntensity,
          duration: duration,
          ease: "power2.inOut"
        },
        0
      );
      
      // Start the timeline
      if (active) {
        timeline.current.play();
      }
    }
    
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [active, duration, startColorObj, endColorObj, startIntensity, endIntensity]);
  
  // Add subtle pulsing effect to the light
  useFrame((state) => {
    if (lightRef.current && active) {
      const time = state.clock.getElapsedTime();
      const pulseIntensity = Math.sin(time * 2) * 0.1;
      
      if (timeline.current && timeline.current.progress() > 0.5) {
        lightRef.current.intensity += pulseIntensity;
      }
    }
  });
  
  return (
    <pointLight 
      ref={lightRef}
      position={new THREE.Vector3(...position)}
      color={startColor}
      intensity={startIntensity}
      distance={10}
      decay={2}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
} 