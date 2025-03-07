'use client';

import React, { useRef, useMemo } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { 
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  SMAA
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useThree } from '@react-three/fiber';
import { getAdaptiveQualitySettings } from '../../utils/performanceUtils';
import { KnowledgeTransformationStage } from '../../types/models';
import { Vector2 } from 'three';

interface TransformationEffectsProps {
  stage: KnowledgeTransformationStage;
  progress: number;
  intensity?: number;
}

export function TransformationEffects({
  stage,
  progress,
  intensity = 1.0
}: TransformationEffectsProps) {
  const { gl, size } = useThree();
  const composer = useRef();
  const quality = useMemo(() => getAdaptiveQualitySettings(), []);
  
  // Calculate effect parameters based on transformation stage
  const effectParams = useMemo(() => {
    const baseIntensity = Math.min(1, progress * intensity);
    
    switch (stage) {
      case KnowledgeTransformationStage.POTENTIAL:
        return {
          bloom: {
            intensity: 0.2 * baseIntensity,
            luminanceThreshold: 0.8,
            luminanceSmoothing: 0.5,
            kernelSize: KernelSize.MEDIUM
          },
          chromaticAberration: {
            offset: new Vector2(0.001 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.02,
            focalLength: 0.015,
            bokehScale: 1
          }
        };
        
      case KnowledgeTransformationStage.AWAKENING:
        return {
          bloom: {
            intensity: 0.5 * baseIntensity,
            luminanceThreshold: 0.6,
            luminanceSmoothing: 0.3,
            kernelSize: KernelSize.LARGE
          },
          chromaticAberration: {
            offset: new Vector2(0.002 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.025,
            focalLength: 0.02,
            bokehScale: 2
          }
        };
        
      case KnowledgeTransformationStage.LEARNING:
        return {
          bloom: {
            intensity: 0.8 * baseIntensity,
            luminanceThreshold: 0.5,
            luminanceSmoothing: 0.4,
            kernelSize: KernelSize.HUGE
          },
          chromaticAberration: {
            offset: new Vector2(0.003 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.03,
            focalLength: 0.025,
            bokehScale: 3
          }
        };
        
      case KnowledgeTransformationStage.GROWTH:
        return {
          bloom: {
            intensity: 1.0 * baseIntensity,
            luminanceThreshold: 0.4,
            luminanceSmoothing: 0.5,
            kernelSize: KernelSize.HUGE
          },
          chromaticAberration: {
            offset: new Vector2(0.004 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.035,
            focalLength: 0.03,
            bokehScale: 4
          }
        };
        
      case KnowledgeTransformationStage.WISDOM:
        return {
          bloom: {
            intensity: 1.2 * baseIntensity,
            luminanceThreshold: 0.3,
            luminanceSmoothing: 0.6,
            kernelSize: KernelSize.HUGE
          },
          chromaticAberration: {
            offset: new Vector2(0.003 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.04,
            focalLength: 0.035,
            bokehScale: 5
          }
        };
        
      case KnowledgeTransformationStage.EMPOWERMENT:
        return {
          bloom: {
            intensity: 1.5 * baseIntensity,
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0.7,
            kernelSize: KernelSize.HUGE
          },
          chromaticAberration: {
            offset: new Vector2(0.002 * baseIntensity, 0)
          },
          depthOfField: {
            focusDistance: 0.045,
            focalLength: 0.04,
            bokehScale: 6
          }
        };
        
      default:
        return {
          bloom: {
            intensity: 0.2,
            luminanceThreshold: 0.8,
            luminanceSmoothing: 0.5,
            kernelSize: KernelSize.MEDIUM
          },
          chromaticAberration: {
            offset: new Vector2(0.001, 0)
          },
          depthOfField: {
            focusDistance: 0.02,
            focalLength: 0.015,
            bokehScale: 1
          }
        };
    }
  }, [stage, progress, intensity]);
  
  return (
    <EffectComposer ref={composer} multisampling={quality.rayTracing.samples}>
      <Bloom 
        intensity={effectParams.bloom.intensity}
        luminanceThreshold={effectParams.bloom.luminanceThreshold}
        luminanceSmoothing={effectParams.bloom.luminanceSmoothing}
        kernelSize={effectParams.bloom.kernelSize}
      />
      
      <ChromaticAberration
        offset={effectParams.chromaticAberration.offset}
        blendFunction={BlendFunction.NORMAL}
      />
      
      <DepthOfField
        focusDistance={effectParams.depthOfField.focusDistance}
        focalLength={effectParams.depthOfField.focalLength}
        bokehScale={effectParams.depthOfField.bokehScale}
        height={size.height}
      />
      
      <SMAA />
    </EffectComposer>
  );
} 