# 📖 La Rola Tattoo NYC - Contenido de Seeders y Web

Este documento contiene la información oficial del estudio, estructurada de tal forma que sirva de referencia directa tanto para poblar la base de datos a través de los **seeders** (en la carpeta `apps/api`), como para la visualización en la interfaz de usuario en las páginas de **Historia (About Us)** y perfiles de **Artistas**.

Se incluyen versiones tanto en inglés como en español para mantener la compatibilidad con el sistema de internacionalización (i18n).

---

## 🏛️ Historia del Estudio (Our Story)

Este bloque de texto es ideal para la sección "About Us" o la historia de la marca.

### 🇺🇸 Inglés (English)

> **Our Story**
> 
> La Rola Tattoo NYC was founded with a simple idea: creating a private tattoo experience where every client feels heard, comfortable, and leaves with artwork designed specifically for them.
> 
> Founded by Colombian tattoo artist Nathalia “La Rola” and joined by Chilean tattoo artist Ariel “Jager”, our studio brings together different artistic backgrounds, cultures, and styles under one roof in the heart of Midtown Manhattan.
> 
> We believe every tattoo should be more than just ink. Whether you’re celebrating a milestone, honoring a loved one, collecting meaningful artwork, or taking home a permanent memory of New York City, every design is created with intention, creativity, and attention to detail.
> 
> Unlike busy walk-in shops, we offer a private, appointment-based environment where every client receives personalized attention from consultation to the final tattoo.
> 
> Whether you’re a New Yorker or visiting from anywhere in the world, we’re honored to be part of your story.
> 
> Welcome to La Rola Tattoo NYC.

### 🇪🇸 Español (Spanish)

> **Nuestra Historia**
> 
> La Rola Tattoo NYC fue fundado con una idea simple: crear una experiencia de tatuaje privada donde cada cliente se sienta escuchado, cómodo y se lleve una obra de arte diseñada específicamente para ellos.
> 
> Fundado por la tatuadora colombiana Nathalia "La Rola" y acompañado por el tatuador chileno Ariel "Jager", nuestro estudio reúne diferentes orígenes artísticos, culturas y estilos bajo un mismo techo en el corazón de Midtown Manhattan.
> 
> Creemos que cada tatuaje debería ser más que solo tinta. Ya sea que estés celebrando un hito, honrando a un ser querido, coleccionando arte con significado, o llevándote a casa un recuerdo permanente de la ciudad de Nueva York, cada diseño es creado con intención, creatividad y atención al detalle.
> 
> A diferencia de las tiendas concurridas, ofrecemos un entorno privado y basado en citas, donde cada cliente recibe atención personalizada desde la consulta hasta el tatuaje final.
> 
> Ya seas neoyorquino o nos visites desde cualquier parte del mundo, es un honor ser parte de tu historia.
> 
> Bienvenido a La Rola Tattoo NYC.

---

## 🧑‍🎨 Perfiles de Artistas (Seeders)

Esta información está lista para ser inyectada en los seeders de la base de datos.

### 1. Nathalia “La Rola” (Fundadora)

**Especialidades (Formato JSON Array):**
```json
[
  "Custom Tattoos", "Fine Line Tattoos", "Ornamental Tattoos", 
  "Floral Tattoos", "Cover-Up Tattoos", "Blackwork Tattoos", 
  "Black & Grey Tattoos", "Color Tattoos", "Geometric Tattoos", 
  "Botanical Tattoos", "Custom Sleeve Tattoos", "Large Scale Tattoos", 
  "Delicate Tattoos", "NYC Souvenir Tattoos"
]
```

**Biografía 🇺🇸 (Inglés):**
> Nathalia “La Rola” is a Colombian custom tattoo artist based in Midtown Manhattan, New York City. She specializes in creating one-of-a-kind tattoos thoughtfully designed to complement each client’s anatomy, personal style, and story.
> 
> Her work combines fine line, ornamental, floral, botanical, geometric, blackwork, black & grey, color tattoos, and selected cover-ups, allowing her to create everything from delicate, meaningful pieces to large-scale custom projects. Every tattoo is designed from scratch with a focus on balance, longevity, and timeless artistry.
> 
> Working from a private, appointment-only tattoo studio in Midtown Manhattan, Nathalia welcomes both New Yorkers and visitors from around the world looking for a personalized tattoo experience in NYC.

**Biografía 🇪🇸 (Español):**
> Nathalia "La Rola" es una tatuadora de diseño personalizado colombiana con sede en Midtown Manhattan, Nueva York. Se especializa en crear tatuajes únicos, cuidadosamente diseñados para complementar la anatomía, el estilo personal y la historia de cada cliente.
> 
> Su trabajo combina línea fina, arte ornamental, floral, botánico, geométrico, blackwork, negro y gris, tatuajes a color, y selectos cover-ups, lo que le permite crear desde piezas delicadas y significativas hasta proyectos a gran escala personalizados. Cada tatuaje es diseñado desde cero, con un enfoque en el balance, la longevidad y el arte atemporal.
> 
> Trabajando desde un estudio de tatuajes privado, accesible solo por cita previa en Midtown Manhattan, Nathalia da la bienvenida tanto a neoyorquinos como a visitantes de todo el mundo que buscan una experiencia de tatuaje personalizada en NYC.

---

### 2. Ariel “Jager” (Artista Residente)

**Especialidades (Formato JSON Array):**
```json
[
  "Custom Tattoos", "Anime Tattoos", "Manga Tattoos", 
  "Color Tattoos", "Black & Grey Tattoos", "Illustrative Tattoos", 
  "Realism Tattoos", "Pop Culture Tattoos", "Fine Line Tattoos", 
  "Cover-Up Tattoos", "Custom Sleeve Tattoos", "Large Scale Tattoos"
]
```

**Biografía 🇺🇸 (Inglés):**
> Ariel “Jager” is a Chilean custom tattoo artist based in Midtown Manhattan, New York City. Known for his versatility, he creates custom tattoos across a wide range of styles, transforming each client’s ideas into unique, high-quality artwork.
> 
> His portfolio includes anime, manga, illustrative, color, black & grey, realism, and fine line tattoos, making him an excellent choice for everything from vibrant pop culture pieces to detailed custom designs and full-sleeve projects. Every tattoo is carefully planned with an emphasis on clean execution, strong composition, and lasting results.
> 
> Working from a private, appointment-only tattoo studio in Midtown Manhattan, Ariel welcomes both local clients and visitors looking for a custom tattoo experience in New York City.

**Biografía 🇪🇸 (Español):**
> Ariel "Jager" es un tatuador de diseño personalizado chileno con sede en Midtown Manhattan, Nueva York. Conocido por su versatilidad, crea tatuajes personalizados a lo largo de una amplia gama de estilos, transformando las ideas de cada cliente en obras de arte únicas y de alta calidad.
> 
> Su portafolio incluye estilos de anime, manga, ilustrativo, color, negro y gris, realismo, y línea fina (fine line), haciéndolo una excelente opción para todo, desde piezas vibrantes de la cultura pop hasta diseños detallados a medida y proyectos de manga completa. Cada tatuaje es planificado cuidadosamente, con énfasis en una ejecución limpia, composición fuerte y resultados duraderos.
> 
> Trabajando desde un estudio de tatuajes privado, accesible solo por cita previa en Midtown Manhattan, Ariel da la bienvenida tanto a clientes locales como a visitantes que buscan una experiencia de tatuaje personalizada en la Ciudad de Nueva York.
