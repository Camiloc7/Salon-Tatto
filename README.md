# NYC Tattoo Studio - Fine Line & Custom 🖋️

Plataforma de exhibición y gestión de primer nivel para **NYC Tattoo Studio**. Construida como un proyecto monorepo utilizando **Turborepo**, esta aplicación ofrece una experiencia de usuario pública multi-idioma (Inglés y Español) bajo una estética ultra-minimalista, limpia y enfocada en el arte (Fine Line). Incluye, además, un panel de administración dinámico para gestionar todo el contenido del negocio.

---

## 🎨 Estética & Diseño (Sleek & Clean)

El diseño del sitio ha sido meticulosamente creado para estudios de tatuajes *Fine Line*. Se caracteriza por:
- **Minimalismo de Alto Nivel**: Fondos oscuros profundos (zinc-900 a negro), enorme espacio en negativo, tipografías finas serifadas y sutiles toques ámbar/dorados.
- **Foco en el Arte**: Las imágenes inician desaturadas (blanco y negro) y toman color al pasar el cursor, evitando diseños 3D ruidosos o recargados.
- **Micro-interacciones**: Transiciones suaves y elegantes gestionadas por `framer-motion`.

## 🏗 Arquitectura del Proyecto (Turborepo)

El proyecto está estructurado de forma modular y escalable:

- **`apps/web`**: Aplicación Frontend desarrollada con **Next.js 15 (App Router)**. Incluye la vista pública para clientes, soporte multi-idioma nativo con `next-intl` y el Panel de Administración.
- **`apps/api`**: Servidor Backend desarrollado con **NestJS**. Provee la API RESTful, gestiona la base de datos a través de TypeORM y orquesta la lógica de negocio y seguridad.
- **`packages/shared`**: Paquete que contiene Tipos (Tipado estricto), Constantes y DTOs compartidos entre Frontend y Backend.
- **`packages/eslint-config`**: Configuración unificada de linting para estandarizar el código.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 15, React 19, Tailwind CSS (Vanilla CSS para tokens), React Query, Framer Motion (Animaciones fluidas), Radix UI, Next-Intl (i18n).
- **Backend**: NestJS, PostgreSQL, TypeORM.
- **Infraestructura**: Docker y Docker Compose (Postgres, Nginx), Turborepo.

---

## ✨ Características Principales

### Web Pública Dinámica (Multi-idioma en/es)
Absolutamente **todos los datos son dinámicos** y vienen del administrador (nada está quemado en el código).
- **Hero Elegante**: Presentación del estudio que lee el título dinámico, subtítulos traducidos y genera el botón de WhatsApp a partir del teléfono registrado.
- **Artistas (Mampostería/Grid)**: Perfiles apilados limpiamente donde el tatuaje es el protagonista.
- **Galería**: Muestra visual inmersiva de los trabajos realizados.
- **Blog SEO-Optimized**: Artículos profesionales y guías de cuidado que soportan traducciones independientes por idioma.
- **Footer**: Diseño centrado y sofisticado con enlaces directos a las redes sociales configuradas globalmente.

### Panel de Administración (`/admin`)
Control absoluto del sitio web sin necesidad de tocar código:
- **Configuración Global (Settings)**: Actualizar nombre del estudio, correo, teléfono, WhatsApp y enlaces sociales (Instagram, TikTok). Todos los cambios se reflejan inmediatamente en la web pública.
- **Gestión de Artistas y Galería**: Crear artistas, subir sus portafolios y definir su información bilingüe.
- **Gestión del Blog**: Redacción de artículos y guías de "aftercare" (cuidados posteriores).

---

## 🛠 Instalación y Despliegue Local

### 1. Requisitos Previos
- Node.js (v18+)
- PostgreSQL (o Docker instalado para levantar el contenedor de la BD).

### 2. Instalar Dependencias
Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes del monorepo:
```bash
npm install
```

### 3. Población de Base de Datos (Seeders)
Este proyecto cuenta con potentes *seeders* que inyectarán datos de prueba, idiomas (en, es), configuración global (NYC Tattoo Studio), el usuario administrador, tatuadores con fotos reales de Unsplash y posts del blog. **Ejecuta este comando siempre que levantes la BD por primera vez:**
```bash
npm run seed --workspace=@salon-tatto/api
```

### 4. Credenciales del Administrador (Generadas por el Seeder)
Una vez corras el comando anterior, podrás iniciar sesión en `http://localhost:3000/en/admin/login` con:
- **Email**: `admin@salontatto.com`
- **Contraseña**: `admin123`

### 5. Levantar el Entorno de Desarrollo
Para iniciar tanto el Backend (NestJS) como el Frontend (Next.js) de forma simultánea, ejecuta:
```bash
npm run dev
```
- La aplicación web estará disponible en `http://localhost:3000`.
- La API de NestJS estará disponible en el puerto correspondiente.

### 6. Ejecutar con Docker (Producción)
Si deseas levantar los servicios completos (Postgres, Nginx, API, Web):
```bash
npm run docker:dev
```

---

## 📜 Comandos Útiles

- `npm run dev`: Levanta el entorno de desarrollo global.
- `npm run build`: Compila todas las aplicaciones y paquetes para producción.
- `npm run db:seed`: (Directorio `/apps/api`) Ejecuta el inyector de datos para popular la base de datos.
- `npm run lint`: Ejecuta el linter global para mantener la calidad.
