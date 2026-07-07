import Link from 'next/link';
import { ArrowRight, Blocks, Code2, Layers3, Sparkles, Zap } from 'lucide-react';
import { getDocsStats, getFeaturedTransitions } from '@/lib/transition-docs';
import { transitionGroups } from '@/library/registry';

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
              Next-generation scroll animations
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Fluid scroll transitions. <br className="hidden sm:block" /> Crafted for React.
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              Copy and paste high-performance scroll sequences into your apps. Built on a persistent-layer architecture that guarantees layout stability, accessibility, and buttery-smooth motion.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/installation" className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500">
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link href="/docs/templates" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                Browse components
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#05070c]/80 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              <Code2 className="size-4" /> Works with your stack
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/40 p-4 text-sm leading-7 text-emerald-300">
              <code>{`npx sectionflow-cli init
`}</code>
            </pre>
            <p className="mt-4 text-sm leading-7 text-white/65">No heavy runtimes or layout thrashing. Pure motion values mapped perfectly to your scroll position.</p>
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
            <h2 className="text-2xl font-semibold text-white">Start with the best</h2>
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
            <h2 className="text-2xl font-semibold text-white">Explore by pattern</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {transitionGroups.map((group) => (
              <Link key={group} href={`/docs/templates#${group.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 transition hover:border-teal-400/40 hover:bg-white/5 hover:text-white">
                <span>{group}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Browse</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-teal-400/20 bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(255,255,255,0.02))] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
              <Zap className="size-4" /> Architecture
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Engineered for speed and readability.</h2>
            <p className="mt-4 text-lg leading-8 text-white/70">We built SectionFlow to solve the hardest parts of scroll animations. Every transition reserves a safe viewing phase, guaranteeing your content is always readable. Animations run on the compositor, ensuring React only re-renders when absolutely necessary.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Blocks className="size-4" /> Own your code
            </div>
            <p className="mt-3 max-w-sm leading-7">This is not an npm package. Grab the code, customize the easing curves, and integrate it seamlessly into your own design system.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
