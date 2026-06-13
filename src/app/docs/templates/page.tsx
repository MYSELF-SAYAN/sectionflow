import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ComingSoonCard } from '@/components/coming-soon-card';
import { getGroupedTransitions } from '@/lib/transition-docs';

export const metadata = {
  title: 'Templates',
  description: 'Browse premium section transitions grouped by composition and motion style.',
};

export default function DocsTemplatesPage() {
  const grouped = getGroupedTransitions();

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-[36px] border border-teal-400/20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.24),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-2 text-sm text-teal-200">
          <ArrowLeft className="size-4" />
          <Link href="/docs" className="transition hover:text-white">Back to docs</Link>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Transition gallery</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
          Explore the library by motion family, preview every transition, and jump straight into the full documentation experience.
        </p>
      </header>

      <div className="space-y-8">
        {grouped.map((section) => (
          <section key={section.group} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">{section.group}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                {section.transitions.length} entries
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.transitions.map((transition) =>
                transition.status === 'available' ? (
                  <Link key={transition.slug} href={`/docs/transitions/${transition.slug}`} className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:border-teal-400/40 hover:bg-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white">{transition.name}</h3>
                      <ArrowRight className="size-4 text-white/40" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/60">{transition.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{transition.engine === 'gsap' ? 'GSAP' : 'Motion'}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-white/40">{transition.category}</span>
                    </div>
                  </Link>
                ) : (
                  <ComingSoonCard key={transition.slug} title={transition.name} description={transition.description} />
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
