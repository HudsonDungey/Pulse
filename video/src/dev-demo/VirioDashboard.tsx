// The real Virio merchant app, recreated from the provided screenshots:
// light theme, white surfaces, black buttons. Sidebar — Overview / Payroll /
// Products / Subscriptions / Transactions / Testing — plus Test mode toggle
// and the "Virio Labs" workspace footer.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, FONTS, MERCHANT_WALLET, PLAN_ID} from './theme';

// ─── Loop mark (Virio logo glyph) ─────────────────────────────────────────────

export const LoopMark: React.FC<{size?: number; color?: string}> = ({
  size = 26,
  color = C.uiInk,
}) => (
  <svg width={size} height={size} viewBox="0 0 26 26">
    <path
      d="M21.5 13 a8.5 8.5 0 1 1 -4.2 -7.35"
      fill="none"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path d="M17 1.2 L18.1 6.6 L12.8 5.2 Z" fill={color} />
  </svg>
);

// ─── Small glyphs for the sidebar nav ────────────────────────────────────────

const NavGlyph: React.FC<{kind: string; color: string}> = ({kind, color}) => {
  const s = {stroke: color, strokeWidth: 1.7, fill: 'none' as const, strokeLinecap: 'round' as const};
  switch (kind) {
    case 'overview':
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" {...s} />
          <rect x="10" y="1.5" width="5.5" height="5.5" rx="1.5" {...s} />
          <rect x="1.5" y="10" width="5.5" height="5.5" rx="1.5" {...s} />
          <rect x="10" y="10" width="5.5" height="5.5" rx="1.5" {...s} />
        </svg>
      );
    case 'payroll':
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <rect x="1.5" y="3.5" width="14" height="10" rx="2" {...s} />
          <path d="M1.5 7 H15.5" {...s} />
        </svg>
      );
    case 'products':
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <path d="M8.5 1.5 L15 5 V12 L8.5 15.5 L2 12 V5 Z" {...s} />
          <path d="M2 5 L8.5 8.5 L15 5 M8.5 8.5 V15.5" {...s} />
        </svg>
      );
    case 'subscriptions':
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <path d="M14.5 8.5 a6 6 0 1 1 -3 -5.2" {...s} />
          <path d="M11 1 L12 4 L9 3.4" fill={color} stroke="none" />
        </svg>
      );
    case 'transactions':
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <path d="M3 5.5 H14 M11 2.5 L14 5.5 L11 8.5" {...s} />
          <path d="M14 11.5 H3 M6 8.5 L3 11.5 L6 14.5" {...s} />
        </svg>
      );
    default: // testing — flask
      return (
        <svg width="17" height="17" viewBox="0 0 17 17">
          <path d="M6.5 1.5 H10.5 M7.5 1.5 V6 L3 13.5 a1.5 1.5 0 0 0 1.3 2 H12.7 a1.5 1.5 0 0 0 1.3 -2 L9.5 6 V1.5" {...s} />
        </svg>
      );
  }
};

const NAV = [
  {kind: 'overview', label: 'Overview'},
  {kind: 'payroll', label: 'Payroll'},
  {kind: 'products', label: 'Products', active: true},
  {kind: 'subscriptions', label: 'Subscriptions'},
  {kind: 'transactions', label: 'Transactions'},
  {kind: 'testing', label: 'Testing'},
];

// ─── App shell ────────────────────────────────────────────────────────────────

