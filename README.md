# AstroCodi

Web interactiva para el link de la bio de Instagram: cada persona pone su fecha y lugar de nacimiento
y recibe, en formato de historias, cómo estaba el cielo esa noche.

1. **El cielo de esa noche**: mapa completo del cielo dos horas después de la puesta del Sol, con planetas y Luna.
2. **La Luna**: fase, porcentaje iluminado y próxima Luna llena (espejada en el hemisferio sur).
3. **Tu estrella**: una estrella real cuya luz salió más o menos cuando naciste, y dónde verla esta noche.
4. **Tu signo real**: en qué constelación estaba de verdad el Sol (incluye Ofiuco).
5. **Desde que naciste**: kilómetros recorridos alrededor del Sol, lunas llenas, edad en Marte y Júpiter.
6. **Tarjeta para compartir**: imagen 1080 × 1920 lista para historias.

Todo se calcula en el teléfono; no hay servidor ni se guardan datos.

## Probarlo

Es un sitio estático. Desde la carpeta del repo:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`. Para publicarlo gratis alcanza con GitHub Pages (Settings → Pages → rama `main`, carpeta raíz).

## Configuración

En `app.js`, arriba de todo: `INSTAGRAM` (tu usuario, aparece en la tarjeta para compartir).

## Archivos

- `index.html`, `styles.css`, `app.js`: la web.
- `data/sky.js`: catálogo compacto (2.865 estrellas visibles a simple vista, líneas de constelaciones, 361 estrellas candidatas). Se regenera con `tools/build-data.py`.

## Créditos de datos

- [HYG Database](https://github.com/astronexus/HYG-Database) v3.8, CC BY-SA 4.0.
- [d3-celestial](https://github.com/ofrohn/d3-celestial), BSD-3 (líneas y nombres de constelaciones).
- [Astronomy Engine](https://github.com/cosinekitty/astronomy), MIT (posiciones de planetas, Luna y Sol).
