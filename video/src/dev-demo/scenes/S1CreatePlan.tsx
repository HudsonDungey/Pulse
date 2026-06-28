// SCENE 1 — create the plan in the real (light) Virio dashboard.
// Form fills, "Create Product", the bytes32 Plan ID resolves in, Copy.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Cursor} from '../Cursor';
import {C, EASE_OUT} from '../theme';
import {ClickRipple, Eyebrow, Toast} from '../ui';
import {CreateProductModal, DashShell, ProductsPage} from '../VirioDashboard';

// Local timing (scene spans frames 0–195 of its Sequence).
const T = {
  createClick: 46,
  modalOpen: 52,
  name: 64,
  desc: 80,
  price: 104,
  intervalOpen: 112,
  intervalPick: 126,
  submit: 138,
  success: 150,
  copy: 180,
};

export const S1CreatePlan: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // Cursor targets (stage coordinates), per orientation.
  const P = vertical
    ? {
        start: {x: 700, y: 1100},
        createBtn: {x: 905, y: 145},
        interval: {x: 540, y: 1128},
        monthly: {x: 540, y: 1268},
        submit: {x: 745, y: 1288},
        copy: {x: 745, y: 1120},
      }
    : {
        start: {x: 1280, y: 680},
        createBtn: {x: 1592, y: 145},
        interval: {x: 960, y: 708},
        monthly: {x: 960, y: 858},
        submit: {x: 1172, y: 856},
        copy: {x: 1168, y: 688},
      };

  return (
    <div style={{position: 'absolute', inset: 0, opacity: inT, background: C.uiCard}}>
      <DashShell vertical={vertical}>
        <ProductsPage vertical={vertical} />
      </DashShell>

      <CreateProductModal
        openAt={T.modalOpen}
        nameAt={T.name}
        descAt={T.desc}
        priceAt={T.price}
        intervalOpenAt={T.intervalOpen}
        intervalPickAt={T.intervalPick}
        submitAt={T.submit}
        successAt={T.success}
        copyAt={T.copy}
        vertical={vertical}
      />

      <Eyebrow text="STEP 01 — CREATE A PLAN" from={6} dark />

      <Cursor
        from={10}
        waypoints={[
          {frame: 12, ...P.start},
          {frame: 40, ...P.createBtn},
          {frame: 100, ...P.createBtn}, // rest while fields type themselves
          {frame: 108, ...P.interval},
          {frame: 122, ...P.monthly},
          {frame: 134, ...P.submit},
          {frame: 152, ...P.submit},
          {frame: 172, ...P.copy},
        ]}
        clicks={[T.createClick, T.intervalOpen, T.intervalPick, T.submit, T.copy]}
      />
      <ClickRipple x={P.createBtn.x} y={P.createBtn.y} at={T.createClick} light />
      <ClickRipple x={P.copy.x} y={P.copy.y} at={T.copy} light />

      <Toast text="✓ Plan ID copied" from={T.copy + 4} />
    </div>
  );
};
