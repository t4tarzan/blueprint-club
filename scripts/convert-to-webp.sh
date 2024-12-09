#!/bin/bash

# Install cwebp if not already installed
if ! command -v cwebp &> /dev/null; then
    echo "cwebp not found. Installing..."
    brew install webp
fi

# Directory containing the images
INPUT_DIR="public/BPC Schooling Overview Images"
OUTPUT_DIR="public/images/stages"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Convert each PNG to WebP
for file in "$INPUT_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename -- "$file")
        filename_noext="${filename%.*}"
        output_file="$OUTPUT_DIR/${filename_noext}.webp"
        
        echo "Converting $filename to WebP..."
        cwebp -q 80 "$file" -o "$output_file"
    fi
done

echo "Conversion complete! WebP images are in $OUTPUT_DIR"
