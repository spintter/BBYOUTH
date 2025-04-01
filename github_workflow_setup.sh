#!/bin/bash

# Create the GitHub Actions workflow directory on the server
mkdir -p /root/github-actions

# Create the GitHub Actions workflow file
cat > /root/github-actions/deploy.yml << 'EOF'
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build Next.js app
      run: npm run build

    - name: Deploy to VPS (Non-Docker)
      uses: appleboy/ssh-action@master
      with:
        host: 69.62.65.76
        username: root
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        port: 2222
        script: |
          cd /var/www/bbyouths
          git pull origin main
          npm install
          npm run build
          pm2 restart bbyouths || pm2 start ecosystem.config.js

    - name: Deploy to VPS (Docker)
      uses: appleboy/ssh-action@master
      with:
        host: 69.62.65.76
        username: root
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        port: 2222
        script: |
          cd /var/www/bbyouths-docker
          git pull origin main
          docker-compose down
          docker-compose up -d --build
EOF

echo "To use this GitHub Actions workflow:"
echo "1. Add this file to your repository at .github/workflows/deploy.yml"
echo "2. Add your SSH private key as a GitHub repository secret named SSH_PRIVATE_KEY" 