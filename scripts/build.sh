#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test

echo "=== move to app dir ==="
cd $APP_DIR

echo "=== node version ==="
node -v || true
npm -v || true

echo "=== install dependencies ==="
npm install

echo "=== build start ==="
npm run build
