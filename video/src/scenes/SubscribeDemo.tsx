import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, EASE_OUT, PROV_COLORS as COLORS, PROV_FONTS} from '../theme';
import {Eyebrow} from '../components/Diagram';

// Scene — the experience. A dummy streaming site ("nimbus.fm") inside a
// browser frame: the cursor clicks "Subscribe with crypto", a wallet sheet
// slides up, two signatures land, the subscription goes active — then the
// site fades and the months charge themselves while you do nothing.
//
// The site shares the video's light mode; the browser ring and shadow keep it
// reading as a screen capture, not a diagram.

// Canvas geometry (1080×1920).
const BROWSER = {x: 110, y: 330, w: 860, h: 1180, r: 22};
const CHROME_H = 68;
const SUBSCRIBE_BTN = {x: 540, y: 1124}; // canvas coords of the site button
const SIGN_BTN = {x: 540, y: 1330}; // canvas coords of the wallet sign button

// Timeline (frames within the 720-frame scene).
const T = {
  cursorIn: 110,
  hover: 158,
  click1: 168,
  sheetUp: 184,
  moveToSign: 204,
  click2: 248,
  sig1Done: 272,
  row2Live: 282,
  click3: 320,
  sig2Done: 344,
  success: 362,
  browserOut: 450,
  dayIn: 490,
  toasts: [540, 580, 620],
  fadeOut: 692,
} as const;

