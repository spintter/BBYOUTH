import * as THREE from 'three';

/**
 * African skin material with realistic properties
 * @param color Base color for the skin
 * @param roughness Material roughness (0-1)
 * @param metalness Material metalness (0-1)
 * @returns THREE.MeshStandardMaterial
 */
export function AfricanSkinMaterial(
  color: string = '#8B4513', 
  roughness: number = 0.7, 
  metalness: number = 0.1
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    envMapIntensity: 0.5,
    flatShading: false,
  });
}

/**
 * Kente cloth material with vibrant colors and patterns
 * @param baseColor Primary color for the cloth
 * @param accentColor Secondary color for patterns
 * @param roughness Material roughness (0-1)
 * @returns THREE.MeshStandardMaterial
 */
export function KenteClothMaterial(
  baseColor: string = '#FFD700', 
  accentColor: string = '#800080',
  roughness: number = 0.8
): THREE.MeshStandardMaterial {
  // In a real implementation, this would use textures for the kente patterns
  // For now, we'll use a simple material with the base color
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(baseColor),
    roughness,
    metalness: 0.1,
    emissive: new THREE.Color(accentColor),
    emissiveIntensity: 0.2,
  });
}
