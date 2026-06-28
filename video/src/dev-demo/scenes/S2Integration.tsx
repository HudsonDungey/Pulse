// SCENE 2 — the integration. Import typed, the Plan ID from Scene 1 PASTED
// (clipboard chip → emerald flash), onSuccess, done. Three beats.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CodeEditor} from '../CodeEditor';
import {C, EASE_OUT, editorRect, FONTS, PLAN_ID_SHORT} from '../theme';
import {Eyebrow, Toast} from '../ui';
import {pricingLines} from './pricingCode';

const T = {
  importAt: 20,
  jsxAt: 62,
  chipAt: 74, // clipboard chip appears
  pasteAt: 86,
  onSuccessAt: 100,
  closeAt: 122,
  toastAt: 138,
};

export const S2Integration: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const frame = useCurrentFrame();
  const r = editorRect(vertical);
  const inT = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const lines = pricingLines(T);

  // Clipboard chip: floats in near the paste line, dissolves on paste.
  const chipIn = interpolate(frame, [T.chipAt, T.chipAt + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const chipOut = interpolate(frame, [T.pasteAt, T.pasteAt + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chipVisible = frame >= T.chipAt && frame <= T.pasteAt + 8;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, opacity: inT}}>
      <div
        style={{
          position: 'absolute',
          left: r.x,
          top: r.y,
          width: r.w,
          height: r.h,
          borderRadius: r.r,
          overflow: 'hidden',
          boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
          border: `1px solid ${C.edBorder}`,
          transform: `translateY(${(1 - inT) * 24}px)`,
        }}
      >
        <CodeEditor lines={lines} showTree={!vertical} fontSize={vertical ? 17 : 21} />

        {chipVisible && (
          <div
            style={{
              position: 'absolute',
              left: vertical ? 120 : 460,
              top: vertical ? 470 : 576,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              borderRadius: 10,
              background: C.card,
              border: `1px solid ${C.emerald}66`,
              fontFamily: FONTS.mono,
              fontSize: 15.5,
              color: C.white,
              opacity: chipIn * chipOut,
              transform: `translateY(${(1 - chipIn) * 10 + (1 - chipOut) * 14}px)`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                color: C.bg,
                background: C.emerald,
                borderRadius: 5,
                padding: '2px 7px',
                fontWeight: 700,
              }}
            >
              ⌘V
            </span>
            {PLAN_ID_SHORT}
            <span style={{color: C.dim, fontSize: 13}}>from clipboard</span>
          </div>
        )}

        <Toast
          text="✓ 3 lines. That's the integration."
          from={T.toastAt}
          style={{right: 24, bottom: 24}}
        />
      </div>

      <Eyebrow text="STEP 02 — INSTALL" from={6} />
    </div>
  );
};
