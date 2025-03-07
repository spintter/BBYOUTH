// Import fetch correctly for ESM or CommonJS
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DeepSeek API key from environment or hardcoded for this example
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-d0680da3298a45d99292e89a1dbb3a41';

// System message that will be reused across all messages
const systemMessage = `You are a team of 6 world-class experts collaborating to create the most optimized 3D model integration for a Next.js application:

1. 3D Technical Director (Expertise: Three.js optimization, WebGPU/WebGL pipeline management)
2. Materials & Shading Expert (Expertise: PBR materials, advanced shading techniques, texture optimization)
3. Performance Engineer (Expertise: Memory management, draw call optimization, LOD implementation)
4. Cultural Art Director (Expertise: African aesthetics, cultural symbolism, authentic representation)
5. Animation Specialist (Expertise: Skeletal animation, transformation sequences, procedural animation)
6. Asset Pipeline Engineer (Expertise: glTF optimization, texture compression, model optimization)

You have access to the following file structure:
- components/KnowledgeIsPowerChessboard.tsx (Main 3D scene component)
- components/materials/AfrocentricMaterials.tsx (Custom materials)
- public/models/african-girl.glb (16KB model)
- public/models/african-queen.glb (47KB model)
- public/draco/ (Draco decoder files)
- public/basis/ (KTX2/Basis decoder files)
- scripts/download-decoders.js (Utility for downloading decoder files)

Your task is to analyze, critique, and progressively enhance the 3D implementation through 4 rounds of meticulous optimization, focusing on:
1. Technical excellence (WebGPU support, memory optimization, performance)
2. Cultural authenticity (accurate representation, meaningful symbolism)
3. Visual quality (PBR materials, lighting, effects)
4. User experience (smooth animations, responsive performance)

In the final round, provide a complete JSON specification for the optimized 3D implementation that meets all requirements.`;

// The four sequential user messages
const userMessages = [
  // Round 1: Initial Analysis
  `Round 1: Initial Analysis

Please analyze the current implementation of our 3D model integration for the Birmingham-Bessemer Youth Ministries project. We're using Next.js 15.2.1 with App Router, TypeScript, and Three.js 0.159.0.

Key requirements:
- Target 60+ FPS with frame times under 16ms across devices
- Support WebGPU with fallback to WebGL2
- 8K textures with anisotropic filtering (16x)
- PBR-based materials with dispersion effects
- HDR lighting with real-time global illumination
- LOD system with 3 detail levels (High: 20K triangles, Medium: 10K triangles, Low: 5K triangles)
- Memory ceiling of 500MB GPU memory
- African-inspired materials and transformation effects

Identify the most critical areas for improvement in our current implementation, focusing on technical excellence, cultural authenticity, visual quality, and user experience.`,

  // Round 2: Technical Optimization
  `Round 2: Technical Optimization

Based on your initial analysis, please provide detailed technical optimizations for our 3D model integration. Focus on:

1. WebGPU implementation with proper fallbacks
2. Memory management and optimization
3. LOD system implementation
4. Texture compression with KTX2
5. Draw call optimization
6. Shader performance

Provide specific code snippets or modifications that would enhance our implementation, particularly for the model loading system, material application, and performance monitoring.`,

  // Round 3: Visual and Cultural Enhancement
  `Round 3: Visual and Cultural Enhancement

Now that we have a solid technical foundation, please focus on enhancing the visual quality and cultural authenticity of our 3D implementation:

1. PBR material improvements for African skin tones and traditional clothing
2. Lighting enhancements for dramatic transformation effects
3. Particle systems for knowledge transformation visualization
4. Cultural symbolism integration (Adinkra symbols, Kente patterns)
5. Animation refinements for the transformation sequence

Provide specific material definitions, lighting setups, and animation sequences that would enhance the cultural significance and visual impact of our implementation.`,

  // Round 4: Final Integration and JSON Specification
  `Round 4: Final Integration and JSON Specification

Based on all previous rounds, please provide a complete JSON specification for our optimized 3D model integration. This should include:

1. Comprehensive model loading system with LOD, compression, and fallbacks
2. Complete material definitions for all elements (skin, clothing, crown, etc.)
3. Lighting and environment setup
4. Animation and transformation sequences
5. Performance optimization strategies
6. Memory management approach

The JSON should be structured to allow for easy implementation and should include all necessary parameters, values, and configurations to meet our requirements for technical excellence, cultural authenticity, visual quality, and user experience.`
];

async function makeDeepSeekCall() {
  try {
    console.log("Making API call to DeepSeek Reasoner...");
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessages[0] },
          { role: "user", content: userMessages[1] },
          { role: "user", content: userMessages[2] },
          { role: "user", content: userMessages[3] }
        ],
        stream: false,
        max_tokens: 6000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Save the response to a file
    fs.writeFileSync(
      path.join(__dirname, '../deepseek-3d-optimization.json'),
      JSON.stringify(data, null, 2)
    );
    
    console.log("API call completed. Response saved to deepseek-3d-optimization.json");
    
    // Print the assistant's response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log("\nDeepSeek Response:\n");
      console.log(data.choices[0].message.content);
    } else {
      console.log("Unexpected response format:", data);
    }
    
  } catch (error) {
    console.error("Error making API call:", error);
  }
}

// Execute the API call
makeDeepSeekCall(); 