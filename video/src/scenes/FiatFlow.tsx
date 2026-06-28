import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';
import {Eyebrow, FeeTag, NodeBox, VConnector} from '../components/Diagram';

// Scene 1 — "Here's how a subscription payment works." (0–18s)
// A five-hop fiat chain builds top to bottom, each hop taxed in red. The fee
// tags outlive the diagram, ghosting into the next scene.
const CHAIN = [
  {label: 'YOU', fee: null},
  {label: 'YOUR BANK', fee: '~0.5%'},
  {label: 'CARD NETWORK', fee: '~1.5%'},
  {label: 'PAYMENT PROCESSOR', fee: '~0.3% + flat fee'},
  {label: 'THE BUSINESS', fee: null},
] as const;

const NODE_AT = [55, 130, 205, 280, 355];

export const FiatFlow: React.FC = () => {
  const frame = useCurrentFrame();

  const titleIn = interpolate(frame, [10, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Once the chain is complete, pull back slightly and deliver the verdict.
  const zoom = interpolate(frame, [372, 416], [1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const counterIn = interpolate(frame, [396, 422], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const pct = interpolate(frame, [400, 458], [0, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const captionIn = interpolate(frame, [474, 500], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Everything fades except the fee tags, which linger as ghosts.
  const mainOut = interpolate(frame, [508, 536], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tagOut = interpolate(frame, [544, 576], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 80}}>
      <div style={{textAlign: 'center', opacity: mainOut}}>
        <Eyebrow text="01 · The toll" at={4} />
        <div
          style={{
            marginTop: 18,
            fontFamily: PROV_FONTS.display,
            fontWeight: 900,
            fontSize: 50,
            letterSpacing: '-0.03em',
            color: COLORS.text,
            maxWidth: 900,
            lineHeight: 1.12,
            opacity: titleIn,
          }}
        >
          Here's how a subscription payment works.
        </div>
      </div>

      <div style={{width: 560, marginTop: 64, transform: `scale(${zoom})`, transformOrigin: 'top center'}}>
        {CHAIN.map((node, i) => (
          <div key={node.label}>
            <NodeBox label={node.label} at={NODE_AT[i]} tone="fiat" mul={mainOut} />
            {i < CHAIN.length - 1 ? (
              <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
                <VConnector id={`ff-c${i}`} at={NODE_AT[i] + 34} height={76} tone="fiat" mul={mainOut} />
                {CHAIN[i + 1].fee ? (
                  <div style={{position: 'absolute', left: 'calc(50% + 30px)', top: '50%', transform: 'translateY(-50%)'}}>
                    <FeeTag text={CHAIN[i + 1].fee as string} at={NODE_AT[i] + 52} mul={tagOut} />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}

        <div style={{marginTop: 48, textAlign: 'center', opacity: counterIn * mainOut}}>
          <div
            style={{
              fontFamily: PROV_FONTS.display,
              fontWeight: 900,
              fontSize: 42,
              letterSpacing: '-0.03em',
              color: COLORS.red,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ~{pct.toFixed(1)}% extracted.
          </div>
          <div style={{marginTop: 8, fontFamily: PROV_FONTS.serif, fontStyle: 'italic', fontSize: 31, color: COLORS.red, opacity: 0.9}}>
            Every transaction. Every month. Forever.
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            textAlign: 'center',
            fontFamily: PROV_FONTS.body,
            fontWeight: 400,
            fontSize: 24,
            lineHeight: 1.5,
            color: COLORS.textDim,
            opacity: captionIn * mainOut,
          }}
        >
          None of these are the business. None of these are you.
          <br />
          Most subscription systems charge a 3% floor — an infrastructure tax you never agreed to.
        </div>
      </div>
    </AbsoluteFill>
  );
};
