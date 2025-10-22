#!/bin/sh
# Build script for Render deployment
# This fixes the react-scripts permission issue

echo "Installing dependencies..."
npm install

echo "Setting executable permissions..."
chmod +x node_modules/.bin/react-scripts

echo "Building React app..."
npm run build

echo "Build completed successfully!"
