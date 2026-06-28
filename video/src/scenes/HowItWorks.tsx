import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_OUT, FONTS} from '../theme';

// Real facts pulled straight from the contracts + tokenomics.
const PANELS = [
  {
    title: 'Set once. Charge forever.',
    sub: 'VirioSubscriptionManager — CEI-pattern, nonReentrant. No custody. No keys.',
  },
  {
    title: 'USDC flows to stakers.',
    sub: '0.25% protocol fee → 60% streamed to stVIRIO stakers. Onchain, automatically.',
  },
  {
    title: 'Base. Arbitrum. Ethereum.',
    sub: 'xERC20 — one canonical supply. Any chain. Any stablecoin. Any interval.',
  },
];

type PanelProps = {
  title: string;
  sub: string;
  appearAt: number;
  vertical: boolean;
};

const Panel: React.FC<PanelProps> = ({title, sub, appearAt, vertical}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  // Slide in from the right over 8 frames, then settle.
  const x = interpolate(local, [0, 8], [vertical ? 220 : 320, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Emerald pulse on arrival — a glow that spikes as the card lands, then fades.
  const pulse = interpolate(local, [6, 13, 34], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: COLORS.card,
        borderLeft: `${vertical ? 4 : 5}px solid ${COLORS.emerald}`,
        borderRadius: 14,
        padding: vertical ? '26px 28px' : '34px 44px',
        opacity,
        transform: `translateX(${x}px)`,
        boxShadow: `0 0 ${pulse * 60}px -10px ${COLORS.emerald}, inset ${vertical ? 4 : 5}px 0 ${
          pulse * 24
        }px -8px ${COLORS.emerald}`,
        // a faint constant emerald edge presence even after the pulse settles
        filter: `saturate(${1})`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: vertical ? 40 : 50,
          letterSpacing: '-0.035em',
          color: COLORS.text,
          lineHeight: 1.02,
          textShadow: pulse > 0 ? `0 0 ${pulse * 18}px ${COLORS.emerald}66` : 'none',
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: vertical ? 12 : 14,
          fontFamily: FONTS.body,
          fontWeight: 400,
          fontSize: vertical ? 23 : 27,
          letterSpacing: '-0.005em',
          color: COLORS.textDim,
          lineHeight: 1.4,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

export const HowItWorks: React.FC<{vertical: boolean}> = ({vertical}) => {
  const frame = useCurrentFrame();

  const stagger = 150;
  const base = 24;

  // Mono ticker line — the protocol's defining property, in code voice.
  const tickerIn = interpolate(frame, [base + stagger * 3, base + stagger * 3 + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const sceneOut = interpolate(frame, [710, 750], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOut,
        justifyContent: 'center',
        alignItems: 'center',
        padding: vertical ? '0 6%' : '0 12%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: vertical ? 940 : 1180,
          display: 'flex',
          flexDirection: 'column',
          gap: vertical ? 22 : 28,
        }}
      >
        {PANELS.map((p, i) => (
          <Panel key={i} title={p.title} sub={p.sub} appearAt={base + i * stagger} vertical={vertical} />
        ))}

        <div
          style={{
            marginTop: vertical ? 14 : 18,
            fontFamily: FONTS.mono,
            fontSize: vertical ? 18 : 21,
            color: COLORS.textDim,
            opacity: tickerIn * 0.85,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{color: COLORS.emerald}}>charge()</span> is permissionless — any executor settles, earns 0.1%.
        </div>
      </div>
    </AbsoluteFill>
  );
};
