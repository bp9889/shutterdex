import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { type Camera, looks, statusInfo, fullName } from '../data/cameras';
import { sourceById } from '../data/sources';
import { CameraArt } from './CameraArt';

type Opt = { v: string; label: string; hint: string };
type Q = { key: string; q: string; opts: Opt[] };

const questions: Q[] = [
  { key: 'look', q: 'What will you shoot most?', opts: [
    ...looks.map((l) => ({ v: l.id, label: l.name, hint: l.desc })),
    { v: 'unsure', label: "I'm not sure yet", hint: 'We pick easy all-rounders people in BD are selling' },
  ] },
  { key: 'buy', q: 'New, or used is fine?', opts: [
    { v: 'used', label: 'Used is fine', hint: 'Cheapest way into real 2000s digicams' },
    { v: 'new', label: 'New only', hint: 'Only cameras still sold today' },
    { v: 'either', label: "I don't mind", hint: 'Best fit either way' },
  ] },
  { key: 'size', q: 'How small does it need to be?', opts: [
    { v: 'pocket', label: 'Fits my pocket', hint: 'Jeans or shirt pocket' },
    { v: 'any', label: 'Bigger is fine', hint: 'A grip, big lens or viewfinder is okay' },
  ] },
  { key: 'budget', q: 'How much can you spend?', opts: [
    { v: 'low', label: 'As little as possible', hint: 'Old pocket cams, around 4,000 to 10,000 taka' },
    { v: 'mid', label: 'A bit more for better photos', hint: 'Bigger sensors and longer zooms' },
    { v: 'high', label: 'Best quality', hint: '1 inch sensor or bigger' },
  ] },
];

const big = (c: Camera) => /^(1"|1\.\d"|APS-C|Four Thirds|Full frame|2\/3")/.test(c.sensor) || c.kind === 'premium' || c.kind === 'rangefinder';

function score(c: Camera, a: Record<string, string>): { score: number; why: string[] } {
  let sc = 0;
  const why: string[] = [];
  if (a.look && a.look !== 'unsure' && c.looks.includes(a.look as never)) { sc += 3; why.push(`good for ${looks.find((l) => l.id === a.look)!.name.toLowerCase()}`); }
  if (a.look === 'unsure' && c.looks.length >= 2) { sc += 1.5; why.push('does a bit of everything'); }
  if (a.buy === 'used' && c.status === 'used') { sc += 2; why.push('easy to find used'); }
  if (a.buy === 'new' && c.status === 'prod') { sc += 2; why.push('still sold new'); }
  if (a.buy === 'new' && c.status !== 'prod') sc -= 5;
  if (a.size === 'pocket') { if (c.small) { sc += 1; why.push('fits a pocket'); } else sc -= 2; }
  if (a.budget === 'low') { if (!big(c)) sc += 1.5; else sc -= 2; }
  if (a.budget === 'mid' && (c.kind === 'superzoom' || /1\/1\.[78]"/.test(c.sensor))) { sc += 1.5; why.push('a step up in quality'); }
  if (a.budget === 'high') { if (big(c)) { sc += 2.5; why.push('big sensor for cleaner photos'); } else sc -= 1.5; }
  if (c.seen.length) {
    sc += 1 + Math.min(c.seen.length, 4) * 0.2;
    const shop = sourceById[c.seen[0].src]?.name;
    why.push(`sold before${shop ? ` by ${shop}` : ' in BD shops'}, so ask them for stock`);
  }
  c.perks.slice(0, 2).forEach((p) => why.push(p));
  return { score: sc, why };
}

interface Props { cams: Camera[]; onOpen: (id: string) => void; }

export function Advisor({ cams, onOpen }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const done = step >= questions.length;
  const current = questions[step];

  useLayoutEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(boxRef.current, { x: 50, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' });
  }, [step]);

  const choose = (key: string, v: string) => { setAnswers((p) => ({ ...p, [key]: v })); setStep((s) => s + 1); };
  const restart = () => { setAnswers({}); setStep(0); };

  // hand-checked cameras, plus anything people in BD are selling right now
  const picks = done
    ? cams.filter((c) => c.featured || c.seen.length)
        .map((c) => ({ c, ...score(c, answers) }))
        .sort((a, b) => b.score - a.score || (Number(b.c.year) || 0) - (Number(a.c.year) || 0))
        .slice(0, 3)
    : [];

  return (
    <div className="quiz">
      <div className="quiz-box" ref={boxRef}>
        {!done && current ? (
          <>
            <div className="quiz-step">Question {step + 1} of {questions.length}</div>
            <h2 className="disp quiz-q">{current.q}</h2>
            <div className="quiz-opts">
              {current.opts.map((o) => (
                <button key={o.v} type="button" className="quiz-opt" aria-pressed={answers[current.key] === o.v} onClick={() => choose(current.key, o.v)}>
                  <span>{o.label}<br /><small>{o.hint}</small></span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="quiz-step">Your matches</div>
            <h2 className="disp quiz-q">Start with one of these.</h2>
            <div className="picks">
              {picks.map((p, i) => (
                <button key={p.c.id} type="button" className="pick" onClick={() => onOpen(p.c.id)} aria-label={`Open ${fullName(p.c)}`}>
                  <CameraArt cam={p.c} width={120} />
                  <span style={{ minWidth: 0 }}>
                    <span className="pick-rank">PICK {i + 1} · {statusInfo[p.c.status].label.toUpperCase()}</span>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>{fullName(p.c)}</span>
                    <span className="pick-why">{p.why.length ? `${p.why.slice(0, 4).join(', ')}.` : p.c.best}</span>
                    {p.c.price && <span className="pick-why" style={{ color: 'var(--muted)' }}>Past price: {p.c.price}</span>}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="progress" aria-hidden="true">
          {questions.map((_, i) => <span key={i} className={i < step ? 'on' : ''} />)}
        </div>
        {step > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
            <button type="button" className="btn" onClick={() => setStep((s) => s - 1)}>Back</button>
            <button type="button" className="btn" onClick={restart}>Start over</button>
          </div>
        )}
      </div>
      <div className="quiz-box" style={{ background: 'transparent' }}>
        <div className="quiz-step">How we pick</div>
        <ul className="how">
          <li>What you want to shoot matters most.</li>
          <li>"Not sure" favours cameras that do a bit of everything.</li>
          <li>"New only" shows cameras still sold today.</li>
          <li>Budget matches sensor size: small for cheap, 1 inch and up for best quality.</li>
          <li>Cameras that BD shops and groups have sold get a boost, since they're the ones you're most likely to find. Check stock with the shop first.</li>
        </ul>
      </div>
    </div>
  );
}
