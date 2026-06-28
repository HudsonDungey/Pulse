// "Forge" — the fake AI dev-tool product whose pricing page we subscribe on.
// Subtle dark UI, real-feeling copy. Renders inside BrowserFrame's content area.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {browserRect, C, EASE_OUT, FONTS} from './theme';
import {LoopMark} from './VirioDashboard';

interface Tier {
  name: string;
  price: string;
  per: string;
  features: string[];
  pro?: boolean;
  cta: string;
}

const TIERS: Tier[] = [
  {
    name: 'Hobby',
    price: 'Free',
    per: 'forever',
    features: ['1 concurrent agent', 'Community models', 'Local runs only'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: '$20',
    per: '/ month',
    features: [
      'Unlimited agents',
      'Priority compute',
      'Custom MCP servers',
      'Background tasks while you sleep',
    ],
    pro: true,
    cta: 'Subscribe with Crypto',
  },
  {
    name: 'Team',
    price: '$60',
    per: '/ month',
    features: ['Everything in Pro', 'Shared agent memory', 'SSO & audit log', 'Dedicated support'],
    cta: 'Contact sales',
  },
];

// Geometry shared with cursor choreography. Coordinates relative to the
// browser CONTENT area (below the 64px chrome).
const NAV_H = 84;
const CARD_W = 388;
const CARD_GAP = 30;
const CARDS_TOP = 268;
const CARD_H = 470;

export function proButtonCenter(vertical: boolean): {x: number; y: number} {
  const r = browserRect(vertical);
  if (vertical) {
    // Stacked: Pro card top = 300 + compact Hobby (150) + gap (22); button sits
    // near its bottom (card h 560, padding 30).
    return {x: r.x + r.w / 2, y: r.y + 64 + 974};
  }
  const contentW = r.w;
  const rowW = CARD_W * 3 + CARD_GAP * 2;
  const proX = (contentW - rowW) / 2 + CARD_W + CARD_GAP + CARD_W / 2;
  return {x: r.x + proX, y: r.y + 64 + CARDS_TOP + CARD_H - 64};
}

const ForgeLogo: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
    {/* anvil-spark mark */}
    <svg width="26" height="26" viewBox="0 0 26 26">
      <path d="M3 8 H23 L19 13 H12 V18 H16 V22 H7 V18 H10 V13 H7 Z" fill={C.forgeAccent} />
      <path d="M17 1 L15 6 H19 L16.5 11" stroke={C.forgeInk} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
    <span style={{fontFamily: FONTS.display, fontWeight: 700, fontSize: 24, color: C.forgeInk}}>
      Forge
    </span>
  </div>
);

