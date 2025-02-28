
// Three.js implementation of the hero section
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

// Initialize the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a192f); // Darker blue background

// Initialize camera with wider field of view to see the full board
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 10); // Moved closer to see full board

// Initialize renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('hero-container').appendChild(renderer.domElement);

// Enhanced lighting system
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0x4d9de0, 0.6); // Bluish ambient light
scene.add(ambientLight);

// Main directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Accent lighting from behind
const backLight = new THREE.DirectionalLight(0x4d9de0, 1); // Bluish backlight
backLight.position.set(-10, 5, -10);
scene.add(backLight);

// Dramatic spot light from above
const spotLight = new THREE.SpotLight(0xffffff, 0.8, 50, Math.PI / 6, 0.5, 1);
spotLight.position.set(0, 15, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Create a subtle fog effect
scene.fog = new THREE.FogExp2(0x0a192f, 0.03);

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minPolarAngle = Math.PI / 4;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Create a more visually stunning chessboard
function createChessboard() {
    const chessboardGroup = new THREE.Group();
    chessboardGroup.rotation.x = -Math.PI / 8;
    
    const textureLoader = new THREE.TextureLoader();
    
    // Load checkerboard texture
    const checkerboardTexture = textureLoader.load('public/textures/checkerboard-texture.svg');
    checkerboardTexture.wrapS = THREE.RepeatWrapping;
    checkerboardTexture.wrapT = THREE.RepeatWrapping;
    
    // Create floor plane with texture
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: checkerboardTexture,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create smaller 6x6 chessboard (reduced from 8x8)
    const boardSize = 6;
    const tileSize = 1.5; // Smaller tile size
    
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const isDark = (i + j) % 2 === 0;
            
            const tileGeometry = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
            const material = new THREE.MeshStandardMaterial({ 
                color: isDark ? 0x2a2d3a : 0xe2d5c4,
                roughness: 0.7,
                metalness: isDark ? 0.3 : 0.1
            });
            
            const tile = new THREE.Mesh(tileGeometry, material);
            const offsetX = (boardSize / 2) * tileSize - tileSize / 2;
            const offsetZ = (boardSize / 2) * tileSize - tileSize / 2;
            
            tile.position.set((i * tileSize) - offsetX, 0, (j * tileSize) - offsetZ);
            tile.receiveShadow = true;
            tile.castShadow = true;
            
            // Add animation data
            tile.userData = { 
                originalY: 0,
                animationOffset: (i + j) * 0.1
            };
            
            chessboardGroup.add(tile);
        }
    }
    
    // Add subtle glow effect around the board
    const glowGeometry = new THREE.RingGeometry(8, 12, 30);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4d9de0,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    
    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = -0.4;
    scene.add(glowRing);
    
    scene.add(chessboardGroup);
    return chessboardGroup;
}

const chessboard = createChessboard();

// Add atmospheric particles
function createAtmosphericParticles() {
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 1] = Math.random() * 15;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x4d9de0,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    return particles;
}

const atmosphericParticles = createAtmosphericParticles();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate chessboard tiles with subtle wave effect
    if (chessboard) {
        chessboard.children.forEach((tile) => {
            const time = Date.now() * 0.001;
            tile.position.y = tile.userData.originalY + Math.sin(time + tile.userData.animationOffset) * 0.05;
        });
    }
    
    // Slowly rotate atmospheric particles
    if (atmosphericParticles) {
        atmosphericParticles.rotation.y += 0.0005;
        
        // Make particles twinkle
        if (Math.random() > 0.95) {
            atmosphericParticles.material.opacity = 0.3 + Math.random() * 0.3;
        }
    }
    
    controls.update(); // Required for auto-rotation
    renderer.render(scene, camera);
}

animate();
