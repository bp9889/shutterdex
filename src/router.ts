// Tiny hash router: each page is #name, so links can be shared and the back button works.
import { useEffect, useState } from 'react';

export const routes = ['home', 'explore', 'advisor', 'compare', 'guide'] as const;
export type Route = (typeof routes)[number];

// old links from when the site also covered DSLRs and mirrorless
const moved: Record<string, Route> = { digicam: 'home', dslr: 'home', mirrorless: 'home' };

/** A page name, or null for in-page anchors like #catalogue (those just scroll). */
export function parse(hash: string): Route | null {
  const name = hash.replace(/^#/, '');
  if (!name) return 'home';
  if (moved[name]) return moved[name];
  return (routes as readonly string[]).includes(name) ? (name as Route) : null;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash) ?? 'home');
  useEffect(() => {
    const on = () => { const r = parse(window.location.hash); if (r) setRoute(r); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const pageTitle: Record<Route, string> = {
  home: 'Shutterdex',
  explore: 'Every digicam',
  advisor: 'Digicam advisor',
  compare: 'Compare',
  guide: 'Buying guide',
};
