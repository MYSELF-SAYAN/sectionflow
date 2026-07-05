export * from './core/types';

// ── v2 architecture (primary) ─────────────────────────────────────────────
// Persistent layers + effect connectors. Sections are mounted once; transitions
// are scroll-driven effects between two neighbours and never own content.
export { SectionFlow, Section } from './core/section-flow';
export { transitionRegistry, resolveTransition } from './core/registry';
export type {
  TransitionComponent,
  TransitionResolver,
  TransitionProps,
  TransitionTiming,
  LayerHandle,
  LayerBounds,
  Viewport,
  TransitionDirection,
} from './core/types';

// v2 transitions live in ./transitions-v2/* and are imported directly by name
// (e.g. `import { CardStack } from 'sectionflow/library/transitions-v2/card-stack'`),
// or resolved by slug through `transitionRegistry`. They are intentionally NOT
// re-exported here so the public surface stays minimal.

// ── Catalog metadata (docs / gallery) ──────────────────────────────────────
export { transitions, availableTransitions } from './registry';
export type { TransitionMeta, TransitionCategory } from './registry';
