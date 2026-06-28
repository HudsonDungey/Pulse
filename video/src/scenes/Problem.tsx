import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_OUT, FONTS} from '../theme';
import {LetterReveal} from '../components/LetterReveal';
import {CircuitGrid} from '../components/CircuitGrid';

// Scene 1 — The Problem (0–15s). Black, accusatory copy, a stat that ticks up,
// circuit grid waking behind it.
export const Problem: React.FC<{vertical: boolean}> = ({vertical}) => {
  const frame = useCurrentFrame();

  const h1 = vertical ? 46 : 60;
  const h2 = vertical ? 30 : 40;
  const statBig = vertical ? 96 : 140;

  // Line 2 fades up as a block.
  const line2 = interpolate(frame, [150, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const line2Y = interpolate(frame, [150, 178], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // First two lines clear out fully before the stat takes the frame.
  const linesFade = interpolate(frame, [238, 262], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Stat block — arrives after the lines are gone, owns the frame.
  const statIn = interpolate(frame, [266, 292], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const counter = interpolate(frame, [276, 372], [0, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const onchain = interpolate(frame, [382, 410], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const sceneOut = interpolate(frame, [428, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <CircuitGrid startFrame={40} vertical={vertical} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: vertical ? '0 8%' : '0 12%',
          textAlign: 'center',
        }}
      >
        <div style={{opacity: linesFade, maxWidth: vertical ? 900 : 1300}}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontWeight: 600,
              fontSize: h1,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: COLORS.text,
            }}
          >
            <LetterReveal text="Every 30 days," startFrame={12} />
            <br />
            <LetterReveal text="someone manually charges you." startFrame={40} />
          </div>

          <div
            style={{
              marginTop: vertical ? 36 : 44,
              fontFamily: FONTS.body,
              fontWeight: 500,
              fontSize: h2,
              letterSpacing: '-0.01em',
              color: COLORS.textDim,
              opacity: line2,
              transform: `translateY(${line2Y}px)`,
            }}
          >
            Middleware. Intermediaries. Permission required.
          </div>
        </div>

        {/* Stat overlay — absolutely centred so it owns the frame on arrival. */}
        <div
          style={{
            position: 'absolute',
            opacity: statIn,
            textAlign: 'center',
            transform: `translateY(${interpolate(statIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: statBig,
              letterSpacing: '-0.04em',
              color: COLORS.text,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${counter.toFixed(1)}T
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: FONTS.body,
              fontWeight: 500,
              fontSize: h2,
              color: COLORS.textDim,
              letterSpacing: '-0.01em',
            }}
          >
            in subscription revenue.
          </div>
          <div
            style={{
              marginTop: vertical ? 28 : 24,
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: vertical ? 38 : 52,
              letterSpacing: '-0.03em',
              color: COLORS.emerald,
              opacity: onchain,
            }}
          >
            None of it onchain.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
