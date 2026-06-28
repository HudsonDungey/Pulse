// Virio manifesto — design tokens.
// Strict visual identity. Secondary "slate-blue" has been replaced with black
// per direction: the only depth color is black, layered against near-black bg.

export const COLORS = {
  bg: '#0D0F0E', // near-black background
  emerald: '#3DD9A4', // primary accent
  secondary: '#000000', // was slate-blue #2A3A4A — now pure black (depth)
  text: '#F0F2F1', // off-white headlines
  textDim: '#8A9A94', // supporting text
  card: '#1A1F1D', // panel surface
  red: '#E84040', // single-frame slash impact
} as const;

// Provocation video — light mode. Warm paper, ink text, deep emerald accent.
// Scoped to the provocation; the manifesto stays on COLORS above.
export const PROV_COLORS = {
  bg: '#F7F5F0', // warm paper background
  emerald: '#0B8F69', // primary accent, darkened for light bg
  text: '#16201B', // ink headlines
  textDim: '#6E7A73', // supporting text
  card: '#FFFFFF', // panel surface
  red: '#D63A3A', // slash / fee impact
} as const;

// Provocation video — the fiat world vs the Virio world (light-mode variants).
export const PROV = {
  grey: '#9AA29D', // desaturated legacy borders/lines
  greyText: '#5C645F', // readable label inside grey boxes
  orange: '#B26A26', // bureaucratic annotations
  boxBg: '#EFEDE5', // fiat box surface
} as const;

// Provocation type system — same family as the website (Inter Tight display,
// Inter body, JetBrains Mono). Serif italic stays for the provocation voice.
// Loaded via @remotion/google-fonts in Provocation.tsx.
export const PROV_FONTS = {
  display: "'Inter Tight', ui-sans-serif, -apple-system, sans-serif",
  body: "'Inter', ui-sans-serif, -apple-system, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as const;

export const FONTS = {
  display: "'Inter Tight', ui-sans-serif, -apple-system, system-ui, sans-serif",
  body: "'Inter', ui-sans-serif, -apple-system, system-ui, sans-serif",
  mono: "ui-monospace, 'SF Mono', Menlo, 'JetBrains Mono', monospace",
} as const;

// Composition timing — 30fps. Scene boundaries in frames.
export const FPS = 30;
export const SCENES = {
  problem: {from: 0, durationInFrames: 450}, //  0–15s
  shift: {from: 450, durationInFrames: 600}, // 15–35s
  howItWorks: {from: 1050, durationInFrames: 750}, // 35–60s
  close: {from: 1800, durationInFrames: 900}, // 60–90s
} as const;

export const TOTAL_FRAMES = 2700; // 90s @ 30fps

// Infrastructure-grade easing: weighted, never bouncy.
import {Easing} from 'remotion';
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.5, 0, 0.75, 0);
