# Guía de Despliegue en VPS (Producción)

Este documento detalla la arquitectura y los pasos necesarios para desplegar el monorepo (Next.js + NestJS) en un Servidor Privado Virtual (VPS) utilizando Nginx, PM2 y Docker (para PostgreSQL).

## Arquitectura de Producción

- **Frontend (Next.js)**: Se ejecuta en el puerto `3000` gestionado por PM2.
- **Backend (NestJS)**: Se ejecuta en el puerto `4000` gestionado por PM2.
- **Base de Datos (PostgreSQL)**: Se ejecuta de manera aislada dentro de un contenedor de Docker en el puerto `5432`.
- **Proxy Inverso (Nginx)**: Actúa como punto de entrada público, redirigiendo el tráfico HTTP/HTTPS a los puertos correspondientes de PM2.

---

## 1. Requisitos Previos en el VPS

Antes de comenzar, asegúrate de que tu VPS (basado en Linux/Ubuntu) tenga instalado lo siguiente:

- **Node.js y npm** (Recomendado v20+)
- **PM2**: `sudo npm install -g pm2`
- **Docker y Docker Compose**: Para correr la base de datos.
- **Nginx**: `sudo apt install nginx`
- **Git**: Para clonar el repositorio.

---

## 2. Configuración Inicial

1. **Clonar el proyecto**:
   ```bash
   git clone <URL-de-tu-repo> /var/www/salon-tatto
   cd /var/www/salon-tatto
   ```

2. **Variables de entorno**:
   Asegúrate de crear un archivo `.env` en la raíz del proyecto basado en `.env.example`. Este archivo es compartido por Docker y PM2.
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Iniciar la Base de Datos**:
   La base de datos se administra de manera independiente mediante Docker.
   ```bash
   docker compose -f docker-compose.db.yml up -d
   ```

4. **Instalar dependencias y Compilar**:
   ```bash
   npm install
   npm run build
   ```

---

## 3. Lanzar la Aplicación con PM2

Para iniciar el backend y el frontend, usamos el archivo de configuración `ecosystem.config.js`.

```bash
# Iniciar servicios
pm2 start ecosystem.config.js

# Guardar la lista actual de procesos para que arranquen con el servidor
pm2 save

# Configurar PM2 para que inicie en el boot del servidor
pm2 startup
```

---

## 4. Configurar Nginx (Proxy Inverso)

El archivo `nginx.vps.conf` contiene la plantilla para que tu VPS sirva las aplicaciones al mundo exterior.

1. Copia el archivo de configuración a Nginx:
   ```bash
   sudo cp nginx.vps.conf /etc/nginx/sites-available/salon-tatto
   ```
2. Edita el archivo para configurar tu dominio real:
   ```bash
   sudo nano /etc/nginx/sites-available/salon-tatto
   ```
   *(Cambia `tu-dominio.com` por el dominio de tu frontend y `api.tu-dominio.com` por el dominio de tu API).*
3. Activa la configuración creando un enlace simbólico:
   ```bash
   sudo ln -s /etc/nginx/sites-available/salon-tatto /etc/nginx/sites-enabled/
   ```
4. Reinicia Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 5. Integración Continua (GitHub Actions)

El proyecto incluye un flujo de trabajo de GitHub Actions (`.github/workflows/deploy.yml`) que automatiza el despliegue al VPS cada vez que se hace un `push` a la rama `main`.

**Secretos necesarios en GitHub:**
Ve a `Settings > Secrets and variables > Actions` en GitHub y añade:
- `VPS_HOST`: IP del servidor.
- `VPS_USERNAME`: Usuario SSH (ej. ubuntu).
- `VPS_PORT`: 22 (generalmente).
- `VPS_SSH_KEY`: Clave privada SSH.

---

## 6. Scripts de Utilidad

La carpeta `scripts/` contiene herramientas para el mantenimiento de la base de datos en producción. 
*(Recuerda darles permiso de ejecución con `chmod +x scripts/*.sh`)*

### Respaldo de Base de Datos (`db-backup.sh`)
Genera un volcado (dump) de PostgreSQL, lo comprime y limpia respaldos viejos (más de 7 días).
- **Ejecución manual**: `./scripts/db-backup.sh`
- **Automatización (Crontab)**:
  Añade esta línea en tu servidor usando `crontab -e` para ejecutar el respaldo diario a las 3 AM:
  ```bash
  0 3 * * * /bin/bash /var/www/salon-tatto/scripts/db-backup.sh
  ```

### Exportar Datos a CSV (`db-export-csv.sh`)
Permite exportar rápidamente cualquier tabla de PostgreSQL a un archivo CSV.
- **Uso**: `./scripts/db-export-csv.sh <nombre_de_tabla>`
- **Ejemplo**:
  ```bash
  ./scripts/db-export-csv.sh users
  ```
  *(El archivo se guardará en la carpeta `exports/` en el VPS).*
