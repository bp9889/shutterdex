import { type Look, cameras, looks } from '../data/cameras';
import { sources, wanted } from '../data/sources';
import type { Route } from '../router';
import { useRef } from 'react';
import { useStill } from '../stillness';
import { useLiquidPill } from '../liquid';

const navItems: [Route, string][] = [
  ['home', 'Ring'], ['explore', 'Every digicam'], ['advisor', 'Advisor'], ['compare', 'Compare'], ['guide', 'Guide'],
];

export function Nav({ route }: { route: Route }) {
  const [still, setStill] = useStill();
  const links = useRef<HTMLElement>(null);
  useLiquidPill(links, 'a', 'a[aria-current="page"]');
  return (
    <header className="nav">
      <a className="skip-link" href="#content" onClick={(e) => { e.preventDefault(); document.getElementById('content')?.focus(); }}>Skip to content</a>
      <div className="wrap nav-island">
        <div className="nav-in">
          <a href="#home" className="logo disp"><span className="logo-mark" aria-hidden="true" />shutterdex</a>
          <nav aria-label="Main" className="nav-links" ref={links}>
            {navItems.map(([r, label]) => (
              <a key={r} href={`#${r}`} aria-current={route === r ? 'page' : undefined}>{label}</a>
            ))}
          </nav>
          <button type="button" className="motion-toggle" aria-pressed={still} onClick={() => setStill(!still)} title={still ? 'Play background motion' : 'Pause background motion'}>
            <span className="sr">{still ? 'Play background motion' : 'Pause background motion'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {still ? <path d="M7 5l12 7-12 7z" /> : <><path d="M8 5v14" /><path d="M16 5v14" /></>}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function Scene({ id }: { id: Look }) {
  if (id === 'flash') return (
    <>
      <div className="burst" style={{ position: 'absolute', left: '50%', top: '30%', width: 120, height: 120, marginLeft: -60, borderRadius: '50%', background: 'radial-gradient(circle,#FFFFFF 0%,rgba(255,255,255,.55) 35%,rgba(255,255,255,0) 70%)' }} />
      <div style={{ position: 'absolute', left: '22%', bottom: '-8%', width: '34%', height: '52%', borderRadius: '50% 50% 0 0', background: '#2C2422' }} />
      <div style={{ position: 'absolute', left: '24%', bottom: '36%', width: '30%', aspectRatio: '1', borderRadius: '50%', background: '#E8C2A8' }} />
      <div style={{ position: 'absolute', right: '16%', bottom: '-8%', width: '34%', height: '46%', borderRadius: '50% 50% 0 0', background: '#3A2D2A' }} />
      <div style={{ position: 'absolute', right: '18%', bottom: '30%', width: '30%', aspectRatio: '1', borderRadius: '50%', background: '#F0CDB4' }} />
    </>
  );
  if (id === 'warm') return (
    <>
      <div style={{ position: 'absolute', left: '50%', top: '48%', width: '44%', aspectRatio: '1', marginLeft: '-22%', borderRadius: '50%', background: '#FFD08A', boxShadow: '0 0 60px 30px rgba(255,176,90,.55)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', background: '#6B3B22' }} />
    </>
  );
  if (id === 'travel') return (
    <>
      <div style={{ position: 'absolute', left: '-10%', bottom: '30%', width: '70%', height: '42%', background: '#7C8CA3', clipPath: 'polygon(0 100%,50% 0,100% 100%)' }} />
      <div style={{ position: 'absolute', right: '-12%', bottom: '30%', width: '75%', height: '56%', background: '#5D6C83', clipPath: 'polygon(0 100%,55% 0,100% 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', background: '#3C6E5A' }} />
      <div style={{ position: 'absolute', left: '30%', top: '40%', width: '40%', height: '28%', border: '2px solid rgba(255,255,255,.9)' }} />
    </>
  );
  const pattern = [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0];
  return (
    <div style={{ position: 'absolute', inset: '14% 12% 0', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 6 }}>
      {pattern.map((p, i) => <div key={i} style={{ background: p ? '#F6D36B' : '#253047' }} />)}
    </div>
  );
}

export function LookPicker({ look, setLook }: { look: Look | 'all'; setLook: (l: Look | 'all') => void }) {
  const toTop = () => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="look" className="section">
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 40px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="eyebrow">Find your look</p>
            <h2 className="disp h2 page-in"><span className="chrome">Pick the photo you wish you took.</span></h2>
          </div>
          <button type="button" className="btn" onClick={() => { setLook('all'); toTop(); }} aria-pressed={look === 'all'}>Bring them all back</button>
        </div>
        <p className="lede">Pick one and the ring and the catalogue focus on digicams that can shoot it.</p>
        <div className="looks">
          {looks.map((l) => (
            <button key={l.id} type="button" className="look" aria-pressed={look === l.id} onClick={() => { setLook(l.id); toTop(); }}>
              <div className="look-ring">
                <div className="look-photo" style={{ background: l.bg }}>
                  <Scene id={l.id} />
                </div>
              </div>
              <div className="disp look-name">{l.name}</div>
              <div className="look-desc">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const sensorRows: [string, string, string][] = [
  ['1/2.5" to 1/2.3"', 'Most pocket digicams: Sony W, Canon A and IXUS, Nikon L and S, Fujifilm J and XP', 'The classic digicam look. Great in daylight and with flash, grainy at night.'],
  ['1/1.8" to 1/1.7"', 'Enthusiast compacts: Canon G9 and S95, Fujifilm F31fd, Panasonic LX', 'Cleaner colour and better low light than the tiny sensors.'],
  ['2/3"', 'Fujifilm X10, X20, X30', 'A step bigger again, still pocket sized.'],
  ['1"', 'Sony RX100 and ZV-1, Canon G7 X, Panasonic TZ99 class', 'Sharp, clean photos and blurry backgrounds. Costs more.'],
  ['APS-C and up', 'Fujifilm X100, Canon G1 X Mark III, Sony RX1', 'Big-camera quality with a fixed lens.'],
];

export function SensorTable() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">Sensor size, in plain words</p>
        <h2 className="disp h2 page-in"><span className="chrome">Bigger sensor, cleaner photo.</span></h2>
        <p className="lede">Every camera on the site lists its sensor. CCD sensors (mostly before 2012) give the warm look people want from digicams. CMOS came later and is better in low light.</p>
        <div className="cmp-table-wrap" style={{ marginTop: 36 }}>
          <table className="cmp-table type-table">
            <thead>
              <tr><th scope="col">Sensor</th><th scope="col">Found in</th><th scope="col">What you get</th></tr>
            </thead>
            <tbody>
              {sensorRows.map(([k, a, b]) => (
                <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function RetroVsReal() {
  return (
    <section id="retro" className="section">
      <div className="wrap">
        <p className="eyebrow">Real vs retro</p>
        <h2 className="disp h2 page-in"><span className="chrome">That "vintage" camera might be from last month.</span></h2>
        <div className="two">
          <div className="box" style={{ borderColor: 'var(--used)' }}>
            <p className="eyebrow" style={{ color: 'var(--used)', margin: 0 }}>Real digicam</p>
            <h3 className="disp">Made by Sony, Canon, Nikon, Fujifilm or Panasonic</h3>
            <p>Has a real model name you can find in our catalogue with a release year. The lens usually slides out and zooms optically.</p>
          </div>
          <div className="box" style={{ borderColor: 'var(--retro)' }}>
            <p className="eyebrow" style={{ color: 'var(--retro-text)', margin: 0 }}>New retro-style</p>
            <h3 className="disp">Sold new under codes like LK-003 or LK-007, often unbranded</h3>
            <p>Labelled "vintage" or "CCD", but there's no original release to look up. If you can't find the model here, ask the seller which brand made it and check for optical zoom.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhereToBuy() {
  return (
    <section id="buy" className="section">
      <div className="wrap">
        <p className="eyebrow">Where we found them</p>
        <h2 className="disp h2 page-in"><span className="chrome">Where these digicams get sold.</span></h2>
        <p className="lede">These shops and groups have sold the cameras listed on this site. We can't see their stock, so a camera showing up here means it was sold there before, not that it's available now. Message them to ask what they have and the price.</p>
        {(['instagram', 'facebook'] as const).map((kind) => (
          <div key={kind}>
            <p className="src-head">{kind === 'instagram' ? 'Instagram shops' : 'Facebook groups'}</p>
            <div className="src-grid">
              {sources.filter((x) => x.kind === kind).map((x) => {
                const n = cameras.filter((c) => c.seen.some((y) => y.src === x.id)).length;
                return (
                  <a key={x.id} className="src" href={x.url} target="_blank" rel="noreferrer">
                    <span className="k"><span>{x.place}</span>{x.showsPrices && <b>Shows prices</b>}</span>
                    <span className="t disp">{x.name}</span>
                    <span className="d">{x.note}</span>
                    <span className="d" style={{ color: 'var(--muted)' }}>Has sold {n} {n === 1 ? 'model' : 'models'} on this site · ask for stock</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
        <div className="wanted">
          <span className="disp" style={{ fontSize: 18, textTransform: 'uppercase' }}>What people in BD are hunting for</span>
          <ul>{wanted.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
        <div className="checklist">
          <span className="disp" style={{ fontSize: 22, color: 'var(--accent)', textTransform: 'uppercase' }}>Before you pay</span>
          <span>Battery flat, not swollen</span>
          <span>Lens moves and focuses smoothly</span>
          <span>Take a test shot and zoom in</span>
          <span>Ask for a sample photo taken that day</span>
          <span>No full advance to a seller you can't meet</span>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-row">
          <span>Shutterdex · a project by Bishan Paul · BD listings checked 5 Nov 2026</span>
          <span>
            Prices are from past posts up to Nov 2026, not live stock or averages. Model list, years and sensor sizes from{' '}
            <a href="https://www.digicamdb.com" target="_blank" rel="noreferrer">Digicamdb</a>.
          </span>
        </div>
      </div>
    </footer>
  );
}
