#!/bin/bash
cd /home/ubuntu/EC2-Deploy-Test

# git pull 제거!

npm install

# 빌드 실패해도 계속 진행하도록 || true 추가
npm run build || echo "Build failed but continuing"

# PM2 재시작
pm2 restart next_app || pm2 start npm --name "next_app" -- start
pm2 save