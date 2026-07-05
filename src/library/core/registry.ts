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
import { CircularPortal } from '../transitions/circular-portal';
import { SpotlightReveal } from '../transitions/spotlight-reveal';
import { InkSpread } from '../transitions/ink-spread';
import { DotMatrixReveal } from '../transitions/dot-matrix';
import { BlindsReveal } from '../transitions/blinds-reveal';
import { LiquidMorph } from '../transitions/liquid-morph';
import { MeshGradientMorph } from '../transitions/mesh-gradient-morph';
import { GlassDistortion } from '../transitions/glass-distortion';
import { RippleReveal } from '../transitions/ripple-reveal';
import { DynamicMaskReveal } from '../transitions/diagonal-wipe';
import { GradientBurn } from '../transitions/gradient-burn';
import { SvgShapeMorph } from '../transitions/svg-shape-morph';

// ── Split & fragment ───────────────────────────────────────────────────────
import { CurtainSplit } from '../transitions/curtain-split';
import { VerticalSplit } from '../transitions/vertical-split';
import { DiagonalSplit } from '../transitions/diagonal-split';
import { Shatter } from '../transitions/shatter';
import { PaperTear } from '../transitions/paper-tear';
import { CrystalShatter } from '../transitions/crystal-shatter';
import { ThunderCrack } from '../transitions/thunder-crack';
import { PanelPass } from '../transitions/panel-pass';
// ── 3D / perspective ───────────────────────────────────────────────────────
import { CardStack } from '../transitions/card-stack';
import { PerspectiveFlip } from '../transitions/perspective-flip';
import { FoldReveal } from '../transitions/fold-reveal';
import { CinematicZoom } from '../transitions/cinematic-zoom';
import { DepthLayers } from '../transitions/depth-layers';
import { HeroMorph } from '../transitions/hero-morph';
import { InfiniteTunnel } from '../transitions/infinite-tunnel';
import { SpatialWarp } from '../transitions/spatial-warp';
import { DynamicPortal } from '../transitions/dynamic-portal';
import { CameraFlythrough } from '../transitions/camera-flythrough';
import { NeonCorridor } from '../transitions/neon-corridor';
import { StarfieldWarp } from '../transitions/starfield-warp';

// ── Scroll ─────────────────────────────────────────────────────────────────
import { WaveReveal } from '../transitions/wave-reveal';
import { ZoomFade } from '../transitions/zoom-fade';
import { ElasticCurtain } from '../transitions/elastic-curtain';
import { ParallaxShift } from '../transitions/parallax-shift';
import { PinReveal } from '../transitions/pin-reveal';
import { ScrollWarp } from '../transitions/scroll-warp';
import { ProgressiveMorph } from '../transitions/progressive-morph';
import { DirectionReveal } from '../transitions/direction-reveal';
import { MultiLayerScroll } from '../transitions/multi-layer-scroll';
import { MagneticPull } from '../transitions/magnetic-pull';

// ── Particles / premium ────────────────────────────────────────────────────
import { ParticleExplosion } from '../transitions/particle-explosion';
import { ParticleAssembly } from '../transitions/particle-assembly';
import { ParticleDissolve } from '../transitions/particle-dissolve';
import { OrbitingParticles } from '../transitions/orbiting-particles';
import { ThanosSnap } from '../transitions/thanos-snap';
import { DustSimulation } from '../transitions/dust-simulation';
import { EnergyBurst } from '../transitions/energy-burst';
import { FloatingParticles } from '../transitions/floating-particles';
import { InteractiveParticles } from '../transitions/interactive-particles';
import { ClothReveal } from '../transitions/cloth-reveal';
import { LensDistortion } from '../transitions/lens-distortion';
import { PrismRefraction } from '../transitions/prism-refraction';
import { VolumetricLight } from '../transitions/volumetric-light';
import { PageBurn } from '../transitions/page-burn';
import { PixelMelt } from '../transitions/pixel-melt';
import { AuroraDrift } from '../transitions/aurora-drift';
import { HolographicGlitch } from '../transitions/holographic-glitch';
import { MoltenPour } from '../transitions/molten-pour';
import { BlackHole } from '../transitions/black-hole';

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
