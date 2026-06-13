'use client';

import type { ComponentType } from 'react';
import { DemoSection } from '@/library/demo/demo-section';
import type { SectionTransitionProps } from '@/library/core/types';
import { WaveReveal } from '@/library/transitions/wave-reveal';
import { CircularPortal } from '@/library/transitions/circular-portal';
import { SpotlightReveal } from '@/library/transitions/spotlight-reveal';
import { InkSpread } from '@/library/transitions/ink-spread';
import { DiagonalWipe } from '@/library/transitions/diagonal-wipe';
import { GradientBurn } from '@/library/transitions/gradient-burn';
import { VerticalSplit } from '@/library/transitions/vertical-split';
import { CurtainSplit } from '@/library/transitions/curtain-split';
import { DiagonalSplit } from '@/library/transitions/diagonal-split';
import { BlindsReveal } from '@/library/transitions/blinds-reveal';
import { DotMatrixReveal } from '@/library/transitions/dot-matrix';
import { CardStack } from '@/library/transitions/card-stack';
import { PerspectiveFlip } from '@/library/transitions/perspective-flip';
import { FoldReveal } from '@/library/transitions/fold-reveal';
import { CinematicZoom } from '@/library/transitions/cinematic-zoom';
import { DepthLayers } from '@/library/transitions/depth-layers';
import { ZoomFade } from '@/library/transitions/zoom-fade';
import { ElasticCurtain } from '@/library/transitions/elastic-curtain';
import { ParallaxShift } from '@/library/transitions/parallax-shift';
import { PinReveal } from '@/library/transitions/pin-reveal';
import { ScrollWarp } from '@/library/transitions/scroll-warp';
import { GsapPinWipe } from '@/library/transitions/gsap-pin-wipe';
import { GsapStaggerWipe } from '@/library/transitions/gsap-stagger-wipe';
import { InfiniteGrid } from '@/library/transitions/infinite-grid';
import { ClothReveal } from '@/library/transitions/cloth-reveal';
import { ParticleDissolve } from '@/library/transitions/particle-dissolve';
import { LiquidMorph } from '@/library/transitions/liquid-morph';
import { MeshGradientMorph } from '@/library/transitions/mesh-gradient-morph';
import { GlassDistortion } from '@/library/transitions/glass-distortion';
import { RippleReveal } from '@/library/transitions/ripple-reveal';
import { PaperTear } from '@/library/transitions/paper-tear';
import { Shatter } from '@/library/transitions/shatter';
import { HeroMorph } from '@/library/transitions/hero-morph';
import { InfiniteTunnel } from '@/library/transitions/infinite-tunnel';
import { SpatialWarp } from '@/library/transitions/spatial-warp';
import { DynamicPortal } from '@/library/transitions/dynamic-portal';
import { CameraFlythrough } from '@/library/transitions/camera-flythrough';
import { ProgressiveMorph } from '@/library/transitions/progressive-morph';
import { DirectionReveal } from '@/library/transitions/direction-reveal';
import { MultiLayerScroll } from '@/library/transitions/multi-layer-scroll';
import { ParticleExplosion } from '@/library/transitions/particle-explosion';
import { ParticleAssembly } from '@/library/transitions/particle-assembly';
import { OrbitingParticles } from '@/library/transitions/orbiting-particles';
import { DustSimulation } from '@/library/transitions/dust-simulation';
import { EnergyBurst } from '@/library/transitions/energy-burst';
import { FloatingParticles } from '@/library/transitions/floating-particles';
import { InteractiveParticles } from '@/library/transitions/interactive-particles';
import { LensDistortion } from '@/library/transitions/lens-distortion';
import { SvgShapeMorph } from '@/library/transitions/svg-shape-morph';
import { PrismRefraction } from '@/library/transitions/prism-refraction';
import { VolumetricLight } from '@/library/transitions/volumetric-light';

const components: Record<string, ComponentType<SectionTransitionProps>> = {
  'wave-reveal': WaveReveal,
  'circular-portal': CircularPortal,
  'spotlight-reveal': SpotlightReveal,
  'ink-spread': InkSpread,
  'diagonal-wipe': DiagonalWipe,
  'gradient-burn': GradientBurn,
  'vertical-split': VerticalSplit,
  'curtain-split': CurtainSplit,
  'diagonal-split': DiagonalSplit,
  'blinds-reveal': BlindsReveal,
  'dot-matrix': DotMatrixReveal,
  'card-stack': CardStack,
  'perspective-flip': PerspectiveFlip,
  'fold-reveal': FoldReveal,
  'cinematic-zoom': CinematicZoom,
  'depth-layers': DepthLayers,
  'zoom-fade': ZoomFade,
  'elastic-curtain': ElasticCurtain,
  'parallax-shift': ParallaxShift,
  'pin-reveal': PinReveal,
  'scroll-warp': ScrollWarp,
  'gsap-pin-wipe': GsapPinWipe,
  'gsap-stagger-wipe': GsapStaggerWipe,
  'infinite-grid': InfiniteGrid,
  'cloth-reveal': ClothReveal,
  'particle-dissolve': ParticleDissolve,
  'liquid-morph': LiquidMorph,
  'mesh-gradient-morph': MeshGradientMorph,
  'glass-distortion': GlassDistortion,
  'ripple-reveal': RippleReveal,
  'paper-tear': PaperTear,
  'shatter': Shatter,
  'hero-morph': HeroMorph,
  'infinite-tunnel': InfiniteTunnel,
  'spatial-warp': SpatialWarp,
  'dynamic-portal': DynamicPortal,
  'camera-flythrough': CameraFlythrough,
  'progressive-morph': ProgressiveMorph,
  'direction-reveal': DirectionReveal,
  'multi-layer-scroll': MultiLayerScroll,
  'particle-explosion': ParticleExplosion,
  'particle-assembly': ParticleAssembly,
  'orbiting-particles': OrbitingParticles,
  'dust-simulation': DustSimulation,
  'energy-burst': EnergyBurst,
  'floating-particles': FloatingParticles,
  'interactive-particles': InteractiveParticles,
  'lens-distortion': LensDistortion,
  'svg-shape-morph': SvgShapeMorph,
  'prism-refraction': PrismRefraction,
  'volumetric-light': VolumetricLight,
};

export function TemplateDemo({ slug, name }: { slug: string; name: string }) {
  const Transition = components[slug];
  if (!Transition) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/60">
        Demo coming soon.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0e0e11]">
      <DemoSection
        variant="light"
        eyebrow="SectionFlow demo"
        title="Keep scrolling"
        body={`The “${name}” transition below is driven entirely by your scroll position. Scroll slowly to study it, fast to feel it.`}
      />
      <Transition
        first={
          <DemoSection
            variant="dark"
            eyebrow="Section A · outgoing"
            title="Everything begins here."
            body="This is the section your visitors are leaving. Watch how it hands the stage over."
          />
        }
        second={
          <DemoSection
            variant="accent"
            eyebrow="Section B · incoming"
            title="And lands right here."
            body="A clean, 60 FPS arrival. Tune the pacing with the height prop on the track."
          />
        }
      />
      <DemoSection
        variant="teal"
        eyebrow="End of demo"
        title="That's the transition."
        body="Copy the component from src/library/transitions and drop it into your page. It only needs the shared TransitionTrack core."
      />
    </div>
  );
}
