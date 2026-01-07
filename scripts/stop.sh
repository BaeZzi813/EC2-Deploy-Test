#!/bin/bash

echo "=== stop app ==="
pm2 stop next_app || true
