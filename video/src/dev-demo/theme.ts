// Dev-demo video — design tokens, timing map, shared geometry.
// Every color in the video comes from here; components never hardcode hex.

import {Easing} from 'remotion';

// ─── Brand (Virio dark world: editor backdrop, closing diagram) ──────────────
export const C = {
  bg: '#0D0F0E',
  emerald: '#3DD9A4',
  emeraldDark: '#0B8F69', // accent on light surfaces
  white: '#F0F2F1',
  dim: '#8A9A94',
  danger: '#E84040',
  card: '#1A1F1D',
  // Light UI surfaces — the REAL Virio app + checkout modal are white/black.
  uiBg: '#F7F7F6',
  uiCard: '#FFFFFF',
  uiBorder: '#E6E7E6',
  uiBorderSoft: '#F0F0EF',
  uiInk: '#0B0C0B',
  uiMuted: '#6E7672',
  uiSuccess: '#0A7D33',
  // Editor (VS Code dark+)
  edBg: '#1E1F1E',
  edChrome: '#161716',
  edBorder: '#2A2C2A',
  edGutter: '#5A625E',
  edDimCode: '#6E7672',
  // Syntax
  synKeyword: '#C586C0',
  synString: '#CE9178',
  synComponent: '#3DD9A4',
  synProp: '#9CDCFE',
  synPlain: '#D4D4D4',
  synComment: '#6A9955',
  synPunct: '#808880',
  // Forge (the fake SaaS) — subtle dark product
  forgeBg: '#0B0D10',
  forgeCard: '#12151A',
  forgeBorder: '#222730',
  forgeInk: '#EDEFF2',
  forgeMuted: '#8B93A0',
  forgeAccent: '#3DD9A4',
  // Wallet (swappable branding lives in WalletBrand.tsx, but neutrals here)
  walletBg: '#FFFFFF',
  walletInk: '#141618',
  walletMuted: '#6A737D',
  walletBorder: '#E8EAED',
  walletBlue: '#0376C9',
} as const;

export const FONTS = {
  display: "'Inter Tight', ui-sans-serif, -apple-system, sans-serif",
  body: "'Inter', ui-sans-serif, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1); // expoOut entrances
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

// ─── The continuity thread ───────────────────────────────────────────────────
// One Plan ID for the whole video: generated in S1, pasted in S2, powers S4–S7.
// Real format: bytes32 = keccak256(merchant ‖ nonce ‖ chainId).
export const PLAN_ID =
  '0x8f4e2a91c7b3d6e5f0a1829bd4c6371e9b0a5d8c2f7e4b1a6d3c9085e7f2ab4d';
export const PLAN_ID_SHORT = '0x8f4e…ab4d';
export const MERCHANT_WALLET = '0x22A1…Eec7'; // matches the dashboard screenshot
export const CUSTOMER_WALLET = '0x3F2d…8B41';
export const VIRIO_CONTRACT_SHORT = '0x7C3a…9F42';

// ─── Timing map: 1350 frames @ 30fps ─────────────────────────────────────────
export const FPS = 30;
export const TOTAL = 1350;
export const TL = {
  s1: {from: 0, dur: 195}, // create plan in the Virio app
  s2: {from: 195, dur: 225}, // 3-line integration
  s3: {from: 420, dur: 90}, // ship + editor→browser morph
  s4: {from: 510, dur: 150}, // live Forge site, click subscribe
  s5: {from: 660, dur: 120}, // Virio checkout modal
  s6: {from: 780, dur: 330}, // wallet connect / approve / subscribe tx
  s7: {from: 1110, dur: 240}, // success + loop diagram + close
} as const;

// ─── Shared geometry (the morph depends on these matching across scenes) ─────
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export function editorRect(vertical: boolean): Rect {
  return vertical
    ? {x: 24, y: 240, w: 1032, h: 1380, r: 18}
    : {x: 110, y: 64, w: 1700, h: 952, r: 18};
}

export function browserRect(vertical: boolean): Rect {
  return vertical
    ? {x: 24, y: 240, w: 1032, h: 1380, r: 14}
    : {x: 190, y: 96, w: 1540, h: 888, r: 14};
}

export function lerpRect(a: Rect, b: Rect, t: number): Rect {
  const m = (p: number, q: number) => p + (q - p) * t;
  return {x: m(a.x, b.x), y: m(a.y, b.y), w: m(a.w, b.w), h: m(a.h, b.h), r: m(a.r, b.r)};
}
