// Liquid pill: one piece of glass that flows to whatever you point at inside a group of links or
// buttons, stretching a little while it travels and settling on a spring, like the tab bar on iOS.
// When the pointer leaves, it slides back to the current item (aria-current / aria-pressed).
// Only transform, width and height of one small element change, and the loop sleeps when settled.
import { useEffect, type RefObject } from 'react';

const K = 260; // spring stiffness
const D = 24;  // spring damping

export function useLiquidPill(ref: RefObject<HTMLElement>, item: string, active: string) {
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    host.classList.add('liquid-host');
    const pill = document.createElement('span');
    pill.className = 'glass lens liquid-pill';
    pill.setAttribute('aria-hidden', 'true');
    host.prepend(pill);

    const s = { x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0, tx: 0, ty: 0, tw: 0, th: 0, on: false };
    let raf = 0;
    let last = 0;
    let first = true;

    const aim = (el: HTMLElement | null) => {
      if (!el) { s.on = false; pill.classList.remove('on'); return; }
      s.tx = el.offsetLeft; s.ty = el.offsetTop; s.tw = el.offsetWidth; s.th = el.offsetHeight;
      if (first || !s.on) { s.x = s.tx; s.y = s.ty; s.w = s.tw; s.h = s.th; s.vx = s.vy = s.vw = s.vh = 0; first = false; }
      s.on = true;
      pill.classList.add('on');
      wake();
    };
    const home = () => aim(host.querySelector<HTMLElement>(active));

    const draw = () => {
      const stretch = Math.min(0.14, Math.abs(s.vx) / 4500);
      pill.style.width = `${s.w.toFixed(1)}px`;
      pill.style.height = `${s.h.toFixed(1)}px`;
      pill.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.6).toFixed(3)})`;
    };
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      if (reduce) { s.x = s.tx; s.y = s.ty; s.w = s.tw; s.h = s.th; s.vx = s.vy = s.vw = s.vh = 0; } else {
        s.vx += (K * (s.tx - s.x) - D * s.vx) * dt; s.x += s.vx * dt;
        s.vy += (K * (s.ty - s.y) - D * s.vy) * dt; s.y += s.vy * dt;
        s.vw += (K * (s.tw - s.w) - D * s.vw) * dt; s.w += s.vw * dt;
        s.vh += (K * (s.th - s.h) - D * s.vh) * dt; s.h += s.vh * dt;
      }
      draw();
      const settled = Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(s.tw - s.w) + Math.abs(s.th - s.h) < 0.5
        && Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vw) + Math.abs(s.vh) < 1;
      if (settled) { s.x = s.tx; s.y = s.ty; s.w = s.tw; s.h = s.th; draw(); raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }

    const over = (e: Event) => {
      const el = (e.target as Element).closest<HTMLElement>(item);
      if (el && host.contains(el)) aim(el);
    };
    const leave = () => home();
    const focusOut = (e: FocusEvent) => { if (!host.contains(e.relatedTarget as Node)) home(); };
    host.addEventListener('pointerover', over);
    host.addEventListener('focusin', over);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('focusout', focusOut);

    // the current item changed (a click, or a new page): settle there
    const mo = new MutationObserver(() => { if (!host.matches(':hover')) home(); });
    mo.observe(host, { subtree: true, attributes: true, attributeFilter: ['aria-current', 'aria-pressed'] });
    // layout changed (resize, wrapping): jump to the right place without animating
    const ro = new ResizeObserver(() => { first = true; home(); });
    ro.observe(host);

    home();
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      host.removeEventListener('pointerover', over);
      host.removeEventListener('focusin', over);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('focusout', focusOut);
      pill.remove();
      host.classList.remove('liquid-host');
    };
  }, [ref, item, active]);
}
