/* AstroCodi: el cielo de la noche en que naciste. */
(() => {
'use strict';

// Configuración: tu usuario de Instagram y la dirección pública de la web.
const INSTAGRAM = 'astrocodi';
const SITE_URL = location.origin.startsWith('http') ? location.origin + location.pathname : '';

const DEG = Math.PI / 180;
const MS_DAY = 86400000;
const YEAR_DAYS = 365.25;
const KM_PER_LY = 9.4607e12;
const EARTH_KMS = 29.78;
const OBLIQUITY = 23.4393 * DEG;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nf = new Intl.NumberFormat('es-AR');
const nf1 = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const CITIES = [
  ['Buenos Aires', -34.60, -58.38, 'America/Argentina/Buenos_Aires'],
  ['La Plata', -34.92, -57.95, 'America/Argentina/Buenos_Aires'],
  ['Mar del Plata', -38.00, -57.56, 'America/Argentina/Buenos_Aires'],
  ['Bahía Blanca', -38.72, -62.27, 'America/Argentina/Buenos_Aires'],
  ['Córdoba', -31.42, -64.18, 'America/Argentina/Cordoba'],
  ['Rosario', -32.95, -60.65, 'America/Argentina/Cordoba'],
  ['Santa Fe', -31.63, -60.70, 'America/Argentina/Cordoba'],
  ['Mendoza', -32.89, -68.83, 'America/Argentina/Mendoza'],
  ['San Juan', -31.54, -68.52, 'America/Argentina/San_Juan'],
  ['Tucumán', -26.81, -65.22, 'America/Argentina/Tucuman'],
  ['Salta', -24.78, -65.41, 'America/Argentina/Salta'],
  ['Jujuy', -24.19, -65.30, 'America/Argentina/Jujuy'],
  ['Corrientes', -27.47, -58.83, 'America/Argentina/Cordoba'],
  ['Posadas', -27.37, -55.90, 'America/Argentina/Cordoba'],
  ['Neuquén', -38.95, -68.06, 'America/Argentina/Salta'],
  ['Bariloche', -41.13, -71.31, 'America/Argentina/Salta'],
  ['Comodoro Rivadavia', -45.86, -67.48, 'America/Argentina/Catamarca'],
  ['Río Gallegos', -51.62, -69.22, 'America/Argentina/Rio_Gallegos'],
  ['Ushuaia', -54.80, -68.30, 'America/Argentina/Ushuaia'],
  ['Montevideo', -34.90, -56.19, 'America/Montevideo'],
  ['Santiago de Chile', -33.45, -70.67, 'America/Santiago'],
  ['Asunción', -25.26, -57.58, 'America/Asuncion'],
  ['La Paz', -16.50, -68.15, 'America/La_Paz'],
  ['Lima', -12.05, -77.04, 'America/Lima'],
  ['Quito', -0.18, -78.47, 'America/Guayaquil'],
  ['Bogotá', 4.71, -74.07, 'America/Bogota'],
  ['Medellín', 6.24, -75.58, 'America/Bogota'],
  ['Caracas', 10.49, -66.88, 'America/Caracas'],
  ['Panamá', 8.98, -79.52, 'America/Panama'],
  ['San José de Costa Rica', 9.93, -84.08, 'America/Costa_Rica'],
  ['La Habana', 23.11, -82.37, 'America/Havana'],
  ['Santo Domingo', 18.49, -69.93, 'America/Santo_Domingo'],
  ['Ciudad de México', 19.43, -99.13, 'America/Mexico_City'],
  ['Guadalajara', 20.67, -103.35, 'America/Mexico_City'],
  ['Monterrey', 25.69, -100.32, 'America/Monterrey'],
  ['São Paulo', -23.55, -46.63, 'America/Sao_Paulo'],
  ['Río de Janeiro', -22.91, -43.17, 'America/Sao_Paulo'],
  ['Miami', 25.76, -80.19, 'America/New_York'],
  ['Nueva York', 40.71, -74.01, 'America/New_York'],
  ['Los Ángeles', 34.05, -118.24, 'America/Los_Angeles'],
  ['Madrid', 40.42, -3.70, 'Europe/Madrid'],
  ['Barcelona', 41.39, 2.17, 'Europe/Madrid'],
  ['Sevilla', 37.39, -5.98, 'Europe/Madrid'],
  ['Londres', 51.51, -0.13, 'Europe/London'],
  ['París', 48.86, 2.35, 'Europe/Paris'],
  ['Roma', 41.90, 12.50, 'Europe/Rome'],
  ['Berlín', 52.52, 13.40, 'Europe/Berlin'],
  ['Sídney', -33.87, 151.21, 'Australia/Sydney'],
  ['Tokio', 35.68, 139.69, 'Asia/Tokyo'],
].map(([name, lat, lon, tz]) => ({ name, lat, lon, tz }));

const PLANETS = [
  ['Venus', 'Venus', '#fff6df', 3.6],
  ['Jupiter', 'Júpiter', '#f6e2bf', 3.3],
  ['Mars', 'Marte', '#ff8d62', 2.6],
  ['Saturn', 'Saturno', '#efd9a2', 2.8],
  ['Mercury', 'Mercurio', '#d8d0c4', 2.2],
];

// Signos del horóscopo (zodíaco tropical) y su fecha de inicio [mes, día].
const TROPICAL = [
  ['Capricornio', 1, 1], ['Acuario', 1, 20], ['Piscis', 2, 19], ['Aries', 3, 21], ['Tauro', 4, 20],
  ['Géminis', 5, 21], ['Cáncer', 6, 21], ['Leo', 7, 23], ['Virgo', 8, 23], ['Libra', 9, 23],
  ['Escorpio', 10, 23], ['Sagitario', 11, 22], ['Capricornio', 12, 22],
];
const ZODIAC_ES = {
  Ari: 'Aries', Tau: 'Tauro', Gem: 'Géminis', Cnc: 'Cáncer', Leo: 'Leo', Vir: 'Virgo', Lib: 'Libra',
  Sco: 'Escorpio', Oph: 'Ofiuco', Sgr: 'Sagitario', Cap: 'Capricornio', Aqr: 'Acuario', Psc: 'Piscis',
};

// Lo que adelanta cada botón "siguiente": una pregunta para que den ganas de seguir.
const TEASERS = [
  '¿Cómo estaba la Luna esa noche?',
  'Hay una estrella que es tuya',
  '¿Dónde estaba el Sol cuando naciste?',
  '¿Cuánto viajaste desde ese día?',
  'Ver tu cielo para historias',
];

const $ = (id) => document.getElementById(id);

/* ---------- Catálogo ---------- */

const SKY = window.SKY;
const STARS = (() => {
  const n = SKY.stars.length / 4;
  const s = { n, ra: new Float32Array(n), sd: new Float32Array(n), cd: new Float32Array(n),
    mag: new Float32Array(n), col: new Array(n) };
  for (let i = 0; i < n; i++) {
    const dec = SKY.stars[i * 4 + 1] / 100 * DEG;
    s.ra[i] = SKY.stars[i * 4] / 100 * DEG;
    s.sd[i] = Math.sin(dec);
    s.cd[i] = Math.cos(dec);
    s.mag[i] = SKY.stars[i * 4 + 2] / 100;
    s.col[i] = bvColor(SKY.stars[i * 4 + 3] / 100);
  }
  return s;
})();
const LINES = SKY.lines.map((seg) => seg.map((v) => (v / 10) * DEG));

// Color real de una estrella a partir de su índice B-V.
function bvColor(bv) {
  const stops = [[-0.3, [155, 178, 255]], [0, [202, 215, 255]], [0.3, [248, 247, 255]], [0.6, [255, 244, 232]],
    [0.9, [255, 224, 188]], [1.2, [255, 207, 152]], [1.5, [255, 181, 108]], [2.0, [255, 157, 74]]];
  bv = clamp(bv, -0.3, 2);
  let k = 1;
  while (k < stops.length - 1 && stops[k][0] < bv) k++;
  const [b0, c0] = stops[k - 1], [b1, c1] = stops[k];
  const t = (bv - b0) / (b1 - b0);
  return `rgb(${c0.map((c, i) => Math.round(c + (c1[i] - c) * t)).join(',')})`;
}

/* ---------- Tiempo y coordenadas ---------- */

function tzOffsetMin(tz, date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric',
    day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(date);
  const g = (t) => +parts.find((p) => p.type === t).value;
  return (Date.UTC(g('year'), g('month') - 1, g('day'), g('hour') % 24, g('minute'), g('second')) - date.getTime()) / 60000;
}
function localToDate(y, m, d, h, min, tz) {
  const guess = Date.UTC(y, m, d, h, min);
  let off = tzOffsetMin(tz, new Date(guess));
  off = tzOffsetMin(tz, new Date(guess - off * 60000));
  return new Date(guess - off * 60000);
}
const fmt = (date, tz, opts) => new Intl.DateTimeFormat('es-AR', { timeZone: tz, ...opts }).format(date);
const fmtTime = (date, tz) => fmt(date, tz, { hour: '2-digit', minute: '2-digit', hour12: false });

// Tiempo sidéreo local en radianes (precisión de sobra para dibujar el cielo).
function lst(date, lonDeg) {
  const jd = date.getTime() / MS_DAY + 2440587.5;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545);
  return (((gmst + lonDeg) % 360) + 360) % 360 * DEG;
}
function altAz(ra, sinDec, cosDec, lstRad, sinLat, cosLat) {
  const h = lstRad - ra;
  const ch = Math.cos(h);
  const sinAlt = sinDec * sinLat + cosDec * cosLat * ch;
  const az = Math.atan2(-cosDec * Math.sin(h), sinDec * cosLat - cosDec * sinLat * ch);
  return [Math.asin(sinAlt), az];
}
function altAzDeg(raDeg, decDeg, date, city) {
  const d = decDeg * DEG;
  const [alt, az] = altAz(raDeg * DEG, Math.sin(d), Math.cos(d), lst(date, city.lon), Math.sin(city.lat * DEG), Math.cos(city.lat * DEG));
  return [alt / DEG, ((az / DEG) + 360) % 360];
}
function toEcliptic(ra, dec) {
  const sb = Math.sin(dec) * Math.cos(OBLIQUITY) - Math.cos(dec) * Math.sin(OBLIQUITY) * Math.sin(ra);
  const lam = Math.atan2(Math.sin(ra) * Math.cos(OBLIQUITY) + Math.tan(dec) * Math.sin(OBLIQUITY), Math.cos(ra));
  return [lam, Math.asin(sb)];
}
const DIRS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
const direction = (az) => DIRS[Math.round(az / 45) % 8];

/* ---------- Dibujo: utilidades ---------- */

function setupCanvas(canvas, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

const glowSprite = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.2, 'rgba(255,255,255,0.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
})();

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Color del cielo según la altura del Sol: noche, crepúsculos y día.
const SKY_STEPS = [
  [-90, '#04060f', '#141a3a', '#04050b', 5.6, 1],
  [-18, '#04060f', '#161c40', '#04050b', 5.6, 1],
  [-12, '#070b22', '#262c60', '#05060e', 4.6, 1],
  [-6, '#0d1640', '#4d4b88', '#070812', 3.2, 0.9],
  [-2, '#1a2b66', '#c58074', '#0b0b16', 2.0, 0.7],
  [0, '#284a90', '#e8a27c', '#10111c', 3.5, 0.32],
  [10, '#2f6cc0', '#a9cdf0', '#1b2232', 3.5, 0.2],
  [90, '#2a63b8', '#b6d6f5', '#1b2232', 3.5, 0.2],
];
function skyLook(sunAlt) {
  let k = 1;
  while (k < SKY_STEPS.length - 1 && SKY_STEPS[k][0] < sunAlt) k++;
  const a = SKY_STEPS[k - 1], b = SKY_STEPS[k];
  const t = clamp((sunAlt - a[0]) / (b[0] - a[0]), 0, 1);
  return { top: mix(hex(a[1]), hex(b[1]), t), horizon: mix(hex(a[2]), hex(b[2]), t), ground: mix(hex(a[3]), hex(b[3]), t),
    magLimit: a[4] + (b[4] - a[4]) * t, starAlpha: a[5] + (b[5] - a[5]) * t, day: sunAlt > 0 };
}

