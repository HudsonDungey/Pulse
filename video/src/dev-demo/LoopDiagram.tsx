// S7 closing diagram — the recurring-payment loop, all SVG.
// [SUBSCRIBER] ──USDC──▶ [VIRIO CONTRACT] ──▶ [FORGE], looping back
// "every 30 days". An emerald dot travels the cycle; months tick as it laps.

import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, FONTS, Rect} from './theme';

const NODE_W = 270;
const NODE_H = 104;

interface NodeSpec {
  cx: number;
  cy: number;
  label: string;
  accent?: boolean;
}

function nodes(vertical: boolean): NodeSpec[] {
  return vertical
    ? [
        {cx: 540, cy: 430, label: 'SUBSCRIBER'},
        {cx: 540, cy: 760, label: 'VIRIO CONTRACT', accent: true},
        {cx: 540, cy: 1090, label: 'FORGE'},
      ]
    : [
        {cx: 520, cy: 410, label: 'SUBSCRIBER'},
        {cx: 960, cy: 410, label: 'VIRIO CONTRACT', accent: true},
        {cx: 1400, cy: 410, label: 'FORGE'},
      ];
}

/** Where the shrinking browser lands (the FORGE node). */
export function forgeNodeRect(vertical: boolean): Rect {
  const n = nodes(vertical)[2];
  return {x: n.cx - NODE_W / 2, y: n.cy - NODE_H / 2, w: NODE_W, h: NODE_H, r: 14};
}

// The dot's circuit, as a closed polyline.
function circuit(vertical: boolean): Array<[number, number]> {
  if (vertical) {
    return [
      [540, 482],
      [540, 1038],
      [300, 1090],
      [300, 430],
      [405, 430],
    ];
  }
  return [
    [655, 410],
    [1265, 410],
    [1400, 410],
    [1400, 620],
    [520, 620],
    [520, 462],
  ];
}

function dotPosition(points: Array<[number, number]>, t: number): [number, number] {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    const l = Math.hypot(x2 - x1, y2 - y1);
    lens.push(l);
    total += l;
  }
  let d = ((t % 1) + 1) % 1 * total;
  for (let i = 0; i < points.length; i++) {
    if (d <= lens[i]) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      const k = lens[i] === 0 ? 0 : d / lens[i];
      return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k];
    }
    d -= lens[i];
  }
  return points[0];
}

interface Props {
  drawAt: number; // strokes + nodes draw in
  dotFrom: number; // dot starts traveling; one lap = `lap` frames
  lap?: number;
  vertical?: boolean;
  hideForgeNode?: boolean; // while the shrinking browser is still landing
}

export const LoopDiagram: React.FC<Props> = ({
  drawAt,
  dotFrom,
  lap = 44,
  vertical = false,
  hideForgeNode,
}) => {
  const frame = useCurrentFrame();
  if (frame < drawAt) return null;

  const ns = nodes(vertical);
  const pts = circuit(vertical);
  const drawT = interpolate(frame, [drawAt, drawAt + 26], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const dotT = frame >= dotFrom ? (frame - dotFrom) / lap : 0;
  const laps = Math.floor(dotT);
  const [dx, dy] = dotPosition(pts, dotT);
  const W = vertical ? 1080 : 1920;
  const H = vertical ? 1920 : 1080;

  const pathD =
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ') + ' Z';
  // Rough perimeter for the draw-in dash animation.
  let perim = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    perim += Math.hypot(x2 - x1, y2 - y1);
  }

  const monthY = vertical ? 1300 : 700;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <path
          d={pathD}
          fill="none"
          stroke={C.dim}
          strokeWidth={2}
          strokeDasharray={perim}
          strokeDashoffset={perim * (1 - drawT)}
          opacity={0.55}
        />
        {/* direction arrows */}
        {!vertical && (
          <>
            {/* subscriber → contract, contract → forge, and the return ▲ up */}
            <path d="M808 403 l13 7 l-13 7 Z" fill={C.dim} />
            <path d="M1252 403 l13 7 l-13 7 Z" fill={C.dim} />
            <path d="M520 472 l-7 13 h14 Z" fill={C.dim} opacity={drawT} />
          </>
        )}
        {/* traveling emerald dot + trail */}
        {frame >= dotFrom && (
          <>
            <circle cx={dx} cy={dy} r={7} fill={C.emerald} />
            <circle cx={dx} cy={dy} r={13} fill={C.emerald} opacity={0.22} />
          </>
        )}
      </svg>

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          left: vertical ? 560 : 740 - 40,
          top: vertical ? 560 : 366,
          fontFamily: FONTS.mono,
          fontSize: 15,
          letterSpacing: '0.14em',
          color: C.emerald,
          opacity: drawT,
        }}
      >
        USDC
      </div>
      <div
        style={{
          position: 'absolute',
          left: vertical ? 330 : 960,
          top: vertical ? 940 : 644,
          transform: vertical ? 'rotate(-90deg)' : 'translateX(-50%)',
          fontFamily: FONTS.mono,
          fontSize: 15,
          letterSpacing: '0.14em',
          color: C.dim,
          opacity: drawT,
        }}
      >
        every 30 days
      </div>

      {/* Nodes */}
      {ns.map((n) => {
        if (hideForgeNode && n.label === 'FORGE') return null;
        return (
          <div
            key={n.label}
            style={{
              position: 'absolute',
              left: n.cx - NODE_W / 2,
              top: n.cy - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
              borderRadius: 14,
              background: C.card,
              border: `1px solid ${n.accent ? C.emerald : C.dim + '55'}`,
              boxShadow: n.accent ? `0 0 36px ${C.emerald}26` : 'none',
              display: 'grid',
              placeItems: 'center',
              fontFamily: FONTS.mono,
              fontSize: 17,
              letterSpacing: '0.12em',
              color: n.accent ? C.emerald : C.white,
              opacity: drawT,
              transform: `scale(${0.92 + 0.08 * drawT})`,
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* Month ticks — one per completed lap */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: monthY,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 34,
          fontFamily: FONTS.mono,
          fontSize: 19,
        }}
      >
        {[1, 2, 3].map((m) => {
          const done = laps >= m;
          const tickT = done
            ? interpolate(frame, [dotFrom + m * lap, dotFrom + m * lap + 10], [0, 1], {
                extrapolateRight: 'clamp',
                easing: EASE_OUT,
              })
            : 0;
          return (
            <span
              key={m}
              style={{
                color: done ? C.emerald : C.dim + '66',
                opacity: 0.3 + 0.7 * tickT,
                transform: `translateY(${(1 - tickT) * 8}px)`,
              }}
            >
              Month {m} {done ? '✓' : '·'}
            </span>
          );
        })}
      </div>
    </div>
  );
};
