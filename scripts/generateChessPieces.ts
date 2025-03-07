import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { Blob, FileReader } from 'vblob';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

console.log('Starting script...');

// Patch global scope with minimal required functionality
(global as any).window = global;
(global as any).THREE = THREE;
(global as any).Blob = Blob;
(global as any).FileReader = FileReader;
(global as any).document = {
  createElement: (nodeName: string) => {
    if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`);
    return createCanvas(256, 256);
  }
};

console.log('Global scope patched...');

// Create the African Pawn model
function createAfricanPawn(): THREE.Group {
  console.log('Creating African Pawn...');
  const pawn = new THREE.Group();

  // Head - African features
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({ 
      color: '#8B4513',
      roughness: 0.7,
      metalness: 0.1
    })
  );
  head.position.y = 1.6;
  pawn.add(head);

  // Hair - Afro style
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 1,
      metalness: 0
    })
  );
  hair.position.y = 1.8;
  pawn.add(hair);

  // Body - Traditional dress
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.4, 1.2, 32),
    new THREE.MeshStandardMaterial({
      color: '#800020',
      roughness: 0.8,
      metalness: 0.1
    })
  );
  body.position.y = 0.8;
  pawn.add(body);

  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32),
    new THREE.MeshStandardMaterial({
      color: '#2a1810',
      roughness: 0.8,
      metalness: 0.2
    })
  );
  base.position.y = 0.1;
  pawn.add(base);

  console.log('African Pawn created successfully');
  return pawn;
}

// Create the African Queen model
function createAfricanQueen(): THREE.Group {
  console.log('Creating African Queen...');
  const queen = new THREE.Group();

  // Crown base
  const crownBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.45, 0.2, 32),
    new THREE.MeshStandardMaterial({
      color: '#FFD700',
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#FFD700',
      emissiveIntensity: 0.5
    })
  );
  crownBase.position.y = 2.2;
  queen.add(crownBase);

  // Crown points
  for (let i = 0; i < 5; i++) {
    const point = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.3, 8),
      new THREE.MeshStandardMaterial({
        color: '#FFD700',
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#FFD700',
        emissiveIntensity: 0.5
      })
    );
    point.position.set(
      Math.cos(i * Math.PI * 2 / 5) * 0.3,
      2.4,
      Math.sin(i * Math.PI * 2 / 5) * 0.3
    );
    queen.add(point);
  }

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.7,
      metalness: 0.1
    })
  );
  head.position.y = 1.8;
  queen.add(head);

  // Hair base
  const hairBase = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 1,
      metalness: 0
    })
  );
  hairBase.position.y = 2.0;
  queen.add(hairBase);

  // Decorative braids
  for (let i = 0; i < 8; i++) {
    const braid = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.03, 8, 16),
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 1,
        metalness: 0
      })
    );
    braid.position.set(
      Math.cos(i * Math.PI / 4) * 0.3,
      1.8,
      Math.sin(i * Math.PI / 4) * 0.3
    );
    queen.add(braid);
  }

  // Upper body
  const upperBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.45, 0.8, 32),
    new THREE.MeshStandardMaterial({
      color: '#800020',
      roughness: 0.8,
      metalness: 0.1
    })
  );
  upperBody.position.y = 1.3;
  queen.add(upperBody);

  // Lower body
  const lowerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.6, 0.8, 32),
    new THREE.MeshStandardMaterial({
      color: '#800020',
      roughness: 0.8,
      metalness: 0.1
    })
  );
  lowerBody.position.y = 0.6;
  queen.add(lowerBody);

  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32),
    new THREE.MeshStandardMaterial({
      color: '#2a1810',
      roughness: 0.8,
      metalness: 0.2
    })
  );
  base.position.y = 0.15;
  queen.add(base);

  console.log('African Queen created successfully');
  return queen;
}

// Export to GLB function using a two-step process
async function exportToGLB(
  scene: THREE.Scene | THREE.Object3D,
  outputPath: string
): Promise<void> {
  try {
    console.log('Starting GLB export...');
    console.log('Using GLTFExporter to convert to GLTF...');
    
    // First export to GLTF using Three.js exporter
    const exporter = new GLTFExporter();
    
    const gltf = await new Promise((resolve, reject) => {
      exporter.parse(
        scene,
        (result) => {
          console.log('GLTFExporter parse successful');
          resolve(result);
        },
        (error) => {
          console.error('GLTFExporter parse failed:', error);
          reject(error);
        },
        {
          binary: false,
          embedImages: true,
          forceIndices: true,
          includeCustomExtensions: true
        }
      );
    });

    // Save temporary GLTF file
    const tempGltfPath = outputPath.replace('.glb', '.gltf');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(tempGltfPath, JSON.stringify(gltf, null, 2));
    console.log(`Temporary GLTF saved to: ${tempGltfPath}`);

    // Convert GLTF to GLB using gltf-pipeline CLI
    console.log('Converting GLTF to GLB using gltf-pipeline...');
    const command = `gltf-pipeline -i "${tempGltfPath}" -o "${outputPath}" -d`;
    
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    // Clean up temporary GLTF file
    fs.unlinkSync(tempGltfPath);
    
    console.log(`Successfully exported GLB to: ${outputPath}`);
  } catch (error) {
    console.error('Error exporting to GLB:', error);
    throw error;
  }
}

// Generate and export the models
async function generateModels() {
  try {
    console.log('Starting model generation...');
    
    // Create scene for proper lighting
    const scene = new THREE.Scene();
    
    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(-5, 3, -5);
    scene.add(light2);

    console.log('Scene and lighting set up');

    // Create and export pawn
    const pawn = createAfricanPawn();
    scene.add(pawn);
    await exportToGLB(scene, 'public/models/african-pawn.glb');
    scene.remove(pawn);

    // Create and export queen
    const queen = createAfricanQueen();
    scene.add(queen);
    await exportToGLB(scene, 'public/models/african-queen.glb');
    scene.remove(queen);

    console.log('Successfully generated chess piece models!');
  } catch (error) {
    console.error('Error generating models:', error);
    throw error;
  }
}

// Run the generation
console.log('Starting script execution...');
generateModels().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 