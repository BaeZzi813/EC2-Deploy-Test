#!/bin/bash
set -e

APP_DIR=/home/ubuntu/EC2-Deploy-Test

pm2 stop all || true

# 이전 찌꺼기 완전 제거
rm -rf $APP_DIR/node_modules

# 권한 정리
sudo chown -R ubuntu:ubuntu $APP_DIR
sudo chmod -R u+rwX $APP_DIR
