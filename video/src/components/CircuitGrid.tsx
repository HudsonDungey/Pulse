import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, EASE_OUT} from '../theme';

type Props = {
  startFrame: number;
  vertical: boolean;
};

// A circuit-board grid that "activates": lines draw outward from centre and a
// few traces light up emerald, travelling like current. Deterministic.
export const CircuitGrid: React.FC<Props> = ({startFrame, vertical}) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;

  const cols = vertical ? 9 : 16;
  const rows = vertical ? 16 : 9;
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  // Whole grid fades up slowly.
  const gridOpacity = interpolate(t, [0, 70], [0, 0.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // A radial wipe reveals lines from the centre outward.
  const reveal = interpolate(t, [0, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const lines: React.ReactNode[] = [];
  for (let c = 1; c < cols; c++) {
    const x = c * cellW;
    const dist = Math.abs(x - 50) / 50;
    const on = reveal > dist;
    lines.push(
      <line
        key={`v${c}`}
        x1={`${x}%`}
        y1="0%"
        x2={`${x}%`}
        y2="100%"
        stroke={COLORS.text}
        strokeWidth={0.5}
        opacity={on ? 1 : 0}
      />
    );
  }
  for (let r = 1; r < rows; r++) {
    const y = r * cellH;
    const dist = Math.abs(y - 50) / 50;
    const on = reveal > dist;
    lines.push(
      <line
        key={`h${r}`}
        x1="0%"
        y1={`${y}%`}
        x2="100%"
        y2={`${y}%`}
        stroke={COLORS.text}
        strokeWidth={0.5}
        opacity={on ? 1 : 0}
      />
    );
  }

  // A handful of emerald traces that pulse along grid rows like live current.
  const traces = [
    {y: 2, phase: 0},
    {y: rows - 2, phase: 40},
    {y: Math.floor(rows / 2), phase: 80},
  ];

  return (
    <AbsoluteFill style={{opacity: gridOpacity}}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {lines}
        {traces.map((tr, i) => {
          const y = tr.y * cellH;
          const cycle = 110;
          const p = ((t + tr.phase) % cycle) / cycle;
          const headX = p * 100;
          const glow = interpolate(t, [40, 90], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <g key={`tr${i}`} opacity={glow}>
              <circle cx={`${headX}%`} cy={`${y}%`} r={3} fill={COLORS.emerald} opacity={0.9} />
              <rect
                x={`${Math.max(0, headX - 8)}%`}
                y={`${y - 0.15}%`}
                width="8%"
                height="0.3%"
                fill={COLORS.emerald}
                opacity={0.4}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
