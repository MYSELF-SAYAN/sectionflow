'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Copy, Expand, Layers3, MonitorPlay, Sparkles, WandSparkles } from 'lucide-react';
import type { TransitionMeta } from '@/library/registry';

// ---------------------------------------------------------------------------
// Tiny tooltip — pure CSS-free, position above the trigger element
// ---------------------------------------------------------------------------
function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-200 shadow-xl"
        >
          {/* Arrow pointing up */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-700" />
          {label}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Build a rich AI prompt that includes the full component source code
// ---------------------------------------------------------------------------
function buildAiPrompt(transition: TransitionMeta, sourceCode: string): string {
  const engine = transition.engine === 'gsap' ? 'GSAP (with ScrollTrigger)' : 'Framer Motion';
  const category = transition.category;

  return `# Implement the "${transition.name}" scroll-driven section transition

## What this transition does
${transition.description}

## Tech stack
- Framework: Next.js (App Router) + React 19
- Animation engine: ${engine}
- Styling: Tailwind CSS v4
- Language: TypeScript

## How it works
The transition uses a sticky scroll track (\`TransitionTrack\`) that creates a tall scrollable region (default 300 vh). A spring-smoothed progress value (0 → 1) drives every animation. The component receives two props — \`first\` (outgoing section) and \`second\` (incoming section) — both typed as \`ReactNode\`.

Key rule: the first 30% of scroll progress is a **dead zone** where both sections are fully visible and readable. Animations only begin after the user has scrolled through ~30% of the track, creating a clear separation between "content reading" and "transition" phases.

## Component source code
Copy this file to \`src/library/transitions/${transition.slug}.tsx\` in your project:

\`\`\`tsx
${sourceCode}
\`\`\`

## Required core files
You also need these two files from the SectionFlow library:

### \`src/library/core/types.ts\`
\`\`\`ts
import type { ReactNode } from 'react';

export interface SectionTransitionProps {
  first: ReactNode;
  second: ReactNode;
  height?: number;   // scroll track height in vh, default 300
  className?: string;
}
\`\`\`

### \`src/library/core/transition-track.tsx\`
\`\`\`tsx
'use client';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useScroll, useSpring, type MotionValue } from 'framer-motion';

const ProgressContext = createContext<MotionValue<number> | null>(null);

export function useTrackProgress(): MotionValue<number> {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useTrackProgress must be used inside <TransitionTrack>');
  return value;
}

export function TransitionTrack({ children, height = 300, className }: { children: ReactNode; height?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4, restDelta: 0.0001 });
  return (
    <div ref={ref} style={{ height: \`\${height}vh\` }} className={\`relative w-full \${className ?? ''}\`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressContext.Provider value={smooth}>{children}</ProgressContext.Provider>
      </div>
    </div>
  );
}
\`\`\`

## Usage example
\`\`\`tsx
import { ${toPascalCase(transition.slug)} } from '@/library/transitions/${transition.slug}';

export default function MyPage() {
  return (
    <main>
      {/* Your first section */}
      <section className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold">Section One</h1>
      </section>

      {/* The transition — wraps both sections */}
      <${toPascalCase(transition.slug)}
        height={300}
        first={
          <section className="h-full w-full bg-zinc-950 flex items-center justify-center text-white">
            <h2 className="text-4xl font-semibold">Outgoing section</h2>
          </section>
        }
        second={
          <section className="h-full w-full bg-zinc-900 flex items-center justify-center text-white">
            <h2 className="text-4xl font-semibold">Incoming section</h2>
          </section>
        }
      />

      {/* Your second section */}
      <section className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold">Section Two</h1>
      </section>
    </main>
  );
}
\`\`\`

## Instructions for AI
1. Copy the component source code exactly as shown above — do not modify the animation logic.
2. Install dependencies: \`${transition.engine === 'gsap' ? 'gsap' : 'framer-motion'}\`
3. Create the two core files (\`types.ts\` and \`transition-track.tsx\`) if they don't exist.
4. Replace the placeholder section content in the usage example with the actual page sections you want to transition between.
5. The \`height\` prop controls transition speed — increase it (e.g. 400) for a slower, more cinematic feel.
6. Both \`first\` and \`second\` props must render full-screen (\`h-full w-full\`) sections that fill their container.
`;
}

function toPascalCase(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// ---------------------------------------------------------------------------
// Main shell
// ---------------------------------------------------------------------------
export function TransitionDocsShell({
  transition,
  sourceCode,
  sourceHtml,
  relatedTransitions,
}: {
  transition: TransitionMeta;
  sourceCode: string;
  sourceHtml: string;
  relatedTransitions: TransitionMeta[];
}) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code'>('demo');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const useCases = [
    { label: 'Landing pages', description: 'Hero-led storytelling', icon: MonitorPlay },
    { label: 'Product reveals', description: 'Section-to-section handoffs', icon: Layers3 },
    { label: 'Editorial UI', description: 'Cinematic motion language', icon: WandSparkles },
  ];

  // Full AI prompt includes component source code
  const aiPrompt = useMemo(
    () => buildAiPrompt(transition, sourceCode),
    [transition, sourceCode],
  );

  async function copyToClipboard(text: string, type: 'code' | 'prompt') {
    if (typeof navigator === 'undefined') return;
    await navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1600);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1600);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[40px] border border-zinc-800/80 bg-[#06080c] p-2.5 sm:p-3 lg:p-4">
        <div className="rounded-[30px] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5 lg:p-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{transition.name}</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-400 sm:text-base">{transition.description}</p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Icon className="size-4" />
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview / Code panel */}
        <div className="mt-4 overflow-hidden rounded-[30px] border border-zinc-800 bg-zinc-950 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500">
            {/* Left: status indicator */}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span>Preview canvas</span>
            </div>

            {/* Centre: tab switcher */}
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] transition ${activeTab === 'demo' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] transition ${activeTab === 'code' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
              >
                Code
              </button>
            </div>

            {/* Right: action icon buttons with tooltips */}
            <div className="flex items-center gap-2">
              <Tooltip label={copiedPrompt ? 'Copied!' : 'Copy AI prompt'}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(aiPrompt, 'prompt')}
                  className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-cyan-300"
                  aria-label="Copy AI prompt"
                >
                  {copiedPrompt ? <Check className="size-4 text-emerald-400" /> : <Sparkles className="size-4" />}
                </button>
              </Tooltip>

              <Tooltip label={copiedCode ? 'Copied!' : 'Copy source code'}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sourceCode, 'code')}
                  className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Copy source code"
                >
                  {copiedCode ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </button>
              </Tooltip>

              <Tooltip label="Full-screen demo">
                <Link
                  href={`/demo/${transition.slug}`}
                  className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Open full-screen demo"
                >
                  <Expand className="size-4" />
                </Link>
              </Tooltip>
            </div>
          </div>

          {/* Content area */}
          {activeTab === 'demo' ? (
            <iframe
              src={`/demo/${transition.slug}`}
              title={`${transition.name} demo`}
              className="min-h-140 h-[76vh] w-full"
            />
          ) : (
            <div className="overflow-hidden bg-[#0d1117]">
              {/* Code panel header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="rounded border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                    {transition.slug}.tsx
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-600">TypeScript / React</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sourceCode, 'code')}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
                >
                  {copiedCode ? (
                    <><Check className="size-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="size-3" /> Copy</>
                  )}
                </button>
              </div>
              {/* Shiki-highlighted code — server-rendered HTML */}
              <div
                className="shiki-wrapper max-h-[70vh] overflow-auto p-4 text-sm leading-6 [&>pre]:bg-transparent! [&>pre]:m-0! [&>pre]:p-0! [&_code]:font-mono! [&_code]:text-sm! [&_code]:leading-6!"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered by Shiki, safe
                dangerouslySetInnerHTML={{ __html: sourceHtml }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Description + AI prompt + Related */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-4xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Description</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">Why this transition stands out</h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">{transition.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">When to use it</div>
              <div className="mt-2 text-sm font-semibold text-white">Hero reveals, product launches, and section handoffs</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Motion profile</div>
              <div className="mt-2 text-sm font-semibold text-white">Smooth, cinematic, and built for premium storytelling</div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-4xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="size-4" />
              <h2 className="text-lg font-semibold">AI prompt</h2>
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              Copies a complete prompt with the full component source, core files, and usage example — ready to paste into any AI assistant.
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(aiPrompt, 'prompt')}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              {copiedPrompt
                ? <><Check className="size-4 text-emerald-400" /> Copied to clipboard</>
                : <><Copy className="size-4" /> Copy full prompt + code</>}
            </button>
          </section>

          <section className="rounded-4xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Related transitions</h2>
              <Link href="/docs/templates" className="text-sm text-zinc-500 transition hover:text-white">
                Browse all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {relatedTransitions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/transitions/${item.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  <span>{item.name}</span>
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
