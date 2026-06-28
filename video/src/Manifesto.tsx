import {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender} from 'remotion';
import {COLORS, FONTS, SCENES} from './theme';
import {Problem} from './scenes/Problem';
import {Shift} from './scenes/Shift';
import {HowItWorks} from './scenes/HowItWorks';
import {Close} from './scenes/Close';
import {FilmGrain} from './components/FilmGrain';

export type ManifestoProps = {
  vertical: boolean;
};

// Load Inter / Inter Tight from Google Fonts and block render until the
// glyphs are actually available, so headless chromium never paints fallback.
export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@600;800;900&display=swap');";

export const useFontsReady = () => {
  const [handle] = useState(() => delayRender('Loading Inter fonts'));
  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) continueRender(handle);
    };
    // document.fonts.ready resolves once @import-loaded fonts are parsed.
    if (typeof document !== 'undefined' && document.fonts) {
      Promise.all([
        document.fonts.load("900 100px 'Inter Tight'"),
        document.fonts.load("600 100px 'Inter Tight'"),
        document.fonts.load("400 100px 'Inter'"),
      ])
        .then(() => document.fonts.ready)
        .then(done)
        .catch(done);
    } else {
      done();
    }
    return () => {
      cancelled = true;
    };
  }, [handle]);
};

export const Manifesto: React.FC<ManifestoProps> = ({vertical}) => {
  useFontsReady();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily: FONTS.body}}>
      <style>{FONT_IMPORT}</style>

      <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.durationInFrames} name="Problem">
        <Problem vertical={vertical} />
      </Sequence>

      <Sequence from={SCENES.shift.from} durationInFrames={SCENES.shift.durationInFrames} name="Shift">
        <Shift vertical={vertical} />
      </Sequence>

      <Sequence from={SCENES.howItWorks.from} durationInFrames={SCENES.howItWorks.durationInFrames} name="HowItWorks">
        <HowItWorks vertical={vertical} />
      </Sequence>

      <Sequence from={SCENES.close.from} durationInFrames={SCENES.close.durationInFrames} name="Close">
        <Close vertical={vertical} />
      </Sequence>

      {/* Subtle film grain unifies all scenes — infrastructure, not glossy. */}
      <FilmGrain />
    </AbsoluteFill>
  );
};
