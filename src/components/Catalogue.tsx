import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { type Brand, type Camera, type Look, type Status, brands, era, sensorType, statusInfo, looks, fullName } from '../data/cameras';
import { sourceById } from '../data/sources';
import { CameraArt } from './CameraArt';
import { useLiquidPill } from '../liquid';


const PAGE = 60;

/** A row of choices with the liquid glass pill sitting on the chosen one. */
function Seg<V extends string>({ value, opts, onPick }: { value: V; opts: [V, string][]; onPick: (v: V) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLiquidPill(ref, 'button', 'button[aria-pressed="true"]');
  return (
    <div className="seg" ref={ref}>
      {opts.map(([v, label]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)}>{label}</button>
      ))}
    </div>
  );
}

interface Props {
  cams: Camera[];
  look: Look | 'all';
  setLook: (l: Look | 'all') => void;
  brand: Brand | 'all';
  setBrand: (b: Brand | 'all') => void;
  onOpen: (id: string) => void;
}

/** "Shutter Camera, Camera Dokan +1" */
const shopNames = (c: Camera) => {
  const names = [...new Set(c.seen.map((x) => sourceById[x.src]?.name).filter(Boolean))];
  return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
};

export function Catalogue({ cams, look, setLook, brand, setBrand, onOpen }: Props) {
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [eraF, setEra] = useState('all');
  const [sensor, setSensor] = useState<'all' | 'CCD' | 'CMOS'>('all');
  const [q, setQ] = useState('');
  const [forSale, setForSale] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const gridRef = useRef<HTMLDivElement>(null);
  const reveal = useRef(false);

  // a filter click: show the new set with a short reveal. Typing in search updates instantly (no motion on every key).
  const withReveal = <T,>(fn: (v: T) => void) => (v: T) => {
    reveal.current = true;
    setShown(PAGE);
    fn(v);
  };
  const typed = (v: string) => { setShown(PAGE); setQ(v); };

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/\s+/g, ' ');
    return cams.filter((c) =>
      (brand === 'all' || c.brand === brand) &&
      (status === 'all' || c.status === status) &&
      (eraF === 'all' || era(c) === eraF) &&
      (!forSale || c.seen.length > 0) &&
      (sensor === 'all' || sensorType(c) === sensor) &&
      (look === 'all' || c.looks.includes(look)) &&
      (!needle || `${fullName(c)} ${c.year} ${c.sensor}`.toLowerCase().includes(needle) || fullName(c).toLowerCase().replace(/[^a-z0-9]/g, '').includes(needle.replace(/[^a-z0-9]/g, ''))));
  }, [cams, brand, status, eraF, sensor, look, q, forSale]);
  const visible = matches.slice(0, shown);
  const brandTotal = brand === 'all' ? cams.length : cams.filter((c) => c.brand === brand).length;

  // New set in: the cards you can see rise a few pixels and fade in, one after another, about 0.4s in all.
  // Nothing slides across the grid, so cards never fly over each other. Cards off screen just appear.
  useLayoutEffect(() => {
    if (!reveal.current) return;
    reveal.current = false;
    const grid = gridRef.current;
    if (!grid || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const bottom = window.innerHeight;
    const cards = [...grid.querySelectorAll<HTMLElement>('.card')].filter((c) => c.getBoundingClientRect().top < bottom).slice(0, 20);
    gsap.killTweensOf(cards);
    gsap.set(cards, { transition: 'none' }); // the card's own hover transition would fight the tween
    gsap.fromTo(cards, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'uiOut', stagger: 0.025, clearProps: 'opacity,visibility,transform,transition' });
  }, [matches]);

  const seg = <V extends string>(value: V, set: (v: V) => void, opts: [V, string][]) => (
    <Seg value={value} opts={opts} onPick={(v) => withReveal(set)(v)} />
  );

  return (
    <section id="catalogue" className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="filters">
          <div className="filter-row">
            <label className="filter-label" htmlFor="cat-search">Search</label>
            <input id="cat-search" className="search" type="search" placeholder="Try W830, IXUS 70, G7 X, X100, 2008" value={q} onChange={(e) => typed(e.target.value)} />
            <span className="count" aria-live="polite">{matches.length.toLocaleString('en-US')} of {brandTotal.toLocaleString('en-US')}</span>
          </div>
          <div className="filter-row"><span className="filter-label">Brand</span>
            {seg<Brand | 'all'>(brand, setBrand, [['all', 'All five'], ...brands.map((b) => [b, b] as [Brand, string])])}
          </div>
          <div className="filter-row"><span className="filter-label">In BD</span>
            {seg<'all' | 'sale'>(forSale ? 'sale' : 'all', (v) => setForSale(v === 'sale'), [['all', 'Every model'], ['sale', 'Sold in BD shops']])}
          </div>
          <div className="filter-row"><span className="filter-label">Status</span>
            {seg<Status | 'all'>(status, setStatus, [['all', 'All'], ['used', statusInfo.used.label], ['prod', statusInfo.prod.label], ['unknown', statusInfo.unknown.label]])}
          </div>
          <div className="filter-row"><span className="filter-label">Era</span>
            {seg(eraF, setEra, [['all', 'All'], ['1990s', '1990s'], ['2000s', '2000s'], ['2010s', '2010s'], ['2020s', '2020s']])}
          </div>
          <div className="filter-row"><span className="filter-label">Sensor</span>{seg(sensor, setSensor, [['all', 'All'], ['CCD', 'CCD'], ['CMOS', 'CMOS']])}</div>
          <div className="filter-row"><span className="filter-label">Look</span>
            {seg<Look | 'all'>(look, setLook, [['all', 'Any'], ...looks.map((l) => [l.id, l.name] as [Look, string])])}
          </div>
        </div>

        <div className="cat-grid" ref={gridRef}>
          {visible.map((c) => (
            <button key={c.id} type="button" className="card" onClick={() => onOpen(c.id)} aria-label={`Open ${fullName(c)}`} data-flip-id={c.id}>
              <CameraArt cam={c} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span className="card-year">{c.year}</span>
                <span className="chip" style={{ background: statusInfo[c.status].color }}>{statusInfo[c.status].label}</span>
              </div>
              <div className="card-name">{fullName(c)}</div>
              <div className="card-specs">{[c.res, c.sensor, c.zoom].filter((x) => x && x !== 'Not listed').join(' · ')}</div>
              {c.seen.length > 0 && (
                <div className="card-seen">
                  <span className="dot" style={{ background: 'var(--accent)' }} />
                  <span>Sold by {shopNames(c)}{c.seen.some((x) => x.price) ? ` · was BDT ${Math.min(...c.seen.filter((x) => x.price).map((x) => x.price!)).toLocaleString('en-US')}` : ''} · check stock</span>
                </div>
              )}
            </button>
          ))}
        </div>
        {matches.length === 0 && <div className="empty">No camera matches all of those. Clear a filter or try another search.</div>}
        {matches.length > shown && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button type="button" className="btn" onClick={() => setShown((s) => s + PAGE)}>Show {Math.min(PAGE, matches.length - shown)} more</button>
          </div>
        )}
      </div>
    </section>
  );
}
