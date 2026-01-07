#!/bin/bash
set -e

# 배포 폴더
DEPLOY_DIR=/home/ubuntu/EC2-Deploy-Test
REPO_URL=https://github.com/BaeZzi813/EC2-Deploy-Test.git
BRANCH=main

# 기존 폴더가 없으면 clone, 있으면 최신 커밋으로 reset
if [ ! -d "$DEPLOY_DIR/.git" ]; then
    git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
else
    cd $DEPLOY_DIR
    git fetch --all
    git reset --hard origin/$BRANCH
fi

cd $DEPLOY_DIR

# 권한 정리
sudo chown -R ubuntu:ubuntu $DEPLOY_DIR

# 패키지 설치 및 빌드
npm install
npm run build

# PM2 실행 (없으면 start, 있으면 restart)
if pm2 list | grep -q next_app; then
    pm2 restart next_app
else
    pm2 start npm --name "next_app" -- run start
fi
