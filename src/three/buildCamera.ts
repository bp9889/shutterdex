// A real 3D digicam, built from simple shapes for each body style (no model files to download).
// Materials are physically based and lit by a generated studio environment, so metal and glass
// pick up real reflections. Units are roughly centimetres.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Kind } from '../data/cameras';

export interface CameraLook { kind: Kind; body: string; trim: string }

const mats = (look: CameraLook) => {
  const dark = new THREE.Color(look.body).getHSL({ h: 0, s: 0, l: 0 }).l < 0.25;
  return {
    body: new THREE.MeshPhysicalMaterial({ color: look.body, metalness: dark ? 0.25 : 0.6, roughness: dark ? 0.45 : 0.3, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
    trim: new THREE.MeshPhysicalMaterial({ color: look.trim, metalness: 0.2, roughness: 0.55 }),
    leather: new THREE.MeshStandardMaterial({ color: '#16171a', metalness: 0, roughness: 0.85 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#d9dee5', metalness: 1, roughness: 0.18 }),
    blackMetal: new THREE.MeshStandardMaterial({ color: '#121316', metalness: 0.7, roughness: 0.4 }),
    // coated lens glass: deep blue with a thin-film sheen like a real multicoated lens
    glass: new THREE.MeshPhysicalMaterial({ color: '#050912', metalness: 0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 0.9, iridescenceIOR: 1.6, iridescenceThicknessRange: [220, 520] }),
    flash: new THREE.MeshStandardMaterial({ color: '#f1f1ea', roughness: 0.35, emissive: '#3a3a36', emissiveIntensity: 0.4 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#ff9a3c', emissive: '#ff7a1a', emissiveIntensity: 1.2 }),
  };
};

type M = ReturnType<typeof mats>;

const cyl = (r: number, depth: number, mat: THREE.Material, seg = 64, rTop = r) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, r, depth, seg), mat);
  m.rotation.x = Math.PI / 2; // face forward (+z)
  return m;
};

/** Barrel + rings + glass, front face at z = 0 of the returned group, pointing +z. */
function lens(m: M, r: number, length: number, knurl = false) {
  const g = new THREE.Group();
  const steps = Math.max(1, Math.round(length / 0.7));
  for (let i = 0; i < steps; i++) {
    const rr = r * (1 - i * 0.07);
    const seg = cyl(rr, length / steps, i % 2 ? m.blackMetal : m.chrome);
    seg.position.z = (length / steps) * (i + 0.5);
    g.add(seg);
  }
  if (knurl) {
    const ring = cyl(r * 1.04, 0.35, m.blackMetal, 96);
    ring.position.z = length * 0.35;
    g.add(ring);
  }
  const lip = new THREE.Mesh(new THREE.TorusGeometry(r * 0.78, r * 0.08, 16, 64), m.chrome);
  lip.position.z = length + 0.02;
  g.add(lip);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(r * 0.74, 48, 24, 0, Math.PI * 2, 0, Math.PI / 4.2), m.glass);
  glass.rotation.x = Math.PI / 2;
  glass.position.z = length - r * 0.74 * Math.cos(Math.PI / 4.2) + 0.08;
  g.add(glass);
  const inner = cyl(r * 0.72, 0.05, m.leather);
  inner.position.z = length - 0.05;
  g.add(inner);
  return g;
}

const box = (w: number, h: number, d: number, r: number, mat: THREE.Material) =>
  new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat);

export function buildCamera(look: CameraLook): THREE.Group {
  const m = mats(look);
  const g = new THREE.Group();
  const add = (o: THREE.Object3D, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); g.add(o); return o; };

  switch (look.kind) {
    case 'slim': {
      add(box(10, 6, 1.7, 0.6, m.body));
      add(lens(m, 1.15, 0.35), 3.2, 1.3, 0.85);
      add(box(2.8, 0.9, 0.12, 0.08, m.flash), -3.2, 2.1, 0.86);
      add(cyl(0.45, 0.35, m.chrome), 2.8, 3.1, 0).rotation.x = 0;
      add(box(10.02, 0.4, 1.72, 0.15, m.trim), 0, -1.6, 0);
      break;
    }
    case 'superzoom': {
      add(box(11.5, 7.6, 5.2, 1.4, m.body));
      add(box(3.4, 7.2, 3.2, 1.2, m.leather), -4.2, -0.1, 2.0);
      add(box(4.2, 2.2, 3.6, 0.8, m.body), 0.6, 4.3, 0);
      add(box(2.4, 0.7, 0.2, 0.1, m.flash), 0.6, 4.6, 1.8);
      add(lens(m, 3.2, 4.6, true), 1.7, -0.3, 2.5);
      add(cyl(0.6, 0.5, m.chrome), -4.0, 3.9, 0).rotation.x = 0;
      break;
    }
    case 'premium': {
      add(box(10.4, 6.0, 3.0, 0.7, m.body));
      add(box(2.0, 5.2, 0.9, 0.5, m.leather), -4.2, -0.2, 1.4);
      add(lens(m, 2.25, 1.6, true), 1.4, -0.3, 1.5);
      add(cyl(0.8, 0.5, m.blackMetal), -2.4, 3.2, 0).rotation.x = 0;
      add(cyl(0.55, 0.45, m.chrome), 3.6, 3.15, 0).rotation.x = 0;
      add(box(1.6, 0.6, 0.15, 0.1, m.flash), -2.6, 2.3, 1.5);
      add(cyl(0.12, 0.1, m.lamp), -3.8, 2.1, 1.52);
      break;
    }
    case 'rangefinder': {
      add(box(12.4, 3.6, 3.4, 0.5, m.body), 0, 1.6, 0);
      add(box(12.4, 3.4, 3.4, 0.5, m.leather), 0, -1.7, 0);
      add(box(2.6, 1.4, 0.2, 0.2, m.blackMetal), -3.8, 1.8, 1.7);
      add(box(2.2, 1.1, 0.06, 0.15, m.glass), -3.8, 1.8, 1.82);
      add(lens(m, 2.3, 2.2), 1.6, -0.6, 1.7);
      add(cyl(0.9, 0.55, m.chrome, 72), 3.6, 3.65, 0).rotation.x = 0;
      add(cyl(0.7, 0.55, m.chrome, 72), 1.4, 3.65, 0).rotation.x = 0;
      break;
    }
    case 'swivel': {
      add(box(4.6, 6.4, 3.6, 0.9, m.body), -2.6, 0, 0);
      const head = new THREE.Group();
      head.add(box(5.6, 6.0, 4.2, 1.2, m.trim));
      const l = lens(m, 2.1, 1.2);
      l.position.z = 2.1;
      head.add(l);
      head.rotation.y = -0.25;
      add(head, 2.6, 0.3, 0.4);
      add(box(2.2, 0.9, 0.12, 0.08, m.flash), -2.6, 1.9, 1.81);
      break;
    }
    default: { // compact
      add(box(10, 6.2, 2.6, 0.9, m.body));
      add(lens(m, 2.0, 1.3), 2.0, -0.2, 1.3);
      add(box(2.6, 1.0, 0.14, 0.08, m.flash), -3.0, 1.9, 1.32);
      add(cyl(0.1, 0.1, m.lamp), -1.2, 2.1, 1.33);
      add(cyl(0.5, 0.4, m.chrome), 3.2, 3.2, 0).rotation.x = 0;
      add(box(3.2, 0.5, 1.2, 0.2, m.trim), -2.6, 3.25, 0);
    }
  }
  // centre it so it spins around its middle
  const bb = new THREE.Box3().setFromObject(g);
  const c = bb.getCenter(new THREE.Vector3());
  g.children.forEach((ch) => ch.position.sub(c));
  return g;
}

export function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const tex = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
  return tex;
}

export function disposeTree(o: THREE.Object3D) {
  o.traverse((n) => {
    const mesh = n as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((mt) => mt.dispose());
  });
}
