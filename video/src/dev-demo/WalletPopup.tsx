// Browser-extension wallet popup, anchored top-right with a pointer triangle.
// Three states, each its own instance crossfaded by the scene:
//   connect   — "forge.dev wants to connect"
//   approve   — ERC-20 spending cap request (the REAL Virio flow: approve max,
//               bounded onchain by the plan) with spinner → "✓ Approved"
//   subscribe — transaction request for subscribe(planId, 0). The protocol uses
//               two transactions, not an EIP-712 signature — shown faithfully.
//
// All branding comes from WalletBrand.tsx (single swap point).

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, CUSTOMER_WALLET, EASE_OUT, FONTS, PLAN_ID_SHORT, VIRIO_CONTRACT_SHORT} from './theme';
import {BRAND, WalletMark, WalletWordmark} from './WalletBrand';

export type WalletState = 'connect' | 'approve' | 'subscribe';

// ─── Geometry (shared with cursor choreography) ──────────────────────────────

const W = 440;

export function popupRect(vertical: boolean): {x: number; y: number} {
  return vertical ? {x: (1080 - 520) / 2, y: 250} : {x: 1262, y: 108};
}

export function popupWidth(vertical: boolean): number {
  return vertical ? 520 : W;
}

const HEIGHTS: Record<WalletState, number> = {connect: 488, approve: 596, subscribe: 600};

/** Stage coordinates of the primary (right) action button for a state. */
export function primaryButtonCenter(vertical: boolean, state: WalletState): {x: number; y: number} {
  const r = popupRect(vertical);
  const w = popupWidth(vertical);
  return {x: r.x + w - 26 - (w / 2 - 32) / 2, y: r.y + HEIGHTS[state] - 26 - 27};
}

// ─── Shared pieces ────────────────────────────────────────────────────────────

const Row: React.FC<{label: string; value: React.ReactNode; mono?: boolean}> = ({
  label,
  value,
  mono,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '11px 0',
      borderBottom: `1px solid ${C.walletBorder}`,
      fontSize: 15.5,
    }}
  >
    <span style={{color: C.walletMuted}}>{label}</span>
    <span style={{color: C.walletInk, fontWeight: 600, fontFamily: mono ? FONTS.mono : FONTS.body, fontSize: mono ? 14.5 : 15.5}}>
      {value}
    </span>
  </div>
);

const Buttons: React.FC<{secondary: string; primary: string; primaryDone?: boolean}> = ({
  secondary,
  primary,
  primaryDone,
}) => (
  <div style={{display: 'flex', gap: 12, marginTop: 'auto'}}>
    <div
      style={{
        flex: 1,
        height: 54,
        borderRadius: 27,
        border: `1.5px solid ${C.walletBlue}`,
        color: C.walletBlue,
        display: 'grid',
        placeItems: 'center',
        fontWeight: 650,
        fontSize: 16.5,
      }}
    >
      {secondary}
    </div>
    <div
      style={{
        flex: 1,
        height: 54,
        borderRadius: 27,
        background: primaryDone ? C.uiSuccess : C.walletBlue,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 650,
        fontSize: 16.5,
      }}
    >
      {primary}
    </div>
  </div>
);

const Spinner: React.FC<{frame: number; size?: number}> = ({frame, size = 30}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{transform: `rotate(${frame * 13}deg)`}}>
    <circle cx="15" cy="15" r="12" stroke={C.walletBorder} strokeWidth="3.4" fill="none" />
    <path d="M15 3 a12 12 0 0 1 12 12" stroke={C.walletBlue} strokeWidth="3.4" fill="none" strokeLinecap="round" />
  </svg>
);

// ─── Popup ────────────────────────────────────────────────────────────────────

interface Props {
  state: WalletState;
  enterAt: number;
  exitAt: number; // starts fading/closing here
  // approve micro-states:
  approvedSpinnerAt?: number; // spinner replaces buttons
  approvedAt?: number; // "✓ Approved"
  vertical?: boolean;
}

