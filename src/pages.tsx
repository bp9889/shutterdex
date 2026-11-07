import { type Brand, type Look, brands, brandInfo, cameras, featuredCams, countByBrand, looks, statusInfo } from './data/cameras';
import { Orbit } from './components/Orbit';
import { Catalogue } from './components/Catalogue';
import { Advisor } from './components/Advisor';
import { Compare } from './components/Compare';
import { CameraArt } from './components/CameraArt';
import { LookPicker, RetroVsReal, SensorTable, WhereToBuy } from './components/Sections';
import { SplitTitle } from './components/SplitTitle';

// the camera drawn on each brand door
const doorCam: Record<Brand, string> = { Sony: 'sony-w830', Canon: 'canon-ixus70', Nikon: 'nikon-2500', Fujifilm: 'fuji-x100vi', Panasonic: 'pana-tz99' };

function PageHead({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children?: React.ReactNode }) {
  return (
    <section id="top" className="page-head">
      <div className="wrap">
        <p className="eyebrow page-in">{eyebrow}</p>
        <h1 className="disp page-title page-in"><SplitTitle text={title} /></h1>
        <p className="lede page-in">{lede}</p>
        {children}
      </div>
    </section>
  );
}

/* ---------- HOME: the ring, then the five brands ---------- */
interface HomeProps { look: Look | 'all'; setLook: (l: Look | 'all') => void; onOpen: (id: string) => void; openBrand: (b: Brand) => void; }

export function Home({ look, setLook, onOpen, openBrand }: HomeProps) {
  const ringCams = look === 'all' ? featuredCams : featuredCams.filter((c) => c.looks.includes(look));
  const matches = ringCams.length;
  const seenCount = cameras.filter((c) => c.seen.length).length;
  return (
    <>
      <section id="top" className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-text">
          <p className="eyebrow page-in">Five brands of digicams, made for Bangladesh</p>
          <h1 className="disp page-in"><SplitTitle text="Find your digicam." /></h1>
          <p className="lede page-in">{cameras.length.toLocaleString('en-US')} pocket cameras from 1996 to today. Hover the edges of the ring to spin it, and click a camera to pull it out.</p>
          <div className="home-actions page-in" style={{ justifyContent: 'center' }}>
            <a className="btn btn-main btn-island" href="#advisor">Not sure? Ask the advisor<span className="btn-orb" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17L17 7M9 7h8v8" /></svg></span></a>
            <a className="btn" href="#explore">Browse all {cameras.length.toLocaleString('en-US')}</a>
          </div>
        </div>
        {look !== 'all' && (
          <div className="ring-filter page-in">
            <span>Showing {matches} cameras for <b>{looks.find((l) => l.id === look)?.name.toLowerCase()}</b></span>
            <button type="button" onClick={() => setLook('all')}>Show all</button>
          </div>
        )}
        <Orbit key={look} cams={ringCams} onOpen={onOpen} />
        <div className="legend">
          <span><span className="dot" style={{ background: statusInfo.used.color }} />Discontinued</span>
          <span><span className="dot" style={{ background: statusInfo.prod.color }} />Sold new</span>
          <span style={{ color: 'var(--text)' }}>{ringCams.length} picks in the ring · {seenCount} sold by BD shops</span>
        </div>
      </section>

      <div className="brand-strip" aria-label="Brands covered">
        <div className="brand-track">
          {[...brands, ...brands, ...brands, ...brands].map((b, i) => <span key={i} className="disp chrome" aria-hidden={i >= brands.length}>{b}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Pick a brand</p>
          <h2 className="disp h2"><span className="chrome">Every model they made.</span></h2>
          <div className="doors five">
            {brands.map((b) => {
              const cam = cameras.find((c) => c.id === doorCam[b]);
              return (
                <button key={b} type="button" className="door drawer" onClick={() => openBrand(b)}>
                  <span className="door-label disp">{b}</span>
                  {cam && <span className="door-cam"><CameraArt cam={cam} width={200} /></span>}
                  <span className="door-info">
                    <span className="door-short">{brandInfo[b].line}</span>
                    <span className="door-pitch">{brandInfo[b].pitch}</span>
                    <span className="door-count">{countByBrand(b)} models</span>
                  </span>
                  <span className="door-go" aria-hidden="true">Open {countByBrand(b)} {b} models<span className="btn-orb"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17L17 7M9 7h8v8" /></svg></span></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <LookPicker look={look} setLook={setLook} />
    </>
  );
}

/* ---------- other pages ---------- */
interface ExploreProps { look: Look | 'all'; setLook: (l: Look | 'all') => void; brand: Brand | 'all'; setBrand: (b: Brand | 'all') => void; onOpen: (id: string) => void; }

export function ExplorePage({ look, setLook, brand, setBrand, onOpen }: ExploreProps) {
  return (
    <>
      <PageHead eyebrow="Explore" title="Every digicam in one place." lede={`${cameras.length.toLocaleString('en-US')} models from Sony, Canon, Nikon, Fujifilm and Panasonic. Filter by brand, or search a model name.`} />
      <Catalogue cams={cameras} look={look} setLook={setLook} brand={brand} setBrand={setBrand} onOpen={onOpen} />
    </>
  );
}

export function AdvisorPage({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <>
      <PageHead eyebrow="Digicam advisor" title="Tell us what you want. We pick the digicam." lede="No specs needed. Answer for how you'll use it. You get three cameras and the reasons for each." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap"><Advisor cams={cameras} onOpen={onOpen} /></div>
      </section>
    </>
  );
}

export function ComparePage({ a, b, setA, setB }: { a: string; b: string; setA: (v: string) => void; setB: (v: string) => void }) {
  return (
    <>
      <PageHead eyebrow="Compare" title="Two digicams, side by side." lede="Pick any two. Rows where they differ are marked, so you can see what you gain or give up." />
      <Compare cams={cameras} a={a} b={b} setA={setA} setB={setB} />
    </>
  );
}

export function GuidePage() {
  return (
    <>
      <PageHead eyebrow="Buying guide" title="Buy smart, buy once." lede="What the sensor sizes mean, how to spot a fake vintage camera, and the shops and groups where we actually found these cameras." />
      <SensorTable />
      <RetroVsReal />
      <WhereToBuy />
    </>
  );
}
