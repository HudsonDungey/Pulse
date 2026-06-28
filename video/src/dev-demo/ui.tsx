// Small shared pieces: scene eyebrow, toast, click ripple.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, FONTS} from './theme';

export const Eyebrow: React.FC<{
  text: string;
  from: number;
  dark?: boolean; // dark text for light backgrounds
}> = ({text, from, dark}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - t) * -12}px)`,
        opacity: t,
        fontFamily: FONTS.mono,
        fontSize: 15,
        letterSpacing: '0.22em',
        color: dark ? C.emeraldDark : C.emerald,
        zIndex: 50,
      }}
    >
      {text}
    </div>
  );
};

export const Toast: React.FC<{
  text: string;
  from: number;
  until?: number;
  // Position within the parent (absolute). Defaults to bottom-right.
  style?: React.CSSProperties;
}> = ({text, from, until, style}) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [from, from + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const outT = until
    ? interpolate(frame, [until - 10, until], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  if (frame < from) return null;
  return (
    <div
      style={{
        position: 'absolute',
        right: 28,
        bottom: 28,
        padding: '13px 20px',
        borderRadius: 12,
        background: C.card,
        border: `1px solid ${C.emerald}55`,
        color: C.emerald,
        fontFamily: FONTS.body,
        fontSize: 17,
        fontWeight: 600,
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        opacity: inT * outT,
        transform: `translateY(${(1 - inT) * 16}px)`,
        zIndex: 60,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Expanding ring at a click point.
export const ClickRipple: React.FC<{x: number; y: number; at: number; light?: boolean}> = ({
  x,
  y,
  at,
  light,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + 18) return null;
  const t = (frame - at) / 18;
  const r = 8 + t * 34;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `2px solid ${light ? C.uiInk : C.emerald}`,
        opacity: (1 - t) * 0.6,
        zIndex: 90,
        pointerEvents: 'none',
      }}
    />
  );
};
