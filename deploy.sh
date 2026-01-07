#!/bin/bash
set -e

# 배포 폴더
DEPLOY_DIR=/home/ubuntu/EC2-Deploy-Test
REPO_URL=https://github.com/BaeZzi813/EC2-Deploy-Test.git
BRANCH=main

# 최초 배포
if [ ! -d "$DEPLOY_DIR/.git" ]; then
  echo "📦 First deploy: cloning repository"
  git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
else
  echo "🔄 Updating existing repository"
  cd $DEPLOY_DIR
  git fetch origin
  git reset --hard origin/$BRANCH
fi

cd $DEPLOY_DIR

# 권한 보정
sudo chown -R ubuntu:ubuntu $DEPLOY_DIR

# 의존성 설치
npm install

# 빌드
npm run build

# PM2 실행
if pm2 list | grep -q next_app; then
  pm2 restart next_app
else
  pm2 start npm --name "next_app" -- run start
fi