export const WalletPopup: React.FC<Props> = ({
  state,
  enterAt,
  exitAt,
  approvedSpinnerAt,
  approvedAt,
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt || frame > exitAt + 12) return null;

  const inT = interpolate(frame, [enterAt, enterAt + 13], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const outT = interpolate(frame, [exitAt, exitAt + 12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const o = inT * outT;
  const r = popupRect(vertical);
  const w = popupWidth(vertical);
  const h = HEIGHTS[state];

  const spinning =
    approvedSpinnerAt !== undefined &&
    frame >= approvedSpinnerAt &&
    (approvedAt === undefined || frame < approvedAt);
  const approved = approvedAt !== undefined && frame >= approvedAt;

  return (
    <div
      style={{
        position: 'absolute',
        left: r.x,
        top: r.y,
        width: w,
        zIndex: 80,
        opacity: o,
        transform: `translateY(${(1 - inT) * -14}px)`,
        fontFamily: FONTS.body,
        filter: 'drop-shadow(0 18px 50px rgba(0,0,0,0.45))',
      }}
    >
      {/* pointer triangle toward the toolbar */}
      <div
        style={{
          position: 'absolute',
          top: -11,
          ...(vertical ? {left: '50%', marginLeft: -12} : {right: 40}),
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: `12px solid ${C.walletBg}`,
        }}
      />
      <div
        style={{
          background: C.walletBg,
          borderRadius: 16,
          height: h,
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header: brand + account + network */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
            <WalletMark size={26} />
            <WalletWordmark size={16} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              border: `1px solid ${C.walletBorder}`,
              borderRadius: 999,
              padding: '5px 13px',
              fontSize: 13.5,
              fontWeight: 600,
              color: C.walletInk,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 17 17">
              <circle cx="8.5" cy="8.5" r="7" fill="#0052FF" />
            </svg>
            Base
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 11, marginTop: 18}}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `conic-gradient(${BRAND.accent}, #9C5BF5, #38B6E8, ${BRAND.accent})`,
            }}
          />
          <div>
            <div style={{fontWeight: 700, fontSize: 16, color: C.walletInk}}>Account 1</div>
            <div style={{fontSize: 13.5, color: C.walletMuted, fontFamily: FONTS.mono}}>
              {CUSTOMER_WALLET} · 1,204.55 USDC
            </div>
          </div>
        </div>

        <div style={{height: 1, background: C.walletBorder, margin: '18px 0 14px'}} />

        {state === 'connect' && (
          <>
            <div style={{fontWeight: 750, fontSize: 21, color: C.walletInk}}>
              forge.dev wants to connect
            </div>
            <div style={{fontSize: 15, color: C.walletMuted, marginTop: 8, lineHeight: 1.5}}>
              This site is requesting to see your address, account balance and activity.
            </div>
            <div style={{marginTop: 14}}>
              <Row label="Site" value="https://forge.dev" />
              <Row label="Account" value={CUSTOMER_WALLET} mono />
            </div>
            <Buttons secondary="Cancel" primary="Connect" />
          </>
        )}

        {state === 'approve' && (
          <>
            <div style={{fontWeight: 750, fontSize: 21, color: C.walletInk}}>
              Spending cap request
            </div>
            <div style={{fontSize: 15, color: C.walletMuted, marginTop: 8, lineHeight: 1.5}}>
              Allow the Virio Subscription Manager to use your USDC for recurring payments.
            </div>
            <div style={{marginTop: 12}}>
              <Row label="Spender" value={`Virio Protocol · ${VIRIO_CONTRACT_SHORT}`} mono />
              <Row label="Token" value="USDC" />
              <Row label="Spending cap" value="Unlimited" />
            </div>
            <div style={{fontSize: 13.5, color: C.walletMuted, marginTop: 12, lineHeight: 1.5}}>
              Charges are bounded onchain by the plan: 20 USDC / month.
            </div>
            {spinning ? (
              <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: 54}}>
                <Spinner frame={frame} />
                <span style={{fontSize: 15.5, color: C.walletMuted}}>Approving…</span>
              </div>
            ) : approved ? (
              <div
                style={{
                  marginTop: 'auto',
                  height: 54,
                  borderRadius: 27,
                  background: '#E8F8EF',
                  color: C.uiSuccess,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 750,
                  fontSize: 17,
                }}
              >
                ✓ Approved
              </div>
            ) : (
              <Buttons secondary="Reject" primary="Approve" />
            )}
          </>
        )}

        {state === 'subscribe' && (
          <>
            <div style={{fontWeight: 750, fontSize: 21, color: C.walletInk}}>
              Transaction request
            </div>
            <div style={{fontSize: 15, color: C.walletMuted, marginTop: 8, lineHeight: 1.5}}>
              forge.dev · Virio Subscription Manager
            </div>
            <div
              style={{
                marginTop: 12,
                border: `1px solid ${C.walletBorder}`,
                borderRadius: 12,
                padding: '4px 16px',
                background: '#FAFBFC',
              }}
            >
              <Row label="Function" value="subscribe" mono />
              <Row label="Plan" value={`Forge Pro · ${PLAN_ID_SHORT}`} mono />
              <Row label="Amount" value="20 USDC / month" />
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '11px 0', fontSize: 15.5}}>
                <span style={{color: C.walletMuted}}>Network</span>
                <span style={{color: C.walletInk, fontWeight: 600}}>Base</span>
              </div>
            </div>
            <Buttons secondary="Reject" primary="Confirm" />
          </>
        )}
      </div>
    </div>
  );
};
