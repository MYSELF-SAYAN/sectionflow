import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { transitions, type TransitionMeta } from '@/library/registry';
import { transitionRegistry } from '@/library/core/registry';
import { codeToHtml } from 'shiki';

export const transitionGroups = ['Wave', 'SVG', 'Perspective', 'Scroll', 'Grid', 'Morph', 'Parallax', 'Other'] as const;

export function getTransitionGroup(meta: TransitionMeta) {
  if (meta.group) return meta.group;
  if (meta.slug.includes('wave')) return 'Wave';
  if (meta.slug.includes('portal') || meta.slug.includes('spotlight') || meta.slug.includes('ink') || meta.slug.includes('wipe') || meta.slug.includes('gradient') || meta.slug.includes('mask')) return 'SVG';
  if (meta.slug.includes('flip') || meta.slug.includes('fold') || meta.slug.includes('stack') || meta.slug.includes('cinematic') || meta.slug.includes('depth')) return 'Perspective';
  if (meta.slug.includes('zoom') || meta.slug.includes('elastic') || meta.slug.includes('parallax') || meta.slug.includes('pin') || meta.slug.includes('scroll') || meta.slug.includes('gsap')) return 'Scroll';
  if (meta.slug.includes('dot') || meta.slug.includes('grid')) return 'Grid';
  if (meta.slug.includes('morph') || meta.slug.includes('liquid') || meta.slug.includes('mesh')) return 'Morph';
  return 'Other';
}

