// Browser window chrome. The morph target in S3 and the stage for S4–S7.

import React from 'react';
import {C, FONTS} from './theme';

interface Props {
  url?: string;
  urlChars?: number; // how many URL characters are visible (morph types it in)
  chromeOpacity?: number;
  children?: React.ReactNode;
}

export const BrowserFrame: React.FC<Props> = ({
  url = 'https://forge.dev/pricing',
  urlChars,
  chromeOpacity = 1,
  children,
}) => {
  const visibleUrl = urlChars === undefined ? url : url.slice(0, Math.max(0, urlChars));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: C.forgeBg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 64,
          background: '#15181D',
          borderBottom: `1px solid ${C.forgeBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px',
          flexShrink: 0,
          opacity: chromeOpacity,
        }}
      >
        <div style={{display: 'flex', gap: 9}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 13, height: 13, borderRadius: '50%', background: c}} />
          ))}
        </div>
        <div style={{display: 'flex', gap: 14, color: C.forgeMuted, fontSize: 18}}>
          <span>←</span>
          <span style={{opacity: 0.4}}>→</span>
          <span>⟳</span>
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 720,
            margin: '0 auto',
            height: 38,
            borderRadius: 19,
            background: C.forgeBg,
            border: `1px solid ${C.forgeBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            fontFamily: FONTS.body,
            fontSize: 16,
            color: C.forgeInk,
          }}
        >
          {/* lock glyph */}
          <svg width="13" height="15" viewBox="0 0 13 15">
            <rect x="1" y="6" width="11" height="8" rx="2" fill={C.forgeMuted} />
            <path
              d="M3.5 6 V4.5 a3 3 0 0 1 6 0 V6"
              stroke={C.forgeMuted}
              strokeWidth="1.8"
              fill="none"
            />
          </svg>
          <span>
            {visibleUrl}
            {urlChars !== undefined && urlChars < url.length && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  background: C.forgeInk,
                  verticalAlign: 'middle',
                }}
              />
            )}
          </span>
        </div>
        <div style={{width: 80}} />
      </div>
      <div style={{flex: 1, position: 'relative', minHeight: 0}}>{children}</div>
    </div>
  );
};
