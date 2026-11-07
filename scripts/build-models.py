"""Turn the raw Digicamdb listing (scripts/digicamdb-raw.json) into src/data/models.json.
Keeps only fixed-lens digital cameras (digicams) from Sony, Canon, Nikon, Fujifilm and Panasonic.
Usage: python scripts/build-models.py"""
import json, math, re, zlib
from pathlib import Path

root = Path(__file__).resolve().parent.parent
raw = json.loads((root / 'scripts' / 'digicamdb-raw.json').read_text(encoding='utf-8'))
BRAND = {'sony': 'Sony', 'canon': 'Canon', 'nikon': 'Nikon', 'fujifilm': 'Fujifilm', 'panasonic': 'Panasonic'}

def is_digicam(b, n):
    if b == 'sony':
        if 'Mavica' in n: return True
        if n.startswith('Cyber-shot'): return not re.search(r'QX1\b', n)  # QX1 takes E-mount lenses
        return bool(re.match(r'(ZV-1|RX1)', n))
    if b == 'canon':
        return bool(re.match(r'(PowerShot|Digital IXUS|IXUS|ELPH)', n))
    if b == 'nikon':
        return n.startswith('Coolpix')
    if b == 'fujifilm':
        if re.search(r'S\d Pro|IS Pro|S3 Pro|S5 Pro|S1 Pro|S2 Pro', n): return False
        if n.startswith(('FinePix', 'Bigjob', 'MX-', 'DS-', 'Digital Q', 'XP')): return True
        return bool(re.fullmatch(r'X100\w*|X10|X20|X30|X70|XF1|XF10|XQ1|XQ2|X-S1', n))
    if b == 'panasonic':
        if n.startswith(('D-snap', 'PV')): return True
        m = re.match(r'Lumix (DMC|DC)-([A-Z]+)', n)
        if not m: return False
        pre, ser = m.groups()
        if ser in ('G', 'GH', 'GF', 'GX', 'GM', 'BS', 'BGH', 'L'): return False
        if pre == 'DC' and ser == 'S': return False
        return True
    return False

SIZES = [(4.54, 3.42, '1/3.2"'), (4.8, 3.6, '1/3"'), (5.37, 4.04, '1/2.7"'), (5.76, 4.29, '1/2.5"'), (6.17, 4.55, '1/2.3"'),
         (6.4, 4.8, '1/2"'), (7.18, 5.32, '1/1.8"'), (7.53, 5.64, '1/1.7"'), (8.8, 6.6, '2/3"'), (13.2, 8.8, '1"'),
         (17.3, 13.0, 'Four Thirds'), (18.7, 14.0, '1.5"'), (22.3, 14.9, 'APS-C'), (23.5, 15.6, 'APS-C'), (35.9, 23.9, 'Full frame')]

def sensor_label(text):
    """'1/2.3" (~ 6.16 x 4.62 mm) CCD' or '23.5 x 15.6 mm CMOS' -> ('1/2.3" CCD', diagonal mm)"""
    if not text: return 'Not listed', None
    t = 'CCD' if 'CCD' in text else ('CMOS' if 'CMOS' in text else '')
    m = re.search(r'([\d.]+) x ([\d.]+) mm', text)
    w, h = (float(m.group(1)), float(m.group(2))) if m else (None, None)
    inch = re.match(r'([\d/.]+")', text)
    if inch: return f'{inch.group(1)} {t}'.strip(), math.hypot(w, h) if w else None
    if not w: return t or 'Not listed', None
    d = math.hypot(w, h)
    best = min(SIZES, key=lambda s: abs(math.hypot(s[0], s[1]) - d))
    lab = best[2] if abs(math.hypot(best[0], best[1]) - d) / d < 0.05 else f'{w:g} x {h:g} mm'
    return f'{lab} {t}'.strip(), d

