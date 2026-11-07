import { useEffect, useRef } from 'react';
import { cameras } from '../data/cameras';
import { isStill } from '../stillness';

/* The curved wall: every model name on one surface that spans the whole page, behind the content.
   It faces you in the middle (very faint) and bends toward you at the edges (brighter), so the sides
   and the middle are one surface. Names drift and move with scroll, the row level with the cursor
   lights up, cyan names have been sold by BD shops. Page changes can kick it with `wallKick`. */

export const wallFx = { turn: 0, rush: 0 };

const short: Record<string, string> = { Fujifilm: 'Fuji', Panasonic: 'Lumix' };
const label = (brand: string, name: string, year: string) => {
  const n = name.replace(/^(Cyber-shot DSC-|Cyber-shot |Lumix DMC-|Lumix DC-|PowerShot |Coolpix |FinePix |Digital )/, '');
  const toks = n.split(' ');
  let s = toks[0];
  for (const t of toks.slice(1)) { if (s.length + 1 + t.length <= 13 && !['Zoom', 'HD', 'EXR', 'Real'].includes(t)) s += ` ${t}`; else break; }
  return `${short[brand] ?? brand} ${s} · ${year}`;
};

// stable shuffle so the wall looks the same on every visit
const names = cameras
  .map((c, i) => ({ t: label(c.brand, c.name, c.year), bd: c.seen.length > 0, k: (i * 2654435761) % 4294967296 }))
  .sort((a, b) => a.k - b.k);

const PER = 90;
const LH = 25;
const CW = 172;

export function NameWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current!;
    const inner = innerRef.current!;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    type Col = { ins: HTMLElement[]; hot: HTMLElement; dir: number; sp: number; dr: number; acc: number };
    let cols: Col[] = [];

    const build = () => {
      const W = window.innerWidth;
      const n = Math.ceil(W / CW) + 2;
      const x0 = (W - n * CW) / 2;
      inner.textContent = '';
      cols = Array.from({ length: n }, (_, i) => {
        const list = names.filter((_, j) => j % n === i).slice(0, PER);
        const rows = list.map((x) => `<div${x.bd ? ' class="bd"' : ''}>${x.t}</div>`).join('');
        const cx = x0 + i * CW + CW / 2;
        const u = (cx - W / 2) / (W / 2); // -1 at the left edge, 1 at the right
        const au = Math.min(1, Math.abs(u));
        const el = document.createElement('div');
        el.className = 'wcol';
        el.style.left = `${x0 + i * CW + 10}px`;
        el.style.width = `${CW - 30}px`;
        el.style.transform = `rotateY(${(-u * 26).toFixed(2)}deg) translateZ(${(au * au * 80).toFixed(0)}px)`;
        el.style.textAlign = u < 0 ? 'right' : 'left';
        el.style.opacity = (0.09 + 0.38 * Math.pow(au, 1.6)).toFixed(3);
        el.innerHTML = `<div class="wlayer dim"><div class="win">${rows}${rows}</div></div><div class="wlayer hot"><div class="win">${rows}${rows}</div></div>`;
        inner.append(el);
        return { ins: [...el.querySelectorAll<HTMLElement>('.win')], hot: el.querySelector<HTMLElement>('.wlayer.hot')!, dir: i % 2 ? 1 : -1, sp: 0.12 + au * 0.16, dr: 3 + au * 5, acc: 0 };
      });
    };
    build();

    let my = -999;
    let width = window.innerWidth;
    const onMove = (e: PointerEvent) => { my = e.clientY; };
    const onResize = () => { if (window.innerWidth !== width) { width = window.innerWidth; build(); } };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    let raf = 0;
    let last = performance.now();
    const loopH = LH * PER;
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const t = now / 1000;
      // reduced motion or paused: the wall holds still (no drift, no scroll coupling, no rush)
      const calm = reduce || isStill();
      const y = calm ? 0 : window.scrollY;
      inner.style.transform = `rotateY(${wallFx.turn.toFixed(3)}deg)`;
      const top = inner.getBoundingClientRect().top;
      for (const c of cols) {
        if (!calm) c.acc += wallFx.rush * (dt / 1000) * 900;
        const off = c.dir * (y * c.sp + (calm ? 0 : t * c.dr) + c.acc);
        const o = ((off % loopH) + loopH) % loopH;
        const tr = `translate3d(0, ${-o.toFixed(1)}px, 0)`;
        c.ins[0].style.transform = tr;
        c.ins[1].style.transform = tr;
        c.hot.style.setProperty('--hy', `${(my - top).toFixed(0)}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    // pause when the tab is hidden
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);
    wall.dataset.ready = '1';

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <div className="atmos" aria-hidden="true" />
      <div className="wall" ref={wallRef} aria-hidden="true"><div className="wall-in" ref={innerRef} /></div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
