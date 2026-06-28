// SCENE 3 — ship it. Terminal slides up, `git push`, deploy goes live, and the
// editor rectangle MORPHS into the browser window. The signature transition:
// one container interpolates geometry while editor chrome cross-dissolves into
// browser chrome and the address bar types itself in.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BrowserFrame} from '../BrowserFrame';
import {CodeEditor} from '../CodeEditor';
import {Terminal} from '../Terminal';
import {browserRect, C, EASE_IN_OUT, editorRect, lerpRect} from '../theme';
import {Eyebrow} from '../ui';
import {pricingLines} from './pricingCode';

const T = {
  termSlide: 4,
  termType: 12,
  deploy: 30,
  live: 48,
  morphStart: 60,
  morphEnd: 88,
};

const URL = 'https://forge.dev/pricing';

export const S3ShipMorph: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const frame = useCurrentFrame();
  const eRect = editorRect(vertical);
  const bRect = browserRect(vertical);

  const morphT = interpolate(frame, [T.morphStart, T.morphEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });
  const r = lerpRect(eRect, bRect, morphT);

  // Editor world fades/blurs out; browser world fades in slightly behind it.
  const editorOpacity = interpolate(frame, [T.morphStart, T.morphStart + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const browserOpacity = interpolate(frame, [T.morphStart + 8, T.morphStart + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const urlChars = Math.floor(
    interpolate(frame, [T.morphStart + 14, T.morphEnd], [0, URL.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // One emerald pulse around the frame at handoff.
  const glow = interpolate(
    frame,
    [T.morphStart + 10, T.morphStart + 22, T.morphEnd + 4],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg}}>
      <div
        style={{
          position: 'absolute',
          left: r.x,
          top: r.y,
          width: r.w,
          height: r.h,
          borderRadius: r.r,
          overflow: 'hidden',
          border: `1px solid ${C.edBorder}`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.55), 0 0 ${50 * glow}px ${C.emerald}${glow > 0 ? '44' : '00'}`,
        }}
      >
        {/* Browser world (revealed beneath as the editor dissolves) */}
        <div style={{position: 'absolute', inset: 0, opacity: browserOpacity}}>
          <BrowserFrame url={URL} urlChars={urlChars} />
        </div>

        {/* Editor world */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: editorOpacity,
            filter: morphT > 0 ? `blur(${morphT * 6}px)` : undefined,
          }}
        >
          <CodeEditor lines={pricingLines()} showTree={!vertical} fontSize={vertical ? 17 : 21} />
          <Terminal
            slideFrom={T.termSlide}
            typeFrom={T.termType}
            deployAt={T.deploy}
            liveAt={T.live}
          />
        </div>
      </div>

      <Eyebrow text="STEP 03 — SHIP" from={4} />
    </div>
  );
};
