import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT, PROV, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';
import {Eyebrow, HConnector, NodeBox} from '../components/Diagram';

// Scene 3 — "What Virio does instead." (36–60s)
// Three nodes. One line. A heartbeat. Then the side-by-side correction.
const ROWS: [string, string][] = [
  ['2–7 day settlement', 'Instant'],
  ['3% fee floor', '0.25% + 0.1% executor'],
  ['Reversible', 'Final'],
  ['Requires permission', 'Permissionless'],
  ['Custodial', 'Non-custodial'],
];

const PULSE = {start: 140, cycle: 96};

export const VirioFlow: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = (at: number, dur = 26) =>
    interpolate(frame, [at, at + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });

  const titleIn = fade(14);
  const contractLabelIn = fade(128);
  const monoIn = fade(150);
  const captionsIn = fade(172);
  const sceneOut = interpolate(frame, [694, 718], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 70, opacity: sceneOut}}>
      <div style={{textAlign: 'center'}}>
        <Eyebrow text="03 · The correction" at={8} />
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
          What Virio does instead.
        </div>
      </div>

      <div style={{marginTop: 130, position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            top: -52,
            width: '100%',
            textAlign: 'center',
            fontFamily: PROV_FONTS.body,
            fontWeight: 500,
            fontSize: 23,
            color: COLORS.text,
            opacity: contractLabelIn,
          }}
        >
          Non-custodial. CEI-pattern. Immutable.
        </div>

        <div style={{display: 'flex', alignItems: 'center'}}>
          <NodeBox label="SUBSCRIBER WALLET" at={48} tone="virio" labelSize={23} style={{width: 280}} />
          <HConnector at={84} width={66} pulse={{...PULSE, window: [0, 0.5]}} />
          <NodeBox label="VIRIO CONTRACT" at={60} tone="virio" labelSize={23} style={{width: 300}} />
          <HConnector at={106} width={66} pulse={{...PULSE, window: [0.5, 1]}} />
          <NodeBox label="MERCHANT WALLET" at={72} tone="virio" labelSize={23} style={{width: 280}} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: -46,
            width: '100%',
            textAlign: 'center',
            fontFamily: PROV_FONTS.mono,
            fontSize: 19,
            color: COLORS.emerald,
            opacity: monoIn,
          }}
        >
          VirioSubscriptionManager.sol
        </div>
      </div>

      <div
        style={{
          marginTop: 78,
          width: 920,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: PROV_FONTS.body,
          fontWeight: 400,
          fontSize: 21,
          color: COLORS.textDim,
          opacity: captionsIn,
        }}
      >
        <div style={{width: '46%', textAlign: 'center'}}>Authorised once</div>
        <div style={{width: '46%', textAlign: 'center'}}>Executes on schedule. No one can stop it.</div>
      </div>

      {/* The correction — fiat claim on the left, Virio answer one beat later. */}
      <div style={{marginTop: 70, width: 920, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
        {ROWS.map(([fiat, virio], i) => {
          const leftAt = 255 + i * 32;
          const rightAt = leftAt + 12;
          const leftIn = fade(leftAt, 18);
          const rightIn = fade(rightAt, 18);
          return (
            <React.Fragment key={fiat}>
              <div
                style={{
                  backgroundColor: PROV.boxBg,
                  borderLeft: `3px solid ${PROV.grey}`,
                  borderRadius: 10,
                  padding: '18px 22px',
                  fontFamily: PROV_FONTS.body,
                  fontWeight: 400,
                  fontSize: 24,
                  color: PROV.greyText,
                  opacity: leftIn,
                  transform: `translateX(${interpolate(leftIn, [0, 1], [-12, 0])}px)`,
                }}
              >
                {fiat}
              </div>
              <div
                style={{
                  backgroundColor: '#E6F3EC',
                  borderLeft: `3px solid ${COLORS.emerald}`,
                  borderRadius: 10,
                  padding: '18px 22px',
                  fontFamily: PROV_FONTS.body,
                  fontWeight: 500,
                  fontSize: 24,
                  color: COLORS.emerald,
                  opacity: rightIn,
                  transform: `translateX(${interpolate(rightIn, [0, 1], [12, 0])}px)`,
                }}
              >
                {virio}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
