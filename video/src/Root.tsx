import {Composition} from 'remotion';
import {Manifesto} from './Manifesto';
import {Instagram, INSTAGRAM_FRAMES} from './Instagram';
import {Provocation, PROVOCATION_FRAMES} from './Provocation';
import {DevDemo} from './dev-demo/DevDemo';
import {TOTAL as DEV_DEMO_FRAMES} from './dev-demo/theme';
import {FPS, TOTAL_FRAMES} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VirioDevDemo"
        component={DevDemo}
        durationInFrames={DEV_DEMO_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{vertical: false}}
      />
      <Composition
        id="VirioDevDemoVertical"
        component={DevDemo}
        durationInFrames={DEV_DEMO_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{vertical: true}}
      />
      <Composition
        id="VirioManifesto"
        component={Manifesto}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{vertical: false}}
      />
      <Composition
        id="VirioManifestoVertical"
        component={Manifesto}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{vertical: true}}
      />
      <Composition
        id="VirioInstagram"
        component={Instagram}
        durationInFrames={INSTAGRAM_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="VirioProvocation"
        component={Provocation}
        durationInFrames={PROVOCATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