function drawStarDot(ctx, x, y, m, col, scale, alpha) {
  const r = Math.max(0.45, (5.8 - m) * 0.42) * scale;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = col;
  if (m < 1.8) {
    const gs = r * 7;
    ctx.drawImage(glowSprite, x - gs / 2, y - gs / 2, gs, gs);
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawObjects(ctx, objects, toXY, o, placed, labelAlpha) {
  const moonR = (o.moonR || 7) * o.scale;
  for (const ob of objects) {
    const d = ob.dec * DEG;
    const [alt, az] = altAz(ob.ra * DEG, Math.sin(d), Math.cos(d), o.L, o.sinLat, o.cosLat);
    if (alt < -0.01) continue;
    const p = toXY(alt, az);
    if (!p) continue;
    const [x, y] = p;
    ctx.globalAlpha = Math.min(1, o.reveal * 1.6);
    if (ob.kind === 'sun') {
      const r = 9 * o.scale;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 8);
      g.addColorStop(0, 'rgba(255,248,225,1)');
      g.addColorStop(0.12, 'rgba(255,236,190,0.8)');
      g.addColorStop(1, 'rgba(255,220,160,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 8, y - r * 8, r * 16, r * 16);
      continue;
    }
    if (ob.kind === 'moon') {
      drawMoon(ctx, x, y, moonR, ob.phase, o.lat < 0);
    } else {
      const r = ob.size * o.scale;
      ctx.drawImage(glowSprite, x - r * 4, y - r * 4, r * 8, r * 8);
      ctx.fillStyle = ob.color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (labelAlpha > 0) {
      ctx.globalAlpha = labelAlpha;
      ctx.fillStyle = ob.kind === 'moon' ? '#ece8f4' : ob.color;
      ctx.font = `500 ${11 * o.scale}px "Hanken Grotesk", system-ui, sans-serif`;
      ctx.textAlign = 'left';
      const lx = x + (ob.kind === 'moon' ? moonR + 4 * o.scale : 7 * o.scale), lw = ctx.measureText(ob.name).width;
      ctx.fillText(ob.name, lx, y + 4 * o.scale);
      placed.push([lx + lw / 2, y + 4 * o.scale, lw + 6 * o.scale]);
    }
  }
}

function drawStarLabels(ctx, toXY, o, placed, alpha, minAlt) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#c9cbe6';
  ctx.font = `italic 500 ${12 * o.scale}px Cormorant, Georgia, serif`;
  ctx.textAlign = 'center';
  // Las más brillantes primero; se saltean las etiquetas que se pisarían.
  for (const [name, ra, dec] of SKY.labels) {
    const d = dec * DEG;
    const [alt, az] = altAz(ra * DEG, Math.sin(d), Math.cos(d), o.L, o.sinLat, o.cosLat);
    if (alt < minAlt) continue;
    const p = toXY(alt, az);
    if (!p) continue;
    const [x, y] = p;
    const w = ctx.measureText(name).width + 6 * o.scale, h = 13 * o.scale, ty = y + 14 * o.scale;
    if (placed.some((b) => Math.abs(b[0] - x) < (b[2] + w) / 2 && Math.abs(b[1] - ty) < h)) continue;
    placed.push([x, ty, w]);
    ctx.fillText(name, x, ty);
  }
}

function drawLines(ctx, toXY, o, alpha, minAlt) {
  if (alpha <= 0) return;
  ctx.globalAlpha = 1;
  ctx.strokeStyle = `rgba(190,198,255,${alpha})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (const seg of LINES) {
    let pen = false;
    for (let i = 0; i < seg.length; i += 2) {
      const [alt, az] = altAz(seg[i], Math.sin(seg[i + 1]), Math.cos(seg[i + 1]), o.L, o.sinLat, o.cosLat);
      const p = alt < minAlt ? null : toXY(alt, az);
      if (!p) { pen = false; continue; }
      if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
      pen = true;
    }
  }
  ctx.stroke();
}

function skyFrame(o) {
  return { ...o, L: lst(o.date, o.lon), sinLat: Math.sin(o.lat * DEG), cosLat: Math.cos(o.lat * DEG),
    scale: o.starScale || 1, reveal: o.reveal == null ? 1 : o.reveal };
}

/*
 * Cielo completo visto desde un lugar: proyección estereográfica centrada en el cénit.
 * El horizonte es un círculo de radio R. En el hemisferio sur el sur queda arriba.
 */
function renderSky(ctx, opts) {
  const o = skyFrame(opts);
  const { cx, cy, R } = o;
  const flip = o.lat < 0 ? -1 : 1;
  const toXY = (alt, az) => {
    const r = R * Math.tan((Math.PI / 2 - alt) / 2);
    return [cx - flip * r * Math.sin(az), cy - flip * r * Math.cos(az)];
  };
  const minAlt = o.ring ? 0 : -0.35;
  const look = o.ring && o.sunAlt != null ? skyLook(o.sunAlt) : null;

  ctx.save();
  if (o.ring) {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
    if (look && look.day) {
      g.addColorStop(0, rgb(look.top, 0.95));
      g.addColorStop(1, rgb(look.horizon, 0.95));
    } else {
      g.addColorStop(0, 'rgba(14,21,49,0.95)');
      g.addColorStop(0.82, 'rgba(18,24,58,0.95)');
      g.addColorStop(1, 'rgba(58,52,118,0.9)');
    }
    ctx.fillStyle = g;
    ctx.fill();
    ctx.clip();
  }
  drawLines(ctx, toXY, o, clamp((o.reveal - 0.45) / 0.35, 0, 1) * (o.lineAlpha ?? 0.22), minAlt - 0.1);

  const magLimit = -1.5 + o.reveal * 7;
  const dayAlpha = look ? look.starAlpha : 1;
  for (let i = 0; i < STARS.n; i++) {
    const m = STARS.mag[i];
    if (m > magLimit) break;
    const [alt, az] = altAz(STARS.ra[i], STARS.sd[i], STARS.cd[i], o.L, o.sinLat, o.cosLat);
    if (alt < minAlt) continue;
    const [x, y] = toXY(alt, az);
    const fade = Math.min(1, (magLimit - m) / 1.2);
    const extinction = alt < 0.2 ? 0.45 + alt * 2.7 : 1;
    drawStarDot(ctx, x, y, m, STARS.col[i], o.scale, clamp((m < 4 ? 1 : 0.55 + (5.5 - m) * 0.3) * fade * extinction * dayAlpha, 0, 1));
  }
  ctx.globalAlpha = 1;

  const labelAlpha = clamp((o.reveal - 0.75) / 0.25, 0, 1);
  const placed = [];
  if (o.objects) drawObjects(ctx, o.objects, toXY, o, placed, labelAlpha);
  if (o.labels && labelAlpha > 0) drawStarLabels(ctx, toXY, o, placed, labelAlpha * 0.7, 0.12);
  ctx.restore();

  if (o.ring) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, o.reveal * 2);
    ctx.strokeStyle = 'rgba(190,198,255,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#a2a4c2';
    ctx.font = `500 ${10 * o.scale}px "IBM Plex Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const pad = 12 * o.scale;
    for (const [label, az] of [['N', 0], ['E', 90], ['S', 180], ['O', 270]]) {
      const a = az * DEG;
      ctx.fillText(label, cx - flip * (R + pad) * Math.sin(a), cy - flip * (R + pad) * Math.cos(a));
    }
    ctx.restore();
  }
}

/*
 * Vista desde el patio: lo que verías parado en el suelo mirando hacia una dirección.
 * Proyección estereográfica centrada en la dirección de la mirada, como un gran angular.
 */
const SILHOUETTE = (() => {
  // Perfil del barrio en grados de altura cada medio grado de acimut: medianeras, casas
  // con techo a dos aguas, tanques de agua, antenas, árboles y faroles. En 0° queda un claro.
  const n = 720, h = new Float32Array(n);
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) h[i] = 1.6 + 0.35 * Math.sin(i * 0.05) + 0.15 * Math.sin(i * 0.31);
  const put = (c, w, fn) => {
    for (let j = -w; j <= w; j++) {
      const v = fn(w ? j / w : 0);
      if (v == null) continue;
      const i = ((c + j) % n + n) % n;
      h[i] = Math.max(h[i], v);
    }
  };
  let pos = 60;
  while (pos < n - 80) {
    const kind = rnd();
    const w = Math.floor(14 + rnd() * 30);
    const c = pos + w;
    if (kind < 0.5) {
      const wall = 3.2 + rnd() * 3, roof = rnd() < 0.55 ? wall + 1.5 + rnd() * 2.5 : wall;
      put(c, w, (t) => wall + (roof - wall) * (1 - Math.abs(t)));
      if (rnd() < 0.55) {
        const tc = c + Math.floor((rnd() - 0.5) * w);
        put(tc, 5, (t) => (Math.abs(t) < 0.8 ? wall + 2.6 : wall + 1.2));
        put(tc, 6, (t) => wall + 3.1 - Math.abs(t) * 0.4);
      }
      if (rnd() < 0.35) {
        const ac = c + Math.floor((rnd() - 0.5) * w);
        put(ac, 0, () => roof + 7);
        put(ac, 4, (t) => (Math.abs(Math.abs(t) - 0.6) < 0.25 ? roof + 5.2 : null));
      }
    } else if (kind < 0.85) {
      const trunk = 2.5 + rnd() * 1.5, crown = 4 + rnd() * 5;
      put(c, 1, () => trunk + 1);
      put(c, w, (t) => {
        const s = 1 - t * t;
        if (s <= 0) return null;
        return trunk + crown * Math.sqrt(s) * (0.85 + 0.15 * Math.sin(t * 23 + c));
      });
    } else {
      const top = 6 + rnd() * 2;
      put(c, 0, () => top);
      put(c + 2, 2, () => top - 0.3);
    }
    pos += w * 2 + Math.floor(rnd() * 26);
  }
  return h;
})();
function silhouetteAlt(az, offset) {
  let d = ((az - offset) / DEG) % 360;
  if (d < 0) d += 360;
  return SILHOUETTE[Math.round(d * 2) % 720] * 1.4 * DEG;
}

