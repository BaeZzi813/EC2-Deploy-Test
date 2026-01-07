#!/bin/bash
cd /home/ubuntu/EC2-Deploy-Test
git pull origin main
sudo npm install
sudo npm run build
pm2 restart next_app
