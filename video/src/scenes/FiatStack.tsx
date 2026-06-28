import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';
import {Eyebrow, NodeBox, VConnector} from '../components/Diagram';

// Scene 2 — "Meet the subscription stack." (18–36s)
// Five bureaucratic layers drop in, each annotated with what it actually does
// to your money. Then a red X strikes the whole stack out.
const STACK = [
  {label: 'CARD ISSUER', sub: 'charges the card on their schedule'},
  {label: 'PAYMENT GATEWAY', sub: 'takes a cut, holds funds 2–7 days'},
  {label: 'MERCHANT BANK ACCOUNT', sub: 'can be frozen. has been frozen.'},
  {label: 'DISPUTES DEPARTMENT', sub: 'can reverse any of this. retroactively.'},
  {label: 'THE BUSINESS', sub: 'finally gets paid. maybe.'},
];

const BOX_AT = (i: number) => 70 + i * 52;
const X_AT = 415;

export const FiatStack: React.FC = () => {
  const frame = useCurrentFrame();

  const titleIn = interpolate(frame, [16, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const verdictIn = interpolate(frame, [358, 386], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  // The X draws as two strokes, corner to corner.
  const xDraw = interpolate(frame, [X_AT, X_AT + 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const xDraw2 = interpolate(frame, [X_AT + 12, X_AT + 42], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const sceneOut = interpolate(frame, [510, 538], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 80, opacity: sceneOut}}>
      <div style={{textAlign: 'center'}}>
        <Eyebrow text="02 · The stack" at={10} />
        <div
          style={{
            marginTop: 18,
            fontFamily: PROV_FONTS.display,
            fontWeight: 900,
            fontSize: 50,
            letterSpacing: '-0.03em',
            color: COLORS.text,
            opacity: titleIn,
          }}
        >
          Meet the subscription stack.
        </div>
      </div>

      <div style={{width: 740, marginTop: 56, position: 'relative'}}>
        {STACK.map((layer, i) => {
          // Boxes grey out in a top-down sweep as the X cuts through them.
          const dim = interpolate(frame, [X_AT + 14 + i * 5, X_AT + 38 + i * 5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={layer.label}>
              <NodeBox label={layer.label} sub={layer.sub} at={BOX_AT(i)} tone="fiat" drop align="left" dim={dim} />
              {i < STACK.length - 1 ? (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <VConnector id={`fs-c${i}`} at={BOX_AT(i) + 28} height={52} tone="fiat" dim={dim} />
                </div>
              ) : null}
            </div>
          );
        })}

        {/* The red X — drawn over the stack's full bounding box. */}
        <svg width="100%" height="100%" viewBox="0 0 740 824" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <line x1={30} y1={20} x2={710} y2={804} stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={xDraw} />
          <line x1={710} y1={20} x2={30} y2={804} stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={xDraw2} />
        </svg>
      </div>

      <div
        style={{
          marginTop: 44,
          fontFamily: PROV_FONTS.serif,
          fontStyle: 'italic',
          fontSize: 40,
          letterSpacing: '-0.01em',
          color: COLORS.emerald,
          opacity: verdictIn,
        }}
      >
        Every layer is a fee, a delay, or a veto.
      </div>
    </AbsoluteFill>
  );
};
