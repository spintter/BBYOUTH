#!/bin/bash

# DeepSeek API key
DEEPSEEK_API_KEY="sk-d0680da3298a45d99292e89a1dbb3a41"

# Create the JSON payload file
cat > deepseek-payload-round1.json << 'EOL'
{
  "model": "deepseek-reasoner",
  "messages": [
    {
      "role": "system",
      "content": "You are a team of 6 world-class experts collaborating to create the most optimized 3D model integration for a Next.js application:\n\n1. 3D Technical Director (Expertise: Three.js optimization, WebGPU/WebGL pipeline management)\n2. Materials & Shading Expert (Expertise: PBR materials, advanced shading techniques, texture optimization)\n3. Performance Engineer (Expertise: Memory management, draw call optimization, LOD implementation)\n4. Cultural Art Director (Expertise: African aesthetics, cultural symbolism, authentic representation)\n5. Animation Specialist (Expertise: Skeletal animation, transformation sequences, procedural animation)\n6. Asset Pipeline Engineer (Expertise: glTF optimization, texture compression, model optimization)\n\nYou have access to the following file structure:\n- components/KnowledgeIsPowerChessboard.tsx (Main 3D scene component)\n- components/materials/AfrocentricMaterials.tsx (Custom materials)\n- public/models/african-girl.glb (16KB model)\n- public/models/african-queen.glb (47KB model)\n- public/draco/ (Draco decoder files)\n- public/basis/ (KTX2/Basis decoder files)\n- scripts/download-decoders.js (Utility for downloading decoder files)\n\nYour task is to analyze, critique, and progressively enhance the 3D implementation through 4 rounds of meticulous optimization, focusing on:\n1. Technical excellence (WebGPU support, memory optimization, performance)\n2. Cultural authenticity (accurate representation, meaningful symbolism)\n3. Visual quality (PBR materials, lighting, effects)\n4. User experience (smooth animations, responsive performance)\n\nIn the final round, provide a complete JSON specification for the optimized 3D implementation that meets all requirements."
    },
    {
      "role": "user",
      "content": "Round 1: Initial Analysis\n\nPlease analyze the current implementation of our 3D model integration for the Birmingham-Bessemer Youth Ministries project. We're using Next.js 15.2.1 with App Router, TypeScript, and Three.js 0.159.0.\n\nKey requirements:\n- Target 60+ FPS with frame times under 16ms across devices\n- Support WebGPU with fallback to WebGL2\n- 8K textures with anisotropic filtering (16x)\n- PBR-based materials with dispersion effects\n- HDR lighting with real-time global illumination\n- LOD system with 3 detail levels (High: 20K triangles, Medium: 10K triangles, Low: 5K triangles)\n- Memory ceiling of 500MB GPU memory\n- African-inspired materials and transformation effects\n\nIdentify the most critical areas for improvement in our current implementation, focusing on technical excellence, cultural authenticity, visual quality, and user experience."
    }
  ],
  "stream": false,
  "max_tokens": 4000,
  "temperature": 0.7
}
EOL

# Make the API call
echo "Making API call to DeepSeek Reasoner for Round 1..."
curl -s -X POST "https://api.deepseek.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d @deepseek-payload-round1.json > deepseek-3d-round1.json

echo "API call completed. Response saved to deepseek-3d-round1.json"

# Extract and display the response content
RESPONSE_CONTENT=$(cat deepseek-3d-round1.json | jq -r '.choices[0].message.content')
echo -e "\nDeepSeek Response (Round 1):\n"
echo "$RESPONSE_CONTENT" 