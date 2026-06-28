// The REAL Virio checkout modal, recreated from packages/sdk/src/react/
// VirioModal.tsx + checkout/styles.ts: white card, black primary, states
// Connect Wallet → Connecting → Preparing → Confirm Subscription → Active.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, FONTS} from './theme';
import {LoopMark} from './VirioDashboard';

// ─── Geometry shared with cursor choreography (stage coordinates) ────────────

export function modalCenter(vertical: boolean): {x: number; y: number} {
  // Vertical: sit low so the wallet popup (top) never overlaps the modal.
  return vertical ? {x: 540, y: 1140} : {x: 960, y: 568};
}

/** Center of the "Continue with Wallet" option. */
export function connectOptionCenter(vertical: boolean): {x: number; y: number} {
  const c = modalCenter(vertical);
  return {x: c.x, y: c.y + 6};
}

interface Props {
  openAt: number;
  originX?: number; // scale-up origin (the Pro button)
  originY?: number;
  connectingAt?: number;
  preparingAt?: number;
  signingAt?: number;
  confirmingAt?: number; // status text flips to "Confirming on Base…"
  successAt?: number;
  collapseAt?: number;
  vertical?: boolean;
}

const Spinner: React.FC<{frame: number}> = ({frame}) => (
  <svg width="34" height="34" viewBox="0 0 34 34" style={{transform: `rotate(${frame * 12}deg)`}}>
    <circle cx="17" cy="17" r="13.5" stroke="#E6E6E6" strokeWidth="3.6" fill="none" />
    <path d="M17 3.5 a13.5 13.5 0 0 1 13.5 13.5" stroke="#000" strokeWidth="3.6" fill="none" strokeLinecap="round" />
  </svg>
);

const Summary: React.FC = () => (
  <div
    style={{
      marginTop: 22,
      padding: 18,
      border: '1px solid #EEEEEE',
      borderRadius: 12,
      background: '#FAFAFA',
    }}
  >
    <div style={{fontSize: 29, fontWeight: 750, color: '#000', letterSpacing: '-0.02em'}}>
      20 USDC
    </div>
    <div style={{fontSize: 15.5, color: '#555', marginTop: 3}}>Every Month · Forge Pro</div>
  </div>
);

