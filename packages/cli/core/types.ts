import type { ReactNode, ComponentType, ReactElement } from 'react';
import type { MotionValue } from 'framer-motion';
import type { MotionStyle } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
 * v2 ARCHITECTURE — Persistent Layers + Effect Connectors
 *
 * Sections are mounted exactly once as persistent layers inside a single
 * pinned viewport. A transition is a scroll-driven EFFECT that animates the
 * relationship between two neighbouring layers. It never owns, clones, or
 * renders section content.
 *
 * Viewing phase: every edge reserves a reading window (the "rest" zone) during
 * which the outgoing section sits fully visible and static, so animation never
 * competes with readability. The window defaults to the stage's `restHeight`
 * but each transition may override it via its static `timing.rest` field.
 * ────────────────────────────────────────────────────────────────────────── */

/** Travel direction of the handoff, derived from scroll velocity sign. */
export type TransitionDirection = 'forward' | 'reverse';

/** Size of the pinned viewport, measured from the DOM. */
export interface Viewport {
  width: number;
  height: number;
}

/** Measured geometry of a single layer (the user-requested "section bounds"). */
export interface LayerBounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * A handle to a single, once-mounted section layer.
 *
 * The transition populates `style` with MotionValues (scale, y, maskImage,
 * clipPath, …) during its render. Because the transition renders *before* the
 * layer elements in the tree, those values are already present when the layer's
 * `motion.div` renders and binds them. The stage never fights the transition:
 * away from the active edge the bag is empty, so the layer sits at identity.
 */
export interface LayerHandle {
  /** Bag of MotionValues the transition writes; the stage spreads this onto the real layer. */
  style: MotionStyle;
  /** Measured bounds of the once-mounted layer. */
  bounds: LayerBounds;
  /**
   * Optional: returns a fresh React element with the layer's content,
   * for transitions that need multiple visual copies (shatter, tear, etc.).
   * Only present when the transition declares `copies: true`.
   * Each call returns a new element — safe to call multiple times.
   * The returned element inherits the section's className.
   */
  render?: () => ReactElement;
}

/**
 * Props every v2 transition receives. Deliberately minimal: only what an
 * effect between two neighbours actually needs. No React elements, no
 * `first`/`second`.
 */
export interface TransitionProps {
  /** Local 0→1 progress across this edge's active scroll window. */
  progress: MotionValue<number>;
  /** Scroll direction across the edge. */
  direction: TransitionDirection;
  /** Pinned viewport size. */
  viewport: Viewport;
  /** Handle to the outgoing (current) layer. */
  outgoing: LayerHandle;
  /** Handle to the incoming (next) layer. */
  incoming: LayerHandle;
}

/**
 * Per-transition timing profile for the viewing phase.
 *
 * A transition may export a static `timing` field to tune how much scroll the
 * stage allots to its reading window (and, optionally, its animation window)
 * — overriding the stage defaults for that edge only. Omit to inherit the
 * stage's `restHeight` / `heightPerSection`.
 *
 *   rest     – reading window in vh before the animation begins. The outgoing
 *              section is fully visible and static here. Mask reveals and
 *              content-heavy handoffs ask for a larger value; quick slides
 *              can shrink it.
 *   duration – animation window in vh the effect plays across. Omit to keep
 *              the stage default.
 */
export interface TransitionTiming {
  rest?: number;
  duration?: number;
}

/**
 * A transition implemented against the v2 handle contract.
 *
 * Components may attach a static `timing` field to influence their viewing
 * phase (see {@link TransitionTiming}). The stage reads it off the resolved
 * component, not from props.
 *
 * Set `copies` to true to opt in to content cloning: the stage will attach
 * a `render()` method to each layer handle, allowing the transition to produce
 * multiple visual copies of the layer's actual content (e.g. for shatter,
 * paper-tear, mosaic effects). Transitions that don't set this flag receive
 * the lightweight handle without `render()` — zero overhead.
 */
export type TransitionComponent = ComponentType<TransitionProps> & {
  timing?: TransitionTiming;
  /** Opt in to content cloning. When true, layer handles include a render()
   *  method for producing visual copies of the layer's actual content. */
  copies?: boolean;
};

/**
 * How a Section declares its outgoing transition:
 * - a `TransitionComponent` directly, or
 * - a string slug resolved through the v2 registry.
 */
export type TransitionResolver = TransitionComponent | string;

export interface SectionProps {
  children: ReactNode;
  /**
   * Transition for this section's OUTGOING edge — i.e. the handoff from this
   * section to the next. Inferred automatically; never specify from/to.
   * Omit for a section that scrolls with native browser behaviour.
   */
  transition?: TransitionResolver;
  className?: string;
}

export interface SectionFlowProps {
  children: ReactNode;
  /**
   * Scroll distance over which each transition's animation plays, in vh.
   * Longer = slower transition. @default 200
   */
  heightPerSection?: number;
  /**
   * Reading window allotted before each transition begins, in vh — the global
   * default for the VIEWING PHASE. The section sits fully visible and static
   * while the user scrolls through this zone, giving ample time to read its
   * content before the handoff triggers. A transition may override this per
   * edge via its static `timing.rest` field. @default 100
   */
  restHeight?: number;
  /** Fallback transition for sections that omit one. */
  defaultTransition?: TransitionResolver;
  className?: string;
}
