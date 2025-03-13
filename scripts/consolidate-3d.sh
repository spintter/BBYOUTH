#!/bin/bash

# Output file
OUTPUT_FILE="3d-assets-consolidated.txt"
echo "Consolidated 3D Assets - $(date)" > "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"

# Directories and patterns to include
DIRECTORIES=(
  "rules/3D"
  "components/materials"
  "components/models"
  "components/KnowledgeIsPowerHero.tsx"
  "public/models"
  "public/textures"
  "scripts"
  "utils/assetLoader.js"
)

PATTERNS=(
  "*.mdc" "*.tsx" "*.glb" "*.jpg" "*.svg" "*.js" "*.ts"
)

# Iterate through directories and patterns
for dir in "${DIRECTORIES[@]}"; do
  if [[ -d "$dir" || -f "$dir" ]]; then
    for pattern in "${PATTERNS[@]}"; do
      find "$dir" -type f -name "$pattern" ! -name ".DS_Store" -exec bash -c '
        echo -e "\n\n--- File: $1 ---" >> "'"$OUTPUT_FILE"'"
        echo "Size: $(stat -f %z "$1") bytes" >> "'"$OUTPUT_FILE"'"
        echo "Last Modified: $(stat -f %Sm "$1")" >> "'"$OUTPUT_FILE"'"
        echo "Content:" >> "'"$OUTPUT_FILE"'"
        cat "$1" >> "'"$OUTPUT_FILE"'"
      ' bash {} \;
    done
  fi
done

echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "Consolidation complete. Total files processed: $(grep -c "File:" "$OUTPUT_FILE")" >> "$OUTPUT_FILE"
echo "Output file size: $(stat -f %z "$OUTPUT_FILE") bytes" >> "$OUTPUT_FILE"