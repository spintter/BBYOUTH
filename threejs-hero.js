
// Three.js implementation of the hero section
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

// Initialize the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1A1A1A);

// Initialize camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 12);

// Initialize renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('hero-container').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 6, 0.5, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2.5;
controls.minPolarAngle = Math.PI / 4;

// Create chessboard
function createChessboard() {
    const chessboardGroup = new THREE.Group();
    chessboardGroup.rotation.x = -Math.PI / 8;
    
    const textureLoader = new THREE.TextureLoader();
    
    // Fallback to solid colors if textures don't load
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2d3a });
    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xe2d5c4 });
    
    // Create 8x8 chessboard
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const isDark = (i + j) % 2 === 0;
            
            const tileGeometry = new THREE.BoxGeometry(1.9, 0.2, 1.9);
            const material = isDark ? darkMaterial : lightMaterial;
            
            const tile = new THREE.Mesh(tileGeometry, material);
            tile.position.set((i * 2) - 7, 0, (j * 2) - 7);
            tile.receiveShadow = true;
            
            // Add animation data
            tile.userData = { 
                originalY: 0,
                animationOffset: (i + j) * 0.1
            };
            
            chessboardGroup.add(tile);
        }
    }
    
    scene.add(chessboardGroup);
    return chessboardGroup;
}

const chessboard = createChessboard();
let blackPantherModel = null;

// Create a simpler placeholder model since we're getting errors with the Black Panther model
function createPlaceholderModel() {
    const group = new THREE.Group();
    
    // Create a stylized geometric figure
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5a2a17,
        metalness: 0.3,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5a2a17,
        metalness: 0.3,
        roughness: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    head.castShadow = true;
    
    group.add(body);
    group.add(head);
    
    // Position the whole figure
    group.position.set(0, 1.5, 0);
    group.rotation.y = Math.PI / 4;
    scene.add(group);
    
    return group;
}

// Create our placeholder model
blackPantherModel = createPlaceholderModel();

// Start transformation sequence after 3 seconds
setTimeout(() => {
    transformBlackPanther();
}, 3000);

// Transform animation
function transformBlackPanther() {
    if (!blackPantherModel) return;
    
    // Change color and position over time
    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    const initialPosition = { y: 1.5 };
    const targetPosition = { y: 2 };
    
    const initialRotation = { y: Math.PI / 4 };
    const targetRotation = { y: Math.PI * 0.75 };
    
    // Add particle effect for transformation
    createTransformationParticles();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smoother animation
        const easedProgress = easeOutElastic(progress);
        
        // Update position
        blackPantherModel.position.y = initialPosition.y + (targetPosition.y - initialPosition.y) * easedProgress;
        
        // Update rotation
        blackPantherModel.rotation.y = initialRotation.y + (targetRotation.y - initialRotation.y) * progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Easing function for smoother animation
function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    
    return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

// Create particle effects for transformation
function createTransformationParticles() {
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 1;
        particlePositions[i * 3 + 1] = Math.random() * 1.5;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x9333ea,
        size: 0.05,
        transparent: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.set(0, 1.5, 0);
    scene.add(particles);
    
    // Animate particles
    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    function animateParticles() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        particles.position.y += 0.01;
        particleMaterial.opacity = Math.max(0, 1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animateParticles);
        } else {
            scene.remove(particles);
        }
    }
    
    animateParticles();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate chessboard tiles
    if (chessboard) {
        chessboard.children.forEach((tile) => {
            const time = Date.now() * 0.001;
            tile.position.y = tile.userData.originalY + Math.sin(time + tile.userData.animationOffset) * 0.05;
        });
    }
    
    renderer.render(scene, camera);
}

animate();
