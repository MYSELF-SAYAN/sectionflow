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
// Source code — read from canonical transitions/ directory
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
// Core library files (types.ts + section-flow.tsx + registry.ts)
// ---------------------------------------------------------------------------

export interface CoreFile {
  filename: string;
  language: 'tsx' | 'ts';
  source: string;
  html: string;
}

export const getCoreFiles = cache(async (slug: string): Promise<CoreFile[]> => {
  const basePath = path.join(process.cwd(), 'src', 'library', 'core');
  
  const [typesSource, flowSource] = await Promise.all([
    fs.readFile(path.join(basePath, 'types.ts'), 'utf8').catch(() => '// Error reading types.ts'),
    fs.readFile(path.join(basePath, 'section-flow.tsx'), 'utf8').catch(() => '// Error reading section-flow.tsx'),
  ]);

  const componentName = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  const registrySource = `'use client';

import type { TransitionComponent, TransitionResolver } from './types';
import { ${componentName} } from '../transitions/${slug}';

/**
 * v2 transition registry
 *
 * Each \`sectionflow add <slug>\` appends an import + entry here, so
 * \`<Section transition="card-stack" />\` resolves through this map.
 * Pass a component directly (\`transition={CardStack}\`) to bypass it.
 */
export const transitionRegistry: Record<string, TransitionComponent> = {
  '${slug}': ${componentName},
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

  const [typesHtml, flowHtml, registryHtml] = await Promise.all([
    highlight(typesSource, 'ts'),
    highlight(flowSource, 'tsx'),
    highlight(registrySource, 'tsx'),
  ]);
  
  return [
    { filename: 'src/library/core/types.ts', language: 'ts', source: typesSource, html: typesHtml },
    { filename: 'src/library/core/section-flow.tsx', language: 'tsx', source: flowSource, html: flowHtml },
    { filename: 'src/library/core/registry.ts', language: 'tsx', source: registrySource, html: registryHtml },
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
 *   src/library/core/registry.ts           ← Slug → component resolver
 *   src/library/transitions/${meta.slug}.tsx  ← This transition
 */

import { SectionFlow, Section } from '@/library/core/section-flow';
${isV2
      ? `import { ${componentName} } from '@/library/transitions/${meta.slug}';`
      : `// Import from transitions/ when migration is complete
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
