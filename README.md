# Shelf Sprint

Videojuego responsive de clasificación rápida para supermercado. Cada participante recibe fichas de productos y debe ubicarlas en la categoría correcta antes de que termine el contador.

## Ejecutar

No requiere instalación de dependencias para probar el prototipo:

```bash
python3 -m http.server 4173
```

Después abre `http://localhost:4173`.

## Qué incluye

- Interfaz responsive para escritorio, tablet y móvil.
- 6 productos de ejemplo con categoría, subcategoría, unidad de medida, descripción, marca, referencia e icono visual.
- Cinco categorías jugables y control por clic o tecla `Space` para saltar.
- 100 puntos por acierto más bonus según los segundos restantes.
- Racha de respuestas, ranking de la sala y estado de participantes.
- Animaciones ligeras para producto, progreso y feedback.
- Configuración mínima de Netlify en `netlify.toml`.
- Esquema PostgreSQL listo para Supabase en `supabase/schema.sql`.

## Modelo de datos

El esquema separa la información en `rooms`, `players`, `products`, `round_products` y `answers`. La función `calculate_points` centraliza el cálculo de puntos para que el cliente no sea la fuente de verdad cuando se conecte el backend.

Para la versión multijugador real:

1. Crea un proyecto Supabase y ejecuta `supabase/schema.sql` en el SQL Editor.
2. Activa Realtime para `rooms`, `players` y `answers`.
3. Mueve la creación de salas, validación de respuestas y actualización del ranking a Edge Functions.
4. Sustituye los datos locales de `app.js` por consultas al catálogo y suscripciones Realtime.
5. Configura las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` en el hosting. La clave privada nunca debe llegar al navegador.

## Publicar en Netlify

Conecta este repositorio en Netlify y usa la raíz como directorio de publicación. `netlify.toml` ya define `publish = "."`; no hay proceso de build para esta primera versión.

## Stack

- HTML semántico y accesible.
- CSS responsive con variables, layout Grid y animaciones.
- JavaScript vanilla para el estado de la ronda.
- PostgreSQL/Supabase para persistencia, salas, respuestas y ranking en tiempo real.