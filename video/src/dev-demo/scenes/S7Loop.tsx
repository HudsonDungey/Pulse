// SCENE 7 — done. The modal collapses into the site's subscribed state, the
// browser shrinks to become the FORGE node of the recurring-payment loop, the
// emerald dot laps as months tick, and the closing copy lands.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BrowserFrame} from '../BrowserFrame';
import {browserRect, C, EASE_IN_OUT, EASE_OUT, FONTS, lerpRect} from '../theme';
import {ForgeSite} from '../ForgeSite';
import {forgeNodeRect, LoopDiagram} from '../LoopDiagram';
import {LoopMark} from '../VirioDashboard';
import {VirioCheckoutModal} from '../VirioCheckoutModal';

const T = {
  collapse: 2,
  siteSuccess: 8,
  shrinkStart: 56,
  shrinkEnd: 88,
  draw: 66,
  dot: 84,
  lap: 40, // months tick at dot + 40/80/120 — all three land before the outro
  copy1: 104,
  copy2: 136,
  copy3: 172,
  outro: 218, // copy fades, loop mark + virio.xyz
  fade: 230, // fade to black
};

export const S7Loop: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  const frame = useCurrentFrame();
  const bRect = browserRect(vertical);
  const nodeRect = forgeNodeRect(vertical);

  const shrinkT = interpolate(frame, [T.shrinkStart, T.shrinkEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });
  const r = lerpRect(bRect, nodeRect, shrinkT);
  // Browser content fades as it lands; the FORGE node takes over.
  const browserFade = interpolate(frame, [T.shrinkEnd - 10, T.shrinkEnd + 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const landed = frame >= T.shrinkEnd - 2;

  const beat = (from: number, dur = 16) =>
    interpolate(frame, [from, from + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });
  const copyFade = interpolate(frame, [T.outro - 8, T.outro], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outroT = beat(T.outro, 14);
  const blackout = interpolate(frame, [T.fade, T.fade + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const copyY = vertical ? 1380 : 790;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg}}>
      <LoopDiagram
        drawAt={T.draw}
        dotFrom={T.dot}
        lap={T.lap}
        vertical={vertical}
        hideForgeNode={!landed}
      />

      {/* The browser, shrinking into the FORGE node */}
      {browserFade > 0 && (
        <div
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: bRect.w,
            height: bRect.h,
            transform: `scale(${r.w / bRect.w})`,
            transformOrigin: 'top left',
            borderRadius: r.r / (r.w / bRect.w),
            overflow: 'hidden',
            border: `1px solid ${C.edBorder}`,
            boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
            opacity: browserFade,
          }}
        >
          <BrowserFrame>
            <ForgeSite enterAt={-100} vertical={vertical} successAt={T.siteSuccess} />
          </BrowserFrame>
          <div
            style={{
              position: 'absolute',
              left: -bRect.x,
              top: -bRect.y,
              width: bRect.x + bRect.w,
              height: bRect.y + bRect.h,
            }}
          >
            <VirioCheckoutModal
              openAt={-100}
              successAt={-50}
              collapseAt={T.collapse}
              vertical={vertical}
            />
          </div>
        </div>
      )}

      {/* Closing copy, in beats */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: copyY,
          textAlign: 'center',
          fontFamily: FONTS.display,
          opacity: copyFade,
        }}
      >
        <div
          style={{
            fontSize: vertical ? 40 : 38,
            fontWeight: 650,
            color: C.white,
            opacity: beat(T.copy1),
            transform: `translateY(${(1 - beat(T.copy1)) * 16}px)`,
          }}
        >
          Three lines of code.
        </div>
        <div
          style={{
            fontSize: vertical ? 27 : 26,
            fontWeight: 450,
            color: C.dim,
            marginTop: 18,
            opacity: beat(T.copy2),
            transform: `translateY(${(1 - beat(T.copy2)) * 16}px)`,
          }}
        >
          No invoices. No processors. No one in the middle.
        </div>
        <div
          style={{
            fontSize: vertical ? 56 : 54,
            fontWeight: 750,
            color: C.emerald,
            letterSpacing: '-0.02em',
            marginTop: 34,
            opacity: beat(T.copy3),
            transform: `translateY(${(1 - beat(T.copy3)) * 20}px)`,
          }}
        >
          Now go about your life.
        </div>
      </div>

      {/* Outro: loop mark + virio.xyz */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          opacity: outroT,
          background: C.bg,
        }}
      >
        <LoopMark size={64} color={C.emerald} />
        <div style={{fontFamily: FONTS.body, fontSize: 22, color: C.dim, letterSpacing: '0.06em'}}>
          virio.xyz
        </div>
      </div>

      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: blackout}} />
    </div>
  );
};
