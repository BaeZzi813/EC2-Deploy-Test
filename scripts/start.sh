#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test

cd $APP_DIR

pm2 start ecosystem.config.js || pm2 restart ecosystem.config.js
