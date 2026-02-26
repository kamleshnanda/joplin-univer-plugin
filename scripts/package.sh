#!/bin/bash
# Script to package the plugin as a .jpl file

set -e

echo "Building plugin..."
npm run dist

echo "Creating .jpl package..."
cd dist
zip -r ../joplin-plugin-univer.jpl .
cd ..

echo "✅ Package created: joplin-plugin-univer.jpl"
echo ""
echo "To install:"
echo "1. Open Joplin"
echo "2. Go to Tools > Options > Plugins"
echo "3. Click 'Install plugin'"
echo "4. Select joplin-plugin-univer.jpl"
echo "5. Restart Joplin"
