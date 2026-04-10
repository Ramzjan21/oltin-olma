#!/bin/bash

# Build frontend
cd frontend
npm install
npm run build

# Build backend
cd ../backend
npm install
npm run build

echo "Build completed!"
