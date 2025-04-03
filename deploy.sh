#!/bin/bash
cd /var/www/bbyouths
git pull
npm install
npm run build
pm2 restart bbyouths || pm2 start ecosystem.config.js
