module.exports = {
  apps: [
    {
      name: 'salon-api',
      script: 'npm',
      args: 'run start:prod -w apps/api',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        // Variables de entorno de la DB
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 5432,
        // (Añade el resto de tus variables de entorno aquí o asegúrate de cargarlas con dotenv o desde el sistema)
      }
    },
    {
      name: 'salon-web',
      script: 'npm',
      args: 'run start -w apps/web',
      instances: 1,
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
