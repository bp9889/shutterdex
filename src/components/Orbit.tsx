import { useEffect, useRef } from 'react';
import { type Camera, statusInfo, fullName } from '../data/cameras';
import { CameraArt } from './CameraArt';
import { isStill } from '../stillness';

const SPACING = 232; // px of ring per camera, so cameras never overlap
const SPIN_ZONE = 0.3; // the outer 20% on each side spins the ring; everywhere else it holds still
const MAX_SPEED = 0.05; // degrees per millisecond at the very edge: a full turn in about 7s
const IDLE_SPEED = 0.0025; // very slow drift while the cursor is elsewhere
const POP_RADIUS = 280; // px around the cursor where cameras swing out

export function Orbit({ cams, onOpen }: { cams: Camera[]; onOpen: (id: string) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const s = useRef({ inside: false, reset: false, nx: 0, px: 0, py: 0, angle: 0, vel: 0 });
  const radius = Math.round(Math.max(640, (cams.length * SPACING) / (2 * Math.PI)));

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      const root = stageRef.current;
      if (!root) return;
      const st = s.current;
      root.querySelectorAll<HTMLElement>('[data-cam]').forEach((el) => {
        let p = 0;
        if (st.inside) {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(st.px - (r.left + r.width / 2), st.py - (r.top + r.height / 2));
          p = Math.max(0, 1 - d / POP_RADIUS);
          p = p * p * (3 - 2 * p);
        }
        el.style.setProperty('--p', p.toFixed(3));
      });
    };

    const tick = (now: number) => {
      const st = s.current;
      const dt = Math.min(50, now - last);
      last = now;
      let target: number;
      if (st.inside) {
        const ax = Math.abs(st.nx);
        target = ax < SPIN_ZONE ? 0 : Math.sign(st.nx) * Math.pow((ax - SPIN_ZONE) / (0.5 - SPIN_ZONE), 1.3) * MAX_SPEED;
      } else {
        target = reduce || isStill() ? 0 : IDLE_SPEED;
      }
      // ease toward the target speed; stopping eases a little faster so the middle feels firm
      st.vel += (target - st.vel) * Math.min(1, dt / (target === 0 ? 220 : 380));
      if (target === 0 && Math.abs(st.vel) < 0.002) st.vel *= 0.85;
      if (target === 0 && Math.abs(st.vel) < 0.0002) st.vel = 0;
      st.angle = (st.angle + st.vel * dt) % 360;
      if (ringRef.current) ringRef.current.style.transform = `rotateY(${st.angle.toFixed(3)}deg)`;
      if (st.inside || st.reset) { measure(); st.reset = false; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const st = s.current;
    st.inside = true;
    st.px = e.clientX;
    st.py = e.clientY;
    const r = stageRef.current?.getBoundingClientRect();
    if (r) st.nx = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
  };
  const onLeave = () => { s.current.inside = false; s.current.reset = true; };

  return (
    <div className="orbit" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="orbit-scale">
        <div className="ring-tilt" style={{ transform: `translateZ(-${radius}px) rotateX(-8deg)` }}>
          <div className="ring-spin" ref={ringRef}>
            {cams.map((c, i) => {
              return (
                <div key={c.id} data-cam className="orb-item" style={{ transform: `rotateY(${(i * 360) / cams.length}deg) translateZ(${radius}px)` }}>
                  <button type="button" className="orb-hit" onClick={() => onOpen(c.id)} aria-label={`Open ${fullName(c)}`}>
                    <div className="orb-slot">
                      <div className="orb-pop">
                        <CameraArt cam={c} />
                        <span className="orb-tag">
                          <span className="dot" style={{ background: statusInfo[c.status].color }} />
                          {c.year} · {c.name}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="zones" aria-hidden="true"><span className="zone l">&lt;&lt; Hover here to spin</span><span className="zone r">Hover here to spin &gt;&gt;</span></div>
    </div>
  );
}
