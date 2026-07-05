'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp, Copy, Expand, Layers3, MonitorPlay, Sparkles, Terminal, WandSparkles } from 'lucide-react';
import type { TransitionMeta } from '@/library/registry';
import type { CoreFile } from '@/lib/transition-docs';

// ---------------------------------------------------------------------------
// Tooltip
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
        <span role="tooltip" className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-200 shadow-xl">
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-700" />
          {label}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Installation command block — package manager switcher
// ---------------------------------------------------------------------------
type PackageManager = 'npx' | 'pnpm' | 'yarn' | 'bun';

const PM_LABELS: Record<PackageManager, string> = { npx: 'npx', pnpm: 'pnpm dlx', yarn: 'yarn dlx', bun: 'bunx' };

function InstallBlock({ slug }: { slug: string }) {
  const [pm, setPm] = useState<PackageManager>('npx');
  const [copied, setCopied] = useState(false);

  const command = `${PM_LABELS[pm]} sectionflow-cli add ${slug}`;

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="border-b border-zinc-800 bg-[#0a0d13]">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Terminal className="size-3.5 text-cyan-400 shrink-0" />
          <span className="font-medium text-zinc-300">Install via CLI</span>
        </div>
        {/* PM switcher */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-800/50 p-0.5">
          {(Object.keys(PM_LABELS) as PackageManager[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPm(key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition ${pm === key ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      {/* Command line */}
      <div className="flex items-center gap-2 border-t border-zinc-800/60 bg-[#07090f] px-4 py-3">
        <span className="select-none text-zinc-600 text-sm font-mono">$</span>
        <code className="flex-1 font-mono text-sm text-cyan-300">{command}</code>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
        >
          {copied
            ? <><Check className="size-3 text-emerald-400" /> Copied</>
            : <><Copy className="size-3" /> Copy</>}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible file block
// ---------------------------------------------------------------------------
function FileBlock({ filename, html, source, defaultOpen = false, badge }: {
  filename: string; html: string; source: string; defaultOpen?: boolean; badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex flex-1 items-center gap-2.5 text-left">
          {open ? <ChevronUp className="size-3.5 shrink-0 text-zinc-500" /> : <ChevronDown className="size-3.5 shrink-0 text-zinc-500" />}
          <span className="rounded border border-zinc-700 bg-zinc-800/70 px-2 py-0.5 font-mono text-[11px] text-zinc-300">{filename}</span>
          {badge && <span className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{badge}</span>}
        </button>
        <button type="button" onClick={copy} className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white">
          {copied ? <><Check className="size-3 text-emerald-400" /> Copied</> : <><Copy className="size-3" /> Copy</>}
        </button>
      </div>
      {open && (
        <div
          className="shiki-wrapper max-h-[60vh] overflow-auto border-t border-zinc-800/60 px-4 py-3 text-sm leading-6 [&>pre]:bg-transparent! [&>pre]:m-0! [&>pre]:p-0! [&_code]:font-mono! [&_code]:text-sm! [&_code]:leading-6!"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered by Shiki, safe
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI prompt builder
// ---------------------------------------------------------------------------
function buildAiPrompt(transition: TransitionMeta, sourceCode: string, usageCode: string): string {
  const engine = transition.engine === 'gsap' ? 'GSAP (with ScrollTrigger)' : 'Framer Motion';
  return `# Implement the "${transition.name}" scroll-driven section transition

## What this transition does
${transition.description}

## Tech stack
- Framework: Next.js (App Router) + React 19
- Animation engine: ${engine}
- Styling: Tailwind CSS v4
- Language: TypeScript

## Architecture — v2 persistent layers
Sections are mounted once as persistent layers inside a single pinned viewport.
The transition is a scroll-driven EFFECT that writes motion values (scale, y,
clipPath, maskImage, opacity, …) into the \`outgoing\` and \`incoming\` layer
handles. It never owns or clones section content. A viewing phase (rest zone)
keeps the outgoing section fully visible and static before animation begins.

## File 1 — Transition component (src/library/transitions-v2/${transition.slug}.tsx)
\`\`\`tsx
${sourceCode}
\`\`\`

## File 2 — Core types (src/library/core/types.ts)
\`\`\`ts
import type { ReactNode, ComponentType, ReactElement } from 'react';
import type { MotionValue, MotionStyle } from 'framer-motion';

export type TransitionDirection = 'forward' | 'reverse';
export interface Viewport { width: number; height: number; }
export interface LayerBounds { width: number; height: number; top: number; left: number; }
export interface LayerHandle { style: MotionStyle; bounds: LayerBounds; render?: () => ReactElement; }

export interface TransitionProps {
  progress: MotionValue<number>;
  direction: TransitionDirection;
  viewport: Viewport;
  outgoing: LayerHandle;
  incoming: LayerHandle;
}
export type TransitionComponent = ComponentType<TransitionProps> & { timing?: { rest?: number; duration?: number }; copies?: boolean };
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
\`\`\`

## File 3 — SectionFlow stage (src/library/core/section-flow.tsx)
The stage manages persistent layers and transition spans. Sections mount once.
Per-frame work stays on the compositor: scroll → spring → local progress →
transition motion values → GPU. React re-renders only on edge changes.

## File 4 — Registry (src/library/core/registry-v2.ts)
Maps string slugs to TransitionComponents so <Section transition="slug"> works.

## File 5 — Full page usage example
\`\`\`tsx
${usageCode}
\`\`\`

## Instructions
1. Manually install: npm install ${transition.engine === 'gsap' ? 'gsap framer-motion' : 'framer-motion'}
2. Copy the transition file into src/library/transitions-v2/
3. Register it in registry-v2.ts
4. Use <SectionFlow> + <Section> to compose your page
5. heightPerSection controls animation speed; restHeight controls reading window
`;
}

function toPascalCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// ---------------------------------------------------------------------------
// Main shell
// ---------------------------------------------------------------------------
export function TransitionDocsShell({
  transition, sourceCode, sourceHtml, coreFiles, usageCode, usageHtml, relatedTransitions,
}: {
  transition: TransitionMeta;
  sourceCode: string;
  sourceHtml: string;
  coreFiles: CoreFile[];
  usageCode: string;
  usageHtml: string;
  relatedTransitions: TransitionMeta[];
}) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code'>('demo');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const useCases = [
    { label: 'Landing pages', description: 'Hero-led storytelling', icon: MonitorPlay },
    { label: 'Product reveals', description: 'Section-to-section handoffs', icon: Layers3 },
    { label: 'Editorial UI', description: 'Cinematic motion language', icon: WandSparkles },
  ];

  const aiPrompt = useMemo(() => buildAiPrompt(transition, sourceCode, usageCode), [transition, sourceCode, usageCode]);

  const allCode = useMemo(() => [
    `// ── ${transition.slug}.tsx (transitions-v2/) ────────────`,
    sourceCode, '',
    `// ── src/library/core/types.ts ───────────────────────────`,
    ...coreFiles.filter((f) => f.filename.includes('types')).map((f) => f.source), '',
    `// ── src/library/core/section-flow.tsx ──────────────────`,
    ...coreFiles.filter((f) => f.filename.includes('section-flow')).map((f) => f.source), '',
    `// ── src/library/core/registry-v2.ts ────────────────────`,
    ...coreFiles.filter((f) => f.filename.includes('registry')).map((f) => f.source), '',
    `// ── Usage example (page.tsx) ────────────────────────────`,
    usageCode,
  ].join('\n'), [transition.slug, sourceCode, coreFiles, usageCode]);

  async function copyToClipboard(text: string, type: 'prompt' | 'all') {
    if (typeof navigator === 'undefined') return;
    await navigator.clipboard.writeText(text);
    if (type === 'prompt') { setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 1600); }
    else { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1600); }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[40px] border border-zinc-800/80 bg-[#06080c] p-2.5 sm:p-3 lg:p-4">
        {/* Header */}
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
                  <div className="flex items-center gap-2 text-cyan-300"><Icon className="size-4" /><span className="text-sm font-semibold text-white">{item.label}</span></div>
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
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span>Preview canvas</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 p-1">
              <button type="button" onClick={() => setActiveTab('demo')} className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] transition ${activeTab === 'demo' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>Preview</button>
              <button type="button" onClick={() => setActiveTab('code')} className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] transition ${activeTab === 'code' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>Code</button>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip label={copiedPrompt ? 'Copied!' : 'Copy AI prompt'}>
                <button type="button" onClick={() => copyToClipboard(aiPrompt, 'prompt')} className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-cyan-300" aria-label="Copy AI prompt">
                  {copiedPrompt ? <Check className="size-4 text-emerald-400" /> : <Sparkles className="size-4" />}
                </button>
              </Tooltip>
              <Tooltip label={copiedAll ? 'Copied!' : 'Copy all files'}>
                <button type="button" onClick={() => copyToClipboard(allCode, 'all')} className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white" aria-label="Copy all source files">
                  {copiedAll ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </button>
              </Tooltip>
              <Tooltip label="Full-screen demo">
                <Link href={`/demo/${transition.slug}`} className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white" aria-label="Open full-screen demo">
                  <Expand className="size-4" />
                </Link>
              </Tooltip>
            </div>
          </div>

          {/* PREVIEW TAB */}
          {activeTab === 'demo' && (
            <iframe src={`/demo/${transition.slug}`} title={`${transition.name} demo`} className="min-h-140 h-[76vh] w-full" />
          )}

          {/* CODE TAB */}
          {activeTab === 'code' && (
            <div className="bg-[#0d1117]">
              {/* ── Installation command — top, always visible, no accordion ── */}
              <InstallBlock slug={transition.slug} />

              {/* Files header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">5 files</span>
                  <span className="text-zinc-700">·</span>
                  <span>Click any filename to expand</span>
                </div>
                <button type="button" onClick={() => copyToClipboard(allCode, 'all')} className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white">
                  {copiedAll ? <><Check className="size-3 text-emerald-400" /> Copied all</> : <><Copy className="size-3" /> Copy all files</>}
                </button>
              </div>

              <FileBlock filename={`src/library/transitions-v2/${transition.slug}.tsx`} html={sourceHtml} source={sourceCode} defaultOpen badge="transition" />
              {coreFiles.filter((f) => f.filename.includes('types')).map((f) => <FileBlock key={f.filename} filename={f.filename} html={f.html} source={f.source} badge="core" />)}
              {coreFiles.filter((f) => f.filename.includes('section-flow')).map((f) => <FileBlock key={f.filename} filename={f.filename} html={f.html} source={f.source} badge="core" />)}
              {coreFiles.filter((f) => f.filename.includes('registry')).map((f) => <FileBlock key={f.filename} filename={f.filename} html={f.html} source={f.source} badge="core" />)}
              <FileBlock filename="page.tsx (usage example)" html={usageHtml} source={usageCode} badge="usage" />
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
            <p className="mt-3 text-xs leading-6 text-zinc-500">Copies a complete prompt with all 4 files plus CLI install command — ready to paste into any AI assistant.</p>
            <button type="button" onClick={() => copyToClipboard(aiPrompt, 'prompt')} className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
              {copiedPrompt ? <><Check className="size-4 text-emerald-400" /> Copied to clipboard</> : <><Copy className="size-4" /> Copy full prompt + code</>}
            </button>
          </section>

          <section className="rounded-4xl border border-zinc-800 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Related transitions</h2>
              <Link href="/docs/templates" className="text-sm text-zinc-500 transition hover:text-white">Browse all</Link>
            </div>
            <div className="mt-4 space-y-3">
              {relatedTransitions.map((item) => (
                <Link key={item.slug} href={`/docs/transitions/${item.slug}`} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
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
