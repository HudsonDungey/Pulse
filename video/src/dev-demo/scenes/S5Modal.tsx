// SCENE 5 — the Virio checkout modal (real white SDK modal) opens from the Pro
// button. Cursor picks "Continue with Wallet".

import React from 'react';
import {BrowserFrame} from '../BrowserFrame';
import {Cursor} from '../Cursor';
import {browserRect, C} from '../theme';
import {ClickRipple} from '../ui';
import {ForgeSite, proButtonCenter} from '../ForgeSite';
import {connectOptionCenter, VirioCheckoutModal} from '../VirioCheckoutModal';

const T = {
  open: 4,
  connectClick: 76,
  connecting: 82,
};

export const S5Modal: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const r = browserRect(vertical);
  const btn = proButtonCenter(vertical);
  const option = connectOptionCenter(vertical);

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
        {/* Modal lives inside the browser viewport, in stage coordinates */}
        <div style={{position: 'absolute', left: -r.x, top: -r.y, width: r.x + r.w, height: r.y + r.h}}>
          <VirioCheckoutModal
            openAt={T.open}
            originX={btn.x}
            originY={btn.y}
            connectingAt={T.connecting}
            vertical={vertical}
          />
        </div>
      </div>

      <Cursor
        waypoints={[
          {frame: 0, x: btn.x, y: btn.y},
          {frame: 24, x: btn.x, y: btn.y},
          {frame: 56, x: option.x + 10, y: option.y},
        ]}
        clicks={[T.connectClick]}
      />
      <ClickRipple x={option.x + 10} y={option.y} at={T.connectClick} light />
    </div>
  );
};
