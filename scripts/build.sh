#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test

echo "=== move to app dir ==="
cd $APP_DIR

echo "=== node version ==="
node -v
npm -v

echo "=== clean node_modules ==="
rm -rf node_modules

echo "=== install dependencies ==="
npm ci --no-progress

echo "=== build ==="
npm run build
