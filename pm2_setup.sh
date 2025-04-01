#!/bin/bash

cat > /var/www/bbyouths/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'bbyouths',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Create a deployment script
cat > /var/www/bbyouths/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/bbyouths
git pull
npm install
npm run build
pm2 restart bbyouths || pm2 start ecosystem.config.js
EOF

chmod +x /var/www/bbyouths/deploy.sh

# Set up PM2 to start on system boot
pm2 startup
pm2 save 