export function getGroupedTransitions() {
  const grouped = new Map<string, TransitionMeta[]>();
  for (const group of transitionGroups) grouped.set(group, []);
  for (const transition of transitions) {
    const group = getTransitionGroup(transition);
    grouped.get(group)?.push(transition);
  }
  return transitionGroups
    .map((group) => ({ group, transitions: (grouped.get(group) ?? []).sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter((item) => item.transitions.length > 0);
}

export const getFeaturedTransitions = cache(() =>
  transitions.filter((item) => item.featured && item.status === 'available'),
);

export const getTransitionBySlug = cache((slug: string) =>
  transitions.find((item) => item.slug === slug),
);

// ---------------------------------------------------------------------------
// Source code — try v2 first, fall back to v1
// ---------------------------------------------------------------------------
export const getTransitionSourceCode = cache(async (slug: string) => {
  // Try v2 (transitions-v2/) first — these implement the handle contract
  const v2Path = path.join(process.cwd(), 'src', 'library', 'transitions-v2', `${slug}.tsx`);
  try {
    return await fs.readFile(v2Path, 'utf8');
  } catch {
    // Fall back to v1 (transitions/)
    const v1Path = path.join(process.cwd(), 'src', 'library', 'transitions', `${slug}.tsx`);
    try {
      return await fs.readFile(v1Path, 'utf8');
    } catch {
      return `// Source is not available for ${slug} yet.`;
    }
  }
});

// ---------------------------------------------------------------------------
// Shiki helpers
// ---------------------------------------------------------------------------
async function highlight(code: string, lang: 'tsx' | 'ts'): Promise<string> {
  try {
    return await codeToHtml(code, { lang, theme: 'github-dark' });
  } catch {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre style="color:#e1e4e8">${escaped}</pre>`;
  }
}

export const getTransitionSourceHtml = cache(async (slug: string) => {
  const source = await getTransitionSourceCode(slug);
  return highlight(source, 'tsx');
});

// ---------------------------------------------------------------------------
// Core library files (v2 types.ts + section-flow.tsx + registry-v2.ts)
// ---------------------------------------------------------------------------

const TYPES_SOURCE = `import type { ReactNode, ComponentType, ReactElement } from 'react';
import type { MotionValue } from 'framer-motion';
import type { MotionStyle } from 'framer-motion';

export type TransitionDirection = 'forward' | 'reverse';

export interface Viewport {
  width: number;
  height: number;
}

export interface LayerBounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface LayerHandle {
  style: MotionStyle;
  bounds: LayerBounds;
  render?: () => ReactElement;
}

export interface TransitionProps {
  progress: MotionValue<number>;
  direction: TransitionDirection;
  viewport: Viewport;
  outgoing: LayerHandle;
  incoming: LayerHandle;
}

export interface TransitionTiming {
  rest?: number;
  duration?: number;
}

export type TransitionComponent = ComponentType<TransitionProps> & {
  timing?: TransitionTiming;
  copies?: boolean;
};

export type TransitionResolver = TransitionComponent | string;

export interface SectionProps {
  children: ReactNode;
  transition?: TransitionResolver;
  className?: string;
}

export interface SectionFlowProps {
  children: ReactNode;
  heightPerSection?: number;
  restHeight?: number;
  defaultTransition?: TransitionResolver;
  className?: string;
}
`;

const SECTION_FLOW_SOURCE = `'use client';

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
  return <div className={\`h-full w-full \${className ?? ''}\`}>{children}</div>;
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

const REGISTRY_SOURCE = `'use client';

import type { TransitionComponent, TransitionResolver } from './types';

/**
 * v2 transition registry — starts empty after \`sectionflow init\`.
 *
 * Each \`sectionflow add <slug>\` appends an import + entry here, so
 * \`<Section transition="card-stack" />\` resolves through this map.
 * Pass a component directly (\`transition={CardStack}\`) to bypass it.
 */
export const transitionRegistry: Record<string, TransitionComponent> = {
  // Entries are appended by the CLI, e.g.:
  //   'card-stack': CardStack,
};

export function resolveTransition(
  resolver: TransitionResolver,
): TransitionComponent | null {
  if (typeof resolver === 'string') {
    return transitionRegistry[resolver] ?? null;
  }
  return resolver;
}
`;

export interface CoreFile {
  filename: string;
  language: 'tsx' | 'ts';
  source: string;
  html: string;
}

export const getCoreFiles = cache(async (): Promise<CoreFile[]> => {
  const [typesHtml, flowHtml, registryHtml] = await Promise.all([
    highlight(TYPES_SOURCE, 'ts'),
    highlight(SECTION_FLOW_SOURCE, 'tsx'),
    highlight(REGISTRY_SOURCE, 'tsx'),
  ]);
  return [
    { filename: 'src/library/core/types.ts', language: 'ts', source: TYPES_SOURCE, html: typesHtml },
    { filename: 'src/library/core/section-flow.tsx', language: 'tsx', source: SECTION_FLOW_SOURCE, html: flowHtml },
    { filename: 'src/library/core/registry.ts', language: 'tsx', source: REGISTRY_SOURCE, html: registryHtml },
  ];
});

// ---------------------------------------------------------------------------
// Usage example — v2 SectionFlow page
// ---------------------------------------------------------------------------
function toPascalCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function buildUsageCode(meta: TransitionMeta): string {
  const componentName = toPascalCase(meta.slug);
  const isGsap = meta.engine === 'gsap';
  const isV2 = !!transitionRegistry[meta.slug];

  return `'use client';

/**
 * Full-page usage example: ${meta.name}
 *
 * Install dependencies:
 *   ${isGsap ? 'npm install gsap framer-motion' : 'npm install framer-motion'}
 *
 * File structure:
 *   src/library/core/types.ts              ← TransitionProps, LayerHandle
 *   src/library/core/section-flow.tsx      ← SectionFlow + Section
 *   src/library/core/registry-v2.ts       ← Slug → component resolver
 *   src/library/transitions-v2/${meta.slug}.tsx  ← This transition
 */

import { SectionFlow, Section } from '@/library/core/section-flow';
${isV2
      ? `import { ${componentName} } from '@/library/transitions-v2/${meta.slug}';`
      : `// Import from transitions/ (legacy) until v2 migration is complete
// import { ${componentName} } from '@/library/transitions/${meta.slug}';`
    }

// ─── Section content ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-3xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
          Section 1
        </p>
        <h1 className="text-6xl font-bold tracking-tighter text-white sm:text-8xl">
          Welcome.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          Keep scrolling to experience the ${meta.name} transition.
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-900 px-6">
      <div className="max-w-3xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
          Section 2
        </p>
        <h2 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
          You made it.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          This section was revealed by the <strong className="text-white">${meta.name}</strong> transition.
        </p>
      </div>
    </section>
  );
}

function WorkSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-teal-950 px-6">
      <div className="max-w-3xl text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-teal-400/60">
          Section 3
        </p>
        <h2 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
          Keep going.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          Chain as many transitions as you like. Each one is scroll-driven and 60 FPS.
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main>
      {/* Native-scroll hero */}
      <HeroSection />

      <SectionFlow heightPerSection={200} restHeight={100}>
        {/*
          The outgoing edge of Section A carries the transition.
          Section B is the incoming layer. Both are mounted once
          as persistent layers inside the pinned span.
        */}
        <Section transition={${componentName} as any}>
          <HeroSection />
        </Section>
        <Section transition={${toPascalCase('card-stack')} as any}>
          <AboutSection />
        </Section>
        {/* Native scroll section — no transition declared */}
        <Section>
          <WorkSection />
        </Section>
      </SectionFlow>

      {/* Native-scroll footer */}
      <footer className="bg-zinc-950 p-8 text-center text-white/60">
        Built with SectionFlow
      </footer>
    </main>
  );
}
`;
}

export const getUsageCode = cache((slug: string) => {
  const meta = transitions.find((t) => t.slug === slug);
  if (!meta) return '// Transition not found.';
  return buildUsageCode(meta);
});

export const getUsageHtml = cache(async (slug: string) => {
  const code = getUsageCode(slug);
  return highlight(code, 'tsx');
});

// ---------------------------------------------------------------------------
// Prompt, related, stats
// ---------------------------------------------------------------------------
export function getTransitionPrompt(meta: TransitionMeta) {
  if (meta.prompt) return meta.prompt;
  return `Create a premium ${meta.name.toLowerCase()} section transition for a React and Next.js landing page. Use smooth Framer Motion motion, polished depth, and a clear handoff between two sections. Keep the transition production-ready, responsive, and visually refined.`;
}

export function getRelatedTransitions(meta: TransitionMeta) {
  return transitions
    .filter((item) => item.status === 'available' && item.slug !== meta.slug && getTransitionGroup(item) === getTransitionGroup(meta))
    .slice(0, 4);
}

export function getDocsStats() {
  const available = transitions.filter((item) => item.status === 'available').length;
  const v2Count = Object.keys(transitionRegistry).length;
  return [
    { label: 'Transitions', value: `${transitions.length}+` },
    { label: 'Available demos', value: `${available}` },
    { label: 'v2 migrated', value: `${v2Count}` },
    { label: 'TypeScript', value: 'First-class' },
  ];
}
