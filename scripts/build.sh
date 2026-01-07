#!/bin/bash
set -e

cd /home/ubuntu/EC2-Deploy-Test

export NODE_ENV=production

npm install
npm run build
