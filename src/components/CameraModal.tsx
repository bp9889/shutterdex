import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { type Camera, looks, statusInfo } from '../data/cameras';
import { sourceById } from '../data/sources';
import { Camera3D } from './Camera3D';

interface Props {
  cams: Camera[];
  id: string;
  onClose: () => void;
  onChange: (id: string) => void;
  onCompare: (id: string) => void;
}

export function CameraModal({ cams, id, onClose, onChange, onCompare }: Props) {
  const idx = Math.max(0, cams.findIndex((c) => c.id === id));
  const cam = cams[idx];
  const s = statusInfo[cam.status];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = (d: number) => onChange(cams[(idx + d + cams.length) % cams.length].id);

  // open: fade the panel in, focus the close button, give focus back on close
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); before?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${cam.brand} ${cam.name}`}>
      <button type="button" className="backdrop" aria-label="Close" onClick={onClose} />
      <div className="panel" ref={panelRef}>
        <div className="panel-stage">
          <Camera3D cam={cam} />
          <p className="credit">3D model of a {cam.kind === 'superzoom' ? 'bridge camera' : cam.kind === 'slim' ? 'slim compact' : cam.kind === 'premium' ? 'premium compact' : cam.kind === 'rangefinder' ? 'rangefinder-style compact' : cam.kind === 'swivel' ? 'swivel compact' : 'compact'} in its colour · {String(idx + 1).padStart(2, '0')} / {cams.length.toLocaleString('en-US')}</p>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <p className="eyebrow" style={{ color: 'var(--muted)', margin: 0 }}>{cam.brand} · {cam.year}</p>
            <button type="button" className="icon-btn" ref={closeRef} onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <h2 className="disp" style={{ margin: 0, fontSize: 'clamp(30px, 3.6vw, 50px)', lineHeight: 0.98, textTransform: 'uppercase' }}>
            <span className="chrome">{cam.name}</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span className="chip" style={{ background: s.color }}>{s.label}</span>
            <span style={{ fontSize: 13, color: 'var(--soft)' }}>{s.note}</span>
          </div>
          <div className="specs">
            <div className="spec"><div className="k">RESOLUTION</div><div className="v disp">{cam.res}</div></div>
            <div className="spec"><div className="k">SENSOR</div><div className="v disp">{cam.sensor}</div></div>
            {cam.zoom && <div className="spec"><div className="k">LENS</div><div className="v disp">{cam.zoom}</div></div>}
            <div className="spec"><div className="k">RELEASED</div><div className="v disp">{cam.year}</div></div>
          </div>
          <div className="facts">
            {cam.best && <div><span className="k">BEST FOR</span>{cam.best}</div>}
            {cam.looks.length > 0 && <div><span className="k">GOOD FOR</span>{cam.looks.map((l) => looks.find((x) => x.id === l)!.name.toLowerCase()).join(', ')}</div>}
            {cam.price && <div><span className="k">PAST PRICE</span>{cam.price}</div>}
            {cam.perks.length > 0 && <div><span className="k">STANDS OUT</span>{cam.perks.join(', ')}</div>}
            {cam.seen.length > 0 && (
              <div className="seen">
                <span className="k">SOLD HERE BEFORE · CHECK STOCK WITH THEM</span>
                <p className="seen-note">These shops and groups have sold this model. That doesn't mean they have one now, so message them to ask.</p>
                <ul>
                  {cam.seen.slice(0, 5).map((x, i) => {
                    const src = sourceById[x.src];
                    return (
                      <li key={i}>
                        <a href={src.url} target="_blank" rel="noreferrer">{src.name}</a>
                        <span className="seen-meta">{x.price ? `Sold for BDT ${x.price.toLocaleString('en-US')}` : 'Price not mentioned'}{x.note ? ` · ${x.note}` : ''} · {x.date.length > 7 ? new Date(x.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Nov 2026'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {cam.source && <div><span className="k">FULL SPECS</span><a href={cam.source} target="_blank" rel="noreferrer">Digicamdb page</a></div>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button type="button" className="btn" onClick={() => go(-1)}>Previous</button>
            <button type="button" className="btn" onClick={() => onCompare(cam.id)}>Compare this</button>
            <button type="button" className="btn btn-main" onClick={() => go(1)}>Next camera</button>
          </div>
        </div>
      </div>
    </div>
  );
}
