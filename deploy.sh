#!/bin/bash
set -e

# 배포 디렉토리로 이동
cd /home/ubuntu/EC2-Deploy-Test

# 소유권 설정
chown -R ubuntu:ubuntu /home/ubuntu/EC2-Deploy-Test

# ubuntu 사용자로 전환하여 nvm 환경에서 실행
su - ubuntu << 'EOF'
# nvm 환경 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 작업 디렉토리로 이동
cd /home/ubuntu/EC2-Deploy-Test

# pm2 프로세스 중지
pm2 stop next_app 2>/dev/null || true
pm2 delete next_app 2>/dev/null || true

# 의존성 설치
npm ci --production

# 빌드
npm run build

# pm2로 앱 시작
pm2 start npm --name "next_app" -- start

# pm2 설정 저장
pm2 save

echo "Deployment completed successfully!"
EOF