import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { transitions, type TransitionMeta } from '@/library/registry';
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
// Source code — raw file read
// ---------------------------------------------------------------------------
export const getTransitionSourceCode = cache(async (slug: string) => {
  const filePath = path.join(process.cwd(), 'src', 'library', 'transitions', `${slug}.tsx`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return `// Source is not available for ${slug} yet.`;
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
// Core library files (types.ts + transition-track.tsx)
// ---------------------------------------------------------------------------

const TYPES_SOURCE = `import type { ReactNode } from 'react';

export interface SectionTransitionProps {
  /** The outgoing section – fills the screen when the track starts. */
  first: ReactNode;
  /** The incoming section – fills the screen when the track ends. */
  second: ReactNode;
  /** Scroll track height in vh. Longer = slower transition. @default 300 */
  height?: number;
  className?: string;
}
`;

const TRACK_SOURCE = `'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useScroll, useSpring, type MotionValue } from 'framer-motion';

const ProgressContext = createContext<MotionValue<number> | null>(null);

/** Spring-smoothed 0→1 scroll progress of the parent <TransitionTrack>. */
export function useTrackProgress(): MotionValue<number> {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error('useTrackProgress must be used inside <TransitionTrack>');
  }
  return value;
}

export interface TransitionTrackProps {
  children: ReactNode;
  /** Track height in vh – longer tracks make the transition slower. */
  height?: number;
  className?: string;
}

/**
 * Sticky scroll track shared by every SectionFlow transition.
 * Creates a tall scrollable region with a pinned full-screen viewport and
 * provides a spring-smoothed 0→1 progress MotionValue to children via context.
 *
 * Dead zone: the first 30% of progress is reserved for content reading.
 * Transition animations should start at p >= 0.30.
 */
export function TransitionTrack({
  children,
  height = 300,
  className,
}: TransitionTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0001,
  });

  return (
    <div
      ref={ref}
      style={{ height: \`\${height}vh\` }}
      className={\`relative w-full \${className ?? ''}\`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressContext.Provider value={smooth}>
          {children}
        </ProgressContext.Provider>
      </div>
    </div>
  );
}
`;

export interface CoreFile {
  filename: string;
  language: 'tsx' | 'ts';
  source: string;
  html: string;
}

export const getCoreFiles = cache(async (): Promise<CoreFile[]> => {
  const [typesHtml, trackHtml] = await Promise.all([
    highlight(TYPES_SOURCE, 'ts'),
    highlight(TRACK_SOURCE, 'tsx'),
  ]);
  return [
    { filename: 'src/library/core/types.ts', language: 'ts', source: TYPES_SOURCE, html: typesHtml },
    { filename: 'src/library/core/transition-track.tsx', language: 'tsx', source: TRACK_SOURCE, html: trackHtml },
  ];
});

// ---------------------------------------------------------------------------
// Usage example — full page showing how to integrate a transition
// ---------------------------------------------------------------------------
function toPascalCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function buildUsageCode(meta: TransitionMeta): string {
  const componentName = toPascalCase(meta.slug);
  const isGsap = meta.engine === 'gsap';

  return `'use client';

/**
 * Full-page usage example: ${meta.name}
 *
 * Install dependencies:
 *   ${isGsap ? 'npm install gsap framer-motion' : 'npm install framer-motion'}
 *
 * File structure required:
 *   src/library/core/types.ts              ← SectionTransitionProps interface
 *   src/library/core/transition-track.tsx  ← Sticky scroll track + progress context
 *   src/library/transitions/${meta.slug}.tsx  ← This transition component
 */

import { ${componentName} } from '@/library/transitions/${meta.slug}';

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
      {/*
        ┌─────────────────────────────────────────────────┐
        │  Transition: ${meta.name}
        │
        │  Props:
        │    first   — the outgoing section (h-full w-full)
        │    second  — the incoming section (h-full w-full)
        │    height  — scroll distance in vh (default 300)
        │              increase for a slower, more cinematic feel
        └─────────────────────────────────────────────────┘
      */}

      {/* First standalone section */}
      <HeroSection />

      {/* Transition 1: Hero → About */}
      <${componentName}
        height={300}
        first={
          <div className="h-full w-full">
            <HeroSection />
          </div>
        }
        second={
          <div className="h-full w-full">
            <AboutSection />
          </div>
        }
      />

      {/* Transition 2: About → Work (chain another transition) */}
      <${componentName}
        height={300}
        first={
          <div className="h-full w-full">
            <AboutSection />
          </div>
        }
        second={
          <div className="h-full w-full">
            <WorkSection />
          </div>
        }
      />

      {/* Final standalone section */}
      <WorkSection />
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
  return [
    { label: 'Transitions', value: `${transitions.length}+` },
    { label: 'Available demos', value: `${available}` },
    { label: 'Engine', value: 'Framer Motion' },
    { label: 'TypeScript', value: 'First-class' },
  ];
}
