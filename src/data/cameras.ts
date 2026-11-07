// Camera data, digicams only (fixed lens), from five brands.
// Two layers:
// 1. featured: hand-checked digicams with full details (below)
// 2. models.json: every digicam model from the five brands, built by scripts/build-models.py
//    from Digicamdb (name, year, megapixels, sensor). Featured cameras win over it.
// sources.ts has where each camera was seen for sale in BD.
import { type Sighting, sightings, priceSummary } from './sources';
import models from './models.json';

export const brands = ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic'] as const;
export type Brand = (typeof brands)[number];
export type Status = 'used' | 'prod' | 'unknown';
export type Look = 'flash' | 'warm' | 'travel' | 'sharp';
export type Kind = 'compact' | 'slim' | 'swivel' | 'superzoom' | 'premium' | 'rangefinder';

export interface Camera {
  id: string;
  brand: Brand;
  name: string;
  year: string;
  res: string;
  sensor: string;
  /** optical zoom or fixed lens; empty when not checked */
  zoom: string;
  status: Status;
  looks: Look[];
  /** fits a pocket */
  small: boolean;
  perks: string[];
  kind: Kind;
  body: string;
  trim: string;
  best: string;
  /** price summary from BD listings, empty when none were seen */
  price: string;
  featured: boolean;
  source?: string;
  /** recent BD listings from shops and groups (sources.ts) */
  seen: Sighting[];
}

type Featured = Omit<Camera, 'featured' | 'source' | 'seen' | 'price'>;
const F = (c: Featured) => c;

