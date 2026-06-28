import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Very subtle moving grain. Derived entirely from frame number — no randomness,
// so every render is deterministic. Keeps the near-black from banding.
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = (frame % 12) + 1; // cycles the turbulence each ~0.4s

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0.05,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
