// Human-feeling mouse cursor: waypoint interpolation with a slight overshoot
// settle, a pause before each click, and a quick scale pulse on click.

import React from 'react';
import {useCurrentFrame} from 'remotion';

export interface Waypoint {
  frame: number;
  x: number;
  y: number;
}

interface Props {
  waypoints: Waypoint[]; // sorted by frame; cursor rests between segments
  clicks?: number[]; // frames at which a click pulse plays
  from?: number; // first visible frame
  until?: number; // last visible frame
  scale?: number;
}

// easeOutBack with a restrained ~4% overshoot — arrives, slightly passes, settles.
function easeOutOvershoot(t: number): number {
  const c1 = 0.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export const Cursor: React.FC<Props> = ({waypoints, clicks = [], from, until, scale = 1}) => {
  const frame = useCurrentFrame();
  if (from !== undefined && frame < from) return null;
  if (until !== undefined && frame > until) return null;
  if (waypoints.length === 0) return null;

  let x = waypoints[0].x;
  let y = waypoints[0].y;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= b.frame) {
      x = b.x;
      y = b.y;
    } else if (frame > a.frame) {
      const t = easeOutOvershoot((frame - a.frame) / (b.frame - a.frame));
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
      break;
    } else {
      break;
    }
  }

  // Click pulse: scale dips for 4 frames then recovers over 6.
  let press = 1;
  for (const c of clicks) {
    if (frame >= c && frame <= c + 10) {
      const t = (frame - c) / 10;
      press = t < 0.4 ? 1 - 0.18 * (t / 0.4) : 1 - 0.18 * (1 - (t - 0.4) / 0.6);
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${press * scale})`,
        transformOrigin: '4px 4px',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* macOS-style arrow: black fill, white outline */}
      <svg width="26" height="30" viewBox="0 0 26 30">
        <path
          d="M3 2 L3 24 L8.7 18.7 L12.2 27 L16 25.4 L12.5 17.3 L20 17 Z"
          fill="#000"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
