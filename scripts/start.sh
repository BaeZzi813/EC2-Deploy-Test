#!/bin/bash
cd /home/ubuntu/EC2-Deploy-Test

pm2 start npm --name "next_app" -- start || pm2 restart next_app
pm2 save
