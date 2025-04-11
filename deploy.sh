#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

cd /var/www/bbyouths || exit 1 # Ensure cd succeeds
git pull
npm install
npm run build
pm2 restart bbyouths || pm2 start ecosystem.config.js
