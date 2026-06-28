import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_OUT} from '../theme';

type Props = {
  startFrame: number;
  vertical: boolean;
};

// Node coordinates in a normalised [-1, 1] space centred on origin (the loop).
// Hand-placed so the graph reads as deliberate infrastructure, not noise.
const NODES = [
  {x: 0, y: 0, hub: true}, // the loop itself
  {x: -0.62, y: -0.34},
  {x: 0.6, y: -0.4},
  {x: -0.72, y: 0.36},
  {x: 0.68, y: 0.32},
  {x: -0.34, y: -0.66},
  {x: 0.32, y: 0.64},
  {x: 0.85, y: -0.02},
  {x: -0.88, y: 0.02},
  {x: 0.1, y: -0.82},
  {x: -0.12, y: 0.8},
];

// Edges as index pairs. The hub (0) fans out; a few peripheral links close loops.
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [0, 8],
  [1, 5], [2, 9], [3, 8], [4, 6], [5, 9], [6, 10],
  [1, 9], [2, 7], [3, 10], [4, 7],
];

export const NetworkGraph: React.FC<Props> = ({startFrame, vertical}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;

  // Map normalised coords into pixel-percent space. Vertical uses a tighter,
  // taller spread so the graph fills a 9:16 frame.
  const spreadX = vertical ? 34 : 30;
  const spreadY = vertical ? 26 : 34;
  const cx = 50;
  const cy = 50;
  const px = (n: {x: number; y: number}) => cx + n.x * spreadX;
  const py = (n: {x: number; y: number}) => cy + n.y * spreadY;

  return (
    <svg width="100%" height="100%" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}>
      {/* Edges fade in, then carry travelling pulses. */}
      {EDGES.map(([a, b], i) => {
        const A = NODES[a];
        const B = NODES[b];
        const x1 = px(A);
        const y1 = py(A);
        const x2 = px(B);
        const y2 = py(B);

        const edgeIn = interpolate(t, [10 + i * 3, 40 + i * 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });

        // Pulse travels a→b on a per-edge cycle, offset by index.
        const cycle = 75;
        const p = ((t + i * 17) % cycle) / cycle;
        const pulseVisible = t > 45 ? 1 : 0;
        const hx = x1 + (x2 - x1) * p;
        const hy = y1 + (y2 - y1) * p;
        const pulseOpacity = Math.sin(p * Math.PI) * pulseVisible;

        return (
          <g key={`e${i}`}>
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={COLORS.emerald}
              strokeWidth={0.6}
              opacity={edgeIn * 0.22}
            />
            <circle cx={`${hx}%`} cy={`${hy}%`} r={2.4} fill={COLORS.emerald} opacity={pulseOpacity * 0.9} />
          </g>
        );
      })}

      {/* Nodes pop in after their edges begin drawing. */}
      {NODES.map((n, i) => {
        const nodeIn = interpolate(t, [4 + i * 4, 26 + i * 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        const r = n.hub ? 0 : 4 * nodeIn; // hub node is the loop glyph, drawn elsewhere
        return (
          <g key={`n${i}`}>
            <circle cx={`${px(n)}%`} cy={`${py(n)}%`} r={r + 6} fill={COLORS.emerald} opacity={nodeIn * 0.12} />
            <circle cx={`${px(n)}%`} cy={`${py(n)}%`} r={r} fill={COLORS.emerald} opacity={nodeIn} />
          </g>
        );
      })}
    </svg>
  );
};
