// VirioDevDemo — 45s @ 30fps = 1350 frames.
// create plan → 3-line integration → ship (editor⇒browser morph) → live site
// → checkout modal → wallet (connect / approve / subscribe) → loop forever.

import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';
import {C, TL} from './theme';
import {S1CreatePlan} from './scenes/S1CreatePlan';
import {S2Integration} from './scenes/S2Integration';
import {S3ShipMorph} from './scenes/S3ShipMorph';
import {S4LiveSite} from './scenes/S4LiveSite';
import {S5Modal} from './scenes/S5Modal';
import {S6Wallet} from './scenes/S6Wallet';
import {S7Loop} from './scenes/S7Loop';

loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});
loadInterTight('normal', {weights: ['600', '700', '800'], subsets: ['latin']});
loadJetBrainsMono('normal', {weights: ['400', '700'], subsets: ['latin']});

export const DevDemo: React.FC<{vertical?: boolean}> = ({vertical = false}) => {
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sequence from={TL.s1.from} durationInFrames={TL.s1.dur}>
        <S1CreatePlan vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s2.from} durationInFrames={TL.s2.dur}>
        <S2Integration vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s3.from} durationInFrames={TL.s3.dur}>
        <S3ShipMorph vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s4.from} durationInFrames={TL.s4.dur}>
        <S4LiveSite vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s5.from} durationInFrames={TL.s5.dur}>
        <S5Modal vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s6.from} durationInFrames={TL.s6.dur}>
        <S6Wallet vertical={vertical} />
      </Sequence>
      <Sequence from={TL.s7.from} durationInFrames={TL.s7.dur}>
        <S7Loop vertical={vertical} />
      </Sequence>
    </AbsoluteFill>
  );
};
