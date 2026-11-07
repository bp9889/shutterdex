import { Fragment } from 'react';

/** A big chrome title split into words, each inside its own mask, so motion.ts can raise them one by one. */
export function SplitTitle({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <span className="split-title" aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="title-mask" aria-hidden="true"><span className="title-word chrome">{w}</span></span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
