/* eslint-disable */
/**
 * GENERATED FILE — do not edit by hand.
 * Produced by packages/cli/scripts/sync-sources.mjs from the canonical
* source in src/library/core/. Re-run `npm run sync:sources` to refresh.
*/
export const TYPES_SOURCE = `import type { ReactNode, ComponentType, ReactElement } from 'react';
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
 * competes with readability. The window defaults to the stage's \`restHeight\`
 * but each transition may override it via its static \`timing.rest\` field.
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
 * The transition populates \`style\` with MotionValues (scale, y, maskImage,
 * clipPath, …) during its render. Because the transition renders *before* the
 * layer elements in the tree, those values are already present when the layer's
 * \`motion.div\` renders and binds them. The stage never fights the transition:
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
   * Only present when the transition declares \`copies: true\`.
   * Each call returns a new element — safe to call multiple times.
   * The returned element inherits the section's className.
   */
  render?: () => ReactElement;
}

/**
 * Props every v2 transition receives. Deliberately minimal: only what an
 * effect between two neighbours actually needs. No React elements, no
 * \`first\`/\`second\`.
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
 * A transition may export a static \`timing\` field to tune how much scroll the
 * stage allots to its reading window (and, optionally, its animation window)
 * — overriding the stage defaults for that edge only. Omit to inherit the
 * stage's \`restHeight\` / \`heightPerSection\`.
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
 * Components may attach a static \`timing\` field to influence their viewing
 * phase (see {@link TransitionTiming}). The stage reads it off the resolved
 * component, not from props.
 *
 * Set \`copies\` to true to opt in to content cloning: the stage will attach
 * a \`render()\` method to each layer handle, allowing the transition to produce
 * multiple visual copies of the layer's actual content (e.g. for shatter,
 * paper-tear, mosaic effects). Transitions that don't set this flag receive
 * the lightweight handle without \`render()\` — zero overhead.
 */
export type TransitionComponent = ComponentType<TransitionProps> & {
  timing?: TransitionTiming;
  /** Opt in to content cloning. When true, layer handles include a render()
   *  method for producing visual copies of the layer's actual content. */
  copies?: boolean;
};

/**
 * How a Section declares its outgoing transition:
 * - a \`TransitionComponent\` directly, or
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
   * edge via its static \`timing.rest\` field. @default 100
   */
  restHeight?: number;
  /** Fallback transition for sections that omit one. */
  defaultTransition?: TransitionResolver;
  className?: string;
}
`;
export const SECTION_FLOW_SOURCE = `'use client';

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  Children,
  isValidElement,
  type ReactElement,
} from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  type MotionStyle,
} from 'framer-motion';

import type {
  SectionProps,
  SectionFlowProps,
  LayerHandle,
  LayerBounds,
  Viewport,
  TransitionDirection,
  TransitionComponent,
  TransitionResolver,
} from './types';
import { resolveTransition } from './registry';

/* ──────────────────────────────────────────────────────────────────────────
 * Segment model
 *
 * Authored children are flattened ONCE into an ordered list of Sections, then
 * grouped into segments:
 *
 *   • flow       – a section that scrolls with native browser behaviour
 *                  (it declared no outgoing transition, or has no successor).
 *                  Rendered as a plain <section> in document flow. No pinning,
 *                  no transforms, no motion values. Fully native scroll.
 *
 *   • transition – a maximal run of sections [i .. j] where every section
 *                  i..j-1 declares an outgoing transition. Section j terminates
 *                  the chain. All j-i+1 sections live inside ONE pinned span as
 *                  persistent layers, each mounted exactly once. The span
 *                  animates one edge at a time, handing the incoming/outgoing
 *                  role down the chain.
 *
 * A section therefore exists in exactly one segment, exactly once. It is never
 * cloned and never rendered twice.
 * ──────────────────────────────────────────────────────────────────────── */

type ResolvedSection = {
  key: string;
  children: SectionProps['children'];
  className?: string;
  /** Outgoing transition component, or null if this section has none. */
  transition: TransitionComponent | null;
};

type Segment =
  | { kind: 'flow'; section: ResolvedSection }
  | { kind: 'transition'; sections: ResolvedSection[] };

function isSectionElement(el: unknown): el is ReactElement<SectionProps> {
  return (
    isValidElement(el) &&
    (el.type as { __sf_section?: boolean }).__sf_section === true
  );
}

function buildSegments(sections: ResolvedSection[]): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  while (i < sections.length) {
    const s = sections[i];
    if (s.transition && i < sections.length - 1) {
      const run: ResolvedSection[] = [s];
      let j = i + 1;
      while (j < sections.length) {
        const prev = run[run.length - 1];
        if (!prev.transition) break;        // chain already terminated
        run.push(sections[j]);              // j becomes the incoming layer
        if (!sections[j].transition) break; // j has no outgoing → terminal
        if (j === sections.length - 1) break; // j is last child → terminal
        j++;
      }
      segments.push({ kind: 'transition', sections: run });
      i += run.length;
    } else {
      // No transition (or no successor): pure native-scroll section.
      segments.push({ kind: 'flow', section: s });
      i++;
    }
  }
  return segments;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Pinned transition span
 *
 * One sticky viewport. N persistent layers (one per section in the run), each
 * mounted once and keyed by its authored position. Exactly one transition is
 * active at a time; it writes motion values into the shared style bags of the
 * two layers it choreographs.
 *
 * Per-frame work stays on the compositor: scroll → spring → local progress →
 * transition motion values → GPU. React re-renders only when the active edge
 * changes (a handful of times per traversal), not every frame.
 * ────────────────────────────────────────────────────────────────────────── */

function TransitionSpan({
  sections,
  heightPerSection,
  restHeight,
}: {
  sections: ResolvedSection[];
  heightPerSection: number;
  restHeight: number;
}) {
  const spineRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // One scroll source, one spring — shared by every edge in the span.
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0001,
  });
  const velocity = useVelocity(progress);

  const edgeCount = Math.max(1, sections.length - 1);

  // ── Per-edge timing table ────────────────────────────────────────────────
  const edges = useMemo(() => {
    const list: { rest: number; duration: number; postRest: number; span: number; start: number }[] = [];
    let cursor = 0;
    for (let e = 0; e < edgeCount; e++) {
      const t = sections[e]?.transition;
      const rest = t?.timing?.rest ?? restHeight;
      const duration = t?.timing?.duration ?? heightPerSection;
      const postRest = t?.timing?.rest ?? restHeight;
      const span = rest + duration + postRest;
      list.push({ rest, duration, postRest, span, start: cursor });
      cursor += span;
    }
    return { list, total: cursor };
  }, [sections, edgeCount, restHeight, heightPerSection]);

  const totalHeight = edges.total;

  // Which edge is active? Derived from absolute scroll offset.
  const [activeEdge, setActiveEdge] = useState(0);
  const [direction, setDirection] = useState<TransitionDirection>('forward');
  useMotionValueEvent(progress, 'change', (p) => {
    const offsetVh = p * edges.total;
    let next = 0;
    for (let e = 0; e < edges.list.length; e++) {
      if (offsetVh >= edges.list[e].start) next = e;
      else break;
    }
    next = Math.min(edgeCount - 1, Math.max(0, next));
    if (next !== activeEdge) setActiveEdge(next);
  });
  useMotionValueEvent(velocity, 'change', (v) => {
    const dir: TransitionDirection = v >= 0 ? 'forward' : 'reverse';
    if (dir !== direction) setDirection(dir);
  });

  const viewport = useViewportSize(viewportRef);

  // ── Style bags ───────────────────────────────────────────────────────────
  // Stable refs that persist across renders. We clear them when the active
  // edge changes instead of recreating with useMemo, which avoids breaking
  // framer-motion's MotionValue binding mid-animation.
  const layerStylesRef = useRef<MotionStyle[]>(
    sections.map(() => ({}) as MotionStyle),
  );
  // Keep array length in sync with sections.
  if (layerStylesRef.current.length !== sections.length) {
    layerStylesRef.current = sections.map(() => ({}) as MotionStyle);
  }
  // Track previous active edge to know when to clear bags.
  const prevEdgeRef = useRef(activeEdge);
  if (prevEdgeRef.current !== activeEdge) {
    // Clear ALL bags so no stale MotionValues from the previous transition
    // leak into a layer's next appearance.
    for (let i = 0; i < layerStylesRef.current.length; i++) {
      const bag = layerStylesRef.current[i];
      for (const key of Object.keys(bag)) {
        delete (bag as Record<string, unknown>)[key];
      }
    }
    prevEdgeRef.current = activeEdge;
  }
  const layerStyles = layerStylesRef.current;

  const layerBounds = useMemo<LayerBounds[]>(
    () => sections.map(() => ({ width: 0, height: 0, top: 0, left: 0 })),
    [sections],
  );
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  useLayerBounds(layerRefs, layerBounds);

  const ActiveTransition = sections[activeEdge]?.transition ?? null;
  const needsCopies = ActiveTransition && (ActiveTransition as TransitionComponent).copies === true;

  // Local 0→1 progress across ONLY the animation window of the active edge.
  const activeEdgeTiming = edges.list[activeEdge] ?? { start: 0, rest: restHeight, duration: heightPerSection, postRest: restHeight };
  const localProgress = useTransform(progress, (p) => {
    const offsetVh = p * edges.total;
    const animLocal =
      (offsetVh - activeEdgeTiming.start - activeEdgeTiming.rest) /
      activeEdgeTiming.duration;
    return animLocal < 0 ? 0 : animLocal > 1 ? 1 : animLocal;
  });

  const outgoing: LayerHandle = {
    style: layerStyles[activeEdge],
    bounds: layerBounds[activeEdge],
    ...(needsCopies
      ? {
          render: () => (
            <SectionShell className={sections[activeEdge].className}>
              {sections[activeEdge].children}
            </SectionShell>
          ),
        }
      : {}),
  };
  const incoming: LayerHandle = {
    style: layerStyles[activeEdge + 1],
    bounds: layerBounds[activeEdge + 1],
    ...(needsCopies
      ? {
          render: () => (
            <SectionShell className={sections[activeEdge + 1].className}>
              {sections[activeEdge + 1].children}
            </SectionShell>
          ),
        }
      : {}),
  };

  return (
    <div ref={spineRef} style={{ height: \`\${totalHeight}vh\` }} className="relative w-full">
      <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The active transition renders FIRST. Its hooks populate the shared
            style bags before the layer elements below render and bind them. */}
        {ActiveTransition && (
          <ActiveTransition
            progress={localProgress}
            direction={direction}
            viewport={viewport}
            outgoing={outgoing}
            incoming={incoming}
          />
        )}

        {/* Persistent layers — each section mounted exactly once. The two
            layers flanking the active edge are "live"; the rest are hidden.
            Z-index ensures outgoing (activeEdge) is BEHIND incoming
            (activeEdge+1), and all other layers are buried at z-0. */}
        {sections.map((s, idx) => {
          const isOutgoing = idx === activeEdge;
          const isIncoming = idx === activeEdge + 1;
          const live = isOutgoing || isIncoming;

          // Write z-index and visibility into the style bag so they coexist
          // with the transition's MotionValues on the same object reference.
          const bag = layerStyles[idx];
          (bag as Record<string, unknown>).zIndex = isIncoming ? 2 : isOutgoing ? 1 : 0;
          (bag as Record<string, unknown>).visibility = live ? 'visible' : 'hidden';
          (bag as Record<string, unknown>).pointerEvents = live ? 'auto' : 'none';

          return (
            <motion.div
              key={s.key}
              ref={(el) => {
                layerRefs.current[idx] = el;
              }}
              style={bag}
              aria-hidden={!live || undefined}
              className="absolute inset-0 h-full w-full"
              data-sf-layer={idx}
            >
              <SectionShell className={s.className}>{s.children}</SectionShell>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Flow section — native browser scroll. No pinning, no transforms.
 * ──────────────────────────────────────────────────────────────────────── */

function FlowSection({ section }: { section: ResolvedSection }) {
  return (
    <section className={section.className} data-sf-flow>
      {section.children}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────────────────────────────────── */

export function SectionFlow({
  children,
  heightPerSection = 200,
  restHeight = 100,
  defaultTransition,
  className = '',
}: SectionFlowProps) {
  const sections = useMemo<ResolvedSection[]>(() => {
    const raw = Children.toArray(children).filter(isSectionElement);
    return raw.map((el, idx) => {
      const props = el.props;
      const resolver: TransitionResolver | undefined =
        props.transition ?? defaultTransition;
      const transition = resolver ? resolveTransition(resolver) : null;
      return {
        key: el.key ?? \`sf-\${idx}\`,
        children: props.children,
        className: props.className,
        transition,
      };
    });
  }, [children, defaultTransition]);

  const segments = useMemo(() => buildSegments(sections), [sections]);

  return (
    <div className={\`w-full \${className}\`}>
      {segments.map((seg, idx) =>
        seg.kind === 'flow' ? (
          <FlowSection key={\`flow-\${idx}\`} section={seg.section} />
        ) : (
          <TransitionSpan
            key={\`span-\${idx}\`}
            sections={seg.sections}
            heightPerSection={heightPerSection}
            restHeight={restHeight}
          />
        ),
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Section — marker component. Carries content + an optional outgoing
 * transition. The __sf_section brand lets SectionFlow recognise it without
 * fragile displayName checks.
 * ──────────────────────────────────────────────────────────────────────── */

export function Section({ children, className }: SectionProps) {
  return <SectionShell className={className}>{children}</SectionShell>;
}
(Section as unknown as { __sf_section: boolean }).__sf_section = true;

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function SectionShell({
  children,
  className,
}: {
  children: SectionProps['children'];
  className?: string;
}) {
  return <div className={\`h-full w-full pointer-events-auto \${className ?? ''}\`}>{children}</div>;
}

function useViewportSize(ref: React.RefObject<HTMLElement | null>): Viewport {
  const [size, setSize] = useState<Viewport>({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function useLayerBounds(
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  bounds: LayerBounds[],
): void {
  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    const update = () => {
      els.forEach((el, i) => {
        if (!el || i >= bounds.length) return;
        const r = el.getBoundingClientRect();
        bounds[i] = { width: r.width, height: r.height, top: r.top, left: r.left };
      });
    };
    update();
    const ro = new ResizeObserver(update);
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [refs, bounds]);
}
`;
export const REGISTRY_SKELETON = `'use client';

import type { TransitionComponent, TransitionResolver } from './types';

/* ──────────────────────────────────────────────────────────────────────────
 * v2 transition registry
 *
 * Maps a string slug to a TransitionComponent implementing the v2 handle
 * contract. \`<Section transition="circular-portal" />\` resolves through here.
 * A transition passed directly as a component (\`transition={CircularPortal}\`)
 * bypasses the lookup.
 *
 * Every entry implements the v2 handle contract: it writes MotionValues into
 * the \`outgoing\` / \`incoming\` layer handles it receives (and optionally
 * returns an effect overlay). No transition owns, clones, or renders section
 * content.
 *
 * Per-transition viewing phase: a component may attach a static \`timing\` field
 * ({ rest?, duration? }) to lengthen or shorten its reading/animation windows
 * for that edge only. The stage honours it via the per-edge timing table.
 * ──────────────────────────────────────────────────────────────────────── */

// ── Mask reveal ────────────────────────────────────────────────────────────

// ── Split & fragment ───────────────────────────────────────────────────────
// ── 3D / perspective ───────────────────────────────────────────────────────

// ── Scroll ─────────────────────────────────────────────────────────────────

// ── Particles / premium ────────────────────────────────────────────────────

/**
 * Viewing-phase profiles. Mask reveals and content-heavy handoffs benefit from
 * a longer reading window so the outgoing section is fully legible before the
 * effect begins; quick slides can use a shorter one. Attached via the static
 * \`timing\` field the stage reads per edge.
 */
const LONG_HOLD = { rest: 160 } as const;
const SHORT_HOLD = { rest: 60 } as const;

export const transitionRegistry: Record<string, TransitionComponent> = {
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
`;
export const TIMING_OVERRIDES = {
    "circular-portal": "LONG_HOLD",
    "spotlight-reveal": "LONG_HOLD",
    "ink-spread": "LONG_HOLD",
    "ripple-reveal": "LONG_HOLD",
    "liquid-morph": "LONG_HOLD",
    "svg-shape-morph": "LONG_HOLD",
    "volumetric-light": "LONG_HOLD",
    "black-hole": "LONG_HOLD",
    "zoom-fade": "SHORT_HOLD",
    "elastic-curtain": "SHORT_HOLD",
    "pin-reveal": "SHORT_HOLD"
};
//# sourceMappingURL=core-sources.js.map