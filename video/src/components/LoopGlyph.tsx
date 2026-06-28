import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_IN_OUT} from '../theme';

type Props = {
  size: number;
  startFrame: number;
  drawDuration?: number;
};

// The real Virio logomark (virio-logo.svg) — a recurring loop. The arc draws
// itself like a signature, then the start-dot lands. pathLength=1 lets us drive
// the stroke with a normalised dashoffset regardless of geometry.
export const LoopGlyph: React.FC<Props> = ({size, startFrame, drawDuration = 90}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;

  const draw = interpolate(t, [0, drawDuration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });

  const dotIn = interpolate(t, [drawDuration - 14, drawDuration + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });

  // Soft emerald glow swells as the loop nears completion.
  const glow = interpolate(t, [0, drawDuration], [0, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{filter: `drop-shadow(0 0 ${glow}px ${COLORS.emerald})`}}
    >
      <path
        d="M16 4 A12 12 0 1 1 4 16"
        stroke={COLORS.emerald}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
      />
      <circle cx={16} cy={4} r={2.5 * (0.6 + dotIn * 0.4)} fill={COLORS.emerald} opacity={dotIn} />
    </svg>
  );
};
