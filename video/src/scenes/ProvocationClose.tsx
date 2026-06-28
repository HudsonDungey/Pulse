import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';

// Scene 5 — the close (75–90s). Lines land one by one, unhurried.
const LINES: {text: string; at: number}[] = [
  {text: 'Subscription billing has had the same architecture since 1950.', at: 20},
  {text: 'Virio is the first time the infrastructure itself is neutral.', at: 70},
  {text: 'No bank. No gateway. No disputes department.', at: 120},
  {text: 'Just a contract. And a schedule.', at: 160},
];

export const ProvocationClose: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = (at: number) =>
    interpolate(frame, [at, at + 24], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });

  const sceneOut = interpolate(frame, [418, 446], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: sceneOut, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8%'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
        {LINES.map(({text, at}, i) => {
          const o = fade(at);
          const isKicker = i === LINES.length - 1; // the closing line gets the serif voice
          return (
            <div
              key={text}
              style={{
                fontFamily: isKicker ? PROV_FONTS.serif : PROV_FONTS.display,
                fontStyle: isKicker ? 'italic' : undefined,
                fontWeight: isKicker ? 400 : 900,
                fontSize: isKicker ? 52 : 44,
                letterSpacing: isKicker ? '-0.01em' : '-0.03em',
                lineHeight: 1.25,
                color: isKicker ? COLORS.emerald : COLORS.text,
                opacity: o,
                transform: `translateY(${interpolate(o, [0, 1], [14, 0])}px)`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      <div style={{marginTop: 64, display: 'flex', flexDirection: 'column', gap: 10}}>
        <div style={{fontFamily: PROV_FONTS.display, fontWeight: 900, fontSize: 31, letterSpacing: '-0.02em', color: COLORS.emerald, opacity: fade(222)}}>
          Permissionless recurring payments.
        </div>
        <div style={{fontFamily: PROV_FONTS.display, fontWeight: 900, fontSize: 31, letterSpacing: '-0.02em', color: COLORS.emerald, opacity: fade(244)}}>
          Built on EVM chains.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 150,
          fontFamily: PROV_FONTS.mono,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: '0.12em',
          color: COLORS.textDim,
          opacity: fade(305),
        }}
      >
        virio.xyz
      </div>
    </AbsoluteFill>
  );
};
