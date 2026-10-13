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
- Partidas de 20 rondas, agrupadas en bloques temáticos de cinco, con contador, racha y bonus según los segundos restantes.
- Pausa de 10 segundos entre preguntas y pistas desplegables de conservación, tipo y tamaño sin revelar la respuesta de inmediato.
- Sistema de resultados: victoria en primer lugar, clasificación entre los tres primeros o derrota.
- Panel del anfitrión para iniciar la partida y consultar un podio visual por puntos o aciertos.
- Selección de emoji personal al entrar a la sala; el emoji aparece en el perfil, el ranking y el podio.
- Nivel especial de cinco tarjetas Verdadero/Falso, con dificultad, explicación y fuente verificable del documento de productos colombianos.
- Pantalla de entrada con usuario y código de sala antes de iniciar la partida.
- Creación de salas con código automático y entrada a salas existentes.
- Código de partida dinámico y jugador personalizado en la clasificación.
- Pantalla final con puntaje, aciertos, posición y botón para jugar otra vez.
- Modo oscuro persistente mediante el botón de tema.
- Ranking de la sala actualizado mientras juegas.
- En salas remotas, todos los jugadores comparten la misma tarjeta, ronda y contador global de 10 segundos.
- Al salir el creador, la sala remota se elimina automáticamente; los demás jugadores solo abandonan su membresía.
- Animaciones ligeras para producto, progreso y feedback.
- Estilo visual liquid glass retro-moderno con efectos de tilt, ripple y transiciones centralizadas en `animations.js`.
- Configuración mínima de Netlify en `netlify.toml`.
- Esquema PostgreSQL listo para Supabase en `supabase/schema.sql`.
- Carga opcional de las 166 tarjetas V/F en `supabase/trivia_cards.sql`; la fuente original se conserva en `productos_colombianos_logistica_trivia.xlsx`.
- Reemplazo seguro del catálogo en `supabase/catalog_products.sql`: desactiva los SKU antiguos, actualiza los 30 productos nuevos y solo elimina registros antiguos que no tengan respuestas ni rondas históricas asociadas.
- Cliente Supabase opcional: entrada real a salas y clasificación sincronizada por Realtime.

## Modelo de datos

El esquema separa la información en `rooms`, `players`, `products`, `round_products` y `answers`. Cada acierto otorga 100 puntos base más 20 puntos por cada segundo restante (máximo 300 puntos); `calculate_points` mantiene esta misma regla para el backend.

Para la versión multijugador real:

1. Crea un proyecto Supabase y ejecuta `supabase/schema.sql` en el SQL Editor.
2. Activa Realtime para `rooms`, `players` y `answers`.
3. Copia la URL y la `anon key` de Supabase en `supabase-config.js`. No uses `service_role`.
4. Ejecuta las funciones y políticas nuevas de `supabase/schema.sql` en el SQL Editor.
5. Activa Realtime para `players` y `answers`.
6. Mueve la validación de respuestas y actualización del ranking a una Edge Function `submit-answer`.
7. Sustituye los datos locales de `app.js` por consultas al catálogo y suscripciones Realtime.

Si una clave privada o `service_role` se pegó en `supabase-config.js`, revócala
inmediatamente en Supabase y genera una nueva. Ese archivo se entrega al navegador:
solo debe contener la URL del proyecto y la clave pública `anon`/publishable.

Si el SQL Editor muestra `relation "rooms" already exists`, usa la versión actual de
`supabase/schema.sql`: es idempotente, utiliza `create table if not exists` y no borra
las salas o jugadores que ya existan. Si no aparece la sección **Realtime / Replication**
en el Dashboard, el mismo SQL agrega `players`, `rooms` y `answers` a la publicación
`supabase_realtime` automáticamente.

## Publicar en Netlify

Conecta este repositorio en Netlify y usa la raíz como directorio de publicación. `netlify.toml` ya define `publish = "."`; no hay proceso de build para esta primera versión.

## Stack

- HTML semántico y accesible.
- CSS responsive con variables, layout Grid y animaciones.
- JavaScript vanilla para el estado de la ronda.
- PostgreSQL/Supabase para persistencia, salas, respuestas y ranking en tiempo real.