// Integrated terminal panel for the ship beat. Slides up inside the editor.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, FONTS} from './theme';

interface Props {
  slideFrom: number; // panel slides up
  typeFrom: number; // `git push` typing begins
  deployAt: number; // "▲ Deploying…" appears
  liveAt: number; // "✓ Live at forge.dev"
  opacity?: number;
}

const CMD = 'git push origin main';

export const Terminal: React.FC<Props> = ({slideFrom, typeFrom, deployAt, liveAt, opacity = 1}) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [slideFrom, slideFrom + 14], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  if (frame < slideFrom) return null;

  const typed = Math.max(0, Math.min(CMD.length, Math.floor((frame - typeFrom) * 1.6)));
  const dots = '.'.repeat((Math.floor(Math.max(0, frame - deployAt) / 8) % 3) + 1);
  const caretOn = Math.floor(frame / 14) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 236,
        background: C.edChrome,
        borderTop: `1px solid ${C.edBorder}`,
        transform: `translateY(${slide * 236}px)`,
        fontFamily: FONTS.mono,
        fontSize: 19,
        padding: '14px 26px',
        opacity,
      }}
    >
      <div style={{color: C.edGutter, fontSize: 13, letterSpacing: '0.14em', marginBottom: 12}}>
        TERMINAL
      </div>
      <div style={{color: C.synPlain, lineHeight: 1.9}}>
        <div>
          <span style={{color: C.emerald}}>➜</span>{' '}
          <span style={{color: C.synProp}}>forge-web</span>{' '}
          <span style={{color: C.edGutter}}>git:(main)</span> {CMD.slice(0, typed)}
          {typed < CMD.length && frame >= typeFrom && caretOn && (
            <span
              style={{
                display: 'inline-block',
                width: 11,
                height: 21,
                background: C.white,
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </div>
        {frame >= deployAt && (
          <div style={{color: C.synPlain}}>
            ▲ Deploying{frame < liveAt ? dots : '…'}{' '}
            <span style={{color: C.edGutter}}>forge-web · production</span>
          </div>
        )}
        {frame >= liveAt && (
          <div style={{color: C.emerald, fontWeight: 700}}>
            ✓ Live at <span style={{textDecoration: 'underline'}}>https://forge.dev</span>
          </div>
        )}
      </div>
    </div>
  );
};
