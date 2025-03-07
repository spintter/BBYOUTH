declare module 'gltf-pipeline' {
  export interface GltfToGlbOptions {
    resourceDirectory?: string;
    dracoOptions?: {
      compressionLevel?: number;
      quantizePositionBits?: number;
      quantizeNormalBits?: number;
      quantizeTexcoordBits?: number;
      quantizeColorBits?: number;
      quantizeGenericBits?: number;
      uncompressedFallback?: boolean;
      useUniqueIdentifiers?: boolean;
    };
    separate?: boolean;
    separateTextures?: boolean;
    stats?: boolean;
    name?: string;
  }

  export interface GltfToGlbResult {
    glb: Buffer;
  }

  export function gltfToGlb(
    gltf: any,
    options?: GltfToGlbOptions
  ): Promise<GltfToGlbResult>;

  export function glbToGltf(
    glb: Buffer | Uint8Array,
    options?: any
  ): Promise<{ gltf: any; separateResources?: { [key: string]: Buffer } }>;

  export function processGltf(
    gltf: any,
    options?: any
  ): Promise<{ gltf: any; separateResources?: { [key: string]: Buffer } }>;
} 