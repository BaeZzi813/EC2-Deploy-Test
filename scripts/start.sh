#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test
cd $APP_DIR

echo "=== start app ==="
pm2 start npm --name "next_app" -- start || pm2 restart next_app
pm2 save
