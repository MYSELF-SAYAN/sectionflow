'use client';

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
  motionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  type MotionValue,
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

  const viewport = useViewportSize(viewportRef);

  // ── Content-height measurement (tall-section support) ───────────────────
  // Measure each layer's natural content height so we can allocate extra
  // scroll budget for sections taller than the viewport.
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  if (contentRefs.current.length !== sections.length) {
    const old = contentRefs.current;
    contentRefs.current = sections.map((_, i) => old[i] ?? null);
  }
  const [contentHeights, setContentHeights] = useState<number[]>(() =>
    sections.map(() => 0),
  );
  useEffect(() => {
    const els = contentRefs.current;
    const measure = () => {
      setContentHeights((prev) => {
        const next = sections.map(
          (_, i) => els[i]?.offsetHeight ?? 0,
        );
        if (next.every((h, i) => h === prev[i])) return prev;
        return next;
      });
    };
    measure();
    const valid = els.filter(Boolean) as HTMLDivElement[];
    if (!valid.length) return;
    const ro = new ResizeObserver(measure);
    valid.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [sections.length]);

  // ── Per-edge timing table (with overflow budgets for tall sections) ──────
  //
  // Each edge now has five zones:
  //   overflowBefore | rest | duration | postRest | overflowAfter
  //
  // overflowBefore  – scroll budget for reading the outgoing section's
  //                   content beyond the first viewport (only on edge 0;
  //                   subsequent edges skip it because the section was
  //                   already scrolled as the incoming layer of the
  //                   preceding edge).
  // overflowAfter   – scroll budget for reading the incoming section's
  //                   content beyond the first viewport.
  //
  // For sections ≤100vh both values are 0, collapsing to the original model.
  //
  // Budget correction: scrollYProgress maps 0→1 over (spineHeight - viewport),
  // not spineHeight.  Naive budgets (overflow_px/vh*100) cause content to move
  // faster than scroll by factor T/(T-100).  We solve the quadratic
  //   T² - (100+B+S)T + 100B = 0
  // to find the inflated total height T where each overflow zone's physical
  // scroll distance exactly equals the overflow in pixels (1:1 ratio).
  const edges = useMemo(() => {
    const vh = viewport.height || 1;

    // Phase 1: collect base (non-overflow) heights and naive overflow budgets.
    const edgeBase: { rest: number; duration: number; postRest: number }[] = [];
    const naiveBudgets: { before: number; after: number }[] = [];
    let B = 0; // total base height in vh
    let S = 0; // total naive overflow budget in vh

    for (let e = 0; e < edgeCount; e++) {
      const t = sections[e]?.transition;
      const rest = t?.timing?.rest ?? restHeight;
      const duration = t?.timing?.duration ?? heightPerSection;
      const postRest = t?.timing?.rest ?? restHeight;
      edgeBase.push({ rest, duration, postRest });
      B += rest + duration + postRest;

      const outOverflow = Math.max(0, (contentHeights[e] ?? 0) - vh);
      const inOverflow = Math.max(0, (contentHeights[e + 1] ?? 0) - vh);
      const naiveBefore = e === 0 && vh > 0 ? (outOverflow / vh) * 100 : 0;
      const naiveAfter = vh > 0 ? (inOverflow / vh) * 100 : 0;
      naiveBudgets.push({ before: naiveBefore, after: naiveAfter });
      S += naiveBefore + naiveAfter;
    }

    // Phase 2: solve quadratic for corrected total height.
    // T² - (100+B+S)T + 100B = 0  →  T = ((100+B+S) + √Δ) / 2
    const sum = 100 + B + S;
    const discriminant = sum * sum - 400 * B;
    const T = S > 0
      ? (sum + Math.sqrt(Math.max(0, discriminant))) / 2
      : B; // no overflow → original height
    const factor = T > 100 ? T / (T - 100) : 1;

    // Phase 3: build edges with corrected budgets.
    const list: {
      overflowBefore: number;
      rest: number;
      duration: number;
      postRest: number;
      overflowAfter: number;
      span: number;
      start: number;
    }[] = [];
    let cursor = 0;
    for (let e = 0; e < edgeCount; e++) {
      const { rest, duration, postRest } = edgeBase[e];
      const overflowBefore = naiveBudgets[e].before * factor;
      const overflowAfter = naiveBudgets[e].after * factor;
      const span = overflowBefore + rest + duration + postRest + overflowAfter;
      list.push({
        overflowBefore,
        rest,
        duration,
        postRest,
        overflowAfter,
        span,
        start: cursor,
      });
      cursor += span;
    }
    return { list, total: cursor };
  }, [sections, edgeCount, restHeight, heightPerSection, contentHeights, viewport.height]);

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

  // ── Content-scroll MotionValues (tall-section support) ──────────────────
  // For sections taller than the viewport, we translate the inner content
  // wrapper upward (negative Y) to "scroll" through the section within the
  // pinned viewport.  Each section has at most one scroll zone in the global
  // timeline:
  //   • sections[0]: scrolls during edge 0's overflowBefore zone.
  //   • sections[k] (k≥1): scrolls during edge (k-1)'s overflowAfter zone.
  const contentYRef = useRef<MotionValue<number>[]>([]);
  if (contentYRef.current.length !== sections.length) {
    const old = contentYRef.current;
    contentYRef.current = sections.map((_, i) =>
      i < old.length ? old[i] : motionValue(0),
    );
  }

  const scrollZones = useMemo(() => {
    const vh = viewport.height || 1;
    return sections.map((_, i) => {
      const overflow_px = Math.max(0, (contentHeights[i] ?? 0) - vh);
      if (vh <= 0 || overflow_px <= 0) return null;

      if (i === 0) {
        // First section scrolls during edge 0's overflowBefore zone.
        return {
          startVh: 0,
          endVh: edges.list[0]?.overflowBefore ?? 0,
          amount_px: overflow_px,
        };
      }
      // Subsequent sections scroll during the previous edge's overflowAfter.
      const edgeIdx = i - 1;
      const edge = edges.list[edgeIdx];
      if (!edge) return null;
      const startVh =
        edge.start +
        edge.overflowBefore +
        edge.rest +
        edge.duration +
        edge.postRest;
      return {
        startVh,
        endVh: startVh + edge.overflowAfter,
        amount_px: overflow_px,
      };
    });
  }, [sections, contentHeights, viewport.height, edges]);

  // ── Content-scroll driver (tall-section support) ────────────────────────
  // Raw scroll listener with ZERO layout thrashing:
  //  • Spine position is cached and only updated on resize.
  //  • Scroll handler reads window.scrollY (pre-computed by browser, no layout).
  //  • Only writes el.style.transform when the value actually changes.
  //  • Content wrapper has will-change:transform for GPU compositing.
  useEffect(() => {
    const spine = spineRef.current;
    if (!spine || !scrollZones.some((z) => z !== null)) return;
    const vh = viewport.height;
    if (vh <= 0) return;

    // Cache geometry — only recompute on resize, NEVER in the scroll handler.
    let cachedSpineTop = 0;
    let cachedScrollable = 0;
    const updateGeometry = () => {
      const rect = spine.getBoundingClientRect();
      cachedSpineTop = rect.top + window.scrollY; // absolute doc position
      cachedScrollable = spine.offsetHeight - vh;
    };
    updateGeometry();
    const ro = new ResizeObserver(updateGeometry);
    ro.observe(spine);

    // Track last written Y per layer to skip no-op DOM writes.
    const lastY = new Float64Array(scrollZones.length);

    const total = edges.total;

    const handleScroll = () => {
      if (cachedScrollable <= 0) return;
      const p = Math.max(0, Math.min(1, (window.scrollY - cachedSpineTop) / cachedScrollable));
      const offsetVh = p * total;

      for (let i = 0; i < scrollZones.length; i++) {
        const zone = scrollZones[i];
        const el = contentRefs.current[i];
        if (!el || !zone) continue;

        let y = 0;
        if (offsetVh <= zone.startVh) {
          y = 0;
        } else if (offsetVh >= zone.endVh) {
          y = -zone.amount_px;
        } else {
          const range = zone.endVh - zone.startVh;
          const t = range > 0 ? (offsetVh - zone.startVh) / range : 0;
          y = -zone.amount_px * t;
        }

        // Skip DOM write if value hasn't changed (within 0.5px).
        if (Math.abs(y - lastY[i]) < 0.5) continue;
        lastY[i] = y;
        el.style.transform = `translateY(${y}px)`;
        // Keep MotionValue in sync for render() copies.
        contentYRef.current[i]?.set(y);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial position
    return () => {
      window.removeEventListener('scroll', handleScroll);
      ro.disconnect();
    };
  }, [scrollZones, edges.total, viewport.height]);

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
  // The animation window starts after overflowBefore + rest.
  const activeEdgeTiming = edges.list[activeEdge] ?? {
    overflowBefore: 0,
    start: 0,
    rest: restHeight,
    duration: heightPerSection,
    postRest: restHeight,
    overflowAfter: 0,
  };
  const localProgress = useTransform(progress, (p) => {
    const offsetVh = p * edges.total;
    const animStart =
      activeEdgeTiming.start +
      activeEdgeTiming.overflowBefore +
      activeEdgeTiming.rest;
    const animLocal =
      (offsetVh - animStart) / activeEdgeTiming.duration;
    return animLocal < 0 ? 0 : animLocal > 1 ? 1 : animLocal;
  });

  const outgoing: LayerHandle = {
    style: layerStyles[activeEdge],
    bounds: layerBounds[activeEdge],
    ...(needsCopies
      ? {
          render: () => (
            <motion.div style={{ y: contentYRef.current[activeEdge] }}>
              <SectionShell className={sections[activeEdge].className}>
                {sections[activeEdge].children}
              </SectionShell>
            </motion.div>
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
            <motion.div style={{ y: contentYRef.current[activeEdge + 1] }}>
              <SectionShell className={sections[activeEdge + 1].className}>
                {sections[activeEdge + 1].children}
              </SectionShell>
            </motion.div>
          ),
        }
      : {}),
  };

  return (
    <div ref={spineRef} style={{ height: `${totalHeight}vh` }} className="relative w-full">
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
              <div
                ref={(el) => {
                  contentRefs.current[idx] = el;
                }}
                style={{ willChange: 'transform' }}
              >
                <SectionShell className={s.className}>{s.children}</SectionShell>
              </div>
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
        key: el.key ?? `sf-${idx}`,
        children: props.children,
        className: props.className,
        transition,
      };
    });
  }, [children, defaultTransition]);

  const segments = useMemo(() => buildSegments(sections), [sections]);

  return (
    <div className={`w-full ${className}`}>
      {segments.map((seg, idx) =>
        seg.kind === 'flow' ? (
          <FlowSection key={`flow-${idx}`} section={seg.section} />
        ) : (
          <TransitionSpan
            key={`span-${idx}`}
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
  return <div className={`min-h-screen w-full pointer-events-auto ${className ?? ''}`}>{children}</div>;
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
