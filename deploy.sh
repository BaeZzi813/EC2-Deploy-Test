#!/bin/bash
cd /home/ubuntu/EC2-Deploy-Test

# Node.js 환경 변수 로드 (PM2 실행에 필요)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 의존성 설치 및 빌드
npm install
npm run build

# PM2로 앱 재시작 (처음이면 start, 실행 중이면 restart)
pm2 describe next_app > /dev/null
if [ $? -eq 0 ]; then
  pm2 restart next_app
else
  pm2 start npm --name "next_app" -- start
fi

# PM2 프로세스 저장 (서버 재시작 시 자동 실행)
pm2 save