function horizVec(alt, az) {
  const ca = Math.cos(alt);
  return [ca * Math.sin(az), ca * Math.cos(az), Math.sin(alt)];
}
function makeView(az0, alt0, k, cx, cy) {
  const f = horizVec(alt0, az0);
  const r = [Math.cos(az0), -Math.sin(az0), 0];
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  return (alt, az) => {
    const v = horizVec(alt, az);
    const d = v[0] * f[0] + v[1] * f[1] + v[2] * f[2];
    if (d < -0.3) return null;
    const s = k / (1 + d);
    return [cx + s * (v[0] * r[0] + v[1] * r[1]), cy - s * (v[0] * u[0] + v[1] * u[1] + v[2] * u[2])];
  };
}

function renderPOV(ctx, opts) {
  const o = skyFrame(opts);
  const { W, H, az0, alt0 } = o;
  const k = (W / 2) / Math.tan((o.fov || 84) * DEG / 4);
  const cy = H * (o.horizonAt || 0.6) - k * Math.tan(alt0 / 2);
  const toXY = makeView(az0, alt0, k, W / 2, cy);
  const look = skyLook(o.sunAlt);
  const onScreen = (p) => p && p[0] > -40 && p[0] < W + 40 && p[1] > -40 && p[1] < H + 40;

  // Cielo
  const hz = toXY(0, az0);
  const hy = hz ? hz[1] : H;
  const g = ctx.createLinearGradient(0, Math.min(0, hy - H), 0, hy);
  g.addColorStop(0, rgb(look.top));
  g.addColorStop(0.7, rgb(mix(look.top, look.horizon, 0.45)));
  g.addColorStop(1, rgb(look.horizon));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // Resplandor del Sol cerca del horizonte (crepúsculo o día)
  if (o.sunAlt > -18) {
    const sp = toXY(Math.max(o.sunAltRad, 0), o.sunAz);
    if (sp) {
      const sg = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], W * 0.9);
      sg.addColorStop(0, `rgba(255,190,140,${clamp(0.35 + o.sunAlt / 40, 0, 0.45)})`);
      sg.addColorStop(1, 'rgba(255,190,140,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
    }
  }
  // Luces de la ciudad reflejadas en el horizonte
  const lp = ctx.createLinearGradient(0, hy - H * 0.16, 0, hy);
  lp.addColorStop(0, 'rgba(255,170,110,0)');
  lp.addColorStop(1, `rgba(255,170,110,${look.day ? 0 : 0.09})`);
  ctx.fillStyle = lp;
  ctx.fillRect(0, hy - H * 0.16, W, H * 0.16);

  drawLines(ctx, toXY, o, clamp((o.reveal - 0.5) / 0.35, 0, 1) * 0.16 * look.starAlpha, -0.05);

  const magLimit = Math.min(look.magLimit, -1.5 + o.reveal * 7.5);
  for (let i = 0; i < STARS.n; i++) {
    const m = STARS.mag[i];
    if (m > magLimit) break;
    const [alt, az] = altAz(STARS.ra[i], STARS.sd[i], STARS.cd[i], o.L, o.sinLat, o.cosLat);
    if (alt < -0.02) continue;
    const p = toXY(alt, az);
    if (!onScreen(p)) continue;
    const fade = Math.min(1, (magLimit - m) / 1.2);
    const extinction = alt < 0.25 ? 0.35 + alt * 2.6 : 1;
    drawStarDot(ctx, p[0], p[1], m, STARS.col[i], o.scale, clamp((m < 4 ? 1 : 0.5 + (5.5 - m) * 0.3) * fade * extinction * look.starAlpha, 0, 1));
  }
  ctx.globalAlpha = 1;

  const labelAlpha = clamp((o.reveal - 0.75) / 0.25, 0, 1);
  const placed = [];
  if (o.objects) drawObjects(ctx, o.objects, toXY, o, placed, labelAlpha);
  if (o.highlight) {
    const s = o.highlight;
    const d = s.dec * DEG;
    const [alt, az] = altAz(s.ra * DEG, Math.sin(d), Math.cos(d), o.L, o.sinLat, o.cosLat);
    const p = alt > 0.05 ? toXY(alt, az) : null;
    if (onScreen(p)) {
      ctx.globalAlpha = labelAlpha;
      ctx.strokeStyle = '#ffd29a';
      ctx.lineWidth = 1.5 * o.scale;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 11 * o.scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffd29a';
      ctx.font = `500 ${11 * o.scale}px "Hanken Grotesk", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`Mi estrella · ${s.name}`, p[0], p[1] - 17 * o.scale);
      placed.push([p[0], p[1] - 17 * o.scale, 120 * o.scale], [p[0], p[1] + 14 * o.scale, 30 * o.scale]);
    }
  }
  if (labelAlpha > 0) drawStarLabels(ctx, toXY, o, placed, labelAlpha * 0.75 * Math.max(look.starAlpha, 0.5), 0.1);
  ctx.globalAlpha = 1;

  // Suelo y siluetas del barrio
  const span = 140 * DEG;
  const pts = [];
  for (let a = -span; a <= span; a += 0.5 * DEG) {
    const az = az0 + a;
    const p = toXY(silhouetteAlt(az, o.silOffset || 0), az);
    if (p) pts.push(p);
  }
  if (pts.length) {
    const gg = ctx.createLinearGradient(0, hy - 60, 0, H);
    gg.addColorStop(0, rgb(look.ground));
    gg.addColorStop(1, rgb(mix(look.ground, [0, 0, 0], 0.5)));
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], H + 10);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(pts[pts.length - 1][0], H + 10);
    ctx.closePath();
    ctx.fill();
  }
  // Puntos cardinales sobre el suelo
  ctx.font = `500 ${10 * o.scale}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(162,164,194,0.75)';
  for (let i = 0; i < 8; i++) {
    const p = toXY(-2.2 * DEG, i * 45 * DEG);
    if (p && p[0] > 10 && p[0] < W - 10 && p[1] < H) ctx.fillText(['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][i], p[0], p[1]);
  }
}

/* Luna con su fase. En el hemisferio sur se ve espejada respecto del norte. */
function drawMoon(ctx, cx, cy, R, phaseDeg, south) {
  const th = phaseDeg * DEG;
  const waning = phaseDeg > 180;
  const rx = R * Math.abs(Math.cos(th));
  ctx.save();
  ctx.translate(cx, cy);
  if (waning !== south) ctx.scale(-1, 1);

  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(28,31,52,0.92)';
  ctx.fill();

  const p = waning ? 360 - phaseDeg : phaseDeg;
  ctx.beginPath();
  ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
  if (p < 90) ctx.ellipse(0, 0, rx, R, 0, Math.PI / 2, -Math.PI / 2, true);
  else ctx.ellipse(0, 0, rx, R, 0, Math.PI / 2, Math.PI * 1.5, false);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  const g = ctx.createRadialGradient(-R * 0.25, -R * 0.25, R * 0.1, 0, 0, R);
  g.addColorStop(0, '#fbf6ea');
  g.addColorStop(0.75, '#e6dfcf');
  g.addColorStop(1, '#bdb4a0');
  ctx.fillStyle = g;
  ctx.fillRect(-R, -R, R * 2, R * 2);
  if (R > 20) {
    // Mares lunares aproximados
    const mx = waning !== south ? -1 : 1;
    for (const [x, y, r] of [[-0.28, -0.32, 0.26], [0.04, -0.2, 0.2], [0.22, 0.08, 0.17], [-0.12, 0.2, 0.28], [-0.45, 0.08, 0.14], [0.3, -0.42, 0.11], [0.12, 0.5, 0.1]]) {
      const px = x * R * mx, py = y * R, pr = r * R;
      const mg = ctx.createRadialGradient(px, py, 0, px, py, pr);
      mg.addColorStop(0, 'rgba(118,110,98,0.32)');
      mg.addColorStop(0.6, 'rgba(118,110,98,0.18)');
      mg.addColorStop(1, 'rgba(118,110,98,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
    }
  }
  ctx.restore();
  ctx.restore();
}

/* ---------- Cálculos del nacimiento ---------- */

function astronomyReady() {
  if (window.Astronomy) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const t = setInterval(() => {
      if (window.Astronomy) { clearInterval(t); resolve(); }
      else if (Date.now() - started > 15000) { clearInterval(t); reject(new Error('timeout')); }
    }, 60);
  });
}

function compute(y, m, d, city, hh, mm) {
  const A = window.Astronomy;
  const obs = new A.Observer(city.lat, city.lon, 0);
  const noon = localToDate(y, m, d, 12, 0, city.tz);
  const knownTime = hh != null;
  let when;
  if (knownTime) {
    when = localToDate(y, m, d, hh, mm, city.tz);
  } else {
    const sunset = A.SearchRiseSet('Sun', obs, -1, noon, 1);
    when = sunset ? new Date(sunset.date.getTime() + 2 * 3600000) : localToDate(y, m, d, 22, 0, city.tz);
  }

  const sunNow = A.Equator('Sun', when, obs, false, true);
  const [sunAlt, sunAz] = altAzDeg(sunNow.ra * 15, sunNow.dec, when, city);
  const objects = [{ name: 'Sol', kind: 'sun', ra: sunNow.ra * 15, dec: sunNow.dec }];
  const visible = [];
  for (const [body, name, color, size] of PLANETS) {
    const eq = A.Equator(body, when, obs, false, true);
    const ob = { name, color, size, ra: eq.ra * 15, dec: eq.dec, kind: 'planet' };
    ob.alt = altAzDeg(ob.ra, ob.dec, when, city);
    objects.push(ob);
    if (ob.alt[0] > 2) visible.push(name);
  }
  const moonEq = A.Equator('Moon', when, obs, false, true);
  const phase = A.MoonPhase(when);
  const moon = { name: 'Luna', kind: 'moon', phase, ra: moonEq.ra * 15, dec: moonEq.dec };
  moon.alt = altAzDeg(moon.ra, moon.dec, when, city);
  objects.push(moon);
  const moonUp = moon.alt[0] > 0;
  const illum = A.Illumination('Moon', when).phase_fraction;
  const nextFull = A.SearchMoonPhase(180, when, 32).date;
  const lastNew = A.SearchMoonPhase(0, new Date(when.getTime() - 31 * MS_DAY), 32).date;

  const sunEq = A.Equator('Sun', noon, obs, false, true);
  const sunCon = A.Constellation(sunEq.ra, sunEq.dec).symbol;

  const birth = knownTime ? when : noon;
  const now = new Date();
  const ageYears = (now - birth) / MS_DAY / YEAR_DAYS;
  const r = { y, m, d, city, knownTime, when, sunAlt, sunAz, objects, visible, moon, moonUp, illum, nextFull, lastNew,
    sunEq, sunCon, birth, now, ageYears, star: pickStar(ageYears, city.lat) };
  r.view = initialView(r);
  return r;
}

// Hacia dónde mira la vista del patio al empezar: lo más lindo que había en el cielo.
function initialView(r) {
  const good = (alt) => alt > 8 && alt < 80;
  let target = null;
  if (r.sunAlt > 0 && good(r.sunAlt)) target = [r.sunAlt, r.sunAz];
  else if (good(r.moon.alt[0])) target = r.moon.alt;
  else {
    const p = r.objects.find((o) => o.kind === 'planet' && good(o.alt[0]));
    if (p) target = p.alt;
  }
  if (target == null) {
    const s = SKY.labels.map(([, ra, dec]) => altAzDeg(ra, dec, r.when, r.city)).find(([alt]) => alt > 15 && alt < 60);
    target = s || [30, r.city.lat < 0 ? 180 : 0];
  }
  // Un poco corrido para que el objeto no quede justo en el centro; el claro del barrio queda debajo.
  return { az: (target[1] + 12) * DEG, alt: clamp(target[0] - 8, 24, 58) * DEG, silOffset: target[1] * DEG };
}

// La estrella cuya luz salió más cerca del momento en que naciste.
function pickStar(age, lat) {
  let best = null, bestScore = Infinity;
  for (const s of SKY.named) {
    const [, , mag, ly, , , , dec] = s;
    const neverRises = lat >= 0 ? dec < lat - 90 : dec > lat + 90;
    // Cerca de tu edad en años luz, pero preferimos estrellas brillantes, con nombre propio y que se vean desde tu ciudad.
    const plain = /^[\dα-ω]/.test(s[0]);
    const score = Math.abs(ly - age) + Math.max(0, mag - 2.5) * 0.3 + (plain ? 0.3 : 0) + (neverRises ? 3 : 0);
    if (score < bestScore) { bestScore = score; best = s; }
  }
  const [name, con, mag, ly, bv, spect, ra, dec] = best;
  return { name, con, mag, ly, bv, spect, ra, dec };
}

function tropicalSign(m, d) {
  let sign = TROPICAL[0][0];
  for (const [name, mm, dd] of TROPICAL) if (m + 1 > mm || (m + 1 === mm && d >= dd)) sign = name;
  return sign;
}

function moonPhaseName(p) {
  if (p < 6 || p >= 354) return 'Luna nueva';
  if (p < 84) return 'Luna creciente';
  if (p < 96) return 'Cuarto creciente';
  if (p < 174) return 'Gibosa creciente';
  if (p < 186) return 'Luna llena';
  if (p < 264) return 'Gibosa menguante';
  if (p < 276) return 'Cuarto menguante';
  return 'Luna menguante';
}

function listEs(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
}
function spanEs(fromDate, toDate) {
  let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + toDate.getMonth() - fromDate.getMonth();
  if (toDate.getDate() < fromDate.getDate()) months--;
  const y = Math.floor(months / 12), mo = months % 12;
  if (months < 1) return 'pocos días';
  const ys = y ? `${y} ${y === 1 ? 'año' : 'años'}` : '';
  const ms = mo ? `${mo} ${mo === 1 ? 'mes' : 'meses'}` : '';
  return [ys, ms].filter(Boolean).join(' y ');
}
function colorWord(bv) {
  if (bv < 0) return 'azulada';
  if (bv < 0.3) return 'blanca';
  if (bv < 0.6) return 'blanco amarillenta';
  if (bv < 1.0) return 'amarilla';
  if (bv < 1.4) return 'anaranjada';
  return 'rojiza';
}
const sunConName = (r) => ZODIAC_ES[r.sunCon] || SKY.cons[r.sunCon];

/* ---------- Fondo animado: el cielo de ahora, girando ---------- */

const bg = $('bg');
let bgCtx, bgW, bgH, bgCity = CITIES[0], bgStart = Date.now(), bgRaf = 0, bgRunning = true;
function sizeBg() {
  bgW = window.innerWidth;
  bgH = window.innerHeight;
  bgCtx = setupCanvas(bg, bgW, bgH);
}
function drawBg() {
  const speed = reduceMotion ? 0 : 40;
  const t = new Date(bgStart + (Date.now() - bgStart) * (1 + speed));
  bgCtx.clearRect(0, 0, bgW, bgH);
  renderSky(bgCtx, { cx: bgW / 2, cy: bgH * 0.34, R: Math.max(bgW, bgH) * 0.62, lat: bgCity.lat, lon: bgCity.lon,
    date: t, lineAlpha: 0.1, starScale: 0.95 });
  if (bgRunning && !reduceMotion) bgRaf = requestAnimationFrame(drawBg);
}

/* ---------- Formulario ---------- */

function fillForm() {
  const day = $('day'), month = $('month'), year = $('year'), city = $('city'), hour = $('hour'), minute = $('minute');
  for (let i = 1; i <= 31; i++) day.add(new Option(i, i));
  for (let i = 0; i < 12; i++) month.add(new Option(fmt(new Date(Date.UTC(2000, i, 15)), 'UTC', { month: 'long' }).replace(/^./, (c) => c.toUpperCase()), i));
  const thisYear = new Date().getFullYear();
  for (let i = thisYear; i >= 1930; i--) year.add(new Option(i, i));
  for (let i = 0; i < 24; i++) hour.add(new Option(String(i).padStart(2, '0') + ' h', i));
  for (let i = 0; i < 60; i += 5) minute.add(new Option(String(i).padStart(2, '0') + ' min', i));
  CITIES.forEach((c, i) => city.add(new Option(c.name, i)));

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let idx = CITIES.findIndex((c) => c.tz === tz);
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem('astrocodi') || 'null'); } catch (e) { /* sin almacenamiento */ }
  if (saved) {
    day.value = saved.d; month.value = saved.m; year.value = saved.y;
    if (saved.hh != null) { hour.value = saved.hh; minute.value = saved.mm; }
    if (CITIES[saved.c]) idx = saved.c;
  }
  city.value = String(Math.max(0, idx));
  bgCity = CITIES[Math.max(0, idx)];
  for (const s of [day, month, year, hour, minute]) {
    const mark = () => s.classList.toggle('empty', !s.value);
    s.addEventListener('change', mark);
    mark();
  }
  hour.addEventListener('change', () => {
    if (hour.value && !minute.value) { minute.value = '0'; minute.classList.remove('empty'); }
    if (!hour.value) { minute.value = ''; minute.classList.add('empty'); }
  });
  city.addEventListener('change', () => { bgCity = CITIES[+city.value]; updateNowLabel(); if (reduceMotion) drawBg(); });
  updateNowLabel();
}
function updateNowLabel() {
  $('now-label').textContent = `Cielo de ahora · ${bgCity.name} · ${fmtTime(new Date(), bgCity.tz)}`;
}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = +$('day').value, m = $('month').value, y = +$('year').value;
  const hh = $('hour').value === '' ? null : +$('hour').value;
  const mm = hh == null ? 0 : +($('minute').value || 0);
  const err = $('error');
  err.hidden = true;
  if (!d || m === '' || !y) { err.textContent = 'Elegí día, mes y año.'; err.hidden = false; return; }
  const date = new Date(y, +m, d, hh ?? 0, mm);
  if (date.getMonth() !== +m) { err.textContent = `Ese mes no tiene ${d} días.`; err.hidden = false; return; }
  if (date > new Date()) { err.textContent = 'Esa fecha todavía no llegó.'; err.hidden = false; return; }
  const cityIdx = +$('city').value;
  try { localStorage.setItem('astrocodi', JSON.stringify({ d, m, y, c: cityIdx, hh, mm })); } catch (e2) { /* sin almacenamiento */ }

  const btn = $('go');
  btn.disabled = true;
  btn.textContent = 'Calculando tu cielo…';
  try {
    await astronomyReady();
    data = compute(y, +m, d, CITIES[cityIdx], hh, mm);
    fillStories(data);
    openStories();
  } catch (ex) {
    console.error(ex);
    err.textContent = 'No pudimos cargar los datos astronómicos. Revisá tu conexión y probá de nuevo.';
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Ver mi cielo';
  }
});

