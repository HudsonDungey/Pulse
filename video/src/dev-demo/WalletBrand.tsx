// ⚠️ TRADEMARK ISOLATION POINT.
// Every piece of wallet branding — name, fox mark, orange accent — lives in
// this file and nowhere else. To ship a public cut with a generic wallet,
// change BRAND below (e.g. name: 'Wallet', accent: '#4F6BFF', generic mark)
// and the rest of the video follows.

import React from 'react';

export const BRAND = {
  name: 'MetaMask',
  accent: '#F6851B',
  accentDark: '#763E1A',
} as const;

// Simplified geometric fox head (pixel-close silhouette, hand-drawn polygons).
export const WalletMark: React.FC<{size?: number}> = ({size = 30}) => (
  <svg width={size} height={size} viewBox="0 0 32 30">
    {/* ears + head */}
    <path d="M2 1 L13 9 L11 13 L4 24 L9 27 L13 24 H19 L23 27 L28 24 L21 13 L19 9 L30 1 L18 7 H14 Z" fill={BRAND.accent} />
    {/* darker snout */}
    <path d="M11 13 L16 21 L21 13 L19 9 H13 Z" fill="#E2761B" />
    <path d="M13 24 L16 21 L19 24 H13 Z" fill={BRAND.accentDark} />
    {/* eyes */}
    <circle cx="11.5" cy="14.5" r="1.3" fill="#161616" />
    <circle cx="20.5" cy="14.5" r="1.3" fill="#161616" />
  </svg>
);

export const WalletWordmark: React.FC<{size?: number; color?: string}> = ({
  size = 17,
  color = '#161616',
}) => (
  <span
    style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 750,
      fontSize: size,
      letterSpacing: '-0.01em',
      color,
    }}
  >
    {BRAND.name}
  </span>
);
