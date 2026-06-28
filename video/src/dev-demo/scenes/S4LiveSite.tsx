// SCENE 4 — the live Forge site. Pricing cards stagger in; the cursor walks to
// the Pro tier's "Subscribe with Crypto" button and clicks.

import React from 'react';
import {BrowserFrame} from '../BrowserFrame';
import {Cursor} from '../Cursor';
import {browserRect, C} from '../theme';
import {ClickRipple} from '../ui';
import {ForgeSite, proButtonCenter} from '../ForgeSite';

const T = {
  enter: 2,
  press: 122,
};

export const S4LiveSite: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const r = browserRect(vertical);
  const btn = proButtonCenter(vertical);

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
          <ForgeSite enterAt={T.enter} pressAt={T.press} vertical={vertical} />
        </BrowserFrame>
      </div>

      <Cursor
        from={40}
        waypoints={[
          {frame: 42, x: btn.x + 320, y: btn.y - 260},
          {frame: 84, x: btn.x + 30, y: btn.y + 40}, // approach low…
          {frame: 104, x: btn.x, y: btn.y}, // …settle on the button
        ]}
        clicks={[T.press]}
      />
      <ClickRipple x={btn.x} y={btn.y} at={T.press} />
    </div>
  );
};
