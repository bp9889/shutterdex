import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import type { Camera } from '../data/cameras';
import { CameraArt } from './CameraArt';
import { reduceMotion } from '../motion';
import { isStill } from '../stillness';

/* The camera window's hero: a real 3D model of the camera's body style in its colour.
   Drag to turn it; it spins in when a new camera opens and idles slowly otherwise.
   three.js loads only when the window first opens. Falls back to the drawing without WebGL. */
export function Camera3D({ cam }: { cam: Camera }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ show: (c: Camera) => void } | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // set up the scene once
  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    (async () => {
      try {
        const THREE = await import('three');
        const { buildCamera, makeEnvironment, disposeTree } = await import('../three/buildCamera');
        const gsap = (await import('gsap')).default;
        if (!alive || !host.current) return;
        const el = host.current;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        el.append(renderer.domElement);

        const scene = new THREE.Scene();
        scene.environment = makeEnvironment(renderer);
        scene.environmentIntensity = 0.9;
        const key = new THREE.DirectionalLight('#ffffff', 1.6);
        key.position.set(6, 8, 10);
        const rim = new THREE.DirectionalLight('#7FE7FF', 2.2); // the site's ice-blue as a rim light
        rim.position.set(-9, 4, -6);
        scene.add(key, rim);

        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
        camera.position.set(0, 2.0, 26);
        camera.lookAt(0, 0, 0);

        const pivot = new THREE.Group(); // user rotation
        scene.add(pivot);
        let model: Group | null = null;

        const size = () => {
          const w = el.clientWidth || 1, h = el.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        size();
        const ro = new ResizeObserver(size);
        ro.observe(el);

        // drag to turn, with a little momentum; slow idle turn when left alone
        const rot = { x: -0.12, y: 0.5, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0, idle: 0 };
        const down = (e: PointerEvent) => { rot.dragging = true; rot.lastX = e.clientX; rot.lastY = e.clientY; el.setPointerCapture(e.pointerId); };
        const move = (e: PointerEvent) => {
          if (!rot.dragging) return;
          const dx = e.clientX - rot.lastX, dy = e.clientY - rot.lastY;
          rot.lastX = e.clientX; rot.lastY = e.clientY;
          rot.vy = dx * 0.012; rot.vx = dy * 0.008;
          rot.y += rot.vy; rot.x = Math.max(-0.7, Math.min(0.7, rot.x + rot.vx));
        };
        const up = () => { rot.dragging = false; rot.idle = performance.now(); };
        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);

        let raf = 0, last = performance.now();
        const tick = (now: number) => {
          const dt = Math.min(50, now - last); last = now;
          if (!rot.dragging) {
            rot.y += rot.vy; rot.x = Math.max(-0.7, Math.min(0.7, rot.x + rot.vx));
            rot.vy *= 0.94; rot.vx *= 0.9;
            if (!reduceMotion() && !isStill() && now - rot.idle > 1500) rot.y += dt * 0.00018;
          }
          pivot.rotation.set(rot.x, rot.y, 0);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        api.current = {
          show: (c) => {
            if (model) { pivot.remove(model); disposeTree(model); }
            model = buildCamera({ kind: c.kind, body: c.body, trim: c.trim });
            pivot.add(model);
            if (reduceMotion()) return;
            // spin in from the ring: a turn and a half, landing on a three-quarter view
            gsap.fromTo(model.rotation, { y: -Math.PI * 3 }, { y: 0, duration: 1.15, ease: 'uiOut' });
            gsap.fromTo(model.scale, { x: 0.6, y: 0.6, z: 0.6 }, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'uiOut' });
            rot.x = -0.12; rot.y = 0.5; rot.vx = rot.vy = 0;
          },
        };
        setReady(true);

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          el.removeEventListener('pointerdown', down);
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          if (model) disposeTree(model);
          scene.environment?.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => { alive = false; cleanup(); api.current = null; };
  }, []);

  // swap the model whenever the camera changes
  useEffect(() => { if (ready) api.current?.show(cam); }, [cam, ready]);

  if (failed) return <div className="panel-art"><CameraArt cam={cam} /></div>;
  return (
    <div className="cam3d" ref={host} role="img" aria-label={`3D model of a ${cam.brand} ${cam.name}-style camera. Drag to turn it.`}>
      {!ready && <div className="panel-art cam3d-wait"><CameraArt cam={cam} /></div>}
      <span className="cam3d-hint" aria-hidden="true">Drag to turn</span>
    </div>
  );
}
