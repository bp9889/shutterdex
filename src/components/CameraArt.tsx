import type { Camera, Kind } from '../data/cameras';

/* Each camera is a 240x160 drawing of its body style (compact, slim, bridge...) and colour,
   not a copy of the product. */

const glass = (inset: number) =>
  `<div style="position:absolute;inset:${inset}px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#45567f 0%,#121828 40%,#020306 72%)"></div>`;
const metalRing = 'conic-gradient(from 30deg,#8d9097,#f1f2f4,#7b7e85,#e3e5e8,#8d9097)';
const flash = (l: number, t: number, w: number, h: number) =>
  `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:4px;background:repeating-linear-gradient(90deg,#f4f4ef 0 2px,#d2d2ca 2px 4px);box-shadow:inset 0 0 0 2px rgba(0,0,0,.25)"></div>`;
const brushed = '<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px)"></div>';
const glint = (l: number, t: number, s: number) =>
  `<div style="position:absolute;left:${l}px;top:${t}px;width:${s}px;height:${s}px;border-radius:50%;background:rgba(255,255,255,.85)"></div>`;
const shutter = (l: number, t: number, w: number) =>
  `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:10px;border-radius:5px 5px 0 0;background:linear-gradient(#f0f1f3,#8f9298)"></div>`;
const knurl = (l: number, t: number, w: number, h: number) =>
  `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:4px 4px 0 0;background:repeating-linear-gradient(90deg,#3a3b3f 0 2px,#202124 2px 4px)"></div>`;

