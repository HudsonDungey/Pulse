import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';
import {Eyebrow, NodeBox, VConnector} from '../components/Diagram';

// Scene 4 — "The fee goes back to you." (60–75s)
// Where a charge actually routes: merchant gets the payment, stakers get the
// protocol fee. Real numbers from TOKENOMICS.md.
const FORK_AT = 135;

export const FeeSplit: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = (at: number, dur = 26) =>
    interpolate(frame, [at, at + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });

  const titleIn = fade(14);
  const stemDraw = interpolate(frame, [FORK_AT, FORK_AT + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const branchDraw = interpolate(frame, [FORK_AT + 14, FORK_AT + 44], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const merchantPct = interpolate(frame, [210, 266], [0, 99.65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const stakerPct = interpolate(frame, [210, 266], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const caption1In = fade(295);
  const caption2In = fade(325);
  const monoIn = fade(368);
  const sceneOut = interpolate(frame, [424, 448], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const counter = (value: string, sub: string) => (
    <div style={{textAlign: 'center', width: 270}}>
      <div
        style={{
          fontFamily: PROV_FONTS.display,
          fontWeight: 900,
          fontSize: 46,
          letterSpacing: '-0.03em',
          color: COLORS.emerald,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div style={{marginTop: 4, fontFamily: PROV_FONTS.body, fontWeight: 400, fontSize: 20, color: COLORS.textDim}}>{sub}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 80, opacity: sceneOut}}>
      <div style={{textAlign: 'center'}}>
        <Eyebrow text="05 · The flywheel" at={8} />
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
          The fee goes back to you.
        </div>
      </div>

      <div style={{marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <NodeBox label="SUBSCRIPTION PAYMENT" at={45} tone="virio" labelSize={25} style={{width: 460}} />
        <VConnector id="fee-stem" at={78} height={58} tone="virio" />
        <NodeBox label="VIRIO PROTOCOL" at={100} tone="virio" labelSize={25} style={{width: 460}} />

        {/* The fork — one stem, two elbows. */}
        <svg width={580} height={140} style={{display: 'block'}}>
          <path
            d="M290 0 V44"
            stroke={COLORS.emerald}
            strokeWidth={2.5}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={stemDraw}
          />
          <path
            d="M290 44 C290 96 140 84 140 128"
            stroke={COLORS.emerald}
            strokeWidth={2.5}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={branchDraw}
          />
          <path
            d="M290 44 C290 96 440 84 440 128"
            stroke={COLORS.emerald}
            strokeWidth={2.5}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={branchDraw}
          />
          <polygon points="140,140 134,129 146,129" fill={COLORS.emerald} opacity={1 - branchDraw} />
          <polygon points="440,140 434,129 446,129" fill={COLORS.emerald} opacity={1 - branchDraw} />
        </svg>

        <div style={{display: 'flex', gap: 60}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <NodeBox label="MERCHANT" at={188} tone="virio" labelSize={24} style={{width: 270}} />
            {counter(`${merchantPct.toFixed(2)}%`, 'of every charge')}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <NodeBox label="STAKERS" at={200} tone="virio" labelSize={24} style={{width: 270}} />
            {counter(`${stakerPct.toFixed(0)}%`, 'of protocol fees')}
          </div>
        </div>
      </div>

      <div style={{marginTop: 64, textAlign: 'center', maxWidth: '84%'}}>
        <div style={{fontFamily: PROV_FONTS.body, fontWeight: 500, fontSize: 27, color: COLORS.text, opacity: caption1In}}>
          The fee doesn't vanish into a corporate treasury.
        </div>
        <div style={{marginTop: 14, fontFamily: PROV_FONTS.body, fontWeight: 400, fontSize: 24, color: COLORS.textDim, opacity: caption2In}}>
          It routes onchain. Automatically. To the people running the network.
        </div>
        <div style={{marginTop: 40, fontFamily: PROV_FONTS.mono, fontSize: 19, color: COLORS.textDim, opacity: monoIn}}>
          <span style={{color: COLORS.emerald}}>charge()</span> is permissionless — executors earn 0.1% per settlement.
        </div>
      </div>
    </AbsoluteFill>
  );
};
