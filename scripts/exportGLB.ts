import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import * as gltfPipeline from 'gltf-pipeline';

// Minimal type declarations for browser globals
declare global {
  namespace NodeJS {
    interface Global {
      document: Partial<Document>;
      window: Partial<Window>;
      THREE: typeof THREE;
    }
  }
}

// Patch global scope with minimal required functionality
(global as any).window = global;
(global as any).THREE = THREE;
(global as any).document = {
  createElement: (nodeName: string) => {
    if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`);
    return createCanvas(256, 256);
  }
};

interface ExportOptions {
  binary?: boolean;
  onlyVisible?: boolean;
  maxTextureSize?: number;
  animations?: THREE.AnimationClip[];
  includeCustomExtensions?: boolean;
  embedImages?: boolean;
  dracoCompression?: boolean;
  dracoOptions?: gltfPipeline.GltfToGlbOptions['dracoOptions'];
}

/**
 * Exports a Three.js scene or object to GLB format
 * @param input - Three.js Scene, Object3D, or Mesh to export
 * @param outputPath - Path where the GLB file should be saved
 * @param options - Export options
 */
export async function exportToGLB(
  input: THREE.Object3D | THREE.Scene | THREE.Mesh,
  outputPath: string,
  options: ExportOptions = {}
): Promise<void> {
  try {
    // First export to GLTF using Three.js exporter
    const exporter = new GLTFExporter();
    
    const gltf = await new Promise((resolve, reject) => {
      exporter.parse(
        input,
        (result) => resolve(result),
        (error) => reject(error),
        {
          binary: false, // We'll convert to binary (GLB) in the next step
          onlyVisible: options.onlyVisible ?? true,
          maxTextureSize: options.maxTextureSize,
          animations: options.animations,
          includeCustomExtensions: options.includeCustomExtensions,
          embedImages: options.embedImages ?? true
        }
      );
    });

    // Convert GLTF to GLB using gltf-pipeline
    const pipelineOptions: gltfPipeline.GltfToGlbOptions = {
      dracoOptions: options.dracoCompression ? {
        compressionLevel: 7,
        ...options.dracoOptions
      } : undefined
    };

    const results = await gltfPipeline.gltfToGlb(gltf, pipelineOptions);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the GLB file
    fs.writeFileSync(outputPath, results.glb);
    
    console.log(`Successfully exported GLB to: ${outputPath}`);
  } catch (error) {
    console.error('Error exporting to GLB:', error);
    throw error;
  }
}

// Example usage:
/*
import { Scene, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';

const scene = new Scene();
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshStandardMaterial({ color: 0xff0000 });
const mesh = new Mesh(geometry, material);
scene.add(mesh);

exportToGLB(scene, 'output/model.glb', {
  dracoCompression: true,
  dracoOptions: {
    compressionLevel: 7
  }
})
  .then(() => console.log('Export complete'))
  .catch(console.error);
*/ 