// The fake site's own palette — warm paper, ink, one deep emerald.
const SITE = {
  bg: '#F7F5F0',
  ink: '#16201B',
  inkDim: '#6E7A73',
  line: '#E4E1D7',
  card: '#FFFFFF',
  accent: '#0B8F69',
} as const;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const SubscribeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fade = (at: number, dur = 24) => interpolate(frame, [at, at + dur], [0, 1], {...clamp, easing: EASE_OUT});

  const titleIn = fade(10);
  const browserRise = spring({frame: frame - 24, fps, config: {damping: 16, stiffness: 90, mass: 1.1}});

  // Cursor path: enter bottom-right → subscribe button → sign button (stays
  // there for both signatures).
  const leg1 = interpolate(frame, [T.cursorIn, T.hover], [0, 1], {...clamp, easing: EASE_IN_OUT});
  const leg2 = interpolate(frame, [T.moveToSign, T.click2 - 8], [0, 1], {...clamp, easing: EASE_IN_OUT});
  const cursorX = interpolate(leg1, [0, 1], [880, SUBSCRIBE_BTN.x + 36]) + leg2 * (SIGN_BTN.x + 42 - (SUBSCRIBE_BTN.x + 36));
  const cursorY = interpolate(leg1, [0, 1], [1680, SUBSCRIBE_BTN.y + 12]) + leg2 * (SIGN_BTN.y + 10 - (SUBSCRIBE_BTN.y + 12));
  const cursorIn = fade(T.cursorIn, 14);

  // Click dips: a quick scale-down on each press.
  const clickDip = (at: number) =>
    interpolate(frame, [at, at + 4, at + 12], [1, 0.82, 1], {...clamp, easing: EASE_OUT});
  const cursorScale = clickDip(T.click1) * clickDip(T.click2) * clickDip(T.click3);

  const ripple = (at: number) => {
    const p = interpolate(frame, [at, at + 22], [0, 1], clamp);
    return {r: p * 60, o: p > 0 && p < 1 ? (1 - p) * 0.5 : 0};
  };
  const ripple1 = ripple(T.click1);

  // Wallet sheet.
  const sheetUp = interpolate(frame, [T.sheetUp, T.sheetUp + 32], [0, 1], {...clamp, easing: EASE_OUT});
  const dim = sheetUp * 0.45;

  // Signature states.
  const sig1Spin = frame >= T.click2 && frame < T.sig1Done;
  const sig2Spin = frame >= T.click3 && frame < T.sig2Done;
  const sig1Check = spring({frame: frame - T.sig1Done, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
  const sig2Check = spring({frame: frame - T.sig2Done, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
  const row2Alpha = interpolate(frame, [T.row2Live, T.row2Live + 16], [0.35, 1], clamp);

  // Success view replaces the rows.
  const successIn = fade(T.success, 22);
  const rowsOut = 1 - successIn;
  const checkDraw = interpolate(frame, [T.success + 4, T.success + 30], [1, 0], {...clamp, easing: EASE_OUT});

  // Phase out: the whole demo rig shrinks away, the day begins.
  const rigOut = interpolate(frame, [T.browserOut, T.browserOut + 38], [1, 0], {...clamp, easing: EASE_IN_OUT});
  const rigScale = interpolate(rigOut, [0, 1], [0.94, 1]);
  const sceneOut = interpolate(frame, [T.fadeOut, T.fadeOut + 26], [1, 0], clamp);

  const spinnerAngle = (frame * 14) % 360;

  const featureRow = (text: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0'}}>
      <svg width={22} height={22} viewBox="0 0 22 22">
        <circle cx={11} cy={11} r={10} fill={`${SITE.accent}1A`} />
        <path d="M6.5 11.5 L9.5 14.5 L15.5 8" stroke={SITE.accent} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{fontFamily: PROV_FONTS.body, fontWeight: 400, fontSize: 21, color: SITE.ink}}>{text}</span>
    </div>
  );

  const sigRow = (title: string, sub: string, spin: boolean, check: number, alpha: number) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        backgroundColor: '#F2F0EA',
        borderRadius: 14,
        border: `1px solid #E4E1D7`,
        opacity: alpha,
      }}
    >
      <div>
        <div style={{fontFamily: PROV_FONTS.body, fontWeight: 500, fontSize: 23, color: COLORS.text}}>{title}</div>
        <div style={{marginTop: 5, fontFamily: PROV_FONTS.mono, fontSize: 15, color: COLORS.textDim}}>{sub}</div>
      </div>
      <div style={{width: 34, height: 34, position: 'relative'}}>
        {spin ? (
          <svg width={34} height={34} viewBox="0 0 34 34" style={{transform: `rotate(${spinnerAngle}deg)`}}>
            <circle cx={17} cy={17} r={13} stroke="#DEDBD1" strokeWidth={3} fill="none" />
            <path d="M17 4 A13 13 0 0 1 30 17" stroke={COLORS.emerald} strokeWidth={3} fill="none" strokeLinecap="round" />
          </svg>
        ) : check > 0.01 ? (
          <svg width={34} height={34} viewBox="0 0 34 34" style={{transform: `scale(${check})`}}>
            <circle cx={17} cy={17} r={15} fill={COLORS.emerald} />
            <path d="M10 17.5 L15 22.5 L24.5 12.5" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width={34} height={34} viewBox="0 0 34 34">
            <circle cx={17} cy={17} r={13} stroke="#DEDBD1" strokeWidth={3} fill="none" />
          </svg>
        )}
      </div>
    </div>
  );

  const toast = (date: string, i: number) => {
    const at = T.toasts[i];
    const s = spring({frame: frame - at, fps, config: {damping: 15, stiffness: 130, mass: 0.9}});
    return (
      <div
        key={date}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          width: 620,
          padding: '22px 28px',
          backgroundColor: COLORS.card,
          border: `1px solid #E4E1D7`,
          borderRadius: 16,
          boxShadow: '0 18px 50px rgba(22,32,27,0.14)',
          opacity: frame < at ? 0 : s,
          transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 30 30">
          <circle cx={15} cy={15} r={14} fill={`${COLORS.emerald}1F`} />
          <path d="M9 15.5 L13.5 20 L21.5 10.5" stroke={COLORS.emerald} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: PROV_FONTS.mono, fontSize: 21, color: COLORS.textDim, width: 96}}>{date}</div>
        <div style={{fontFamily: PROV_FONTS.body, fontWeight: 500, fontSize: 22, color: COLORS.text}}>9.99 USDC charged</div>
        <div style={{marginLeft: 'auto', fontFamily: PROV_FONTS.mono, fontSize: 15, color: COLORS.emerald}}>onchain</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      {/* Title block. */}
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', opacity: titleIn * rigOut}}>
        <Eyebrow text="04 · The experience" at={10} />
        <div
          style={{
            marginTop: 18,
            fontFamily: PROV_FONTS.display,
            fontWeight: 900,
            fontSize: 52,
            letterSpacing: '-0.03em',
            color: COLORS.text,
          }}
        >
          Subscribing takes ten seconds.
        </div>
      </div>

      {/* The demo rig: browser, sheet, cursor. */}
      <div style={{position: 'absolute', inset: 0, opacity: rigOut, transform: `scale(${rigScale})`, transformOrigin: '50% 55%'}}>
        {/* Browser window. */}
        <div
          style={{
            position: 'absolute',
            left: BROWSER.x,
            top: BROWSER.y,
            width: BROWSER.w,
            height: BROWSER.h,
            borderRadius: BROWSER.r,
            overflow: 'hidden',
            backgroundColor: SITE.bg,
            boxShadow: '0 40px 110px rgba(22,32,27,0.22), 0 0 0 1px #DEDBD1',
            opacity: interpolate(browserRise, [0, 0.4], [0, 1], clamp),
            transform: `translateY(${interpolate(browserRise, [0, 1], [70, 0])}px)`,
          }}
        >
          {/* Chrome bar. */}
          <div
            style={{
              height: CHROME_H,
              display: 'flex',
              alignItems: 'center',
              padding: '0 26px',
              gap: 22,
              backgroundColor: '#ECEAE2',
            }}
          >
            <div style={{display: 'flex', gap: 9}}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <div key={c} style={{width: 14, height: 14, borderRadius: 7, backgroundColor: c}} />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                maxWidth: 420,
                margin: '0 auto',
                height: 38,
                borderRadius: 10,
                backgroundColor: '#FFFFFFB3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: PROV_FONTS.mono,
                fontSize: 17,
                color: COLORS.textDim,
              }}
            >
              <svg width={13} height={15} viewBox="0 0 13 15">
                <rect x={1} y={6} width={11} height={8} rx={2} fill="none" stroke={COLORS.emerald} strokeWidth={1.5} />
                <path d="M3.5 6 V4.5 a3 3 0 0 1 6 0 V6" fill="none" stroke={COLORS.emerald} strokeWidth={1.5} />
              </svg>
              nimbus.fm
            </div>
            <div style={{width: 60}} />
          </div>

          {/* Site content. */}
          <div style={{padding: '0 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 0'}}>
              <div style={{fontFamily: PROV_FONTS.display, fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em', color: SITE.ink}}>
                nimbus<span style={{color: SITE.accent}}>.</span>
              </div>
              <div style={{display: 'flex', gap: 30, fontFamily: PROV_FONTS.body, fontWeight: 500, fontSize: 18, color: SITE.inkDim}}>
                <span>Library</span>
                <span style={{color: SITE.ink}}>Pricing</span>
                <span>Account</span>
              </div>
            </div>

            <div style={{paddingTop: 36}}>
              <div
                style={{
                  fontFamily: PROV_FONTS.display,
                  fontWeight: 900,
                  fontSize: 47,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: SITE.ink,
                  maxWidth: 620,
                }}
              >
                Music without the middlemen.
              </div>
              <div style={{marginTop: 16, fontFamily: PROV_FONTS.body, fontWeight: 400, fontSize: 22, color: SITE.inkDim}}>
                Lossless streaming, paid straight from your wallet.
              </div>
            </div>

            {/* Plan card. */}
            <div
              style={{
                width: 600,
                margin: '44px auto 0',
                padding: 36,
                backgroundColor: SITE.card,
                border: `1px solid ${SITE.line}`,
                borderRadius: 18,
                boxShadow: '0 24px 60px rgba(22,32,27,0.10)',
              }}
            >
              <div style={{fontFamily: PROV_FONTS.mono, fontSize: 15, letterSpacing: '0.22em', color: SITE.accent}}>
                PRO · MONTHLY
              </div>
              <div style={{marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12}}>
                <span style={{fontFamily: PROV_FONTS.display, fontWeight: 900, fontSize: 54, letterSpacing: '-0.03em', color: SITE.ink}}>
                  9.99 USDC
                </span>
                <span style={{fontFamily: PROV_FONTS.body, fontSize: 22, color: SITE.inkDim}}>/ month</span>
              </div>
              <div style={{margin: '22px 0', height: 1, backgroundColor: SITE.line}} />
              {featureRow('Lossless audio, no ads')}
              {featureRow('Cancel anytime — onchain, instantly')}
              {featureRow('No card. No account recovery emails.')}

              {/* The button the cursor goes for. */}
              <div
                style={{
                  position: 'relative',
                  marginTop: 26,
                  height: 76,
                  borderRadius: 14,
                  backgroundColor: SITE.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  filter: frame >= T.hover && frame < T.sheetUp ? 'brightness(1.08)' : undefined,
                  transform: frame >= T.click1 && frame < T.click1 + 10 ? 'scale(0.98)' : undefined,
                }}
              >
                <span style={{fontFamily: PROV_FONTS.body, fontWeight: 600, fontSize: 24, color: '#FFFFFF'}}>
                  Subscribe with crypto
                </span>
                <svg width={20} height={20} viewBox="0 0 20 20">
                  <path d="M4 10 H15 M11 5 L16 10 L11 15" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {ripple1.o > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: ripple1.r * 2,
                      height: ripple1.r * 2,
                      marginLeft: -ripple1.r,
                      marginTop: -ripple1.r,
                      borderRadius: '50%',
                      backgroundColor: `rgba(255,255,255,${ripple1.o})`,
                    }}
                  />
                ) : null}
              </div>
              <div style={{marginTop: 18, textAlign: 'center', fontFamily: PROV_FONTS.mono, fontSize: 14, color: SITE.inkDim}}>
                powered by virio · settles onchain
              </div>
            </div>
          </div>

          {/* Dim layer under the wallet sheet. */}
          <div style={{position: 'absolute', inset: 0, backgroundColor: `rgba(10,12,11,${dim})`}} />

          {/* Wallet sheet. */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 560,
              padding: '0 36px',
              borderRadius: '28px 28px 0 0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 -20px 60px rgba(22,32,27,0.18)',
              transform: `translateY(${interpolate(sheetUp, [0, 1], [580, 0])}px)`,
            }}
          >
            <div style={{width: 48, height: 5, borderRadius: 3, backgroundColor: '#DEDBD1', margin: '16px auto 0'}} />
            <div style={{marginTop: 30, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
              <div style={{fontFamily: PROV_FONTS.display, fontWeight: 700, fontSize: 30, letterSpacing: '-0.02em', color: COLORS.text}}>
                Signature request
              </div>
              <div style={{fontFamily: PROV_FONTS.mono, fontSize: 16, color: COLORS.textDim}}>nimbus.fm</div>
            </div>

            {/* Two requests — then the success view crossfades over them. */}
            <div style={{position: 'relative', marginTop: 28}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: 16, opacity: rowsOut}}>
                {sigRow('Approve USDC', 'spend cap · 9.99 / month', sig1Spin, frame >= T.sig1Done ? sig1Check : 0, 1)}
                {sigRow('Subscribe · Nimbus Pro', 'VirioSubscriptionManager.subscribe()', sig2Spin, frame >= T.sig2Done ? sig2Check : 0, row2Alpha)}
                <div
                  style={{
                    marginTop: 14,
                    height: 80,
                    borderRadius: 14,
                    backgroundColor: COLORS.emerald,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: PROV_FONTS.body,
                    fontWeight: 600,
                    fontSize: 25,
                    color: '#FFFFFF',
                    transform: (frame >= T.click2 && frame < T.click2 + 10) || (frame >= T.click3 && frame < T.click3 + 10) ? 'scale(0.98)' : undefined,
                  }}
                >
                  Sign
                </div>
              </div>

              <div style={{position: 'absolute', inset: 0, textAlign: 'center', paddingTop: 8, opacity: successIn}}>
                <svg width={120} height={120} viewBox="0 0 120 120" style={{display: 'block', margin: '0 auto'}}>
                  <circle cx={60} cy={60} r={54} stroke={COLORS.emerald} strokeWidth={4} fill={`${COLORS.emerald}14`} pathLength={1} strokeDasharray={1} strokeDashoffset={checkDraw} />
                  <path d="M38 62 L54 78 L84 44" stroke={COLORS.emerald} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={checkDraw} />
                </svg>
                <div style={{marginTop: 22, fontFamily: PROV_FONTS.display, fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em', color: COLORS.text}}>
                  Subscription active
                </div>
                <div style={{marginTop: 14, fontFamily: PROV_FONTS.mono, fontSize: 18, color: COLORS.textDim}}>
                  next charge · 10 Jul · enforced onchain
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cursor — macOS-style pointer with a soft shadow. */}
        <svg
          width={34}
          height={40}
          viewBox="0 0 24 28"
          style={{
            position: 'absolute',
            left: cursorX,
            top: cursorY,
            opacity: cursorIn,
            transform: `scale(${cursorScale})`,
            transformOrigin: '4px 2px',
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
          }}
        >
          <path d="M4 1 L4 22 L9.2 17.4 L12.6 25.4 L16.2 23.8 L12.8 16 L19.6 15.4 Z" fill="#101312" stroke="#FFFFFF" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>

      {/* Phase D — the months pay themselves. */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - rigOut}}>
        <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: fade(T.dayIn)}}>
          <div style={{fontFamily: PROV_FONTS.serif, fontStyle: 'italic', fontSize: 62, color: COLORS.text, letterSpacing: '-0.01em'}}>
            Now go about your day.
          </div>
        </div>
        <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          {['10 JUL', '10 AUG', '10 SEP'].map((d, i) => toast(d, i))}
        </div>
        <div style={{position: 'absolute', top: 1180, width: '100%', textAlign: 'center', opacity: fade(656)}}>
          <div style={{fontFamily: PROV_FONTS.mono, fontSize: 20, color: COLORS.textDim}}>
            <span style={{color: COLORS.emerald}}>charge()</span> runs on schedule. No card. No portal. No one to call.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
