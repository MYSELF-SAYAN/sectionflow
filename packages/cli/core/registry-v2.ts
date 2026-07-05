'use client';

import type { TransitionComponent, TransitionResolver } from './types';

/* ──────────────────────────────────────────────────────────────────────────
 * v2 transition registry
 *
 * Maps a string slug to a TransitionComponent implementing the v2 handle
 * contract. `<Section transition="circular-portal" />` resolves through here.
 * A transition passed directly as a component (`transition={CircularPortal}`)
 * bypasses the lookup.
 *
 * Every entry implements the v2 handle contract: it writes MotionValues into
 * the `outgoing` / `incoming` layer handles it receives (and optionally
 * returns an effect overlay). No transition owns, clones, or renders section
 * content.
 *
 * Per-transition viewing phase: a component may attach a static `timing` field
 * ({ rest?, duration? }) to lengthen or shorten its reading/animation windows
 * for that edge only. The stage honours it via the per-edge timing table.
 * ──────────────────────────────────────────────────────────────────────── */

// ── Mask reveal ────────────────────────────────────────────────────────────
import { CircularPortal } from '../transitions-v2/circular-portal';
import { SpotlightReveal } from '../transitions-v2/spotlight-reveal';
import { InkSpread } from '../transitions-v2/ink-spread';
import { DotMatrixReveal } from '../transitions-v2/dot-matrix';
import { BlindsReveal } from '../transitions-v2/blinds-reveal';
import { LiquidMorph } from '../transitions-v2/liquid-morph';
import { MeshGradientMorph } from '../transitions-v2/mesh-gradient-morph';
import { GlassDistortion } from '../transitions-v2/glass-distortion';
import { RippleReveal } from '../transitions-v2/ripple-reveal';
import { DynamicMaskReveal } from '../transitions-v2/diagonal-wipe';
import { GradientBurn } from '../transitions-v2/gradient-burn';
import { SvgShapeMorph } from '../transitions-v2/svg-shape-morph';

// ── Split & fragment ───────────────────────────────────────────────────────
import { CurtainSplit } from '../transitions-v2/curtain-split';
import { VerticalSplit } from '../transitions-v2/vertical-split';
import { DiagonalSplit } from '../transitions-v2/diagonal-split';
import { Shatter } from '../transitions-v2/shatter';
import { PaperTear } from '../transitions-v2/paper-tear';
import { CrystalShatter } from '../transitions-v2/crystal-shatter';
import { ThunderCrack } from '../transitions-v2/thunder-crack';
import { PanelPass } from '../transitions-v2/panel-pass';
// ── 3D / perspective ───────────────────────────────────────────────────────
import { CardStack } from '../transitions-v2/card-stack';
import { PerspectiveFlip } from '../transitions-v2/perspective-flip';
import { FoldReveal } from '../transitions-v2/fold-reveal';
import { CinematicZoom } from '../transitions-v2/cinematic-zoom';
import { DepthLayers } from '../transitions-v2/depth-layers';
import { HeroMorph } from '../transitions-v2/hero-morph';
import { InfiniteTunnel } from '../transitions-v2/infinite-tunnel';
import { SpatialWarp } from '../transitions-v2/spatial-warp';
import { DynamicPortal } from '../transitions-v2/dynamic-portal';
import { CameraFlythrough } from '../transitions-v2/camera-flythrough';
import { NeonCorridor } from '../transitions-v2/neon-corridor';
import { StarfieldWarp } from '../transitions-v2/starfield-warp';

// ── Scroll ─────────────────────────────────────────────────────────────────
import { WaveReveal } from '../transitions-v2/wave-reveal';
import { ZoomFade } from '../transitions-v2/zoom-fade';
import { ElasticCurtain } from '../transitions-v2/elastic-curtain';
import { ParallaxShift } from '../transitions-v2/parallax-shift';
import { PinReveal } from '../transitions-v2/pin-reveal';
import { ScrollWarp } from '../transitions-v2/scroll-warp';
import { ProgressiveMorph } from '../transitions-v2/progressive-morph';
import { DirectionReveal } from '../transitions-v2/direction-reveal';
import { MultiLayerScroll } from '../transitions-v2/multi-layer-scroll';
import { MagneticPull } from '../transitions-v2/magnetic-pull';

// ── Particles / premium ────────────────────────────────────────────────────
import { ParticleExplosion } from '../transitions-v2/particle-explosion';
import { ParticleAssembly } from '../transitions-v2/particle-assembly';
import { ParticleDissolve } from '../transitions-v2/particle-dissolve';
import { OrbitingParticles } from '../transitions-v2/orbiting-particles';
import { ThanosSnap } from '../transitions-v2/thanos-snap';
import { DustSimulation } from '../transitions-v2/dust-simulation';
import { EnergyBurst } from '../transitions-v2/energy-burst';
import { FloatingParticles } from '../transitions-v2/floating-particles';
import { InteractiveParticles } from '../transitions-v2/interactive-particles';
import { ClothReveal } from '../transitions-v2/cloth-reveal';
import { LensDistortion } from '../transitions-v2/lens-distortion';
import { PrismRefraction } from '../transitions-v2/prism-refraction';
import { VolumetricLight } from '../transitions-v2/volumetric-light';
import { PageBurn } from '../transitions-v2/page-burn';
import { PixelMelt } from '../transitions-v2/pixel-melt';
import { AuroraDrift } from '../transitions-v2/aurora-drift';
import { HolographicGlitch } from '../transitions-v2/holographic-glitch';
import { MoltenPour } from '../transitions-v2/molten-pour';
import { BlackHole } from '../transitions-v2/black-hole';

