#!/bin/bash
cd /home/ubuntu/ec2-test
sudo npm install
sudo npm run build
pm2 delete next_app || true
pm2 start npm --name "next_app" -- start