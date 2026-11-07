import { type Camera, brands, statusInfo, looks, fullName } from '../data/cameras';
import { sourceById } from '../data/sources';
import { CameraArt } from './CameraArt';

interface Props {
  cams: Camera[];
  a: string;
  b: string;
  setA: (id: string) => void;
  setB: (id: string) => void;
}

const dash = (v: string) => (v && v !== 'Not listed' ? v : 'Not listed');

const rows: { label: string; get: (c: Camera) => string }[] = [
  { label: 'Status', get: (c) => statusInfo[c.status].label },
  { label: 'Released', get: (c) => c.year },
  { label: 'Sensor', get: (c) => dash(c.sensor) },
  { label: 'Resolution', get: (c) => dash(c.res) },
  { label: 'Lens', get: (c) => dash(c.zoom) },
  { label: 'Fits a pocket', get: (c) => (c.small ? 'Yes' : 'No') },
  { label: 'Good for', get: (c) => c.looks.map((l) => looks.find((x) => x.id === l)!.name).join(', ') || 'Not listed' },
  { label: 'Stands out', get: (c) => c.perks.join(', ') || 'Not listed' },
  { label: 'Past price', get: (c) => c.price || 'Not seen in BD shops' },
  { label: 'Sold before by', get: (c) => [...new Set(c.seen.map((x) => sourceById[x.src]?.name))].join(', ') || 'Not seen in BD shops' },
];

export function Compare({ cams, a, b, setA, setB }: Props) {
  const ca = cams.find((c) => c.id === a) ?? cams[0];
  const cb = cams.find((c) => c.id === b) ?? cams[1];
  const picker = (id: string, value: string, set: (v: string) => void, label: string) => (
    <div className="cmp-pick">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => set(e.target.value)}>
        <optgroup label="Sold in BD shops">
          {cams.filter((c) => c.seen.length).map((c) => <option key={c.id} value={c.id}>{c.year} · {fullName(c)}</option>)}
        </optgroup>
        {brands.map((br) => (
          <optgroup key={br} label={br}>
            {cams.filter((c) => c.brand === br && !c.seen.length).map((c) => <option key={c.id} value={c.id}>{c.year} · {c.name}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  );

  return (
    <section id="compare" className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="cmp-pickers">
          {picker('cmp-a', ca.id, setA, 'First camera')}
          {picker('cmp-b', cb.id, setB, 'Second camera')}
        </div>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <tbody>
              <tr className="cmp-head">
                <th scope="row">Camera</th>
                <td><CameraArt cam={ca} width={150} /><div style={{ marginTop: 8, fontWeight: 600 }}>{fullName(ca)}</div></td>
                <td><CameraArt cam={cb} width={150} /><div style={{ marginTop: 8, fontWeight: 600 }}>{fullName(cb)}</div></td>
              </tr>
              {rows.map((r) => {
                const va = r.get(ca);
                const vb = r.get(cb);
                const diff = va !== vb;
                return (
                  <tr key={r.label} className={diff ? 'diff' : 'same'}>
                    <th scope="row">{r.label}{diff && <span className="diff-mark">DIFFERS</span>}</th>
                    <td>{va}</td>
                    <td>{vb}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
