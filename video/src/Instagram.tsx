import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, EASE_OUT, FONTS} from './theme';
import {FONT_IMPORT, useFontsReady} from './Manifesto';
import {CircuitGrid} from './components/CircuitGrid';
import {LoopGlyph} from './components/LoopGlyph';
import {NetworkGraph} from './components/NetworkGraph';
import {FilmGrain} from './components/FilmGrain';

// 45s Instagram cut — 1080×1920 @ 30fps. Same identity as the manifesto, but at
// reel pacing: word stamps, impact flashes, decaying shake, fast counters.
// Beat boundaries in frames.
export const INSTAGRAM_FRAMES = 1350; // 45s
const BEATS = {
  hook: {from: 0, durationInFrames: 105}, //   0.0–3.5s  they charge you
  count: {from: 105, durationInFrames: 145}, // 3.5–8.3s  $1.2T counter
  reveal: {from: 250, durationInFrames: 220}, // 8.3–15.7s Virio slams in
  cards: {from: 470, durationInFrames: 330}, // 15.7–26.7s three punch cards
  slash: {from: 800, durationInFrames: 310}, // 26.7–37.0s legacy billing slashed, doctrine
  cta: {from: 1110, durationInFrames: 240}, // 37.0–45.0s loop + virio.xyz
} as const;

// Decaying impact shake: fires at `start`, dies over 18 frames. Deterministic.
const shakeY = (frame: number, start: number, amp: number): number => {
  const t = frame - start;
  if (t < 0 || t > 18) return 0;
  return Math.sin(t * 1.9) * amp * (1 - t / 18);
};

// Full-frame white flash, 1-frame attack, short decay.
const Flash: React.FC<{at: number; peak?: number}> = ({at, peak = 0.3}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at - 1, at, at + 4], [0, peak, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity, pointerEvents: 'none'}} />;
};

// A word that stamps in: spring scale-down from oversized, opacity snap.
const Stamp: React.FC<{text: string; at: number; size: number; color?: string}> = ({
  text,
  at,
  size,
  color = COLORS.text,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 240, mass: 0.7}});
  const scale = interpolate(s, [0, 1], [1.45, 1]);
  const opacity = frame < at ? 0 : interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FONTS.display,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: '-0.04em',
        color,
        lineHeight: 1.05,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {text}
    </span>
  );
};

// Beat 1 — hook. Accusation in three stamps.
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const out = interpolate(frame, [92, 105], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8%'}}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 58,
          letterSpacing: '-0.03em',
          color: COLORS.textDim,
          opacity: line1,
          transform: `translateY(${interpolate(line1, [0, 1], [14, 0])}px)`,
        }}
      >
        They charge you.
      </div>
      <div style={{marginTop: 34, display: 'flex', gap: 22, justifyContent: 'center', transform: `translateY(${shakeY(frame, 76, 7)}px)`}}>
        <Stamp text="Every." at={46} size={88} />
        <Stamp text="Single." at={60} size={88} />
        <Stamp text="Month." at={76} size={88} color={COLORS.emerald} />
      </div>
      <Flash at={76} peak={0.18} />
    </AbsoluteFill>
  );
};