/**
 * Viewing-phase profiles. Mask reveals and content-heavy handoffs benefit from
 * a longer reading window so the outgoing section is fully legible before the
 * effect begins; quick slides can use a shorter one. Attached via the static
 * `timing` field the stage reads per edge.
 */
const LONG_HOLD = { rest: 160 } as const;
const SHORT_HOLD = { rest: 60 } as const;

// Attach per-transition timing where a non-default viewing phase is warranted.
(CircularPortal as TransitionComponent).timing = LONG_HOLD;
(SpotlightReveal as TransitionComponent).timing = LONG_HOLD;
(InkSpread as TransitionComponent).timing = LONG_HOLD;
(RippleReveal as TransitionComponent).timing = LONG_HOLD;
(LiquidMorph as TransitionComponent).timing = LONG_HOLD;
(SvgShapeMorph as TransitionComponent).timing = LONG_HOLD;
(VolumetricLight as TransitionComponent).timing = LONG_HOLD;
(BlackHole as TransitionComponent).timing = LONG_HOLD;

(ZoomFade as TransitionComponent).timing = SHORT_HOLD;
(ElasticCurtain as TransitionComponent).timing = SHORT_HOLD;
(PinReveal as TransitionComponent).timing = SHORT_HOLD;

export const transitionRegistry: Record<string, TransitionComponent> = {
  // Mask reveal
  'circular-portal': CircularPortal,
  'spotlight-reveal': SpotlightReveal,
  'ink-spread': InkSpread,
  'dot-matrix': DotMatrixReveal,
  'blinds-reveal': BlindsReveal,
  'liquid-morph': LiquidMorph,
  'mesh-gradient-morph': MeshGradientMorph,
  'glass-distortion': GlassDistortion,
  'ripple-reveal': RippleReveal,
  'diagonal-wipe': DynamicMaskReveal,
  'gradient-burn': GradientBurn,
  'svg-shape-morph': SvgShapeMorph,

  // Split & fragment
  'curtain-split': CurtainSplit,
  'vertical-split': VerticalSplit,
  'diagonal-split': DiagonalSplit,
  'shatter': Shatter,
  'paper-tear': PaperTear,
  'crystal-shatter': CrystalShatter,
  'thunder-crack': ThunderCrack,
  'panel-pass': PanelPass,

  // 3D / perspective
  'card-stack': CardStack,
  'perspective-flip': PerspectiveFlip,
  'fold-reveal': FoldReveal,
  'cinematic-zoom': CinematicZoom,
  'depth-layers': DepthLayers,
  'hero-morph': HeroMorph,
  'infinite-tunnel': InfiniteTunnel,
  'spatial-warp': SpatialWarp,
  'dynamic-portal': DynamicPortal,
  'camera-flythrough': CameraFlythrough,
  'neon-corridor': NeonCorridor,
  'starfield-warp': StarfieldWarp,

  // Scroll
  'wave-reveal': WaveReveal,
  'zoom-fade': ZoomFade,
  'elastic-curtain': ElasticCurtain,
  'parallax-shift': ParallaxShift,
  'pin-reveal': PinReveal,
  'scroll-warp': ScrollWarp,
  'progressive-morph': ProgressiveMorph,
  'direction-reveal': DirectionReveal,
  'multi-layer-scroll': MultiLayerScroll,
  'magnetic-pull': MagneticPull,

  // Particles / premium
  'particle-explosion': ParticleExplosion,
  'particle-assembly': ParticleAssembly,
  'particle-dissolve': ParticleDissolve,
  'orbiting-particles': OrbitingParticles,
  'thanos-snap': ThanosSnap,
  'dust-simulation': DustSimulation,
  'energy-burst': EnergyBurst,
  'floating-particles': FloatingParticles,
  'interactive-particles': InteractiveParticles,
  'cloth-reveal': ClothReveal,
  'lens-distortion': LensDistortion,
  'prism-refraction': PrismRefraction,
  'volumetric-light': VolumetricLight,
  'page-burn': PageBurn,
  'pixel-melt': PixelMelt,
  'aurora-drift': AuroraDrift,
  'holographic-glitch': HolographicGlitch,
  'molten-pour': MoltenPour,
  'black-hole': BlackHole,
};

/** Resolve a TransitionResolver (string slug or component) to a component. */
export function resolveTransition(
  resolver: TransitionResolver,
): TransitionComponent | null {
  if (typeof resolver === 'string') {
    return transitionRegistry[resolver] ?? null;
  }
  return resolver;
}
