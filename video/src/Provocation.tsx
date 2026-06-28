import {AbsoluteFill, Sequence, interpolateColors, useCurrentFrame} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadInstrumentSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';
import {PROV_COLORS as COLORS, PROV_FONTS} from './theme';
import {FiatFlow} from './scenes/FiatFlow';
import {FiatStack} from './scenes/FiatStack';
import {VirioFlow} from './scenes/VirioFlow';
import {SubscribeDemo} from './scenes/SubscribeDemo';
import {FeeSplit} from './scenes/FeeSplit';
import {ProvocationClose} from './scenes/ProvocationClose';
import {Backdrop} from './components/Backdrop';
import {FilmGrain} from './components/FilmGrain';

// loadFont blocks rendering until glyphs are ready — no fallback flash.
loadInterTight('normal', {weights: ['600', '700', '900'], subsets: ['latin']});
loadInter('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
loadInstrumentSerif('italic', {weights: ['400'], subsets: ['latin']});
loadJetBrainsMono('normal', {weights: ['400', '500'], subsets: ['latin']});

// 114s provocation — 1080×1920 @ 30fps. A visual argument: the fiat payment
// stack is absurd, Virio is the correction — then the proof: subscribing on a
// real site takes ten seconds and two signatures. Crossfades only.
export const PROVOCATION_FRAMES = 3420;

const SCENES = {
  fiatFlow: {from: 0, durationInFrames: 580}, // runs past 540 so the fee tags ghost into scene 2
  fiatStack: {from: 540, durationInFrames: 540},
  virioFlow: {from: 1080, durationInFrames: 720},
  demo: {from: 1800, durationInFrames: 720},
  feeSplit: {from: 2520, durationInFrames: 450},
  close: {from: 2970, durationInFrames: 450},
} as const;

export const Provocation: React.FC = () => {
  const frame = useCurrentFrame();

  // The backdrop's glow turns from cold steel to emerald as Virio enters.
  const glow = interpolateColors(frame, [1020, 1140], ['#5C6B74', COLORS.emerald]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily: PROV_FONTS.body}}>
      <Backdrop glow={glow} />

      <Sequence from={SCENES.fiatFlow.from} durationInFrames={SCENES.fiatFlow.durationInFrames} name="FiatFlow">
        <FiatFlow />
      </Sequence>
      <Sequence from={SCENES.fiatStack.from} durationInFrames={SCENES.fiatStack.durationInFrames} name="FiatStack">
        <FiatStack />
      </Sequence>
      <Sequence from={SCENES.virioFlow.from} durationInFrames={SCENES.virioFlow.durationInFrames} name="VirioFlow">
        <VirioFlow />
      </Sequence>
      <Sequence from={SCENES.demo.from} durationInFrames={SCENES.demo.durationInFrames} name="SubscribeDemo">
        <SubscribeDemo />
      </Sequence>
      <Sequence from={SCENES.feeSplit.from} durationInFrames={SCENES.feeSplit.durationInFrames} name="FeeSplit">
        <FeeSplit />
      </Sequence>
      <Sequence from={SCENES.close.from} durationInFrames={SCENES.close.durationInFrames} name="Close">
        <ProvocationClose />
      </Sequence>

      <FilmGrain />
    </AbsoluteFill>
  );
};
