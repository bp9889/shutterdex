// Page change: "title morph".
// Built to the animate skill's rules: the old page leaves fast (180ms), the new one arrives slower
// with a short stagger, only transform and opacity move, strong custom curves (no ease-in),
// and reduced motion gets a plain crossfade.
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { wallFx } from './components/NameWall';

gsap.registerPlugin(CustomEase);
CustomEase.create('uiOut', '0.23, 1, 0.32, 1'); // strong ease-out: entering and leaving
CustomEase.create('uiInOut', '0.77, 0, 0.175, 1'); // strong ease-in-out: moving across the screen

export const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Old page out: everything that entered drifts up a touch and fades. */
export function exitPage(main: HTMLElement | null, done: () => void) {
  if (!main || reduceMotion()) { done(); return; }
  gsap.killTweensOf(main.querySelectorAll('.page-in, .title-word'));
  gsap.to(main.querySelectorAll('.page-in'), { y: -10, autoAlpha: 0, duration: 0.18, ease: 'uiOut', onComplete: done });
}

/** The name wall turns toward where you're going and its names rush for a moment. */
export function wallKick(dir: number) {
  if (reduceMotion()) return;
  gsap.killTweensOf(wallFx);
  gsap.timeline()
    .to(wallFx, { turn: -dir * 7, rush: dir, duration: 0.3, ease: 'uiOut' })
    .to(wallFx, { turn: 0, rush: 0, duration: 0.9, ease: 'uiInOut' });
}

/**
 * New page in. The menu word you clicked floats to where the title sits and fades,
 * while each word of the title rises into place from behind its own edge, one after another.
 * Then the rest of the page settles in. Returns a cleanup for unmount.
 */
export function enterPage(main: HTMLElement, from: { rect: DOMRect; text: string } | null, first: boolean) {
  if (reduceMotion()) {
    const t = gsap.fromTo(main, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, clearProps: 'opacity,visibility' });
    return () => { t.kill(); };
  }
  let ghost: HTMLDivElement | null = null;
  const ctx = gsap.context(() => {
    const words = gsap.utils.toArray<HTMLElement>('.title-word', main);
    const rest = gsap.utils.toArray<HTMLElement>('.page-in', main).filter((el) => !el.querySelector('.title-word'));
    const title = main.querySelector<HTMLElement>('.split-title');
    const delay = first ? 0.1 : 0.06;

    // each word slides up out of its own mask, so nothing scales and no letters fall from the top
    gsap.set(title, { autoAlpha: 1 });
    gsap.fromTo(words, { yPercent: 108 }, { yPercent: 0, duration: 0.7, ease: 'uiOut', stagger: 0.05, delay, clearProps: 'transform' });
    gsap.fromTo(rest, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'uiOut', stagger: 0.04, delay: delay + 0.16, clearProps: 'transform,opacity,visibility' });
    const orbit = main.querySelector('.orbit');
    if (orbit) gsap.fromTo(orbit, { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'uiOut', delay: delay + 0.2, clearProps: 'transform,opacity,visibility' });

    // the clicked menu word travels to the title and hands over to it
    if (from && title) {
      const to = title.getBoundingClientRect();
      const g = document.createElement('div');
      ghost = g;
      g.className = 'nav-ghost';
      g.textContent = from.text;
      Object.assign(g.style, { left: `${from.rect.left}px`, top: `${from.rect.top}px` });
      document.body.append(g);
      gsap.timeline({ onComplete: () => g.remove() })
        .to(g, { x: to.left - from.rect.left, y: to.top - from.rect.top + Math.min(40, to.height * 0.25), scale: 2.2, duration: 0.5, ease: 'uiInOut' })
        .to(g, { autoAlpha: 0, duration: 0.25, ease: 'uiOut' }, '-=0.22');
    }
  }, main);
  return () => { ctx.revert(); ghost?.remove(); };
}