function draw(kind: Kind, body: string, trim: string): string {
  switch (kind) {
    case 'slim':
      return `${shutter(36, 29, 30)}
<div style="position:absolute;left:10px;top:38px;width:220px;height:96px;border-radius:12px;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.5),inset 0 -8px 14px rgba(0,0,0,.3),inset 0 0 0 1px rgba(0,0,0,.28);overflow:hidden">${brushed}
<div style="position:absolute;left:0;top:0;bottom:0;width:142px;background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(0,0,0,.14));border-right:2px solid rgba(0,0,0,.22)"></div>
<div style="position:absolute;left:112px;top:22px;width:20px;height:52px;background:repeating-linear-gradient(180deg,rgba(0,0,0,.22) 0 2px,transparent 2px 6px)"></div>
${flash(156, 74, 52, 12)}</div>
<div style="position:absolute;left:160px;top:44px;width:56px;height:56px;border-radius:50%;background:${metalRing};box-shadow:0 3px 8px rgba(0,0,0,.4)"><div style="position:absolute;inset:6px;border-radius:50%;background:#1b1c1f"></div>${glass(11)}${glint(19, 18, 6)}</div>`;
    case 'swivel':
      return `<div style="position:absolute;left:18px;top:42px;width:98px;height:102px;border-radius:16px;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.4),inset 0 -10px 16px rgba(0,0,0,.3),inset 0 0 0 1px rgba(0,0,0,.28);overflow:hidden">${brushed}${flash(14, 16, 30, 14)}</div>
${shutter(52, 33, 28)}
<div style="position:absolute;left:106px;top:70px;width:22px;height:44px;border-radius:10px;background:#2b2e33"></div>
<div style="position:absolute;left:116px;top:28px;width:110px;height:112px;border-radius:22px;background:${trim};transform:rotate(-7deg);box-shadow:inset 0 2px 1px rgba(255,255,255,.25),inset 0 -10px 16px rgba(0,0,0,.4),0 6px 12px rgba(0,0,0,.35)">
<div style="position:absolute;left:16px;top:18px;width:78px;height:78px;border-radius:50%;background:${metalRing}"><div style="position:absolute;inset:8px;border-radius:50%;background:#1b1c1f"></div>${glass(17)}${glint(28, 26, 8)}</div></div>`;
    case 'superzoom':
      return `<div style="position:absolute;left:92px;top:14px;width:74px;height:30px;border-radius:12px 12px 0 0;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.25)"></div>
<div style="position:absolute;left:40px;top:22px;width:34px;height:10px;border-radius:5px 5px 0 0;background:linear-gradient(#cfd1d5,#6b6e74)"></div>
<div style="position:absolute;left:8px;top:32px;width:224px;height:114px;border-radius:24px;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.28),inset 0 -10px 18px rgba(0,0,0,.4),inset 0 0 0 1px rgba(0,0,0,.3);overflow:hidden">
<div style="position:absolute;left:0;top:0;bottom:0;width:66px;background:radial-gradient(circle,rgba(0,0,0,.35) 1px,transparent 1.5px) 0 0/4px 4px,linear-gradient(90deg,rgba(255,255,255,.08),rgba(0,0,0,.2))"></div>${flash(78, 14, 22, 10)}</div>
<div style="position:absolute;left:100px;top:24px;width:130px;height:130px;border-radius:50%;background:#16171a;box-shadow:0 6px 14px rgba(0,0,0,.5),inset 0 0 0 2px #2c2e33">
<div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(#2a2b2f 0 3deg,#1a1b1e 3deg 6deg)"></div>
<div style="position:absolute;inset:20px;border-radius:50%;background:conic-gradient(from 30deg,#55585e,#a4a7ad,#4c4f55,#9a9da3,#55585e)"></div>
<div style="position:absolute;inset:27px;border-radius:50%;background:#0f1012"></div>${glass(36)}${glint(50, 48, 10)}</div>`;
    case 'premium':
      return `${knurl(38, 18, 46, 16)}${knurl(92, 22, 32, 12)}${shutter(150, 24, 26)}
<div style="position:absolute;left:12px;top:32px;width:216px;height:112px;border-radius:12px;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.18),inset 0 -10px 18px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.06);overflow:hidden">
<div style="position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1.5px) 0 0/3px 3px"></div>
<div style="position:absolute;inset:0;background:linear-gradient(170deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,0) 40%)"></div>
<div style="position:absolute;right:14px;top:14px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffcf9a,#b85a16)"></div></div>
<div style="position:absolute;left:66px;top:30px;width:116px;height:116px;border-radius:50%;background:repeating-conic-gradient(#3a3b3f 0 3deg,#1c1d20 3deg 6deg);box-shadow:0 5px 12px rgba(0,0,0,.55)">
<div style="position:absolute;inset:10px;border-radius:50%;background:#141517;box-shadow:inset 0 0 0 2px #34363b"></div>
<div style="position:absolute;inset:18px;border-radius:50%;background:conic-gradient(from 30deg,#4a4d53,#8e9197,#3f4248,#878a90,#4a4d53)"></div>
<div style="position:absolute;inset:25px;border-radius:50%;background:#0c0d0f"></div>${glass(33)}${glint(46, 44, 9)}</div>`;
    case 'rangefinder':
      return `<div style="position:absolute;left:160px;top:24px;width:42px;height:16px;border-radius:4px 4px 0 0;background:repeating-linear-gradient(90deg,#e6e7ea 0 2px,#a7aab0 2px 4px)"></div>${shutter(118, 30, 24)}
<div style="position:absolute;left:30px;top:30px;width:40px;height:10px;border-radius:3px 3px 0 0;background:#2a2b2e"></div>
<div style="position:absolute;left:6px;top:40px;width:228px;height:104px;border-radius:9px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.35)">
<div style="position:absolute;left:0;right:0;top:0;height:40px;background:${body}"></div>
<div style="position:absolute;left:0;right:0;top:0;height:40px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 3px),linear-gradient(180deg,rgba(255,255,255,.4),rgba(0,0,0,.12))"></div>
<div style="position:absolute;left:0;right:0;top:40px;bottom:0;background:${trim}"></div>
<div style="position:absolute;left:0;right:0;top:40px;bottom:0;background:radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1.6px) 0 0/3px 3px"></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:${body};opacity:.9"></div>
<div style="position:absolute;left:16px;top:10px;width:46px;height:28px;border-radius:3px;background:linear-gradient(135deg,#2c3f5c,#0b1220 60%,#3a5a7a);box-shadow:inset 0 0 0 3px #1a1a1c"></div>
<div style="position:absolute;left:70px;top:14px;width:16px;height:14px;border-radius:2px;background:#0b1220;box-shadow:inset 0 0 0 2px #1a1a1c"></div></div>
<div style="position:absolute;left:96px;top:58px;width:86px;height:86px;border-radius:50%;background:${metalRing};box-shadow:0 5px 12px rgba(0,0,0,.5)">
<div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(#2a2b2f 0 4deg,#1a1b1e 4deg 8deg)"></div>
<div style="position:absolute;inset:16px;border-radius:50%;background:#0f1012"></div>${glass(22)}${glint(32, 30, 8)}</div>`;
    default:
      return `${shutter(150, 17, 34)}
<div style="position:absolute;left:118px;top:21px;width:18px;height:7px;border-radius:3px 3px 0 0;background:#5f6268"></div>
<div style="position:absolute;left:12px;top:26px;width:216px;height:120px;border-radius:18px;background:${body};box-shadow:inset 0 2px 1px rgba(255,255,255,.45),inset 0 -10px 18px rgba(0,0,0,.35),inset 0 0 0 1px rgba(0,0,0,.28);overflow:hidden">${brushed}
<div style="position:absolute;inset:0;background:linear-gradient(170deg,rgba(255,255,255,.38) 0%,rgba(255,255,255,0) 38%,rgba(0,0,0,.2) 100%)"></div>
${flash(16, 14, 40, 18)}
<div style="position:absolute;left:64px;top:18px;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffcf9a,#b85a16);box-shadow:0 0 0 2px rgba(0,0,0,.3)"></div>
<div style="position:absolute;left:18px;bottom:30px;width:72px;height:2px;background:rgba(0,0,0,.18)"></div></div>
<div style="position:absolute;left:112px;top:34px;width:104px;height:104px;border-radius:50%;background:${metalRing};box-shadow:0 4px 10px rgba(0,0,0,.45),inset 0 0 0 1px rgba(0,0,0,.3)">
<div style="position:absolute;inset:9px;border-radius:50%;background:#1b1c1f;box-shadow:inset 0 0 0 2px #3a3c41"></div>
<div style="position:absolute;inset:16px;border-radius:50%;background:repeating-conic-gradient(#2a2b2f 0 4deg,#1f2023 4deg 8deg)"></div>
${glass(26)}
<div style="position:absolute;left:34px;top:31px;width:22px;height:12px;border-radius:50%;background:rgba(150,110,255,.35);transform:rotate(-25deg)"></div>${glint(38, 35, 9)}</div>`;
  }
}

const shadow = '<div style="position:absolute;left:34px;right:34px;bottom:2px;height:16px;border-radius:50%;background:rgba(0,0,0,.6);filter:blur(9px)"></div>';

/** Width-driven drawing of the camera's body style and colour. */
export function CameraArt({ cam, width = 196 }: { cam: Camera; width?: number }) {
  const height = Math.round(width * (2 / 3));
  return (
    <div className="art" style={{ width, height }} aria-hidden="true">
      <div
        className="art-draw"
        style={{ transform: `scale(${width / 240})` }}
        dangerouslySetInnerHTML={{ __html: shadow + draw(cam.kind, cam.body, cam.trim) }}
      />
    </div>
  );
}
