# Shutterdex

An animated digicam guide for people in Bangladesh: every fixed-lens digital camera Sony, Canon, Nikon, Fujifilm and Panasonic made, from 1996 to today. Each one shows its year, sensor and megapixels, and, when we found it for sale, which BD shop or Facebook group had it.

Built with Vite, React, TypeScript and GSAP.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production site in dist/ (deploy this folder)
```

## Pages

Each page has its own link (`#explore`, `#advisor`, ...), so the back button and shared links work. Every page change runs through an aperture transition (`src/components/Iris.tsx`). Old links (`#digicam`, `#dslr`, `#mirrorless`) go to the home page.

- **Home (Ring)**: a 3D ring of the hand-picked digicams, the brand marquee, five brand doors, and the "find your look" picker.
- **Every digicam**: all models with search and filters (brand, for sale in BD, status, era, sensor, look). Clicking a brand door opens this page filtered to that brand.
- **Advisor**: four questions (with an "I'm not sure" option), then three picks with reasons.
- **Compare**: any two digicams side by side.
- **Guide**: sensor sizes in plain words, real vs retro digicams, and the shops and groups we checked.

## Camera data

- `src/data/cameras.ts`: the hand-picked digicams with full details (zoom, best use, perks).
- `src/data/models.json`: every digicam model from the five brands (name, year, megapixels, sensor, body style). Built from `scripts/digicamdb-raw.json` by `npm run models` (Python). DSLRs, mirrorless cameras and other lens-swapping cameras are filtered out there.
- `src/data/sources.ts`: the Instagram shops and Facebook groups, and which cameras were seen in each, with prices only when the post showed one.

Status: hand-picked cameras are checked. For the long list, models before 2017 show as Discontinued and newer ones as "Not checked".

Cameras are drawn by body style (compact, slim, bridge, premium...) in code, so there are no photo files to manage.

## Deploy

Any static host works: Vercel, Netlify or GitHub Pages. Build command `npm run build`, output folder `dist`.
