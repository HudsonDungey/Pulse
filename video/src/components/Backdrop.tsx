import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PROV_COLORS as COLORS} from '../theme';

// Layered atmosphere behind the provocation video. Replaces the flat fill:
// a tonal glow (cold during the fiat half, emerald once Virio enters), a
// blueprint grid drifting almost imperceptibly, and an edge vignette.
// Everything derives from the frame number — deterministic across renders.
export const Backdrop: React.FC<{glow: string}> = ({glow}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.18) % 88; // grid cell is 88px, so the loop is seamless

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Tonal glows — one high, one low, both faint. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 55% at 50% -8%, ${glow}26 0%, transparent 62%),
            radial-gradient(90% 40% at 18% 108%, ${glow}14 0%, transparent 60%)`,
        }}
      />

      {/* Blueprint grid, drifting diagonally. */}
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.05}}>
        <defs>
          <pattern id="bd-grid" width={88} height={88} patternUnits="userSpaceOnUse" patternTransform={`translate(${-drift} ${-drift * 0.55})`}>
            <path d="M 88 0 L 0 0 0 88" fill="none" stroke={COLORS.text} strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bd-grid)" />
      </svg>

      {/* Vignette — keeps focus centred, kills the flat-poster look. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(85% 70% at 50% 46%, transparent 55%, ${COLORS.bg} 130%)`,
          opacity: 0.85,
        }}
      />
    </AbsoluteFill>
  );
};