export const VirioCheckoutModal: React.FC<Props> = (p) => {
  const frame = useCurrentFrame();
  const vertical = p.vertical ?? false;
  if (frame < p.openAt) return null;

  const at = (f?: number) => f !== undefined && frame >= f;
  // Latest reached state wins.
  const state = at(p.successAt)
    ? 'success'
    : at(p.confirmingAt)
      ? 'confirming'
      : at(p.signingAt)
        ? 'signing'
        : at(p.preparingAt)
          ? 'preparing'
          : at(p.connectingAt)
            ? 'connecting'
            : 'connect';

  const inT = interpolate(frame, [p.openAt, p.openAt + 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const collapseT = p.collapseAt
    ? interpolate(frame, [p.collapseAt, p.collapseAt + 12], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE_OUT,
      })
    : 1;
  if (collapseT <= 0) return null;

  const c = modalCenter(vertical);
  const w = vertical ? 560 : 470;
  // Scale up from the Pro button on open; collapse in place on close.
  const ox = p.originX ?? c.x;
  const oy = p.originY ?? c.y;
  const px = ox + (c.x - ox) * inT;
  const py = oy + (c.y - oy) * inT;
  const scale = (0.35 + 0.65 * inT) * (0.92 + 0.08 * collapseT);

  const confirmProgress = p.confirmingAt
    ? interpolate(frame, [p.confirmingAt, (p.successAt ?? p.confirmingAt + 40) - 2], [0.05, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <>
      {/* Backdrop dims the site */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0,0,0,${0.5 * inT * collapseT})`,
          zIndex: 60,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: px - w / 2,
          top: py,
          width: w,
          transform: `translateY(-50%) scale(${scale})`,
          opacity: inT * collapseT,
          background: '#fff',
          color: '#000',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          fontFamily: FONTS.body,
          zIndex: 65,
        }}
      >
        {/* Close + brand row */}
        <div style={{position: 'absolute', top: 16, right: 18, color: '#666', fontSize: 22}}>×</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
          <LoopMark size={18} color="#000" />
          <span style={{fontSize: 14, fontWeight: 650, color: '#555', letterSpacing: '0.02em'}}>
            virio
          </span>
        </div>

        {state === 'connect' && (
          <>
            <div style={{fontSize: 23, fontWeight: 750, letterSpacing: '-0.01em'}}>
              Connect Wallet
            </div>
            <div style={{fontSize: 15.5, color: '#555', marginTop: 6}}>
              Subscribe to Forge Pro — $20.00 / month · USDC · cancel anytime, onchain.
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22}}>
              <div style={{border: '1px solid #E3E3E3', borderRadius: 12, padding: '14px 17px'}}>
                <div style={{fontSize: 16.5, fontWeight: 650}}>Continue with Wallet</div>
                <div style={{fontSize: 13.5, color: '#777', marginTop: 3}}>
                  MetaMask, Coinbase, Rainbow, Trust, Rabby
                </div>
              </div>
              <div style={{border: '1px solid #E3E3E3', borderRadius: 12, padding: '14px 17px'}}>
                <div style={{fontSize: 16.5, fontWeight: 650, display: 'flex', alignItems: 'center', gap: 9}}>
                  {/* QR glyph */}
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="6" stroke="#000" strokeWidth="1.4" fill="none" />
                    <rect x="9" y="1" width="6" height="6" stroke="#000" strokeWidth="1.4" fill="none" />
                    <rect x="1" y="9" width="6" height="6" stroke="#000" strokeWidth="1.4" fill="none" />
                    <rect x="9" y="9" width="2.5" height="2.5" fill="#000" />
                    <rect x="12.5" y="12.5" width="2.5" height="2.5" fill="#000" />
                  </svg>
                  Connect on another device
                </div>
                <div style={{fontSize: 13.5, color: '#777', marginTop: 3}}>
                  Scan a QR code with your wallet
                </div>
              </div>
            </div>
          </>
        )}

        {state === 'connecting' && (
          <>
            <div style={{fontSize: 23, fontWeight: 750}}>Connecting</div>
            <div style={{fontSize: 15.5, color: '#555', marginTop: 6}}>
              Approve the connection in your wallet.
            </div>
            <div style={{display: 'flex', justifyContent: 'center', padding: '34px 0 14px'}}>
              <Spinner frame={frame} />
            </div>
          </>
        )}

        {state === 'preparing' && (
          <>
            <div style={{fontSize: 23, fontWeight: 750}}>Preparing Subscription</div>
            <div style={{fontSize: 15.5, color: '#555', marginTop: 6}}>
              Review the details below.
            </div>
            <Summary />
          </>
        )}

        {(state === 'signing' || state === 'confirming') && (
          <>
            <div style={{fontSize: 23, fontWeight: 750}}>Confirm Subscription</div>
            <div style={{fontSize: 15.5, color: '#555', marginTop: 6}}>
              {state === 'signing' ? 'Approve the request in your wallet.' : 'Almost there.'}
            </div>
            <Summary />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 13,
                padding: '24px 0 6px',
              }}
            >
              <Spinner frame={frame} />
              <span style={{fontSize: 15, color: '#555'}}>
                {state === 'signing' ? 'Waiting for confirmation…' : 'Confirming on Base…'}
              </span>
              {state === 'confirming' && (
                <div style={{width: '78%', height: 4, borderRadius: 2, background: '#EDEDED', overflow: 'hidden'}}>
                  <div
                    style={{
                      width: `${confirmProgress * 100}%`,
                      height: '100%',
                      background: C.emeraldDark,
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 6}}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: C.uiSuccess,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 26,
                }}
              >
                ✓
              </div>
            </div>
            <div style={{fontSize: 23, fontWeight: 750, textAlign: 'center', marginTop: 16}}>
              Subscription Active
            </div>
            <div style={{fontSize: 15.5, color: '#555', textAlign: 'center', marginTop: 6}}>
              Payments will be processed automatically.
            </div>
            <div
              style={{
                marginTop: 22,
                height: 52,
                borderRadius: 12,
                background: '#000',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 650,
                fontSize: 16.5,
              }}
            >
              Done
            </div>
          </>
        )}
      </div>
    </>
  );
};
