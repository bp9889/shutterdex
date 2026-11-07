// Where cameras were sold in Bangladesh shops and groups (posts up to 5 Nov 2026). Past posts, not live stock.
// Raw notes: research/facebook-2026-11.md and research/instagram-2026-11.md
// Only model, price and date are kept. No seller names or numbers.

export interface Source {
  id: string;
  name: string;
  kind: 'instagram' | 'facebook';
  url: string;
  place: string;
  note: string;
  showsPrices: boolean;
}

export const sources: Source[] = [
  { id: 'fb-classic', name: 'Classic and Vintage Camera Collectors of Bangladesh', kind: 'facebook', url: 'https://www.facebook.com/groups/193225570698782/', place: 'Facebook group · 44K members', note: 'Mostly film cameras, plenty of digicams too. Good for "who has a W830" asks.', showsPrices: false },
  { id: 'fb-digicam', name: 'Digicam community BD', kind: 'facebook', url: 'https://www.facebook.com/groups/557469234037349/', place: 'Facebook group', note: 'Almost all digicams. Many sellers post a price.', showsPrices: true },
  { id: 'fb-hatt', name: 'Camera Hatt Bangladesh', kind: 'facebook', url: 'https://www.facebook.com/groups/1532644933714613/', place: 'Facebook group · 29.6K members', note: 'Mostly DSLRs and lenses, with the odd digicam. Prices in taka.', showsPrices: true },
  { id: 'ig-cache', name: 'The Analogue Cache', kind: 'instagram', url: 'https://www.instagram.com/analoguecache/', place: 'Dhaka · nationwide COD', note: '19K followers, since 2022. 10 to 15 day warranty, also rents cameras.', showsPrices: false },
  { id: 'ig-lensora', name: 'Lensora Cams', kind: 'instagram', url: 'https://www.instagram.com/lensora.cams/', place: 'Uttara, Dhaka · nationwide delivery', note: 'Tested cameras, 7 day exchange, pickup in Uttara.', showsPrices: false },
  { id: 'ig-shutter', name: 'Shutter Camera', kind: 'instagram', url: 'https://www.instagram.com/shuttercameraa/', place: 'Bangladesh', note: 'Lists the price on every post.', showsPrices: true },
  { id: 'ig-digitalcams', name: 'Digital Cams Bangladesh', kind: 'instagram', url: 'https://www.instagram.com/digitalcamsbd/', place: 'Dhaka', note: 'Sony Cyber-shot focused.', showsPrices: false },
  { id: 'ig-dokan', name: 'Camera Dokan', kind: 'instagram', url: 'https://www.instagram.com/camera.dokan/', place: 'Chattogram · COD all over BD', note: 'Budget Canon, Sony and Nikon digicams, own sample photos.', showsPrices: false },
  { id: 'ig-digicambd', name: 'DIGICAM BD', kind: 'instagram', url: 'https://www.instagram.com/digicambd/', place: 'Bangladesh', note: 'Some brand new old stock in pink and yellow.', showsPrices: false },
];

export interface Sighting { src: string; date: string; price?: number; note?: string; }

const s = (src: string, date: string, price?: number, note?: string): Sighting => ({ src, date, price, note });

