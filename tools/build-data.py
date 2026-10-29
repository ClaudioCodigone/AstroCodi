#!/usr/bin/env python3
"""Genera data/sky.js a partir de catálogos astronómicos públicos.

Fuentes (descargar a mano y pasar las rutas como argumentos):
  - HYG Database v3.8 (CC BY-SA 4.0): https://github.com/astronexus/HYG-Database
      hyg/v3/hyg_v38.csv.gz  (descomprimido)
  - d3-celestial (BSD-3): paquete npm `d3-celestial`, carpeta data/
      constellations.lines.json y constellations.json

Uso: python3 tools/build-data.py hyg_v38.csv ruta/a/d3-celestial/data > data/sky.js
"""
import csv, json, sys, os

LY_PER_PC = 3.26156
GREEK = {'Alp':'α','Bet':'β','Gam':'γ','Del':'δ','Eps':'ε','Zet':'ζ','Eta':'η','The':'θ',
         'Iot':'ι','Kap':'κ','Lam':'λ','Mu':'μ','Nu':'ν','Xi':'ξ','Omi':'ο','Pi':'π','Rho':'ρ',
         'Sig':'σ','Tau':'τ','Ups':'υ','Phi':'φ','Chi':'χ','Psi':'ψ','Ome':'ω'}
# Nombres tradicionales en castellano para las estrellas más conocidas.
ES_NAMES = {'Sirius':'Sirio','Rigil Kentaurus':'Alfa Centauri','Arcturus':'Arturo','Pollux':'Pólux',
            'Castor':'Cástor','Procyon':'Proción','Regulus':'Régulo','Spica':'Espiga','Canopus':'Canopo',
            'Aldebaran':'Aldebarán','Polaris':'Estrella Polar','Toliman':'Alfa Centauri B',
            'Hadar':'Hadar','Acrux':'Ácrux','Mimosa':'Mimosa','Fomalhaut':'Fomalhaut'}

hyg_path, d3 = sys.argv[1], sys.argv[2]
rows = [r for r in csv.DictReader(open(hyg_path)) if r['proper'] != 'Sol' and r['mag']]

def bv(r):
    try: return float(r['ci'])
    except ValueError: return 0.6

# Estrellas visibles a simple vista para dibujar el cielo: [ra°, dec°, mag, B-V] * 100
stars = []
for r in sorted(rows, key=lambda r: float(r['mag'])):
    m = float(r['mag'])
    if m > 5.5: break
    stars += [round(float(r['ra']) * 1500), round(float(r['dec']) * 100), round(m * 100), round(bv(r) * 100)]

con_meta = {f['id']: f['properties'] for f in json.load(open(os.path.join(d3, 'constellations.json')))['features']}

def display_name(r):
    if r['proper']:
        return ES_NAMES.get(r['proper'], r['proper'])
    gen = con_meta.get(r['con'], {}).get('gen', r['con'])
    if r['bayer']:
        letter, _, idx = r['bayer'].partition('-')
        sup = {'1':'¹','2':'²','3':'³'}.get(idx, '')
        return f"{GREEK.get(letter, letter)}{sup} {gen}"
    if r['flam']:
        return f"{r['flam']} {gen}"
    return None

# Candidatas a "tu estrella": visibles a simple vista y a menos de 105 años luz.
named = []
for r in rows:
    m, ly = float(r['mag']), float(r['dist']) * LY_PER_PC
    if m > 6.0 or ly > 105 or ly < 1: continue
    n = display_name(r)
    if not n: continue
    named.append([n, r['con'], round(m, 2), round(ly, 2), round(bv(r), 2), r['spect'][:6],
                  round(float(r['ra']) * 15, 3), round(float(r['dec']), 3)])
named.sort(key=lambda s: s[3])

# Etiquetas para las estrellas más brillantes del cielo.
labels = []
for r in rows:
    if float(r['mag']) <= 1.6 and r['proper'] and r['proper'] != 'Toliman':
        labels.append([ES_NAMES.get(r['proper'], r['proper']), round(float(r['ra']) * 15, 2), round(float(r['dec']), 2)])

lines = []
for f in json.load(open(os.path.join(d3, 'constellations.lines.json')))['features']:
    for seg in f['geometry']['coordinates']:
        lines.append([v for ra, dec in seg for v in (round((ra % 360) * 10), round(dec * 10))])

cons = {k: v.get('es') or v['name'] for k, v in con_meta.items()}

out = {'stars': stars, 'lines': lines, 'named': named, 'labels': labels, 'cons': cons}
print('/* Generado por tools/build-data.py. Datos: HYG Database v3.8 (CC BY-SA 4.0) y d3-celestial (BSD-3). */')
print('window.SKY=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';')
