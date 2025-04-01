#!/bin/bash

# Create Dockerfile
cat > /var/www/bbyouths-docker/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Create docker-compose.yml
cat > /var/www/bbyouths-docker/docker-compose.yml << 'EOF'
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: always
    environment:
      - NODE_ENV=production
EOF

# Create a deployment script
cat > /var/www/bbyouths-docker/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/bbyouths-docker
git pull
docker-compose down
docker-compose up -d --build
EOF

chmod +x /var/www/bbyouths-docker/deploy.sh 