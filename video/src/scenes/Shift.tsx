import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_IN_OUT, EASE_OUT, FONTS} from '../theme';
import {LoopGlyph} from '../components/LoopGlyph';
import {NetworkGraph} from '../components/NetworkGraph';

// Scene 2 — The Shift (15–35s). The loop signs itself, the name lands, then we
// pull back to find the loop was one node in a living network.
export const Shift: React.FC<{vertical: boolean}> = ({vertical}) => {
  const frame = useCurrentFrame();

  const loopSize = vertical ? 200 : 240;

  // Name + tagline arrive after the loop is mostly drawn.
  const nameIn = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const nameY = interpolate(frame, [120, 150], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const taglineIn = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // The pull-back: the central cluster shrinks and the graph resolves around it.
  const pullBack = interpolate(frame, [235, 380], [1.22, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });
  const graphIn = interpolate(frame, [240, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const sceneOut = interpolate(frame, [578, 600], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const name = (
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: 900,
        fontSize: vertical ? 110 : 168,
        letterSpacing: '-0.045em',
        color: COLORS.text,
        lineHeight: 0.9,
        opacity: nameIn,
        transform: `translateY(${nameY}px)`,
      }}
    >
      Virio
    </div>
  );

  const tagline = (
    <div
      style={{
        marginTop: vertical ? 18 : 22,
        fontFamily: FONTS.body,
        fontWeight: 500,
        fontSize: vertical ? 26 : 34,
        letterSpacing: '-0.01em',
        color: COLORS.textDim,
        opacity: taglineIn,
      }}
    >
      Permissionless. Onchain. Unstoppable.
    </div>
  );

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <AbsoluteFill style={{opacity: graphIn}}>
        <NetworkGraph startFrame={235} vertical={vertical} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${pullBack})`,
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            gap: vertical ? 28 : 56,
          }}
        >
          {/* loop glyph sits where the hub node lives */}
          <LoopGlyph size={loopSize} startFrame={20} drawDuration={110} />
          <div style={{textAlign: vertical ? 'center' : 'left'}}>
            {name}
            {tagline}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
