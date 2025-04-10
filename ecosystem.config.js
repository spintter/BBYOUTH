module.exports = {
  apps: [
    {
      name: 'bbyouths',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/bbyouths',
      exec_mode: 'fork', // Changed from "cluster" to "fork"
      instances: 1, // Explicitly set to 1
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/pm2/bbyouths-error.log',
      out_file: '/var/log/pm2/bbyouths-out.log',
      merge_logs: true,
      exp_backoff_restart_delay: 100,
    },
  ],
};
