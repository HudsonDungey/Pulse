import {interpolate, useCurrentFrame} from 'remotion';
import {EASE_OUT} from '../theme';

type Props = {
  text: string;
  startFrame: number;
  perLetter?: number; // frames between each letter's entrance
  duration?: number; // fade duration per letter
  style?: React.CSSProperties;
};

// Reveals a string letter-by-letter. Each glyph eases in opacity + a small
// upward drift. Pure frame math; no layout thrash.
export const LetterReveal: React.FC<Props> = ({
  text,
  startFrame,
  perLetter = 1.4,
  duration = 18,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <span style={{display: 'inline-block', ...style}}>
      {text.split('').map((char, i) => {
        const begin = startFrame + i * perLetter;
        const opacity = interpolate(frame, [begin, begin + duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        const dy = interpolate(frame, [begin, begin + duration], [10, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${dy}px)`,
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
