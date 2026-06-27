module.exports = {
  apps: [
    {
      name: 'salon-api',
      cwd: '/home/camilo/Salon-Tatto',
      script: 'npm',
      args: 'run start:prod -w apps/api',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'salon-web',
      cwd: '/home/camilo/Salon-Tatto',
      script: 'npm',
      args: 'run start -w apps/web',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};