// Beat 2 — the number. Counter rips to $1.2T, emerald verdict slams.
const Count: React.FC = () => {
  const frame = useCurrentFrame();
  const counter = interpolate(frame, [8, 64], [0, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const statIn = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const out = interpolate(frame, [132, 145], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 6%'}}>
      <div style={{opacity: statIn, transform: `translateY(${shakeY(frame, 84, 9)}px)`}}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 168,
            letterSpacing: '-0.045em',
            color: COLORS.text,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${counter.toFixed(1)}T
        </div>
        <div style={{marginTop: 16, fontFamily: FONTS.body, fontWeight: 500, fontSize: 36, color: COLORS.textDim}}>
          in subscriptions. Every year.
        </div>
        <div style={{marginTop: 40}}>
          <Stamp text="None of it onchain." at={84} size={62} color={COLORS.emerald} />
        </div>
      </div>
      <Flash at={84} peak={0.2} />
    </AbsoluteFill>
  );
};

// Beat 3 — the reveal. Loop signs itself fast, VIRIO slams in, network blooms.
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const NAME_AT = 55;
  const nameSpring = spring({frame: frame - NAME_AT, fps, config: {damping: 15, stiffness: 220, mass: 0.8}});
  const nameScale = interpolate(nameSpring, [0, 1], [1.35, 1]);
  const nameOpacity = frame < NAME_AT ? 0 : interpolate(nameSpring, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});

  const graphIn = interpolate(frame, [70, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const out = interpolate(frame, [205, 220], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const TAGLINE = ['Permissionless.', 'Onchain.', 'Unstoppable.'];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{opacity: graphIn}}>
        <NetworkGraph startFrame={70} vertical />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translateY(${shakeY(frame, NAME_AT + 3, 12)}px)`,
        }}
      >
        <LoopGlyph size={210} startFrame={2} drawDuration={48} />
        <div
          style={{
            marginTop: 30,
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 150,
            letterSpacing: '-0.045em',
            color: COLORS.text,
            lineHeight: 0.9,
            opacity: nameOpacity,
            transform: `scale(${nameScale})`,
          }}
        >
          Virio
        </div>
        <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 8}}>
          {TAGLINE.map((word, i) => (
            <Stamp key={word} text={word} at={92 + i * 16} size={44} color={i === 2 ? COLORS.emerald : COLORS.textDim} />
          ))}
        </div>
      </AbsoluteFill>
      <Flash at={NAME_AT + 3} peak={0.28} />
    </AbsoluteFill>
  );
};

// Beat 4 — three punch cards. Real facts from the contracts + tokenomics.
const CARDS = [
  {
    title: 'Set once. Charge forever.',
    sub: 'VirioSubscriptionManager — no custody, no keys, no middleman.',
  },
  {
    title: 'Fees flow to stakers.',
    sub: '0.25% protocol fee → 60% paid to stVIRIO. Onchain, automatically.',
  },
  {
    title: 'Ethereum. Base. Arbitrum.',
    sub: 'One canonical supply (xERC20). Any stablecoin. Any interval.',
  },
];

const PunchCard: React.FC<{title: string; sub: string; at: number; fromLeft: boolean}> = ({title, sub, at, fromLeft}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const x = interpolate(t, [0, 9], [fromLeft ? -260 : 260, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const opacity = interpolate(t, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = interpolate(t, [7, 14, 38], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: COLORS.card,
        borderLeft: `5px solid ${COLORS.emerald}`,
        borderRadius: 14,
        padding: '34px 36px',
        opacity,
        transform: `translateX(${x}px) translateY(${shakeY(frame, at + 8, 5)}px)`,
        boxShadow: `0 0 ${pulse * 70}px -10px ${COLORS.emerald}`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: 52,
          letterSpacing: '-0.035em',
          color: COLORS.text,
          lineHeight: 1.02,
          textShadow: pulse > 0 ? `0 0 ${pulse * 20}px ${COLORS.emerald}66` : 'none',
        }}
      >
        {title}
      </div>
      <div style={{marginTop: 14, fontFamily: FONTS.body, fontWeight: 400, fontSize: 27, color: COLORS.textDim, lineHeight: 1.4}}>
        {sub}
      </div>
    </div>
  );
};

const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const tickerIn = interpolate(frame, [250, 274], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const out = interpolate(frame, [316, 330], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', padding: '0 6%'}}>
      <div style={{width: '100%', maxWidth: 940, display: 'flex', flexDirection: 'column', gap: 26}}>
        {CARDS.map((c, i) => (
          <PunchCard key={c.title} title={c.title} sub={c.sub} at={10 + i * 78} fromLeft={i % 2 === 1} />
        ))}
        <div
          style={{
            marginTop: 14,
            fontFamily: FONTS.mono,
            fontSize: 21,
            color: COLORS.textDim,
            opacity: tickerIn * 0.85,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{color: COLORS.emerald}}>charge()</span> is permissionless — anyone settles, earns 0.1%.
        </div>
      </div>
      {CARDS.map((c, i) => (
        <Flash key={c.title} at={18 + i * 78} peak={0.1} />
      ))}
    </AbsoluteFill>
  );
};

// Beat 5 — the kill shot. Legacy billing slashed in red, doctrine stamps in.
const Slash: React.FC = () => {
  const frame = useCurrentFrame();
  const titleIn = interpolate(frame, [8, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const SLASH_AT = 58;
  const slash = interpolate(frame, [SLASH_AT, SLASH_AT + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleDim = interpolate(frame, [SLASH_AT + 1, SLASH_AT + 20], [1, 0.38], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const out = interpolate(frame, [296, 310], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const DOCTRINE = ['Built on Ethereum.', 'Owned by no one.', 'Stopped by nothing.'];

  return (
    <AbsoluteFill
      style={{
        opacity: out,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 5%',
      }}
    >
      <div style={{transform: `translateY(${shakeY(frame, SLASH_AT, 11)}px)`}}>
        <div style={{position: 'relative', display: 'inline-block', opacity: titleIn}}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 92,
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
              height: 9,
              background: COLORS.red,
              transform: `translateY(-50%) scaleX(${slash})`,
              transformOrigin: 'left center',
              borderRadius: 2,
              boxShadow: `0 0 ${slash * 26}px ${COLORS.red}`,
            }}
          />
        </div>
        <div style={{marginTop: 64, display: 'flex', flexDirection: 'column', gap: 18}}>
          {DOCTRINE.map((line, i) => (
            <Stamp key={line} text={line} at={92 + i * 28} size={58} color={COLORS.emerald} />
          ))}
        </div>
      </div>
      <Flash at={SLASH_AT} peak={0.32} />
    </AbsoluteFill>
  );
};

// Beat 6 — CTA. The loop closes, the name holds, the URL lands. Fade to black.
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const nameIn = interpolate(frame, [44, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const urlIn = interpolate(frame, [96, 122], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const out = interpolate(frame, [216, 240], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <LoopGlyph size={250} startFrame={0} drawDuration={55} />
      <div
        style={{
          marginTop: 36,
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 120,
          letterSpacing: '-0.045em',
          color: COLORS.text,
          lineHeight: 0.9,
          opacity: nameIn,
          transform: `translateY(${interpolate(nameIn, [0, 1], [20, 0])}px)`,
        }}
      >
        Virio
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONTS.body,
          fontWeight: 500,
          fontSize: 32,
          letterSpacing: '0.04em',
          color: COLORS.emerald,
          opacity: urlIn,
        }}
      >
        virio.xyz
      </div>
    </AbsoluteFill>
  );
};

export const Instagram: React.FC = () => {
  useFontsReady();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily: FONTS.body}}>
      <style>{FONT_IMPORT}</style>

      {/* Circuit grid underlies the first two beats — the system waking up. */}
      <Sequence from={0} durationInFrames={BEATS.count.from + BEATS.count.durationInFrames} name="Grid">
        <CircuitGrid startFrame={20} vertical />
      </Sequence>

      <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.durationInFrames} name="Hook">
        <Hook />
      </Sequence>
      <Sequence from={BEATS.count.from} durationInFrames={BEATS.count.durationInFrames} name="Count">
        <Count />
      </Sequence>
      <Sequence from={BEATS.reveal.from} durationInFrames={BEATS.reveal.durationInFrames} name="Reveal">
        <Reveal />
      </Sequence>
      <Sequence from={BEATS.cards.from} durationInFrames={BEATS.cards.durationInFrames} name="Cards">
        <Cards />
      </Sequence>
      <Sequence from={BEATS.slash.from} durationInFrames={BEATS.slash.durationInFrames} name="Slash">
        <Slash />
      </Sequence>
      <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.durationInFrames} name="Cta">
        <Cta />
      </Sequence>

      <FilmGrain />
    </AbsoluteFill>
  );
};