const featured: Featured[] = [
  F({ id: 'nikon-2500', brand: 'Nikon', name: 'Coolpix 2500', year: '2002', res: '2 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['warm'], kind: 'swivel', body: '#9AA3AD', trim: '#4A4F56', best: 'Very early, lo-fi digital look in a swivel body', small: true, perks: ['swivel lens body'] }),
  F({ id: 'canon-ixus40', brand: 'Canon', name: 'Digital IXUS 40', year: '2004', res: '4 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['warm', 'flash'], kind: 'compact', body: '#CDD0D4', trim: '#2B2E33', best: 'Warm skin tones in a small metal body', small: true, perks: ['metal body'] }),
  F({ id: 'fuji-f810', brand: 'Fujifilm', name: 'FinePix F810', year: '2004', res: '6 MP', sensor: 'Super CCD', zoom: '4x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#7E848C', trim: '#2B2E33', best: 'Collector favourite with a widescreen display', small: true, perks: ['widescreen display'] }),
  F({ id: 'canon-ixus700', brand: 'Canon', name: 'Digital IXUS 700', year: '2005', res: '7.1 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#DADCDF', trim: '#2B2E33', best: 'Classic warm Canon colour, sold as SD500 in some markets', small: true, perks: ['classic Canon colour'] }),
  F({ id: 'sony-t7', brand: 'Sony', name: 'Cyber-shot DSC-T7', year: '2005', res: '5 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash'], kind: 'slim', body: '#D6D7DA', trim: '#2B2E33', best: 'Very thin slider body, a Y2K icon', small: true, perks: ['very thin slider body'] }),
  F({ id: 'sony-t9', brand: 'Sony', name: 'Cyber-shot DSC-T9', year: '2005', res: '6 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash'], kind: 'slim', body: '#C7C9CD', trim: '#2B2E33', best: 'Punchy contrast and a bold flash for night photos', small: true, perks: ['slider body'] }),
  F({ id: 'fuji-f31fd', brand: 'Fujifilm', name: 'FinePix F31fd', year: '2006', res: '6.3 MP', sensor: 'Super CCD', zoom: '3x optical', status: 'used', looks: ['warm', 'sharp'], kind: 'compact', body: '#2B2C30', trim: '#2B2E33', best: 'Known for clean photos in low light', small: true, perks: ['clean in low light'] }),
  F({ id: 'sony-w55', brand: 'Sony', name: 'Cyber-shot DSC-W55', year: '2006', res: '7.2 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#E7B3C4', trim: '#2B2E33', best: 'Cool, crisp colour with strong direct flash', small: true, perks: ['strong flash'] }),
  F({ id: 'canon-ixus70', brand: 'Canon', name: 'Digital IXUS 70', year: '2007', res: '7.1 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['warm', 'flash'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Small, warm and easy, sold as SD1000 in some markets', small: true, perks: ['easy to use'] }),
  F({ id: 'sony-w80', brand: 'Sony', name: 'Cyber-shot DSC-W80', year: '2007', res: '7.2 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#2E2F34', trim: '#2B2E33', best: 'Everyday pocket camera of the late 2000s', small: true, perks: [] }),
  F({ id: 'canon-g9', brand: 'Canon', name: 'PowerShot G9', year: '2007', res: '12 MP', sensor: 'CCD', zoom: '6x optical', status: 'used', looks: ['warm', 'sharp'], kind: 'premium', body: '#2A2B2F', trim: '#2B2E33', best: 'Chunky enthusiast compact with real dials', small: false, perks: ['real dials'] }),
  F({ id: 'canon-a590', brand: 'Canon', name: 'PowerShot A590 IS', year: '2008', res: '8 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#8E9196', trim: '#2B2E33', best: 'Runs on AA batteries, easy to keep alive', small: true, perks: ['AA batteries'] }),
  F({ id: 'sony-w300', brand: 'Sony', name: 'Cyber-shot DSC-W300', year: '2008', res: '13.6 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#3A3B40', trim: '#2B2E33', best: 'Metal body, one of the higher end W models', small: true, perks: ['metal body'] }),
  F({ id: 'nikon-l22', brand: 'Nikon', name: 'Coolpix L22', year: '2010', res: '12 MP', sensor: 'CCD', zoom: '3.6x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#B23A48', trim: '#2B2E33', best: 'Simple AA battery camera, cheap to find', small: true, perks: ['AA batteries'] }),
  F({ id: 'canon-s95', brand: 'Canon', name: 'PowerShot S95', year: '2010', res: '10 MP', sensor: 'CCD', zoom: '3.8x optical', status: 'used', looks: ['warm', 'sharp'], kind: 'premium', body: '#1E1E20', trim: '#2B2E33', best: 'Bigger sensor in a pocket body', small: true, perks: ['bigger sensor'] }),
  F({ id: 'pana-fh27', brand: 'Panasonic', name: 'Lumix DMC-FH27', year: '2011', res: '16 MP', sensor: 'CCD', zoom: '8x optical', status: 'used', looks: ['travel'], kind: 'compact', body: '#A8312F', trim: '#2B2E33', best: 'Trips where you need real zoom, with a touchscreen', small: true, perks: ['touchscreen'] }),
  F({ id: 'sony-w650', brand: 'Sony', name: 'Cyber-shot DSC-W650', year: '2012', res: '16 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['travel', 'flash'], kind: 'compact', body: '#4D6EA8', trim: '#2B2E33', best: 'Late CCD compact, easy to find and use', small: true, perks: ['easy to find'] }),
  F({ id: 'sony-w830', brand: 'Sony', name: 'Cyber-shot DSC-W830', year: '2014', res: '20 MP', sensor: 'CCD', zoom: '8x optical', status: 'used', looks: ['travel', 'flash'], kind: 'compact', body: '#C8CBD0', trim: '#2B2E33', best: 'One of the last CCD pocket cameras', small: true, perks: ['8x zoom'] }),
  F({ id: 'sony-h300', brand: 'Sony', name: 'Cyber-shot DSC-H300', year: '2014', res: '20 MP', sensor: 'CCD', zoom: '35x optical', status: 'used', looks: ['travel'], kind: 'superzoom', body: '#232427', trim: '#2B2E33', best: 'Huge zoom for subjects far away', small: false, perks: ['35x zoom'] }),
  F({ id: 'nikon-a10', brand: 'Nikon', name: 'Coolpix A10', year: '2016', res: '16 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#B3302A', trim: '#2B2E33', best: 'A late CCD camera on AA batteries', small: true, perks: ['AA batteries'] }),
  F({ id: 'canon-g7x3', brand: 'Canon', name: 'PowerShot G7 X Mark III', year: '2019', res: '20 MP', sensor: '1 inch CMOS', zoom: '4.2x optical', status: 'prod', looks: ['sharp', 'travel'], kind: 'premium', body: '#1C1C1E', trim: '#2B2E33', best: 'Vlogging and sharp everyday photos', small: true, perks: ['1 inch sensor', 'flip screen'] }),
  F({ id: 'sony-zv1-2', brand: 'Sony', name: 'ZV-1 II', year: '2023', res: '20 MP', sensor: '1 inch CMOS', zoom: '18 to 50mm', status: 'prod', looks: ['sharp'], kind: 'premium', body: '#1B1B1D', trim: '#2B2E33', best: 'Vlogging with a wide lens', small: true, perks: ['wide lens for vlogs'] }),
  F({ id: 'fuji-x100vi', brand: 'Fujifilm', name: 'X100VI', year: '2024', res: '40 MP', sensor: 'APS-C', zoom: 'Fixed 23mm', status: 'prod', looks: ['sharp'], kind: 'rangefinder', body: '#CFD2D7', trim: '#1B1B1D', best: 'Street photos with built in film simulations', small: false, perks: ['film simulations', 'APS-C sensor'] }),
  F({ id: 'pana-tz99', brand: 'Panasonic', name: 'Lumix TZ99', year: '2024', res: '20 MP', sensor: '1/2.3 inch', zoom: '30x optical', status: 'prod', looks: ['travel'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Pocket travel zoom, sold as ZS99 in some markets', small: true, perks: ['30x zoom'] }),
  F({ id: 'canon-v1', brand: 'Canon', name: 'PowerShot V1', year: '2025', res: '22 MP', sensor: '1.4 inch', zoom: '16 to 50mm', status: 'prod', looks: ['sharp', 'travel'], kind: 'premium', body: '#202022', trim: '#2B2E33', best: 'Wide vlogging compact with a big sensor', small: true, perks: ['big sensor'] }),
  F({ id: 'fuji-xhalf', brand: 'Fujifilm', name: 'X half', year: '2025', res: '18 MP', sensor: '1 inch', zoom: 'Fixed 32mm', status: 'prod', looks: ['warm'], kind: 'rangefinder', body: '#C9CCD1', trim: '#3A3A3C', best: 'Film camera feel, vertical photos', small: true, perks: ['film camera feel'] }),
  F({ id: 'sony-w50', brand: 'Sony', name: 'Cyber-shot DSC-W50', year: '2006', res: '6 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'True early-2000s flash look on a small budget', small: true, perks: ['classic Y2K look'] }),
  F({ id: 'nikon-l18', brand: 'Nikon', name: 'Coolpix L18', year: '2008', res: '8 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#4D6EA8', trim: '#2B2E33', best: 'Cheapest working CCD camera people sell', small: true, perks: ['AA batteries'] }),
  F({ id: 'canon-ixus85', brand: 'Canon', name: 'Digital IXUS 85 IS', year: '2008', res: '10 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['warm', 'flash'], kind: 'compact', body: '#CDD0D4', trim: '#2B2E33', best: 'Slim metal Canon, sometimes found brand new', small: true, perks: ['metal body'] }),
  F({ id: 'sony-w290', brand: 'Sony', name: 'Cyber-shot DSC-W290', year: '2009', res: '12.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash', 'travel'], kind: 'compact', body: '#2E2F34', trim: '#2B2E33', best: 'Wide lens and 5x zoom in a metal body', small: true, perks: ['28mm wide lens'] }),
  F({ id: 'sony-w310', brand: 'Sony', name: 'Cyber-shot DSC-W310', year: '2010', res: '12.1 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Popular wide-angle Cyber-shot with soft flash', small: true, perks: ['28mm wide lens'] }),
  F({ id: 'sony-w320', brand: 'Sony', name: 'Cyber-shot DSC-W320', year: '2010', res: '14.1 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#E7B3C4', trim: '#2B2E33', best: 'Thin and light, often found in pink', small: true, perks: ['very light'] }),
  F({ id: 'sony-h55', brand: 'Sony', name: 'Cyber-shot DSC-H55', year: '2010', res: '14.1 MP', sensor: 'CCD', zoom: '10x optical', status: 'used', looks: ['travel'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Long zoom CCD for trips', small: false, perks: ['10x zoom', 'Sony G lens'] }),
  F({ id: 'nikon-s6000', brand: 'Nikon', name: 'Coolpix S6000', year: '2010', res: '14.2 MP', sensor: 'CCD', zoom: '7x optical', status: 'used', looks: ['travel', 'warm'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Slim body with a 7x wide zoom', small: true, perks: ['7x zoom'] }),
  F({ id: 'sony-w510', brand: 'Sony', name: 'Cyber-shot DSC-W510', year: '2011', res: '12.1 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#F0C0CC', trim: '#2B2E33', best: 'The pink Cyber-shot people ask for', small: true, perks: ['comes in pink'] }),
  F({ id: 'sony-w550', brand: 'Sony', name: 'Cyber-shot DSC-W550', year: '2011', res: '14.1 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Budget Cyber-shot that is easy to find', small: true, perks: [] }),
  F({ id: 'sony-w570', brand: 'Sony', name: 'Cyber-shot DSC-W570', year: '2011', res: '16.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#E7B3C4', trim: '#2B2E33', best: 'Sellers call it the most wanted Cyber-shot', small: true, perks: ['Zeiss lens', 'stabilised'] }),
  F({ id: 'canon-a2200', brand: 'Canon', name: 'PowerShot A2200', year: '2011', res: '14.1 MP', sensor: 'CCD', zoom: '4x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Plain, reliable Canon colour', small: true, perks: [] }),
  F({ id: 'canon-a3300', brand: 'Canon', name: 'PowerShot A3300 IS', year: '2011', res: '16 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['warm', 'flash'], kind: 'compact', body: '#F0C0CC', trim: '#2B2E33', best: 'Warm Canon CCD, often in baby pink', small: true, perks: ['stabilised'] }),
  F({ id: 'canon-ixus310', brand: 'Canon', name: 'IXUS 310 HS', year: '2011', res: '12.1 MP', sensor: 'CMOS', zoom: '4.4x optical', status: 'used', looks: ['sharp', 'warm'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Touchscreen IXUS that is good in low light', small: true, perks: ['touchscreen', 'f/2.0 lens'] }),
  F({ id: 'nikon-s3100', brand: 'Nikon', name: 'Coolpix S3100', year: '2011', res: '14 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#F2D35A', trim: '#2B2E33', best: 'Bright colours, still found brand new', small: true, perks: ['pink and yellow'] }),
  F({ id: 'nikon-s8200', brand: 'Nikon', name: 'Coolpix S8200', year: '2011', res: '16.1 MP', sensor: 'CMOS', zoom: '14x optical', status: 'used', looks: ['travel', 'sharp'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Pocket travel zoom with full HD video', small: true, perks: ['14x zoom', '1080p video'] }),
  F({ id: 'pana-tz20', brand: 'Panasonic', name: 'Lumix DMC-TZ20', year: '2011', res: '14.1 MP', sensor: 'CMOS', zoom: '16x optical', status: 'used', looks: ['travel'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Travel zoom with GPS, sold as ZS10 in some markets', small: true, perks: ['16x zoom', 'GPS'] }),
  F({ id: 'nikon-l25', brand: 'Nikon', name: 'Coolpix L25', year: '2012', res: '10.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Wide 28mm lens on AA batteries', small: true, perks: ['AA batteries'] }),
  F({ id: 'sony-w630', brand: 'Sony', name: 'Cyber-shot DSC-W630', year: '2012', res: '16.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#F0C0CC', trim: '#2B2E33', best: 'One of the most listed digicams in BD right now', small: true, perks: ['Zeiss lens'] }),
  F({ id: 'sony-w690', brand: 'Sony', name: 'Cyber-shot DSC-W690', year: '2012', res: '16.1 MP', sensor: 'CCD', zoom: '10x optical', status: 'used', looks: ['travel', 'flash'], kind: 'compact', body: '#2E2F34', trim: '#2B2E33', best: '10x zoom in a pocket CCD, often asked for', small: true, perks: ['10x zoom'] }),
  F({ id: 'canon-a2300', brand: 'Canon', name: 'PowerShot A2300', year: '2012', res: '16 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Shops call it most wanted, easy Canon colour', small: true, perks: [] }),
  F({ id: 'canon-a3400', brand: 'Canon', name: 'PowerShot A3400 IS', year: '2012', res: '16 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['warm', 'flash'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Touchscreen Canon CCD', small: true, perks: ['touchscreen', 'stabilised'] }),
  F({ id: 'fuji-l55', brand: 'Fujifilm', name: 'FinePix L55', year: '2012', res: '12 MP', sensor: 'CCD', zoom: '3x optical', status: 'used', looks: ['warm'], kind: 'compact', body: '#8E6BB0', trim: '#2B2E33', best: 'Fujifilm colours on a small budget', small: true, perks: ['Fujinon lens'] }),
  F({ id: 'canon-sx600', brand: 'Canon', name: 'PowerShot SX600 HS', year: '2014', res: '16 MP', sensor: 'CMOS', zoom: '18x optical', status: 'used', looks: ['travel'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Slim travel zoom with Wi-Fi', small: true, perks: ['18x zoom', 'Wi-Fi'] }),
  F({ id: 'sony-w800', brand: 'Sony', name: 'Cyber-shot DSC-W800', year: '2014', res: '20.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Easy to find and cheap, a common first digicam', small: true, perks: ['easy to find'] }),
  F({ id: 'sony-hx60v', brand: 'Sony', name: 'Cyber-shot DSC-HX60V', year: '2014', res: '20.4 MP', sensor: 'CMOS', zoom: '30x optical', status: 'used', looks: ['travel', 'sharp'], kind: 'compact', body: '#1E1F22', trim: '#2B2E33', best: 'Huge zoom that still fits a pocket', small: true, perks: ['30x zoom', 'GPS'] }),
  F({ id: 'nikon-s2800', brand: 'Nikon', name: 'Coolpix S2800', year: '2014', res: '20.1 MP', sensor: 'CCD', zoom: '5x optical', status: 'used', looks: ['flash'], kind: 'compact', body: '#C9CCD1', trim: '#2B2E33', best: 'Late CCD Nikon in many colours', small: true, perks: [] }),
  F({ id: 'canon-ixus285', brand: 'Canon', name: 'IXUS 285 HS', year: '2016', res: '20.2 MP', sensor: 'CMOS', zoom: '12x optical', status: 'used', looks: ['travel', 'sharp'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Small 12x zoom many buyers ask for, sold as ELPH 360 HS', small: true, perks: ['12x zoom', 'Wi-Fi'] }),
  F({ id: 'canon-sx620', brand: 'Canon', name: 'PowerShot SX620 HS', year: '2016', res: '20.2 MP', sensor: 'CMOS', zoom: '25x optical', status: 'used', looks: ['travel', 'sharp'], kind: 'compact', body: '#2A2B2F', trim: '#2B2E33', best: 'Slim 25x travel zoom', small: true, perks: ['25x zoom'] }),
  F({ id: 'canon-ixus185', brand: 'Canon', name: 'IXUS 185', year: '2017', res: '20 MP', sensor: 'CCD', zoom: '8x optical', status: 'used', looks: ['flash', 'warm'], kind: 'compact', body: '#B23A48', trim: '#2B2E33', best: 'One of the last CCD Canons, in bright red', small: true, perks: ['8x zoom'] }),
  F({ id: 'canon-sx730', brand: 'Canon', name: 'PowerShot SX730 HS', year: '2017', res: '20.3 MP', sensor: 'CMOS', zoom: '40x optical', status: 'used', looks: ['travel', 'sharp'], kind: 'compact', body: '#1E1F22', trim: '#2B2E33', best: '40x zoom with a flip-up selfie screen', small: true, perks: ['40x zoom', 'flip screen'] }),
];

// loose name match so "Cyber-shot DSC-W830" and "DSC-W830" count as one camera
const norm = (s: string) => s.toLowerCase()
  .replace(/digital|cyber-?shot|dsc-|dmc-|dc-|lumix|powershot|coolpix|finepix|\bis\b|\bhs\b/g, '')
  .replace(/[^a-z0-9]/g, '');
const featuredKeys = new Set(featured.map((c) => norm(c.brand + c.name)));

type Model = { id: string; brand: Brand; name: string; year: string; mp: string; sensor: string; kind: Kind; body: string; looks: Look[]; source: string };

const mp = (v: string) => (v ? `${Number(v).toFixed(1).replace(/\.0$/, '')} MP` : 'Not listed');

const basics: Camera[] = (models as Model[])
  .filter((m) => !featuredKeys.has(norm(m.brand + m.name)))
  .map((m) => {
    const y = Number(m.year);
    return {
      id: m.id, brand: m.brand, name: m.name, year: m.year || 'Unknown',
      res: mp(m.mp), sensor: m.sensor, zoom: '', status: (y && y < 2017 ? 'used' : 'unknown') as Status,
      looks: m.looks, small: m.kind !== 'superzoom', perks: [], kind: m.kind, body: m.body, trim: '#1B1C1F',
      best: '', price: '', featured: false, source: m.source, seen: [],
    };
  });

const withSightings = (c: Camera): Camera => {
  const seen = sightings[c.id] ?? [];
  const summary = priceSummary(seen);
  return { ...c, seen, price: summary ?? (seen.length ? 'Not mentioned, ask the shop' : '') };
};

const yearN = (c: Camera) => Number(c.year) || 9999;

// featured cameras borrow the exact sensor size and the spec page from the full list
const modelByKey = new Map((models as Model[]).map((m) => [norm(m.brand + m.name), m]));
const enrich = (c: Featured): Camera => {
  const m = modelByKey.get(norm(c.brand + c.name));
  const vague = /^(Super )?(CCD|CMOS)$/.test(c.sensor);
  return { ...c, sensor: m && vague && m.sensor !== 'Not listed' ? m.sensor : c.sensor, source: m?.source, featured: true, price: '', seen: [] };
};

export const cameras: Camera[] = [
  ...featured.map(enrich),
  ...basics,
].map(withSightings).sort((a, b) => yearN(a) - yearN(b) || a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

export const featuredCams = cameras.filter((c) => c.featured);
export const countByBrand = (b: Brand) => cameras.filter((c) => c.brand === b).length;

export const statusInfo: Record<Status, { label: string; color: string; note: string }> = {
  used: { label: 'Discontinued', color: 'var(--used)', note: 'No longer made. Used market only.' },
  prod: { label: 'Sold new', color: 'var(--prod)', note: 'Still sold new.' },
  unknown: { label: 'Not checked', color: 'var(--muted)', note: 'Recent model. We have not checked if it is still made.' },
};

export const brandInfo: Record<Brand, { line: string; pitch: string }> = {
  Sony: { line: 'Cyber-shot', pitch: 'W-series pocket cams that BD buyers hunt for, up to the RX100 and ZV-1.' },
  Canon: { line: 'PowerShot · IXUS', pitch: 'Warm colour IXUS slims, A-series AA cameras and the G7 X.' },
  Nikon: { line: 'Coolpix', pitch: 'From the swivel 2500 to the 125x zoom P1000.' },
  Fujifilm: { line: 'FinePix · X', pitch: 'Super CCD FinePix colour, rugged XP cams and the X100 line.' },
  Panasonic: { line: 'Lumix', pitch: 'Leica lenses on travel zooms like the TZ and LX series.' },
};

export const looks: { id: Look; name: string; desc: string; bg: string }[] = [
  { id: 'flash', name: 'Flash at a party', desc: 'Hard direct flash, bright faces, dark background.', bg: '#141018' },
  { id: 'warm', name: 'Warm CCD glow', desc: 'Soft, slightly warm colour early sensors are loved for.', bg: '#C9773E' },
  { id: 'travel', name: 'Zoom for trips', desc: 'Optical zoom, so far things stay sharp instead of cropped.', bg: '#AFC4DB' },
  { id: 'sharp', name: 'Sharp and clean', desc: 'Bigger sensors, sharper detail and cleaner night shots.', bg: '#141B2B' },
];

export function era(c: Camera): string {
  const y = Number(c.year);
  if (!y) return 'Unknown';
  if (y < 2000) return '1990s';
  if (y < 2010) return '2000s';
  if (y < 2020) return '2010s';
  return '2020s';
}

export function sensorType(c: Camera): 'CCD' | 'CMOS' | 'Unknown' {
  if (c.sensor.includes('CCD')) return 'CCD';
  if (c.sensor.includes('CMOS')) return 'CMOS';
  return 'Unknown';
}

export const fullName = (c: Camera) => `${c.brand} ${c.name}`;