/** camera id -> where it was seen. Dates are post dates (YYYY-MM-DD) or "2026-11" when the post had no date. */
export const sightings: Record<string, Sighting[]> = {
  // digicams already in the catalogue
  'sony-w830': [s('fb-digicam', '2026-11', 8500, 'battery and charger only'), s('fb-digicam', '2026-11', 10000, 'new battery and charger'), s('fb-classic', '2026-11'), s('ig-digitalcams', '2026-10-22')],
  'canon-g7x3': [s('fb-digicam', '2026-11', 120000, 'brand new, 18 month official warranty')],
  // digicams added from what BD shops and groups trade
  'sony-w800': [s('fb-hatt', '2026-11', 9000, '9.5/10'), s('fb-digicam', '2026-11'), s('fb-classic', '2026-11'), s('ig-digitalcams', '2026-08-20')],
  'sony-w630': [s('ig-digicambd', '2026-11-01', undefined, 'brand new old stock'), s('ig-digitalcams', '2026-08-29', undefined, 'pink'), s('fb-classic', '2026-11')],
  'sony-w570': [s('fb-hatt', '2026-11', 15500, 'pink, mint'), s('ig-dokan', '2026-11-02', undefined, 'booked'), s('fb-digicam', '2026-11')],
  'sony-w510': [s('fb-classic', '2026-11', undefined, 'pink, new'), s('ig-digicambd', '2026-10-26', undefined, 'pink, sold out')],
  'sony-w310': [s('ig-digitalcams', '2026-09-03'), s('fb-digicam', '2026-11')],
  'sony-w320': [s('ig-lensora', '2026-09-29', undefined, '9.75/10'), s('fb-classic', '2026-11', undefined, 'pink')],
  'sony-w690': [],
  'sony-h55': [s('fb-digicam', '2026-11', 13000, '10/10, asking'), s('ig-dokan', '2026-10-30')],
  'sony-w550': [s('fb-digicam', '2026-11', 5000, '9.5/10')],
  'sony-w290': [s('fb-digicam', '2026-11', 6500, 'fixed')],
  'sony-w50': [s('fb-digicam', '2026-11', 5500, 'slightly negotiable')],
  'sony-hx60v': [s('ig-digicambd', '2026-08-13', undefined, '10/10')],
  'canon-a3300': [s('ig-dokan', '2026-10-28'), s('ig-dokan', '2026-10-24', undefined, 'baby pink'), s('fb-digicam', '2026-11')],
  'canon-a3400': [s('ig-digicambd', '2026-09-12', undefined, '9.9/10'), s('ig-dokan', '2026-10-31'), s('fb-classic', '2026-11')],
  'canon-a2300': [s('ig-dokan', '2026-11-03', undefined, 'display has grain'), s('ig-dokan', '2026-10-27')],
  'canon-a2200': [s('ig-shutter', '2026-10-29', 6999, '9.9/10')],
  'canon-ixus285': [],
  'canon-ixus185': [s('fb-classic', '2026-11', undefined, 'red, sold out'), s('fb-digicam', '2026-11')],
  'canon-ixus85': [s('ig-shutter', '2026-10-18', 14999, 'brand new')],
  'canon-ixus310': [s('ig-shutter', '2026-03-04', 24999, '9.9/10')],
  'canon-sx730': [s('ig-cache', '2026-11-04', undefined, '9.9/10')],
  'canon-sx620': [s('ig-digicambd', '2026-10-27', undefined, 'sold')],
  'canon-sx600': [s('fb-digicam', '2026-11', 14000, 'shadow on screen')],
  'nikon-s3100': [s('ig-digicambd', '2026-10-22', undefined, 'yellow, brand new'), s('ig-digicambd', '2026-10-20', undefined, 'pink, brand new'), s('fb-classic', '2026-11', undefined, '10/10')],
  'nikon-s2800': [s('fb-digicam', '2026-11', undefined, '10/10'), s('fb-classic', '2026-11')],
  'nikon-s8200': [s('fb-digicam', '2026-11', 9500)],
  'nikon-s6000': [s('ig-shutter', '2026-10-17', 5999, '9.9/10')],
  'nikon-l25': [s('ig-shutter', '2026-10-19', 5999, '9/10')],
  'nikon-l18': [s('fb-digicam', '2026-11', 4000, 'fixed, card door loose')],
  'pana-tz20': [s('fb-digicam', '2026-11', 9500, 'flash not working')],
  'fuji-l55': [s('ig-shutter', '2026-10-27', 7999, 'purple')],
};

/** What people in the groups asked for most (Nov 2026). */
export const wanted = [
  'Sony W830, especially black',
  'Canon G7X Mark II or III, and a fair used price for it',
  'Canon IXUS 285 HS (ELPH 360)',
  'Sony W690, W570 in pink or purple, W510 under 8k',
  'Travel zooms under 12 to 13k: Sony WX500, WX350, Canon SX720, SX620',
  'Fujifilm X10, X20, X100 or X100S',
  'Any digicam for 3,000 to 4,000 taka',
];

export function priceSummary(list: Sighting[] | undefined): string | null {
  const prices = (list ?? []).map((x) => x.price).filter((p): p is number => typeof p === 'number');
  if (!prices.length) return null;
  const fmt = (n: number) => n.toLocaleString('en-US');
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const n = prices.length;
  return `BDT ${lo === hi ? fmt(lo) : `${fmt(lo)} to ${fmt(hi)}`} · from ${n} past ${n === 1 ? 'post' : 'posts'}, up to Nov 2026`;
}

export const sourceById = Object.fromEntries(sources.map((x) => [x.id, x])) as Record<string, Source>;