/* ---------- Historias ---------- */

let data = null;
let current = 0;
let storyRaf = 0;
const stories = [...document.querySelectorAll('.story')];
const bars = $('bars');
stories.forEach((s, i) => {
  const b = document.createElement('span');
  b.appendChild(document.createElement('i'));
  bars.appendChild(b);
  if (i < TEASERS.length) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'next-btn';
    btn.innerHTML = `<span>${TEASERS[i]}</span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.addEventListener('click', () => go(i + 1));
    s.querySelector('.copy').appendChild(btn);
  }
});

function fillStories(r) {
  const { city } = r;
  const dateTxt = fmt(r.when, city.tz, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '');
  const hourTxt = fmtTime(r.when, city.tz);
  $('s1-eyebrow').textContent = `${dateTxt} · ${hourTxt} · ${city.name}`;

  const seen = [...r.visible];
  if (r.moonUp) seen.push('la Luna');
  const verb = seen.length === 1 ? 'estaba' : 'estaban';
  let s1;
  if (r.knownTime && r.sunAlt > 0) {
    s1 = `Naciste de día, con el Sol a ${Math.round(r.sunAlt)}° de altura. Detrás del azul ${seen.length ? `${verb} <strong>${listEs(seen)}</strong> y` : 'estaban'} estas estrellas, aunque nadie las podía ver.`;
  } else if (r.knownTime && r.sunAlt > -12) {
    s1 = `Naciste en el crepúsculo, con el Sol apenas debajo del horizonte.${seen.length ? ` Ya ${seen.length === 1 ? 'asomaba' : 'asomaban'} <strong>${listEs(seen)}</strong>.` : ''}`;
  } else if (seen.length) {
    const lead = r.knownTime ? `A las ${hourTxt}, la hora en que naciste,` : 'Dos horas después de la puesta del Sol';
    s1 = `${lead} se ${seen.length === 1 ? 'veía' : 'veían'} <strong>${listEs(seen)}</strong> sobre ${city.name}.`;
  } else {
    const bright = SKY.labels.filter(([, ra, dec]) => altAzDeg(ra, dec, r.when, city)[0] > 15).slice(0, 2).map((l) => l[0]);
    s1 = `Esa noche los planetas estaban del otro lado del cielo, pero brillaban <strong>${listEs(bright)}</strong>.`;
  }
  $('s1-text').innerHTML = s1;

  $('s2-title').textContent = moonPhaseName(r.moon.phase);
  const ageDays = Math.floor((r.when - r.lastNew) / MS_DAY);
  const fullTxt = fmt(r.nextFull, city.tz, { day: 'numeric', month: 'long' });
  let s2 = `Iluminada al <strong>${Math.round(r.illum * 100)}%</strong>, con ${ageDays} ${ageDays === 1 ? 'día' : 'días'} desde la Luna nueva. `;
  s2 += r.moon.phase > 174 && r.moon.phase < 186 ? 'Naciste con la Luna llena en el cielo.' : `La siguiente Luna llena fue el ${fullTxt}.`;
  if (city.lat < 0) s2 += ' Desde el hemisferio sur se ve al revés que en los dibujos del norte: la parte iluminada queda del otro lado.';
  $('s2-text').innerHTML = s2;

  const st = r.star;
  $('s3-title').textContent = st.name;
  $('s3-meta').textContent = `${nf1.format(st.ly)} años luz · ${SKY.cons[st.con] || st.con} · ${colorWord(st.bv)}`;
  const departed = new Date(r.now.getTime() - st.ly * YEAR_DAYS * MS_DAY);
  const departedTxt = fmt(departed, city.tz, { month: 'long', year: 'numeric' });
  $('s3-from').textContent = `Salió de ${st.name} · ${fmt(departed, city.tz, { month: 'short', year: 'numeric' }).replace(/\./g, '')}`;
  const rel = departed >= r.birth ? `cuando tenías ${spanEs(r.birth, departed)}` : `${spanEs(departed, r.birth)} antes de que nacieras`;
  const km = st.ly * KM_PER_LY / 1e12;
  $('s3-text').innerHTML = `La luz que esta noche te llega de ${st.name} salió en ${departedTxt}, <strong>${rel}</strong>. Viajó ${nf.format(Math.round(km))} billones de kilómetros para llegar a tus ojos ahora.`;
  $('s3-where').textContent = whereToSee(st, city);

  const sign = tropicalSign(r.m, r.d);
  const real = sunConName(r);
  $('s4-title').textContent = `El Sol estaba frente a ${real}.`;
  let s4 = 'Visto desde la Tierra, el Sol recorre las constelaciones a lo largo del año. El día que naciste tenía detrás a esta, aunque su luz no dejaba verla. ';
  if (r.sunCon === 'Oph') s4 += 'Ofiuco es la constelación que el Sol cruza y los horóscopos nunca incluyeron.';
  else if (real === sign) s4 += `El horóscopo también dice ${sign}: esta vez coinciden.`;
  else s4 += `El horóscopo diría ${sign}, pero usa el cielo de hace 2.000 años: el eje de la Tierra fue cambiando de dirección (precesión) y el cielo se corrió casi una constelación.`;
  $('s4-text').textContent = s4;

  const days = Math.floor((r.now - r.birth) / MS_DAY);
  const stats = [
    [nf.format(Math.floor(r.ageYears)), Math.floor(r.ageYears) === 1 ? 'vuelta al Sol' : 'vueltas al Sol'],
    [nf.format(Math.floor(days / 29.530589)), 'lunas llenas'],
    [nf1.format(r.ageYears / 1.8808), 'años en Marte'],
    [nf1.format(r.ageYears / 11.862), 'años en Júpiter'],
  ];
  $('s5-stats').innerHTML = stats.map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('');
  $('card').removeAttribute('data-for');
  pov = { az: r.view.az, alt: r.view.alt, vaz: 0, valt: 0, dragged: false };
  setSkyMode('pov');
}

function whereToSee(st, city) {
  const now = new Date();
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: city.tz, year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(now).map((x) => [x.type, +x.value || x.value]));
  const maxAlt = 90 - Math.abs(city.lat - st.dec);
  if (maxAlt < 3) return `Desde ${city.name} nunca sale sobre el horizonte. Se ve desde el otro hemisferio.`;
  for (let h = 21; h <= 29; h++) {
    const t = localToDate(p.year, p.month - 1, p.day, h, 0, city.tz);
    const [alt, az] = altAzDeg(st.ra, st.dec, t, city);
    if (alt > 12) {
      return h === 21
        ? `Para verla: esta noche a las 21 está hacia el ${direction(az)}, a ${Math.round(alt)}° sobre el horizonte.`
        : `Para verla: esta noche asoma después de las ${String(h % 24).padStart(2, '0')} h, hacia el ${direction(az)}.`;
    }
  }
  return 'En esta época del año sale de día. Va a volver al cielo nocturno en unos meses.';
}

function openStories() {
  bgRunning = false;
  cancelAnimationFrame(bgRaf);
  $('intro').hidden = true;
  $('stories').hidden = false;
  go(0);
}
function closeStories() {
  cancelAnimationFrame(storyRaf);
  $('stories').hidden = true;
  $('sheet').hidden = true;
  $('intro').hidden = false;
  bgRunning = true;
  sizeBg();
  drawBg();
}

function go(i) {
  if (i < 0 || i >= stories.length) return;
  current = i;
  stories.forEach((s, k) => {
    s.classList.toggle('on', k === i);
    s.classList.toggle('before', k < i);
    s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
  });
  [...bars.children].forEach((b, k) => { b.classList.toggle('done', k < i); b.classList.toggle('on', k === i); });
  cancelAnimationFrame(storyRaf);
  requestAnimationFrame(() => [playSky, playMoon, playStar, playBand, playStats, playCard][i]());
}

$('tap-next').addEventListener('click', () => go(current + 1));
$('tap-prev').addEventListener('click', () => go(current - 1));
$('restart').addEventListener('click', closeStories);
$('again').addEventListener('click', closeStories);
document.addEventListener('keydown', (e) => {
  if ($('stories').hidden) return;
  if (e.key === 'ArrowRight') go(current + 1);
  if (e.key === 'ArrowLeft') go(current - 1);
  if (e.key === 'Escape') closeStories();
});
let touchX = null;
$('stories').addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
$('stories').addEventListener('touchend', (e) => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

function visualBox(canvas) {
  const box = canvas.parentElement.getBoundingClientRect();
  return { w: box.width, h: box.height };
}

function animate(duration, frame) {
  const t0 = performance.now();
  const step = (now) => {
    const p = reduceMotion ? 1 : Math.min(1, (now - t0) / duration);
    const keep = frame(p, now - t0);
    if (p < 1 || keep) storyRaf = requestAnimationFrame(step);
  };
  storyRaf = requestAnimationFrame(step);
}
const ease = (p) => 1 - Math.pow(1 - p, 3);

/* ---------- Historia 1: el cielo, desde el patio o completo ---------- */

let pov = { az: 0, alt: 26 * DEG, vaz: 0, valt: 0, dragged: false };
let skyMode = 'pov';
let skyT0 = 0;
function setSkyMode(mode) {
  skyMode = mode;
  document.querySelectorAll('#sky-mode button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  $('drag-hint').hidden = mode !== 'pov' || pov.dragged;
}
document.querySelectorAll('#sky-mode button').forEach((b) => b.addEventListener('click', () => {
  setSkyMode(b.dataset.mode);
  if (current === 0) { cancelAnimationFrame(storyRaf); playSky(true); }
}));

function playSky(instant) {
  instant = instant === true;
  const c = $('sky');
  const W = c.parentElement.clientWidth, H = c.parentElement.clientHeight;
  const ctx = setupCanvas(c, W, H);
  // El horizonte queda justo arriba del texto, así el suelo oscuro hace de fondo para leer.
  const copyTop = c.closest('.story').querySelector('.copy').getBoundingClientRect().top - c.getBoundingClientRect().top;
  const horizonAt = clamp((copyTop - 6) / H, 0.38, 0.64);
  if (!instant) skyT0 = performance.now();
  const azFrom = pov.az - 28 * DEG;
  animate(instant ? 1 : 2800, (p) => {
    const e = instant ? 1 : ease(p);
    // Después de aparecer, el cielo sigue girando despacio, como esa noche.
    const drift = reduceMotion ? 0 : Math.max(0, performance.now() - skyT0 - 2800) * 12;
    const date = new Date(data.when.getTime() + drift);
    if (skyMode === 'pov') {
      if (!pointer.down) {
        pov.az += pov.vaz;
        pov.alt = clamp(pov.alt + pov.valt, 4 * DEG, 85 * DEG);
        pov.vaz *= 0.93;
        pov.valt *= 0.93;
      }
      const az = p < 1 && !pov.dragged && !instant ? azFrom + (pov.az - azFrom) * e : pov.az;
      renderPOV(ctx, { W, H, az0: az, alt0: pov.alt, lat: data.city.lat, lon: data.city.lon, date, reveal: e,
        objects: data.objects, sunAlt: data.sunAlt, sunAltRad: data.sunAlt * DEG, sunAz: data.sunAz * DEG,
        silOffset: data.view.silOffset, starScale: Math.max(1.1, W / 330), moonR: 9, horizonAt });
    } else {
      ctx.clearRect(0, 0, W, H);
      const top = 64, avail = H * 0.56 - top;
      const size = Math.min(W - 40, avail);
      renderSky(ctx, { cx: W / 2, cy: top + avail / 2, R: size / 2 - 14, lat: data.city.lat, lon: data.city.lon, date,
        reveal: e, ring: true, objects: data.objects, labels: true, sunAlt: data.sunAlt, starScale: Math.max(0.8, size / 380) });
    }
    return !reduceMotion || pointer.down || Math.abs(pov.vaz) + Math.abs(pov.valt) > 1e-4;
  });
}

// Arrastrar para mirar alrededor. Un toque sin arrastre avanza o retrocede como en el resto.
const pointer = { down: false, x: 0, y: 0, t: 0, moved: 0 };
const skyCanvas = $('sky');
skyCanvas.addEventListener('pointerdown', (e) => {
  pointer.down = true; pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now(); pointer.moved = 0;
  try { skyCanvas.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
  pov.vaz = pov.valt = 0;
});
skyCanvas.addEventListener('pointermove', (e) => {
  if (!pointer.down || skyMode !== 'pov') return;
  const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
  pointer.x = e.clientX; pointer.y = e.clientY;
  pointer.moved += Math.abs(dx) + Math.abs(dy);
  const k = (skyCanvas.clientWidth / 2) / Math.tan(84 * DEG / 4);
  pov.vaz = -dx / k * 1.15;
  pov.valt = dy / k * 1.15;
  pov.az += pov.vaz;
  pov.alt = clamp(pov.alt + pov.valt, 4 * DEG, 85 * DEG);
  if (pointer.moved > 8 && !pov.dragged) { pov.dragged = true; $('drag-hint').hidden = true; }
  if (reduceMotion) playSky(true);
});
const endPointer = (e) => {
  if (!pointer.down) return;
  pointer.down = false;
  if (pointer.moved < 8 && performance.now() - pointer.t < 400) {
    go(current + (e.clientX < window.innerWidth * 0.3 ? -1 : 1));
  } else if (!reduceMotion) {
    cancelAnimationFrame(storyRaf);
    playSky(true);
  }
};
skyCanvas.addEventListener('pointerup', endPointer);
skyCanvas.addEventListener('pointercancel', () => { pointer.down = false; });
for (const ev of ['touchstart', 'touchend']) skyCanvas.addEventListener(ev, (e) => e.stopPropagation(), { passive: true });

/* ---------- Historias 2 a 5 ---------- */

function playMoon() {
  const c = $('moon');
  const { w, h } = visualBox(c);
  const size = Math.min(w, h, 340);
  const ctx = setupCanvas(c, size, size);
  const target = data.moon.phase;
  const south = data.city.lat < 0;
  animate(1600, (p) => {
    ctx.clearRect(0, 0, size, size);
    const R = size * 0.36;
    const halo = ctx.createRadialGradient(size / 2, size / 2, R * 0.9, size / 2, size / 2, size / 2);
    halo.addColorStop(0, `rgba(255,244,220,${0.18 * data.illum})`);
    halo.addColorStop(1, 'rgba(255,244,220,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, size, size);
    // La fase avanza desde la Luna nueva hasta la de esa noche.
    drawMoon(ctx, size / 2, size / 2, R, Math.max(0.5, target * ease(p)), south);
  });
}

function playStar() {
  const c = $('star');
  const { w, h } = visualBox(c);
  const size = Math.min(w, h, 320);
  const ctx = setupCanvas(c, size, size);
  const col = bvColor(data.star.bv).match(/\d+/g).join(',');
  animate(1400, (p, ms) => {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(ms / 900) * 0.04;
    const R = size * 0.42 * ease(p) * pulse;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.06, `rgba(${col},0.95)`);
    g.addColorStop(0.22, `rgba(${col},0.28)`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    // Picos de difracción, como en una foto de telescopio
    ctx.strokeStyle = `rgba(${col},${0.35 * ease(p)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.stroke();
    return !reduceMotion;
  });
}

function playBand() {
  const c = $('band');
  const { w, h } = visualBox(c);
  const bw = Math.min(w, 520), bh = Math.min(h, bw * 0.75);
  const ctx = setupCanvas(c, bw, bh);
  const [sunLam, sunBeta] = toEcliptic(data.sunEq.ra * 15 * DEG, data.sunEq.dec * DEG);
  const span = 52 * DEG;
  const sx = (lam) => {
    let dl = lam - sunLam;
    dl = Math.atan2(Math.sin(dl), Math.cos(dl));
    return bw / 2 - (dl / span) * (bw / 2);
  };
  const sy = (beta) => bh / 2 - (beta - sunBeta) / (span * bh / bw) * (bh / 2);
  const stars = [];
  for (let i = 0; i < STARS.n; i++) {
    const [lam, beta] = toEcliptic(STARS.ra[i], Math.asin(STARS.sd[i]));
    const x = sx(lam), y = sy(beta);
    if (x > -10 && x < bw + 10 && y > -10 && y < bh + 10) stars.push([x, y, STARS.mag[i], STARS.col[i]]);
  }
  const segs = LINES.map((seg) => {
    const pts = [];
    for (let i = 0; i < seg.length; i += 2) {
      const [lam, beta] = toEcliptic(seg[i], seg[i + 1]);
      pts.push([sx(lam), sy(beta)]);
    }
    return pts;
  }).filter((pts) => pts.some(([x, y]) => x > 0 && x < bw && y > 0 && y < bh));
  const name = sunConName(data).toUpperCase();

  animate(1800, (p) => {
    ctx.clearRect(0, 0, bw, bh);
    const e = ease(p);
    // Eclíptica: el camino del Sol entre las estrellas
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(255,210,154,0.35)';
    ctx.beginPath();
    ctx.moveTo(0, sy(0)); ctx.lineTo(bw, sy(0));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = `rgba(190,198,255,${0.3 * e})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (const pts of segs) {
      pts.forEach(([x, y], k) => {
        const jump = k > 0 && Math.abs(x - pts[k - 1][0]) > bw / 2;
        if (k === 0 || jump) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
    }
    ctx.stroke();
    for (const [x, y, m, col] of stars) {
      ctx.globalAlpha = Math.min(1, e * 1.5) * (m < 4 ? 1 : 0.6);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, (5.8 - m) * 0.45), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const cx = bw / 2, cy = bh / 2, R = 13;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 5);
    g.addColorStop(0, 'rgba(255,220,160,0.65)');
    g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - R * 5, cy - R * 5, R * 10, R * 10);
    ctx.fillStyle = '#fff3dc';
    ctx.beginPath();
    ctx.arc(cx, cy, R * (0.6 + 0.4 * e), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = e;
    ctx.fillStyle = '#ffd29a';
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('☉ EL SOL EN ' + name, cx, cy + R * 3.2);
    ctx.globalAlpha = 1;
  });
}

function playStats() {
  const c = $('orbit');
  const { w, h } = visualBox(c);
  const ow = Math.min(w, 420), oh = Math.min(h, ow * 0.62);
  const octx = setupCanvas(c, ow, oh);
  const laps = data.ageYears;
  const el = $('s5-km');
  const startKm = (data.now - data.birth) / 1000 * EARTH_KMS;
  const t0 = performance.now();
  animate(1800, (p, ms) => {
    // Órbita de la Tierra: la vuelta actual se completa en la proporción real del año.
    const cx = ow / 2, cy = oh / 2, rx = ow * 0.42, ry = oh * 0.36;
    octx.clearRect(0, 0, ow, oh);
    octx.strokeStyle = 'rgba(190,198,255,0.18)';
    octx.lineWidth = 1;
    octx.beginPath(); octx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); octx.stroke();
    const frac = laps % 1;
    const a0 = Math.PI / 2;
    const a = a0 + Math.PI * 2 * frac * ease(p) + (p >= 1 && !reduceMotion ? (ms - 1800) / 60000 : 0);
    octx.strokeStyle = 'rgba(255,210,154,0.75)';
    octx.lineWidth = 1.6;
    octx.beginPath(); octx.ellipse(cx, cy, rx, ry, 0, a0, a); octx.stroke();
    const sg = octx.createRadialGradient(cx, cy, 0, cx, cy, 34);
    sg.addColorStop(0, 'rgba(255,226,170,0.9)');
    sg.addColorStop(1, 'rgba(255,200,120,0)');
    octx.fillStyle = sg; octx.fillRect(cx - 34, cy - 34, 68, 68);
    octx.fillStyle = '#fff3dc';
    octx.beginPath(); octx.arc(cx, cy, 9, 0, Math.PI * 2); octx.fill();
    const ex = cx + rx * Math.cos(a), ey = cy + ry * Math.sin(a);
    octx.fillStyle = '#7fb2ff';
    octx.beginPath(); octx.arc(ex, ey, 5, 0, Math.PI * 2); octx.fill();
    octx.fillStyle = '#a2a4c2';
    octx.font = '500 10px "IBM Plex Mono", monospace';
    octx.textAlign = 'center';
    octx.fillText(`VUELTA ${Math.floor(laps) + 1} · ${Math.round(frac * 100)}%`, cx, Math.min(oh - 4, cy + ry + 18));
    const km = p < 1 ? startKm * ease(p) : startKm + ((performance.now() - t0 - 1800) / 1000) * EARTH_KMS;
    el.textContent = nf.format(Math.floor(km));
    return !reduceMotion;
  });
}

/* ---------- Tarjeta para compartir (1080 × 1920, formato historia) ---------- */

let cardStyle = 'pov';
let cardBlob = null;
document.querySelectorAll('#card-style button').forEach((b) => b.addEventListener('click', () => {
  cardStyle = b.dataset.style;
  document.querySelectorAll('#card-style button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  playCard();
}));

function drawSticker(ctx, x, y, text) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-3 * DEG);
  ctx.font = '600 44px "Hanken Grotesk", system-ui, sans-serif';
  const w = ctx.measureText(text).width + 84, h = 96;
  ctx.shadowColor = 'rgba(255,190,110,0.55)';
  ctx.shadowBlur = 40;
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  g.addColorStop(0, '#fff1d8');
  g.addColorStop(1, '#ffc97e');
  ctx.fillStyle = g;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
  else ctx.rect(-w / 2, -h / 2, w, h);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1a1408';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}

function drawRows(ctx, rows, y0, step, W, rules) {
  let y = y0;
  ctx.strokeStyle = 'rgba(190,196,255,0.18)';
  ctx.lineWidth = 2;
  for (const [k, v] of rows) {
    if (rules) { ctx.beginPath(); ctx.moveTo(120, y - 50); ctx.lineTo(W - 120, y - 50); ctx.stroke(); }
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a2a4c2';
    ctx.font = '500 26px "IBM Plex Mono", monospace';
    ctx.fillText(k, 120, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ece8f4';
    ctx.font = 'italic 500 46px Cormorant, Georgia, serif';
    ctx.fillText(v, W - 120, y + 4);
    y += step;
  }
}

async function playCard() {
  const img = $('card');
  const key = `${cardKey()}-${cardStyle}`;
  if (img.dataset.for === key) return;
  try { await document.fonts.ready; } catch (e) { /* sigue con fuentes del sistema */ }
  const W = 1080, H = 1920;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const { city } = data;
  const dateLine = `${fmt(data.when, city.tz, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').toUpperCase()} · ${fmtTime(data.when, city.tz)} · ${city.name.toUpperCase()}`;
  const rows = [
    ['MI ESTRELLA', `${data.star.name} · ${nf1.format(data.star.ly)} años luz`],
    ['MI LUNA', `${moonPhaseName(data.moon.phase)} · ${Math.round(data.illum * 100)}%`],
    ['EL SOL EN', sunConName(data)],
  ];
  const cta = `¿Y el tuyo? → @${INSTAGRAM}`;

  if (cardStyle === 'pov') {
    renderPOV(ctx, { W, H, az0: data.view.az, alt0: data.view.alt + 4 * DEG, fov: 92, horizonAt: 0.6, lat: city.lat, lon: city.lon,
      date: data.when, objects: data.objects, sunAlt: data.sunAlt, sunAltRad: data.sunAlt * DEG, sunAz: data.sunAz * DEG,
      silOffset: data.view.silOffset, starScale: 2.6, moonR: 9, highlight: data.star });
    const top = ctx.createLinearGradient(0, 0, 0, 420);
    top.addColorStop(0, 'rgba(4,6,15,0.85)');
    top.addColorStop(1, 'rgba(4,6,15,0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, 420);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ece8f4';
    ctx.font = '600 36px Cormorant, Georgia, serif';
    ctx.fillText('A S T R O C O D I', W / 2, 120);
    ctx.fillStyle = '#ffd29a';
    ctx.font = '500 30px "IBM Plex Mono", monospace';
    ctx.fillText(dateLine, W / 2, 180);
    ctx.fillStyle = '#ece8f4';
    ctx.font = '500 112px Cormorant, Georgia, serif';
    ctx.fillText('Así estaba el cielo', W / 2, 1300);
    ctx.font = 'italic 500 112px Cormorant, Georgia, serif';
    ctx.fillText('cuando nací', W / 2, 1408);
    drawRows(ctx, rows, 1510, 70, W, false);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0e1531');
    g.addColorStop(0.55, '#070b1a');
    g.addColorStop(1, '#151033');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ece8f4';
    ctx.font = '600 36px Cormorant, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('A S T R O C O D I', W / 2, 120);
    renderSky(ctx, { cx: W / 2, cy: 600, R: 410, lat: city.lat, lon: city.lon, date: data.when, ring: true,
      objects: data.objects, labels: true, sunAlt: data.sunAlt, starScale: 2.3 });
    ctx.fillStyle = '#ffd29a';
    ctx.font = '500 30px "IBM Plex Mono", monospace';
    ctx.fillText(dateLine, W / 2, 1110);
    ctx.fillStyle = '#ece8f4';
    ctx.font = '500 104px Cormorant, Georgia, serif';
    ctx.fillText('Así estaba el cielo', W / 2, 1230);
    ctx.font = 'italic 500 104px Cormorant, Georgia, serif';
    ctx.fillText('cuando nací', W / 2, 1330);
    drawRows(ctx, rows, 1450, 94, W, true);
  }
  drawSticker(ctx, W / 2, 1790, cta);

  img.src = c.toDataURL('image/jpeg', 0.9);
  img.dataset.for = key;
  $('sheet-img').src = img.src;
  cardBlob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.92));
}
const cardKey = () => `${data.y}-${data.m}-${data.d}-${fmtTime(data.when, 'UTC')}-${data.city.name}`;

const openSheet = () => { $('sheet').hidden = false; };
$('sheet-close').addEventListener('click', () => { $('sheet').hidden = true; });

$('share').addEventListener('click', async () => {
  if (!cardBlob) return;
  const file = new File([cardBlob], 'mi-cielo-astrocodi.jpg', { type: 'image/jpeg' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  openSheet();
});

$('save').addEventListener('click', () => {
  if (!cardBlob) return;
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(cardBlob);
    a.download = 'mi-cielo-astrocodi.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) { /* algunos navegadores internos no descargan */ }
  // En el navegador de Instagram la descarga no siempre funciona: mostramos cómo guardarla a mano.
  openSheet();
});

$('send').addEventListener('click', async () => {
  const url = SITE_URL || location.href;
  const text = 'Mirá cómo estaba el cielo la noche en que naciste';
  try {
    if (navigator.share) { await navigator.share({ text, url }); return; }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  try {
    await navigator.clipboard.writeText(`${text}: ${url}`);
    toast('Link copiado. Pegáselo a quien quieras.');
  } catch (e) {
    toast(url);
  }
});

let toastTimer = 0;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

/* ---------- Inicio ---------- */

fillForm();
sizeBg();
drawBg();
window.addEventListener('resize', () => {
  sizeBg();
  if (!bgRunning || reduceMotion) drawBg();
  if (!$('stories').hidden) go(current);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(bgRaf);
  else if (bgRunning && !reduceMotion) drawBg();
});
setInterval(updateNowLabel, 30000);
})();
