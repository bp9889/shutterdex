import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cameras, type Brand, type Look } from './data/cameras';
import { useHashRoute, pageTitle, routes, type Route } from './router';
import { CameraModal } from './components/CameraModal';
import { NameWall } from './components/NameWall';
import { Nav, Footer } from './components/Sections';
import { exitPage, enterPage, wallKick } from './motion';
import { Home, ExplorePage, AdvisorPage, ComparePage, GuidePage } from './pages';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const hashRoute = useHashRoute();
  const [route, setRoute] = useState<Route>(hashRoute);
  const [open, setOpen] = useState<string | null>(null);
  const [look, setLook] = useState<Look | 'all'>('all');
  const [brand, setBrand] = useState<Brand | 'all'>('all');
  const [cmpA, setCmpA] = useState('sony-w830');
  const [cmpB, setCmpB] = useState('canon-g7x3');
  const from = useRef<{ rect: DOMRect; text: string } | null>(null);
  const leaving = useRef(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // every page change (links, back button, typed URL): the old page leaves fast, then the new one is rendered
  useEffect(() => {
    if (hashRoute === route || leaving.current) return;
    setOpen(null);
    const link = document.querySelector<HTMLAnchorElement>(`.nav-links a[href="#${hashRoute}"]`);
    const rect = link?.getBoundingClientRect();
    from.current = link && rect && rect.width ? { rect, text: link.textContent ?? '' } : null;
    wallKick(Math.sign(routes.indexOf(hashRoute) - routes.indexOf(route)) || 1);
    leaving.current = true;
    exitPage(pageRef.current, () => {
      leaving.current = false;
      // a look picked on one page shouldn't leave the ring greyed out on the next
      setLook('all');
      setRoute(hashRoute);
    });
  }, [hashRoute, route]);

  useEffect(() => { document.title = route === 'home' ? 'Shutterdex' : `${pageTitle[route]} · Shutterdex`; }, [route]);

  // the new page arrives: title words rise into place, the rest settles in, headings further down reveal on scroll
  useLayoutEffect(() => {
    const main = pageRef.current;
    if (!main) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const undoEnter = enterPage(main, first.current ? null : from.current, first.current);
    from.current = null;
    first.current = false;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section .h2').forEach((el) => {
        gsap.from(el, { y: 50, duration: 0.9, ease: 'uiOut', scrollTrigger: { trigger: el, start: 'top 92%' } });
      });
    }, main);
    return () => { undoEnter(); ctx.revert(); };
  }, [route]);

  const openBrand = (b: Brand) => {
    setBrand(b);
    window.location.hash = 'explore';
  };

  const compareWith = (id: string) => {
    if (id !== cmpA) { setCmpB(cmpA); setCmpA(id); }
    setOpen(null);
    window.location.hash = 'compare';
  };

  return (
    <div className="app">
      <NameWall />
      <Nav route={route} />
      <main ref={pageRef} key={route} id="content" tabIndex={-1}>
        {route === 'home' && <Home look={look} setLook={setLook} onOpen={setOpen} openBrand={openBrand} />}
        {route === 'explore' && <ExplorePage look={look} setLook={setLook} brand={brand} setBrand={setBrand} onOpen={setOpen} />}
        {route === 'advisor' && <AdvisorPage onOpen={setOpen} />}
        {route === 'compare' && <ComparePage a={cmpA} b={cmpB} setA={setCmpA} setB={setCmpB} />}
        {route === 'guide' && <GuidePage />}
      </main>
      <Footer />
      {open && <CameraModal cams={cameras} id={open} onClose={() => setOpen(null)} onChange={setOpen} onCompare={compareWith} />}
    </div>
  );
}
