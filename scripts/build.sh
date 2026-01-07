#!/bin/bash
set -e

cd /home/ubuntu/EC2-Deploy-Test

npm ci
npm run build
