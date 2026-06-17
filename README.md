# Salon Tatto - Plataforma de Gestión y Exhibición

Un proyecto monorepo construido con **Turborepo** para la gestión y exhibición de un estudio de tatuajes. La plataforma cuenta con una página web pública multi-idioma y un panel de administración robusto.

## 🏗 Arquitectura del Proyecto (Turborepo)

El proyecto está dividido en aplicaciones y paquetes compartidos:

- **`apps/web`**: Aplicación Frontend desarrollada con **Next.js 15**. Incluye la vista pública para clientes y un panel de administración para el estudio.
- **`apps/api`**: Servidor Backend desarrollado con **NestJS**. Provee la API RESTful, gestiona la base de datos y la lógica de negocio.
- **`packages/shared`**: Paquete que contiene Tipos, Constantes y DTOs (Data Transfer Objects) compartidos entre el Frontend y el Backend.
- **`packages/eslint-config`**: Configuración unificada de linting para todo el repositorio.

## 🚀 Tecnologías Principales

- **Frontend**: Next.js 15, React 19, TailwindCSS, React Query, Radix UI, Next-Intl (para soporte multi-idioma `en` / `es`).
- **Backend**: NestJS, PostgreSQL.
- **Infraestructura**: Docker y Docker Compose (Nginx y PostgreSQL configurados), Turborepo para orquestación y compilación rápida.

## ✨ Características Principales

### Web Pública (Multi-idioma)
- **Inicio/Hero**: Presentación principal del estudio con FAQs y testimonios.
- **Artistas**: Perfiles detallados de los artistas del estudio y sus especialidades.
- **Galería**: Muestra visual de trabajos y tatuajes realizados.
- **Blog**: Artículos de interés sobre el mundo del tatuaje.
- **Estudio/Contacto**: Información de contacto e integración con botón de WhatsApp.
- **SEO Optimization**: Componentes dinámicos y JSON-LD para el posicionamiento en buscadores.

### Panel de Administración (`/admin`)
- Gestión de Artistas (Crear, Editar, Eliminar).
- Gestión del Blog y Publicaciones.
- Configuración global del sitio (SEO, datos de la empresa, redes sociales).
- Inicio de sesión seguro y roles.

## 🛠 Cómo inicializar el proyecto localmente

1. **Instalar dependencias**:
   Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes de los *workspaces*:
   ```bash
   npm install
   ```

2. **Levantar el entorno de desarrollo**:
   Esto iniciará tanto la API de NestJS como la aplicación web en Next.js simultáneamente gracias a Turborepo:
   ```bash
   npm run dev
   ```
   La aplicación web estará disponible en `http://localhost:3000`.

3. **Ejecutar con Docker (Opcional/Producción)**:
   Si deseas levantar los servicios completos (incluyendo la base de datos Postgres y Nginx), puedes usar los comandos de Docker:
   ```bash
   npm run docker:dev
   ```

## 📜 Comandos Útiles en la Raíz

- `npm run build`: Compila todas las aplicaciones y paquetes para producción.
- `npm run lint`: Ejecuta el linter en todos los paquetes para detectar errores.
- `npm run format`: Formatea el código de todo el repositorio con Prettier.
- `npm run db:migration:run`: Ejecuta las migraciones pendientes en la base de datos (se ejecuta en la API).
- `npm run db:seed`: Puebla la base de datos con información inicial de prueba.