const Check: React.FC = () => (
  <svg width="15" height="12" viewBox="0 0 15 12" style={{flexShrink: 0}}>
    <path d="M1.5 6 L5.5 10 L13.5 1.5" stroke={C.forgeAccent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Props {
  enterAt: number; // nav + hero + cards stagger from here
  pressAt?: number; // Pro CTA press feedback
  vertical?: boolean;
  successAt?: number; // swap pricing for the subscribed state
}

export const ForgeSite: React.FC<Props> = ({enterAt, pressAt, vertical, successAt}) => {
  const frame = useCurrentFrame();
  const ease = (from: number, dur = 16) =>
    interpolate(frame, [from, from + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });

  const navT = ease(enterAt);
  const heroT = ease(enterAt + 5);
  const success = successAt !== undefined && frame >= successAt;
  const successT = success ? ease(successAt!, 14) : 0;

  const press =
    pressAt !== undefined && frame >= pressAt && frame <= pressAt + 10
      ? 1 - 0.05 * Math.sin(((frame - pressAt) / 10) * Math.PI)
      : 1;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.forgeBg, fontFamily: FONTS.body, overflow: 'hidden'}}>
      {/* faint grid backdrop */}
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35}}>
        <defs>
          <pattern id="fgrid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0 H0 V56" fill="none" stroke={C.forgeBorder} strokeWidth="0.6" />
          </pattern>
          <radialGradient id="fglow" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor={C.forgeAccent} stopOpacity="0.07" />
            <stop offset="100%" stopColor={C.forgeAccent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#fgrid)" />
        <rect width="100%" height="100%" fill="url(#fglow)" />
      </svg>

      {/* Nav */}
      <div
        style={{
          height: NAV_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 56px',
          borderBottom: `1px solid ${C.forgeBorder}`,
          position: 'relative',
          opacity: navT,
          transform: `translateY(${(1 - navT) * -14}px)`,
        }}
      >
        <ForgeLogo />
        <div style={{display: 'flex', alignItems: 'center', gap: 36, color: C.forgeMuted, fontSize: 17.5}}>
          {!vertical && <span>Docs</span>}
          <span style={{color: C.forgeInk}}>Pricing</span>
          {!vertical && <span>Changelog</span>}
          <span>Sign in</span>
          <div
            style={{
              background: C.forgeInk,
              color: C.forgeBg,
              borderRadius: 10,
              padding: '10px 20px',
              fontWeight: 650,
              fontSize: 16.5,
            }}
          >
            Get started
          </div>
        </div>
      </div>

      {!success ? (
        <>
          {/* Hero */}
          <div
            style={{
              textAlign: 'center',
              paddingTop: 44,
              opacity: heroT,
              transform: `translateY(${(1 - heroT) * 18}px)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: vertical ? 52 : 50,
                fontWeight: 750,
                color: C.forgeInk,
                letterSpacing: '-0.02em',
              }}
            >
              Ship features while you sleep.
            </div>
            <div style={{fontSize: 20, color: C.forgeMuted, marginTop: 12}}>
              Forge agents write, test and open the PR. You review with coffee.
            </div>
          </div>

          {/* Pricing cards */}
          <div
            style={{
              position: 'absolute',
              top: vertical ? 300 : CARDS_TOP,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: vertical ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: vertical ? 'center' : 'stretch',
              gap: vertical ? 22 : CARD_GAP,
              padding: vertical ? '0 40px' : 0,
            }}
          >
            {TIERS.map((tier, i) => {
              const t = ease(enterAt + 10 + i * 7, 20);
              const compactVertical = vertical && !tier.pro;
              return (
                <div
                  key={tier.name}
                  style={{
                    width: vertical ? 860 : CARD_W,
                    height: compactVertical ? 150 : vertical ? 560 : CARD_H,
                    borderRadius: 18,
                    background: C.forgeCard,
                    border: `1px solid ${tier.pro ? C.forgeAccent : C.forgeBorder}`,
                    boxShadow: tier.pro ? `0 0 44px ${C.forgeAccent}22` : 'none',
                    padding: '30px 32px',
                    position: 'relative',
                    opacity: t,
                    transform: `translateY(${(1 - t) * 44}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {tier.pro && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: C.forgeAccent,
                        color: C.forgeBg,
                        borderRadius: 999,
                        padding: '4px 16px',
                        fontSize: 13.5,
                        fontWeight: 750,
                        letterSpacing: '0.06em',
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{fontSize: 19, fontWeight: 650, color: C.forgeMuted}}>{tier.name}</div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: 9, marginTop: 10}}>
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontSize: 46,
                        fontWeight: 750,
                        color: C.forgeInk,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {tier.price}
                    </span>
                    <span style={{fontSize: 17, color: C.forgeMuted}}>{tier.per}</span>
                  </div>
                  {!compactVertical && (
                    <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 13, flex: 1}}>
                      {tier.features.map((f) => (
                        <div key={f} style={{display: 'flex', alignItems: 'center', gap: 11, fontSize: 16.5, color: C.forgeInk}}>
                          <Check /> {f}
                        </div>
                      ))}
                    </div>
                  )}
                  {!compactVertical && (
                    <div
                      style={{
                        height: 56,
                        borderRadius: 12,
                        background: tier.pro ? C.forgeAccent : 'transparent',
                        border: tier.pro ? 'none' : `1px solid ${C.forgeBorder}`,
                        color: tier.pro ? C.forgeBg : C.forgeInk,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        fontWeight: 700,
                        fontSize: 17.5,
                        transform: tier.pro ? `scale(${press})` : undefined,
                      }}
                    >
                      {tier.pro && <LoopMark size={19} color={C.forgeBg} />}
                      {tier.cta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // ── Subscribed state (S7) ──
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: successT,
          }}
        >
          <div
            style={{
              width: vertical ? 820 : 620,
              borderRadius: 20,
              background: C.forgeCard,
              border: `1px solid ${C.forgeAccent}55`,
              boxShadow: `0 0 60px ${C.forgeAccent}1d`,
              padding: '52px 48px',
              textAlign: 'center',
              transform: `translateY(${(1 - successT) * 22}px)`,
            }}
          >
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: '50%',
                background: `${C.forgeAccent}1f`,
                border: `2px solid ${C.forgeAccent}`,
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 26px',
              }}
            >
              <svg width="34" height="27" viewBox="0 0 34 27">
                <path d="M3 14 L12.5 23.5 L31 3" stroke={C.forgeAccent} strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 36, fontWeight: 750, color: C.forgeInk}}>
              You&apos;re subscribed to Forge Pro
            </div>
            <div style={{fontSize: 19, color: C.forgeMuted, marginTop: 14}}>
              Next charge: <span style={{color: C.forgeInk, fontWeight: 650}}>July 11, 2026</span> ·
              20 USDC on Base
            </div>
            <div style={{fontSize: 15.5, color: C.forgeMuted, marginTop: 8}}>
              Cancel anytime, onchain.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
