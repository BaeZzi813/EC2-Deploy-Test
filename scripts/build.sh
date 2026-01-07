#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test

echo "=== move to app dir ==="
cd $APP_DIR

echo "=== node version ==="
node -v
npm -v

echo "=== install dependencies ==="
npm ci

echo "=== build ==="
npm run build
