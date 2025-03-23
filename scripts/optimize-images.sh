#!/bin/bash

# Create an optimized images directory if it doesn't exist
mkdir -p public/images/optimized

# Function to optimize an image
optimize_image() {
  input_file=$1
  output_file=$2
  size_limit=$3
  
  echo "Optimizing: $input_file to $output_file (target size: $size_limit KB)"
  
  # Get the file extension
  ext="${input_file##*.}"
  
  # For webp, jpg, and jpeg files
  if [[ "$ext" == "webp" || "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
    # Start with quality 85 for webp/jpg
    quality=85
    
    # Convert and optimize
    convert "$input_file" -strip -quality $quality -resize '1500x1500>' -sampling-factor 4:2:0 -interlace Plane "$output_file"
    
    # Check size and reduce quality if needed
    current_size=$(stat -f %z "$output_file")
    current_size_kb=$((current_size / 1024))
    
    while [ $current_size_kb -gt $size_limit ] && [ $quality -gt 30 ]; do
      quality=$((quality - 5))
      echo "  Reducing quality to $quality to meet size target"
      convert "$input_file" -strip -quality $quality -resize '1500x1500>' -sampling-factor 4:2:0 -interlace Plane "$output_file"
      current_size=$(stat -f %z "$output_file")
      current_size_kb=$((current_size / 1024))
    done
  
  # For png files
  elif [[ "$ext" == "png" ]]; then
    # Convert PNGs with transparency to webp
    if convert "$input_file" -alpha extract -format "%[fx:mean]" info: | awk '{if ($1 < 1) exit 0; else exit 1}'; then
      output_file="${output_file%.*}.webp"
      echo "  PNG has transparency, converting to WebP: $output_file"
      convert "$input_file" -strip -quality 85 -resize '1500x1500>' -define webp:lossless=false "$output_file"
    else
      # No transparency, use regular optimization
      convert "$input_file" -strip -resize '1500x1500>' -quality 85 "$output_file"
    fi
    
    # Check size and optimize further if needed
    current_size=$(stat -f %z "$output_file")
    current_size_kb=$((current_size / 1024))
    
    quality=85
    while [ $current_size_kb -gt $size_limit ] && [ $quality -gt 30 ]; do
      quality=$((quality - 5))
      echo "  Reducing quality to $quality to meet size target"
      convert "$input_file" -strip -quality $quality -resize '1500x1500>' "$output_file"
      current_size=$(stat -f %z "$output_file")
      current_size_kb=$((current_size / 1024))
    done
  fi
  
  # Show the compression results
  original_size=$(stat -f %z "$input_file")
  original_size_kb=$((original_size / 1024))
  current_size=$(stat -f %z "$output_file")
  current_size_kb=$((current_size / 1024))
  reduction=$((original_size_kb - current_size_kb))
  percent=$((reduction * 100 / original_size_kb))
  
  echo "  Optimized: $input_file ($original_size_kb KB) -> $output_file ($current_size_kb KB), saved $reduction KB ($percent%)"
}

# Main optimization
echo "Optimizing key images for the hero section..."

# Central image - optimize to less than 300KB
optimize_image "public/images/church4.webp" "public/images/optimized/church4_optimized.webp" 300

# Supporting images - optimize to less than 200KB each
optimize_image "public/images/group_graduate_optimized.webp" "public/images/optimized/group_graduate_optimized.webp" 200
optimize_image "public/images/urban_youth_optimized.webp" "public/images/optimized/urban_youth_optimized.webp" 200

# Additional images
echo "Optimizing remaining images..."
for img in public/images/*.{jpg,jpeg,png,webp}; do
  if [ -f "$img" ]; then
    # Skip already optimized images
    if [[ "$img" != *"_optimized."* ]] && [[ "$img" != *"/optimized/"* ]]; then
      filename=$(basename -- "$img")
      name="${filename%.*}"
      ext="${filename##*.}"
      output="public/images/optimized/${name}_optimized.${ext}"
      
      # Optimize to a reasonable size (500KB for most images)
      optimize_image "$img" "$output" 500
    fi
  fi
done

echo "Image optimization complete!" 