def kind_of(b, n, d):
    s = n.replace('Cyber-shot ', '').replace('DSC-', '')
    if b == 'sony':
        if re.match(r'RX10\b|R1\b|H\d|HX(1|100V|200V|300|350|400V?)\b', s): return 'superzoom'
        if re.match(r'RX1|RX100|ZV-1', s): return 'premium'
        if re.match(r'(T|TX|TF|N|G|U)\d', s): return 'slim'
        if re.match(r'F7|F8', s): return 'swivel'
    if b == 'canon':
        s = n.replace('PowerShot ', '')
        if re.match(r'SX(1|10|20|30|40|50|60|70|4\d\d|5\d\d)\b|S[1235] IS|Pro', s): return 'superzoom'
        if re.match(r'G\d|S(90|95|1[0-2]0|200)\b|V\d', s): return 'premium'
        if re.match(r'(Digital IXUS|IXUS|ELPH|SD|Elph)', s): return 'slim'
    if b == 'nikon':
        s = n.replace('Coolpix ', '')
        if re.match(r'P(80|90|100|5\d\d|6\d\d|9\d\d|1000)\b|B[5-7]00|L(1[0-2]0|3[1-4]0|8[1-4]0)\b', s): return 'superzoom'
        if re.match(r'P(7\d00|3[0-4]0|6000|5000|5100)\b|A\b|A$', s): return 'premium'
        if re.match(r'(9[05]0|99[05]|2500|3500|4500|S10)\b', s): return 'swivel'
        if s.startswith('S'): return 'slim'
    if b == 'fujifilm':
        s = n.replace('FinePix ', '')
        if s.startswith('X100') or s == 'X70': return 'rangefinder'
        if re.match(r'(X10|X20|X30|XF1|XF10|XQ)', s): return 'premium'
        if re.match(r'(S\d|HS|X-S1|SL)', s): return 'superzoom'
        if re.match(r'(Z|T)\d', s): return 'slim'
    if b == 'panasonic':
        s = re.sub(r'Lumix (DMC|DC)-', '', n)
        if s.startswith('FZ'): return 'superzoom'
        if re.match(r'(LX|LF|LC1\b)', s): return 'premium'
        if re.match(r'(FX|FS|FP|XS|SZ)', s): return 'slim'
    if d and d > 10: return 'premium'
    return 'compact'

BODIES = {'compact': ['#C8CCD2', '#9AA0A8', '#2A2C30', '#B9B2A6', '#3E4A62'],
          'slim': ['#CDD0D4', '#2A2C30', '#8E3A3A', '#3E5C8A', '#C9A9B6', '#B5B9BF'],
          'superzoom': ['#1F2023', '#2A2C30'], 'premium': ['#1F2023', '#2A2C30', '#B9BDC3'],
          'rangefinder': ['#B9BDC3', '#1F2023'], 'swivel': ['#9AA3AD', '#7E848C']}

out, seen = [], set()
for b, rows in raw.items():
    for full, slug, year, mp, sensor_text in rows:
        n = full[len(BRAND[b]) + 1:] if full.startswith(BRAND[b]) else full
        n = n.strip()
        if not is_digicam(b, n): continue
        cid = slug.replace('_', '-')
        if cid in seen: continue
        seen.add(cid)
        sensor, d = sensor_label(sensor_text)
        k = kind_of(b, n, d)
        y = int(year) if year.isdigit() else 0
        looks = []
        if 'CCD' in sensor: looks.append('warm')
        if k in ('compact', 'slim', 'swivel') and y and y <= 2013: looks.append('flash')
        if k == 'superzoom' or re.search(r'(HX|WX\d{3}|SX\d|TZ|ZS|S9\d{3}|S6\d{3}|F[67]\d0|XP1\d0)', n): looks.append('travel')
        if d and d >= 9: looks.append('sharp')
        h_ = zlib.crc32(cid.encode())
        pal = BODIES[k]
        out.append({'id': cid, 'brand': BRAND[b], 'name': n, 'year': year or '', 'mp': mp, 'sensor': sensor,
                    'kind': k, 'body': pal[h_ % len(pal)], 'looks': looks, 'source': f'https://www.digicamdb.com/specs/{slug}/'})

out.sort(key=lambda m: (m['brand'], m['year'], m['name']))
(root / 'src' / 'data' / 'models.json').write_text(json.dumps(out, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
from collections import Counter
print(len(out), Counter(m['brand'] for m in out), Counter(m['kind'] for m in out))
