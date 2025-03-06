#!/bin/bash

# Create temporary SVG with background
cat > temp.svg << EOL
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#2563EB"/>
  <path d="M128 128h256v64H128zM128 224h192v64H128zM128 320h256v64H128z" fill="white"/>
  <circle cx="384" cy="256" r="32" fill="#FCD34D"/>
</svg>
EOL

# Generate PNG files
convert temp.svg -resize 16x16 favicon-16.png
convert temp.svg -resize 32x32 favicon-32.png
convert temp.svg -resize 48x48 favicon-48.png
convert temp.svg -resize 180x180 apple-touch-icon.png
convert temp.svg -resize 192x192 android-chrome-192x192.png
convert temp.svg -resize 512x512 android-chrome-512x512.png

# Create favicon.ico (multi-size)
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico

# Move files to public directory
mv *.png *.ico ../public/

# Clean up
rm temp.svg favicon-16.png favicon-32.png favicon-48.png 