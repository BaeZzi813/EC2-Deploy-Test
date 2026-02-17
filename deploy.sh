#!/bin/bash
set -e

# 배포 폴더
DEPLOY_DIR=/home/ubuntu/EC2-Deploy-Test
REPO_URL=https://github.com/BaeZzi813/EC2-Deploy-Test.git
BRANCH=main

if [ ! -d "$DEPLOY_DIR/.git" ]; then
    git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
fi

cd $DEPLOY_DIR
git fetch --all
git reset --hard origin/$BRANCH

npm install
npm run build
npm cache clean --force
pm2 describe next_app > /dev/null 2>&1 && pm2 restart next_app || pm2 start npm --name "next_app" -- start
pm2 save
