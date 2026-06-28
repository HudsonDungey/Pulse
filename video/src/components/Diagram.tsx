import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_OUT, PROV, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';

// Shared primitives for the provocation video's diagrams. Two tones:
// 'fiat' — desaturated grey, dashed lines, bureaucratic.
// 'virio' — solid emerald, clean, inevitable.

const TONE = {
  fiat: {border: PROV.grey, text: PROV.greyText, line: PROV.grey, bg: PROV.boxBg},
  virio: {border: COLORS.emerald, text: COLORS.text, line: COLORS.emerald, bg: '#E6F3EC'},
} as const;

export type Tone = keyof typeof TONE;

type NodeBoxProps = {
  label: string;
  sub?: string; // bureaucratic annotation (orange) under the label
  at: number;
  tone: Tone;
  drop?: boolean; // spring drop with slight overshoot (the fiat stack)
  dim?: number; // 0..1 — greys the box out after the red X verdict
  mul?: number; // scene-exit opacity multiplier
  labelSize?: number;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
};

export const NodeBox: React.FC<NodeBoxProps> = ({
  label,
  sub,
  at,
  tone,
  drop = false,
  dim = 0,
  mul = 1,
  labelSize = 28,
  align = 'center',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame - at;
  const c = TONE[tone];

  const entrance = drop
    ? spring({frame: t, fps, config: {damping: 14, stiffness: 110, mass: 1}})
    : interpolate(t, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT});
  const y = interpolate(entrance, [0, 1], [-22, 0]);
  const fadeIn = interpolate(t, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        backgroundColor: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 14,
        padding: sub ? '20px 28px' : '24px 26px',
        textAlign: align,
        opacity: fadeIn * (1 - dim * 0.62) * mul,
        transform: `translateY(${y}px)`,
        filter: dim > 0 ? `saturate(${1 - dim})` : undefined,
        boxShadow:
          tone === 'virio'
            ? `0 16px 44px rgba(22,32,27,0.10), 0 0 36px ${COLORS.emerald}14`
            : '0 16px 44px rgba(22,32,27,0.10)',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: PROV_FONTS.mono,
          fontWeight: 500,
          fontSize: labelSize - 3,
          letterSpacing: '0.05em',
          color: c.text,
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      {sub ? (
        <div style={{marginTop: 8, fontFamily: PROV_FONTS.body, fontWeight: 400, fontSize: 22, color: PROV.orange, lineHeight: 1.35}}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

type VConnectorProps = {
  at: number;
  height: number;
  tone: Tone;
  id: string; // unique clipPath id
  dim?: number;
  mul?: number;
};

// Vertical connector with arrowhead. Fiat: dashed, dashes drift downward
// forever (the machine grinding on). Virio: solid emerald draw-in.
export const VConnector: React.FC<VConnectorProps> = ({at, height, tone, id, dim = 0, mul = 1}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const c = TONE[tone];
  const W = 28;

  const reveal = interpolate(t, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const head = interpolate(t, [13, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const travel = -frame * 0.9;

  return (
    <svg width={W} height={height} style={{display: 'block', opacity: (1 - dim * 0.62) * mul}}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={W} height={reveal * height} />
        </clipPath>
      </defs>
      <line
        x1={W / 2}
        y1={0}
        x2={W / 2}
        y2={height - 11}
        stroke={c.line}
        strokeWidth={2}
        strokeDasharray={tone === 'fiat' ? '9 7' : undefined}
        strokeDashoffset={tone === 'fiat' ? travel : undefined}
        clipPath={`url(#${id})`}
      />
      <polygon points={`${W / 2},${height} ${W / 2 - 6},${height - 11} ${W / 2 + 6},${height - 11}`} fill={c.line} opacity={head} />
    </svg>
  );
};

type HConnectorProps = {
  at: number;
  width: number;
  // Looping heartbeat dot. `window` selects this connector's slice of a loop
  // shared across connectors, so the dot appears to travel the whole path.
  pulse?: {start: number; cycle: number; window: [number, number]};
  mul?: number;
};

// Horizontal solid-emerald connector that draws itself, then carries a pulse.
export const HConnector: React.FC<HConnectorProps> = ({at, width, pulse, mul = 1}) => {
  const frame = useCurrentFrame();
  const t = frame - at;

  const draw = interpolate(t, [0, 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const head = interpolate(t, [15, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  let dotOpacity = 0;
  let dotX = 0;
  if (pulse && frame >= pulse.start) {
    const p = ((frame - pulse.start) % pulse.cycle) / pulse.cycle;
    const [w0, w1] = pulse.window;
    if (p >= w0 && p < w1) {
      const q = (p - w0) / (w1 - w0);
      dotX = 4 + q * (width - 20);
      dotOpacity = Math.sin(q * Math.PI);
    }
  }

  return (
    <svg width={width} height={28} style={{display: 'block', opacity: mul}}>
      <line
        x1={2}
        y1={14}
        x2={width - 13}
        y2={14}
        stroke={COLORS.emerald}
        strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
      />
      <polygon points={`${width - 2},14 ${width - 13},8 ${width - 13},20`} fill={COLORS.emerald} opacity={head} />
      <circle cx={dotX} cy={14} r={5} fill={COLORS.emerald} opacity={dotOpacity * 0.95} />
    </svg>
  );
};

// Mono section marker above each scene title — "01 · The toll".
export const Eyebrow: React.FC<{text: string; at: number; mul?: number}> = ({text, at, mul = 1}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        fontFamily: PROV_FONTS.mono,
        fontSize: 19,
        fontWeight: 500,
        letterSpacing: '0.34em',
        textTransform: 'uppercase',
        color: COLORS.emerald,
        opacity: o * mul,
      }}
    >
      {text}
    </div>
  );
};

type FeeTagProps = {
  text: string;
  at: number;
  mul?: number;
  style?: React.CSSProperties;
};

// Small red fee pill — scales in from nothing, centre origin.
export const FeeTag: React.FC<FeeTagProps> = ({text, at, mul = 1, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 13, stiffness: 160, mass: 0.8}});
  const opacity = frame < at ? 0 : mul;

  return (
    <div
      style={{
        display: 'inline-block',
        border: `1.5px solid ${COLORS.red}`,
        backgroundColor: `${COLORS.red}14`,
        color: COLORS.red,
        borderRadius: 999,
        padding: '7px 16px',
        fontFamily: PROV_FONTS.mono,
        fontWeight: 500,
        fontSize: 20,
        whiteSpace: 'nowrap',
        opacity,
        transform: `scale(${s})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
