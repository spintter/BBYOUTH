#!/bin/bash

cat > /root/deployment-report-bbyouths.md << 'EOF'
# Deployment Report for bbyouths.org

## VPS Details
- **IP Address:** 69.62.65.76
- **Operating System:** Ubuntu 24.04.2 LTS
- **Installed Packages:**
  - Node.js: v18.19.1
  - npm: v9.2.0
  - Nginx: v1.24.0
  - Docker: v26.1.3
  - PM2: v6.0.5
  - Git: v2.43.0
- **Disk Space:** 96G total, 93G available (4% used)
- **Memory:** 7.8Gi total, 7.2Gi available

## Directory Structure
- **Non-Docker Setup:** `/var/www/bbyouths`
  - Contains `ecosystem.config.js` for PM2 configuration
  - Contains `deploy.sh` for easy deployment
- **Docker Setup:** `/var/www/bbyouths-docker`
  - Contains `Dockerfile` for container configuration
  - Contains `docker-compose.yml` for container orchestration
  - Contains `deploy.sh` for easy deployment
- **Nginx Configuration:** `/etc/nginx/sites-available/bbyouths` (symlinked to `/etc/nginx/sites-enabled/bbyouths`)
- **GitHub Actions Workflow:** `/root/github-actions/deploy.yml` (for reference)
- **Deployment Report:** `/root/deployment-report-bbyouths.md` (this file)

## Deployment Commands

### Non-Docker Setup
1. Clone your repository:
   ```bash
   cd /var/www/bbyouths
   git clone <your-repo-url> .
   ```
2. Install dependencies, build, and start the app:
   ```bash
   ./deploy.sh
   ```
   
   Or manually:
   ```bash
   npm install
   npm run build
   pm2 start ecosystem.config.js
   ```

### Docker Setup
1. Clone your repository:
   ```bash
   cd /var/www/bbyouths-docker
   git clone <your-repo-url> .
   ```
2. Build and start the container:
   ```bash
   ./deploy.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up -d
   ```

## Nginx Configuration
- **File Location:** `/etc/nginx/sites-available/bbyouths`
- **Content:**
  ```nginx
  server {
      listen 80;
      server_name bbyouths.org www.bbyouths.org;

      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```

## PM2 Setup (Non-Docker)
- **Process Name:** bbyouths
- **Configuration File:** `/var/www/bbyouths/ecosystem.config.js`
- **Auto-start on Boot:** Enabled
- **Command to Check Status:**
  ```bash
  pm2 list
  ```
- **Command to View Logs:**
  ```bash
  pm2 logs bbyouths
  ```
- **Command to Restart:**
  ```bash
  pm2 restart bbyouths
  ```

## Docker Setup
- **Container Name:** bbyouths-docker_app_1 (auto-generated from directory name)
- **Ports:** 3000 (internal) mapped to 3000 (host)
- **Command to Check Status:**
  ```bash
  docker ps
  ```
- **Command to View Logs:**
  ```bash
  docker logs bbyouths-docker_app_1
  ```
- **Command to Restart:**
  ```bash
  cd /var/www/bbyouths-docker && docker-compose down && docker-compose up -d
  ```

## CI/CD Pipeline (GitHub Actions)
- **Workflow File:** Add the workflow file at `.github/workflows/deploy.yml` in your repository
- **Secrets to Add in GitHub:**
  1. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**.
  2. Add the following secret:
     - **Name:** `SSH_PRIVATE_KEY`
     - **Value:** The contents of your SSH private key file

## Firewall Status
- **Status:** Active
- **Open Ports:** 
  - 80/tcp (HTTP)
  - 443/tcp (HTTPS)
  - 2222/tcp (SSH)

## Additional Steps
- **Set Up SSL with Certbot:**
  ```bash
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d bbyouths.org -d www.bbyouths.org
  ```
  Follow the prompts to configure HTTPS.

## Troubleshooting Tips
- **Port Conflicts:** Ensure no other service is using port 3000:
  ```bash
  lsof -i :3000
  ```
- **DNS Propagation:** Verify DNS with:
  ```bash
  dig bbyouths.org
  dig www.bbyouths.org
  ```
- **Nginx Errors:** Check logs:
  ```bash
  cat /var/log/nginx/error.log
  ```
- **PM2 Issues:** Check logs:
  ```bash
  pm2 logs bbyouths
  ```
- **Docker Issues:** Check logs:
  ```bash
  docker logs bbyouths-docker_app_1
  ```
- **Application Errors:** Check application logs:
  ```bash
  # For non-Docker setup
  pm2 logs bbyouths
  
  # For Docker setup
  docker logs bbyouths-docker_app_1
  ```

## Deployment Verification
After deploying your application, verify it's running properly:
- Check that the site is accessible at http://bbyouths.org
- Verify PM2 process is running: `pm2 list`
- Check Docker container: `docker ps`
- Verify Nginx is properly proxying: `curl -I http://localhost:80`
EOF 