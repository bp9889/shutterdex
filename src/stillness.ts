// "Pause motion": one switch that stops everything that moves on its own
// (the name wall, the brand banner, the ring's idle drift). Remembered per browser.
import { useEffect, useState } from 'react';

const KEY = 'shutterdex-still';
const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

export const isStill = () => document.documentElement.dataset.still === '1';

export function applyStill(on: boolean) {
  document.documentElement.dataset.still = on ? '1' : '0';
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* storage blocked: still works for this visit */ }
  window.dispatchEvent(new Event('shutterdex-still'));
}

export function useStill(): [boolean, (v: boolean) => void] {
  const [still, setStill] = useState(read);
  useEffect(() => { document.documentElement.dataset.still = still ? '1' : '0'; }, [still]);
  return [still, (v: boolean) => { applyStill(v); setStill(v); }];
}
