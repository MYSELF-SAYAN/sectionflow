import Link from 'next/link';
import { ArrowRight, Blocks, Code2, Layers3, Sparkles, Zap } from 'lucide-react';
import { getDocsStats, getFeaturedTransitions, transitionGroups } from '@/lib/transition-docs';

export function DocsHomeContent() {
  const featured = getFeaturedTransitions();
  const stats = getDocsStats();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-teal-400/20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.24),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-sm text-teal-200">
              <Sparkles className="size-4" />
              50+ production-ready transitions
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Scroll-driven transitions with persistent layers and viewing phases.
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              SectionFlow uses a persistent-layer architecture — sections mount once, transitions animate handles, and every edge reserves a reading window before animation begins. Every entry ships with a live demo, source code, and an AI prompt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/installation" className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500">
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link href="/docs/templates" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                Explore transitions
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#05070c]/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              <Code2 className="size-4" /> Quick install
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/40 p-4 text-sm leading-7 text-emerald-300">
              <code>{`npm install framer-motion
# Optional: npm install gsap`}</code>
            </pre>
            <p className="mt-4 text-sm leading-7 text-white/65">Sections mount once as persistent layers. Transitions write motion values into handles — never clone content.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
            <div className="mt-2 text-sm text-white/55">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-teal-200">
            <Sparkles className="size-5" />
            <h2 className="text-2xl font-semibold text-white">Featured transitions</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featured.map((transition) => (
              <Link key={transition.slug} href={`/docs/transitions/${transition.slug}`} className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:border-teal-400/40 hover:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{transition.name}</h3>
                  <ArrowRight className="size-4 text-white/40" />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{transition.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-teal-200">
            <Layers3 className="size-5" />
            <h2 className="text-2xl font-semibold text-white">Transition categories</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {transitionGroups.map((group) => (
              <div key={group} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                <span>{group}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Browse</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-teal-400/20 bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(255,255,255,0.02))] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
              <Zap className="size-4" /> Persistent layers
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">A premium library for modern landing pages and design systems.</h2>
            <p className="mt-4 text-lg leading-8 text-white/70">Every transition reserves a viewing phase so content stays readable. Per-frame work stays on the compositor — React re-renders only on edge changes.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Blocks className="size-4" /> Copy-paste friendly
            </div>
            <p className="mt-3 max-w-sm leading-7">Drop in a transition, swap the content, and ship a polished experience without starting from scratch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
