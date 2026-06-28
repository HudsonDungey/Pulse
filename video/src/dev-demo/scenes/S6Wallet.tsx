// SCENE 6 — the wallet. Extension popup top-right, three states:
// connect → spending cap (ERC-20 approve, the real Virio flow) → subscribe
// transaction. The Virio modal tracks along behind. Longest beat of the video.

import React from 'react';
import {BrowserFrame} from '../BrowserFrame';
import {Cursor} from '../Cursor';
import {browserRect, C} from '../theme';
import {ClickRipple} from '../ui';
import {ForgeSite} from '../ForgeSite';
import {connectOptionCenter, VirioCheckoutModal} from '../VirioCheckoutModal';
import {primaryButtonCenter, WalletPopup} from '../WalletPopup';

const T = {
  // A — connect
  aEnter: 6,
  aClick: 62,
  aExit: 72,
  preparing: 78,
  signing: 96,
  // B — spending cap
  bEnter: 96,
  bClick: 152,
  bSpinner: 154,
  bApproved: 186,
  bExit: 204,
  // C — subscribe transaction
  cEnter: 218,
  cClick: 272,
  cExit: 280,
  confirming: 286,
  success: 320,
};

export const S6Wallet: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const r = browserRect(vertical);
  const option = connectOptionCenter(vertical);
  const aBtn = primaryButtonCenter(vertical, 'connect');
  const bBtn = primaryButtonCenter(vertical, 'approve');
  const cBtn = primaryButtonCenter(vertical, 'subscribe');

  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg}}>
      <div
        style={{
          position: 'absolute',
          left: r.x,
          top: r.y,
          width: r.w,
          height: r.h,
          borderRadius: r.r,
          overflow: 'hidden',
          border: `1px solid ${C.edBorder}`,
          boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
        }}
      >
        <BrowserFrame>
          <ForgeSite enterAt={-100} vertical={vertical} />
        </BrowserFrame>
        <div style={{position: 'absolute', left: -r.x, top: -r.y, width: r.x + r.w, height: r.y + r.h}}>
          <VirioCheckoutModal
            openAt={-100}
            connectingAt={-50}
            preparingAt={T.preparing}
            signingAt={T.signing}
            confirmingAt={T.confirming}
            successAt={T.success}
            vertical={vertical}
          />
        </div>
      </div>

      {/* STATE A — connect */}
      <WalletPopup state="connect" enterAt={T.aEnter} exitAt={T.aExit} vertical={vertical} />
      {/* STATE B — spending cap request */}
      <WalletPopup
        state="approve"
        enterAt={T.bEnter}
        exitAt={T.bExit}
        approvedSpinnerAt={T.bSpinner}
        approvedAt={T.bApproved}
        vertical={vertical}
      />
      {/* STATE C — subscribe(planId, 0) transaction */}
      <WalletPopup state="subscribe" enterAt={T.cEnter} exitAt={T.cExit} vertical={vertical} />

      <Cursor
        waypoints={[
          {frame: 0, x: option.x + 10, y: option.y},
          {frame: 14, x: option.x + 10, y: option.y},
          {frame: 46, x: aBtn.x, y: aBtn.y}, // pause ≥6 frames before each click
          {frame: 100, x: aBtn.x, y: aBtn.y},
          {frame: 134, x: bBtn.x, y: bBtn.y},
          {frame: 230, x: bBtn.x, y: bBtn.y},
          {frame: 258, x: cBtn.x, y: cBtn.y},
          {frame: 290, x: cBtn.x, y: cBtn.y},
          {frame: 318, x: cBtn.x - 140, y: cBtn.y + 180},
        ]}
        clicks={[T.aClick, T.bClick, T.cClick]}
      />
      <ClickRipple x={aBtn.x} y={aBtn.y} at={T.aClick} light />
      <ClickRipple x={bBtn.x} y={bBtn.y} at={T.bClick} light />
      <ClickRipple x={cBtn.x} y={cBtn.y} at={T.cClick} light />
    </div>
  );
};