export const DashShell: React.FC<{vertical?: boolean; children: React.ReactNode}> = ({
  vertical,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: C.uiCard,
      fontFamily: FONTS.body,
      display: 'flex',
    }}
  >
    {!vertical && (
      <div
        style={{
          width: 330,
          flexShrink: 0,
          borderRight: `1px solid ${C.uiBorderSoft}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '30px 22px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '0 6px'}}>
          <LoopMark size={30} />
          <span style={{fontFamily: FONTS.display, fontSize: 27, fontWeight: 600, color: C.uiInk}}>
            virio
          </span>
        </div>
        {/* Search */}
        <div
          style={{
            marginTop: 34,
            height: 44,
            border: `1px solid ${C.uiBorder}`,
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 10,
            color: C.uiMuted,
            fontSize: 16,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15">
            <circle cx="6.5" cy="6.5" r="5" stroke={C.uiMuted} strokeWidth="1.6" fill="none" />
            <path d="M10.5 10.5 L14 14" stroke={C.uiMuted} strokeWidth="1.6" />
          </svg>
          <span style={{flex: 1}}>Search...</span>
          <span style={{fontSize: 13, border: `1px solid ${C.uiBorder}`, borderRadius: 5, padding: '1px 6px'}}>
            ⌘K
          </span>
        </div>
        {/* Nav */}
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 3}}>
          {NAV.map((n) => (
            <div
              key={n.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                padding: '11px 14px',
                borderRadius: 10,
                background: n.active ? '#F2F3F2' : 'transparent',
                color: C.uiInk,
                fontWeight: n.active ? 650 : 450,
                fontSize: 17.5,
              }}
            >
              <NavGlyph kind={n.kind} color={n.active ? C.uiInk : C.uiMuted} />
              {n.label}
            </div>
          ))}
        </div>
        <div style={{height: 1, background: C.uiBorderSoft, margin: '22px 6px'}} />
        {['Documentation', 'Developer portal'].map((l) => (
          <div
            key={l}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '10px 14px',
              color: C.uiInk,
              fontSize: 17,
            }}
          >
            <span style={{color: C.uiMuted, fontFamily: FONTS.mono, fontSize: 13}}>
              {l === 'Documentation' ? '❏' : '</>'}
            </span>
            {l}
          </div>
        ))}
        <div style={{flex: 1}} />
        {/* Test mode */}
        <div
          style={{
            border: `1px solid ${C.uiBorder}`,
            borderRadius: 13,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{fontWeight: 650, fontSize: 16.5, color: C.uiInk}}>Test mode</div>
            <div style={{fontSize: 13.5, color: C.uiMuted, marginTop: 2}}>Accelerated executor</div>
          </div>
          <div
            style={{
              width: 46,
              height: 26,
              borderRadius: 13,
              background: '#34C77B',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 3,
                top: 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, padding: '0 4px'}}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: C.uiInk,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            P
          </div>
          <div>
            <div style={{fontWeight: 650, fontSize: 16, color: C.uiInk}}>Virio Labs</div>
            <div style={{fontSize: 13.5, color: C.uiMuted}}>Merchant workspace</div>
          </div>
        </div>
      </div>
    )}

    {/* Main */}
    <div style={{flex: 1, position: 'relative', minWidth: 0}}>
      {/* Top bar pills */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 28,
          display: 'flex',
          gap: 12,
          zIndex: 5,
        }}
      >
        <div
          style={{
            height: 48,
            borderRadius: 12,
            background: C.uiInk,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '0 16px',
            fontSize: 16,
          }}
        >
          {/* Base network glyph: simple circle */}
          <svg width="17" height="17" viewBox="0 0 17 17">
            <circle cx="8.5" cy="8.5" r="7" fill="#0052FF" />
            <path d="M8.5 3 a5.5 5.5 0 1 0 0 11 a5.5 5.5 0 0 0 0 -11 M3.4 8.5 H10" fill="#fff" fillRule="evenodd" />
          </svg>
          <span style={{opacity: 0.85}}>▾</span>
        </div>
        <div
          style={{
            height: 48,
            borderRadius: 12,
            background: C.uiInk,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            fontWeight: 650,
            fontSize: 17,
          }}
        >
          {MERCHANT_WALLET} <span style={{opacity: 0.85}}>▾</span>
        </div>
      </div>
      <div style={{borderBottom: `1px solid ${C.uiBorderSoft}`, height: 84}} />
      {children}
    </div>
  </div>
);

// ─── Products page (header + empty state / created row) ──────────────────────

export const ProductsPage: React.FC<{createdAt?: number; vertical?: boolean}> = ({
  createdAt,
  vertical,
}) => {
  const frame = useCurrentFrame();
  const created = createdAt !== undefined && frame >= createdAt;
  const rowIn = created
    ? interpolate(frame, [createdAt, createdAt + 14], [0, 1], {
        extrapolateRight: 'clamp',
        easing: EASE_OUT,
      })
    : 0;
  const pad = vertical ? 36 : 64;
  return (
    <div style={{padding: `34px ${pad}px`, maxWidth: 1280, margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{fontFamily: FONTS.display, fontSize: 44, fontWeight: 700, color: C.uiInk}}>
            Products
          </div>
          <div style={{fontSize: 18.5, color: C.uiMuted, marginTop: 6}}>
            Subscription products created on the Virio manager
          </div>
        </div>
        <div
          style={{
            height: 52,
            borderRadius: 12,
            background: C.uiInk,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 22px',
            fontWeight: 650,
            fontSize: 18,
          }}
        >
          <span style={{fontSize: 20, fontWeight: 400}}>+</span> Create Product
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          border: `1px solid ${C.uiBorder}`,
          borderRadius: 16,
          minHeight: vertical ? 380 : 470,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!created ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: '#F4F5F4',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 8,
              }}
            >
              <NavGlyph kind="products" color={C.uiMuted} />
            </div>
            <div style={{fontWeight: 700, fontSize: 22, color: C.uiInk}}>No products yet</div>
            <div style={{fontSize: 17, color: C.uiMuted, textAlign: 'center', maxWidth: 420, lineHeight: 1.5}}>
              Create your first subscription product to start billing customers onchain.
            </div>
            <div
              style={{
                marginTop: 16,
                height: 52,
                borderRadius: 12,
                background: C.uiInk,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 22px',
                fontWeight: 650,
                fontSize: 18,
              }}
            >
              <span style={{fontSize: 20, fontWeight: 400}}>+</span> Create Product
            </div>
          </div>
        ) : (
          <div style={{padding: '8px 28px', opacity: rowIn, transform: `translateY(${(1 - rowIn) * 10}px)`}}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: vertical ? '1.3fr 1fr 1fr' : '1.4fr 0.8fr 0.9fr 0.8fr 0.7fr',
                padding: '16px 0 12px',
                borderBottom: `1px solid ${C.uiBorderSoft}`,
                color: C.uiMuted,
                fontSize: 14.5,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              <span>Name</span>
              <span>Price</span>
              <span>Interval</span>
              {!vertical && <span>Created</span>}
              {!vertical && <span>Status</span>}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: vertical ? '1.3fr 1fr 1fr' : '1.4fr 0.8fr 0.9fr 0.8fr 0.7fr',
                padding: '18px 0',
                alignItems: 'center',
                fontSize: 17.5,
                color: C.uiInk,
              }}
            >
              <span>
                <strong>Forge Pro</strong>
                <div style={{fontSize: 14, color: C.uiMuted, marginTop: 2}}>
                  AI coding agent — Pro tier
                </div>
              </span>
              <span>
                <strong>$20.00</strong> <span style={{color: C.uiMuted}}>USDC</span>
              </span>
              <span>Monthly</span>
              {!vertical && <span style={{color: C.uiMuted}}>6/11/2026</span>}
              {!vertical && (
                <span>
                  <span
                    style={{
                      background: '#E8F8EF',
                      color: C.uiSuccess,
                      borderRadius: 999,
                      padding: '4px 13px',
                      fontSize: 14,
                      fontWeight: 650,
                    }}
                  >
                    active
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Create Product modal ─────────────────────────────────────────────────────
// Recreated from the screenshot: Name / Description (optional) / Price (USDC)
// with the protocol-fee note / Billing interval. After submit it shows the
// created Plan ID resolving in (bytes32, like the contract emits) + Copy.

interface ModalTiming {
  openAt: number;
  nameAt: number;
  descAt: number;
  priceAt: number;
  intervalOpenAt: number;
  intervalPickAt: number;
  submitAt: number;
  successAt: number; // success body with Plan ID scramble
  copyAt: number;
  vertical?: boolean;
}

const NAME = 'Forge Pro';
const DESC = 'AI coding agent — Pro tier';
const PRICE = '20';
const HEXC = '0123456789abcdef';

const Field: React.FC<{
  label: string;
  value: string;
  typedChars: number;
  placeholder: string;
  note?: string;
  caret: boolean;
}> = ({label, value, typedChars, placeholder, note, caret}) => {
  const shown = value.slice(0, Math.max(0, typedChars));
  return (
    <div style={{marginBottom: 22}}>
      <div style={{fontWeight: 650, fontSize: 17, color: C.uiInk, marginBottom: 9}}>{label}</div>
      <div
        style={{
          height: 54,
          border: `1px solid ${caret ? C.uiInk : C.uiBorder}`,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          padding: '0 17px',
          fontSize: 17.5,
          color: shown ? C.uiInk : '#A8AFAB',
        }}
      >
        {shown || placeholder}
        {caret && (
          <span style={{display: 'inline-block', width: 2, height: 22, background: C.uiInk, marginLeft: 1}} />
        )}
      </div>
      {note && (
        <div style={{fontSize: 14.5, color: C.uiMuted, marginTop: 8, lineHeight: 1.45}}>{note}</div>
      )}
    </div>
  );
};

export const CreateProductModal: React.FC<ModalTiming> = (t) => {
  const frame = useCurrentFrame();
  if (frame < t.openAt) return null;

  const inT = interpolate(frame, [t.openAt, t.openAt + 13], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const chars = (start: number, speed = 1.1) =>
    frame < start ? 0 : Math.floor((frame - start) * speed);
  const success = frame >= t.successAt;
  const submitting = frame >= t.submitAt && !success;
  const intervalOpen = frame >= t.intervalOpenAt && frame < t.intervalPickAt;
  const intervalPicked = frame >= t.intervalPickAt;

  // Plan ID scramble: resolves left→right over 22 frames.
  const hexBody = PLAN_ID.slice(2);
  const resolveT = Math.min(1, Math.max(0, (frame - t.successAt - 4) / 22));
  const resolved = Math.floor(resolveT * hexBody.length);
  const planIdShown =
    '0x' +
    hexBody
      .split('')
      .map((ch, i) =>
        i < resolved ? ch : HEXC[(i * 7 + frame * 3) % 16],
      )
      .join('');
  const fullyResolved = resolved >= hexBody.length;
  const copyPulse = fullyResolved && frame < t.copyAt ? 1 + 0.05 * Math.sin(frame * 0.45) : 1;
  const copied = frame >= t.copyAt;

  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 20, fontFamily: FONTS.body}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(10,12,11,${0.36 * inT})`}} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: t.vertical ? 880 : 660,
          transform: `translate(-50%, -50%) scale(${0.96 + 0.04 * inT})`,
          opacity: inT,
          background: C.uiCard,
          borderRadius: 18,
          boxShadow: '0 30px 80px rgba(0,0,0,0.28)',
          padding: '0 0 26px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 30px',
            borderBottom: `1px solid ${C.uiBorderSoft}`,
            marginBottom: 26,
          }}
        >
          <span style={{fontWeight: 700, fontSize: 23, color: C.uiInk}}>
            {success ? 'Product created' : 'Create Product'}
          </span>
          <span style={{color: C.uiMuted, fontSize: 22}}>×</span>
        </div>

        {!success ? (
          <div style={{padding: '0 30px'}}>
            <Field
              label="Name"
              value={NAME}
              typedChars={chars(t.nameAt)}
              placeholder="Pro Plan"
              caret={frame >= t.nameAt && frame < t.descAt}
            />
            <Field
              label="Description (optional)"
              value={DESC}
              typedChars={chars(t.descAt, 1.4)}
              placeholder="Full access to all features"
              caret={frame >= t.descAt && frame < t.priceAt}
            />
            <Field
              label="Price (USDC)"
              value={PRICE}
              typedChars={chars(t.priceAt, 0.7)}
              placeholder="9.99"
              note="Minimum 1.01 USDC — must cover the 1 USDC protocol flat fee plus executor and protocol percentages."
              caret={frame >= t.priceAt && frame < t.intervalOpenAt}
            />
            <div style={{fontWeight: 650, fontSize: 17, color: C.uiInk, marginBottom: 9}}>
              Billing interval
            </div>
            <div
              style={{
                height: 54,
                border: `1px solid ${intervalOpen ? C.uiInk : C.uiBorder}`,
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 17px',
                fontSize: 17.5,
                color: intervalPicked ? C.uiInk : '#A8AFAB',
                position: 'relative',
              }}
            >
              {intervalPicked ? 'Monthly' : 'Select an interval...'}
              <span style={{color: C.uiMuted}}>⌄</span>
              {intervalOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 58,
                    left: 0,
                    right: 0,
                    background: C.uiCard,
                    border: `1px solid ${C.uiBorder}`,
                    borderRadius: 11,
                    boxShadow: '0 14px 40px rgba(0,0,0,0.14)',
                    zIndex: 5,
                    overflow: 'hidden',
                  }}
                >
                  {['Daily', 'Weekly', 'Monthly', 'Annually'].map((o) => (
                    <div
                      key={o}
                      style={{
                        padding: '13px 17px',
                        fontSize: 17,
                        color: C.uiInk,
                        background: o === 'Monthly' ? '#F2F3F2' : 'transparent',
                      }}
                    >
                      {o}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: 20,
                border: `1px solid ${C.uiBorderSoft}`,
                background: '#FAFAF9',
                borderRadius: 11,
                padding: '14px 17px',
                fontSize: 14.5,
                color: C.uiMuted,
                lineHeight: 1.5,
              }}
            >
              Protocol fee and flat fee are set on the manager by the contract owner — they
              aren&apos;t configurable per plan.
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 26}}>
              <div
                style={{
                  height: 52,
                  borderRadius: 11,
                  border: `1px solid ${C.uiBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 24px',
                  fontWeight: 600,
                  fontSize: 17.5,
                  color: C.uiInk,
                }}
              >
                Cancel
              </div>
              <div
                style={{
                  height: 52,
                  borderRadius: 11,
                  background: C.uiInk,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 24px',
                  fontWeight: 650,
                  fontSize: 17.5,
                }}
              >
                {submitting && (
                  <svg width="17" height="17" viewBox="0 0 17 17" style={{transform: `rotate(${frame * 14}deg)`}}>
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="#ffffff55" strokeWidth="2.4" fill="none" />
                    <path d="M8.5 2 a6.5 6.5 0 0 1 6.5 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  </svg>
                )}
                {submitting ? 'Creating…' : 'Create Product'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{padding: '4px 30px 0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: '#E8F8EF',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg width="20" height="16" viewBox="0 0 20 16">
                  <path d="M2 8.5 L7.5 14 L18 2.5" stroke={C.uiSuccess} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: 20, color: C.uiInk}}>Forge Pro</div>
                <div style={{fontSize: 16, color: C.uiMuted, marginTop: 2}}>
                  $20.00 / month · USDC · onchain
                </div>
              </div>
            </div>
            <div style={{fontWeight: 650, fontSize: 16.5, color: C.uiInk, margin: '24px 0 9px'}}>
              Plan ID
            </div>
            <div
              style={{
                border: `1px solid ${fullyResolved ? C.emeraldDark + '66' : C.uiBorder}`,
                background: '#FAFAF9',
                borderRadius: 11,
                padding: '15px 17px',
                fontFamily: FONTS.mono,
                fontSize: t.vertical ? 19 : 16.5,
                color: fullyResolved ? C.uiInk : C.uiMuted,
                wordBreak: 'break-all',
                lineHeight: 1.55,
              }}
            >
              {planIdShown}
            </div>
            <div style={{fontSize: 14.5, color: C.uiMuted, marginTop: 10, lineHeight: 1.5}}>
              keccak256(merchant ‖ nonce ‖ chainId) — paste this into your integration.
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 22}}>
              <div
                style={{
                  height: 52,
                  borderRadius: 11,
                  background: copied ? C.emeraldDark : C.uiInk,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 26px',
                  fontWeight: 650,
                  fontSize: 17.5,
                  transform: `scale(${copyPulse})`,
                }}
              >
                {copied ? '✓ Copied' : 'Copy Plan ID'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
