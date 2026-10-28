# AstroCodi

Web interactiva para el link de la bio de Instagram: cada persona pone su fecha y lugar de nacimiento
y recibe, en formato de historias, cómo estaba el cielo esa noche.

1. **El cielo de esa noche**: vista "desde tu patio" (en perspectiva, con el barrio recortado y arrastrable para mirar alrededor) o cielo completo. Usa la hora de nacimiento si la ponen; si no, dos horas después de la puesta del Sol.
2. **La Luna**: fase, porcentaje iluminado y próxima Luna llena (espejada en el hemisferio sur).
3. **Tu estrella**: una estrella real cuya luz salió más o menos cuando naciste, y dónde verla esta noche.
4. **Dónde estaba el Sol**: frente a qué constelación estaba el Sol (incluye Ofiuco) y por qué no coincide con el horóscopo.
5. **Desde que naciste**: kilómetros recorridos alrededor del Sol, lunas llenas, edad en Marte y Júpiter.
6. **Tarjeta para compartir**: imagen 1080 × 1920 en dos estilos, con botón para subirla a historias.

Todo se calcula en el teléfono; no hay servidor ni se guardan datos.

## Probarlo

Es un sitio estático. Desde la carpeta del repo:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Publicarlo con GitHub Pages

1. GitHub Pages gratis necesita que el repositorio sea **público** (en repos privados requiere GitHub Pro).
   Settings → General → Danger Zone → Change visibility.
2. Settings → Pages → Build and deployment → Source: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En uno o dos minutos queda en `https://claudiocodigone.github.io/AstroCodi/`. Ese es el link para la bio.

## Configuración

En `app.js`, arriba de todo: `INSTAGRAM` (tu usuario, aparece en la tarjeta para compartir).

## Archivos

- `index.html`, `styles.css`, `app.js`: la web.
- `data/sky.js`: catálogo compacto (2.865 estrellas visibles a simple vista, líneas de constelaciones, 361 estrellas candidatas). Se regenera con `tools/build-data.py`.

## Créditos de datos

- [HYG Database](https://github.com/astronexus/HYG-Database) v3.8, CC BY-SA 4.0.
- [d3-celestial](https://github.com/ofrohn/d3-celestial), BSD-3 (líneas y nombres de constelaciones).
- [Astronomy Engine](https://github.com/cosinekitty/astronomy), MIT (posiciones de planetas, Luna y Sol).
