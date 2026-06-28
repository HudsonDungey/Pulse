import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_OUT, FONTS} from '../theme';

const MANIFESTO_LINES = ['Built on Ethereum.', 'Owned by no one.', 'Stopped by nothing.'];

// Scene 4 — The Manifesto Close (60–90s). The old name is struck out in red,
// the new doctrine arrives in emerald, then everything settles to black.
export const Close: React.FC<{vertical: boolean}> = ({vertical}) => {
  const frame = useCurrentFrame();

  const titleSize = vertical ? 78 : 128;
  const lineSize = vertical ? 42 : 64;

  const titleIn = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // The slash — fast, near single-frame. scaleX snaps across the wordmark.
  const SLASH = 120;
  const slash = interpolate(frame, [SLASH, SLASH + 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // White impact flash for one frame as the slash connects.
  const flash = interpolate(frame, [SLASH - 1, SLASH, SLASH + 3], [0, 0.32, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // "Legacy billing" dims the instant it's cut.
  const titleDim = interpolate(frame, [SLASH + 1, SLASH + 22], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const url = interpolate(frame, [700, 742], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Final settle to black.
  const fadeOut = interpolate(frame, [864, 898], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: fadeOut, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      {/* Struck-out wordmark */}
      <div style={{position: 'relative', display: 'inline-block', opacity: titleIn}}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: titleSize,
            letterSpacing: '-0.04em',
            color: COLORS.text,
            opacity: titleDim,
            lineHeight: 1,
          }}
        >
          Legacy billing
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-2%',
            width: '104%',
            height: vertical ? 8 : 12,
            background: COLORS.red,
            transform: `translateY(-50%) scaleX(${slash})`,
            transformOrigin: 'left center',
            borderRadius: 2,
            boxShadow: `0 0 ${slash * 24}px ${COLORS.red}`,
          }}
        />
      </div>

      {/* New doctrine, emerald */}
      <div style={{marginTop: vertical ? 56 : 64, display: 'flex', flexDirection: 'column', gap: vertical ? 10 : 12}}>
        {MANIFESTO_LINES.map((line, i) => {
          const begin = 168 + i * 34;
          const o = interpolate(frame, [begin, begin + 26], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_OUT,
          });
          const y = interpolate(frame, [begin, begin + 26], [18, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE_OUT,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: lineSize,
                letterSpacing: '-0.04em',
                color: COLORS.emerald,
                lineHeight: 1.04,
                opacity: o,
                transform: `translateY(${y}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* URL */}
      <div
        style={{
          position: 'absolute',
          bottom: vertical ? 120 : 70,
          fontFamily: FONTS.body,
          fontWeight: 500,
          fontSize: vertical ? 26 : 24,
          letterSpacing: '0.04em',
          color: COLORS.textDim,
          opacity: url,
        }}
      >
        virio.xyz
      </div>

      {/* Impact flash */}
      <AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
