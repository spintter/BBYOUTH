#!/bin/bash

# Create Nginx configuration file
cat > /etc/nginx/sites-available/bbyouths << 'EOF'
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
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/bbyouths /etc/nginx/sites-enabled/

# Test Nginx configuration and reload
nginx -t && systemctl reload nginx 