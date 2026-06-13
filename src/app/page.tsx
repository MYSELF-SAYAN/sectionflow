'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Layers, Gauge, Accessibility, Boxes, Wand2, MousePointerClick } from 'lucide-react';
import { CardStack } from '@/library/transitions/card-stack';
import { CircularPortal } from '@/library/transitions/circular-portal';
import { VerticalSplit } from '@/library/transitions/vertical-split';
import { transitions, availableTransitions } from '@/library/registry';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  return (
    <div className="w-full bg-[#0b0b0e] text-[#fbfaf7] antialiased">
      <Nav />
      <Hero />
      <CardStack first={<FeaturePanel />} second={<CategoriesPanel />} />
      <CircularPortal first={<EnginePanel />} second={<StatsPanel />} />
      <VerticalSplit first={<QuotePanel />} second={<CtaPanel />} />
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
      className="fixed left-1/2 top-6 z-50 flex w-[92%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#0b0b0e]/70 px-6 py-3 backdrop-blur-xl"
    >
      <Link href="/" className="text-sm font-bold tracking-tight">
        SectionFlow<span className="text-teal-400">.</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm text-white/60">
        <Link href="/docs/templates" className="transition-colors hover:text-white">Templates</Link>
        <Link href="/docs" className="transition-colors hover:text-white">Docs</Link>
        <Link
          href="/docs/templates"
          className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-medium text-black transition-transform hover:scale-105 sm:flex"
        >
          Explore <ArrowRight className="size-3.5" />
        </Link>
      </nav>
    </motion.header>
  );
}

function Hero() {
  const names = availableTransitions.map((t) => t.name);
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        aria-hidden
        className="absolute -top-1/3 left-1/4 size-[60vmax] rounded-full bg-teal-700/25 blur-[120px]"
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-1/3 right-1/4 size-[55vmax] rounded-full bg-cyan-600/20 blur-[120px]"
        animate={{ x: [0, -70, 50, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8, ease }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-white/40"
      >
        {transitions.length}+ scroll-driven section transitions
      </motion.span>
      <h1 className="mt-6 text-center text-6xl font-semibold leading-[0.9] tracking-tighter sm:text-8xl md:text-[9rem]" style={{ perspective: 800 }}>
        {['Section', 'Flow'].map((word, i) => (
          <motion.span
            key={word}
            className="inline-block"
            initial={{ opacity: 0, y: 70, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.9, ease }}
          >
            {word}
            {i === 1 && <span className="text-teal-400">.</span>}
          </motion.span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease }}
        className="mt-8 max-w-xl text-center text-lg leading-relaxed text-white/60"
      >
        Beautifully crafted, production-ready section transitions for modern React websites. Framer Motion first, GSAP when you need more.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9, ease }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link href="/docs/templates" className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-black transition-transform hover:scale-105">
          Browse templates <ArrowRight className="size-4" />
        </Link>
        <Link href="/docs" className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white">
          Read the docs
        </Link>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 text-white/30"
      >
        <ArrowDown className="size-5" />
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-white/10 py-4">
        <div className="flex w-max gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-white/30 [animation:marquee_35s_linear_infinite]">
          {[...names, ...names].map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex h-full min-h-screen w-full flex-col items-center justify-center px-6 py-24 ${className ?? ''}`}>
      {children}
    </section>
  );
}

const features = [
  { icon: Gauge, title: '60 FPS', body: 'Only compositor-friendly properties: transforms, opacity, clip-paths and masks.' },
  { icon: Layers, title: 'Scroll-driven', body: 'Sticky tracks with spring-smoothed progress, just like the best Awwwards sites.' },
  { icon: Boxes, title: 'Copy-paste', body: 'Each transition is one self-contained file with a consistent first/second API.' },
  { icon: Wand2, title: 'Two engines', body: 'Framer Motion by default. GSAP ScrollTrigger for staggered, multi-phase timelines.' },
  { icon: Accessibility, title: 'Production ready', body: 'TypeScript, SSR compatible, mobile optimized and tuned spring physics.' },
  { icon: MousePointerClick, title: 'Interactive', body: 'Velocity-reactive effects that respond to how fast you scroll.' },
];

function FeaturePanel() {
  return (
    <Panel className="bg-[#101014] text-[#fbfaf7]">
      <span className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/40">Why SectionFlow</span>
      <h2 className="max-w-3xl text-center text-4xl font-semibold tracking-tighter sm:text-6xl">Built like the sites you admire.</h2>
      <div className="mt-16 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
            <f.icon className="size-5 text-teal-400" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CategoriesPanel() {
  const categories = [...new Set(transitions.map((t) => t.category))];
  return (
    <Panel className="bg-gradient-to-br from-teal-950 via-slate-900 to-[#07111d] text-white">
      <span className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/40">The catalog</span>
      <h2 className="max-w-3xl text-center text-4xl font-semibold tracking-tighter sm:text-6xl">{transitions.length} transitions. Seven families.</h2>
      <div className="mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        {categories.map((c) => (
          <span key={c} className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80">
            {c} · {transitions.filter((t) => t.category === c).length}
          </span>
        ))}
      </div>
      <Link href="/docs/templates" className="mt-12 flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-black transition-transform hover:scale-105">
        Open the gallery <ArrowRight className="size-4" />
      </Link>
    </Panel>
  );
}

function EnginePanel() {
  return (
    <Panel className="bg-[#fbfaf7] text-[#191919]">
      <span className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-black/40">Animation architecture</span>
      <h2 className="max-w-3xl text-center text-4xl font-semibold tracking-tighter sm:text-6xl">Framer Motion first.<br />GSAP when it counts.</h2>
      <p className="mt-8 max-w-xl text-center text-lg leading-relaxed text-black/60">
        Springs, motion values and a shared sticky-track core power most transitions. Multi-phase staggered choreography hands off to GSAP ScrollTrigger.
      </p>
    </Panel>
  );
}

function StatsPanel() {
  const stats = [
    [String(transitions.length) + '+', 'transitions in the catalog'],
    ['60', 'frames per second, always'],
    ['2', 'animation engines, one API'],
    ['1', 'file to copy per transition'],
  ];
  return (
    <Panel className="bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-900 text-white">
      <div className="grid w-full max-w-4xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <div className="text-6xl font-semibold tracking-tighter">{value}</div>
            <div className="mt-3 text-sm text-white/55">{label}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QuotePanel() {
  return (
    <Panel className="bg-[#101014] text-[#fbfaf7]">
      <p className="max-w-3xl text-center font-serif text-3xl italic leading-snug text-white/80 sm:text-5xl">
        “The space between sections is where a website earns its polish.”
      </p>
    </Panel>
  );
}

function CtaPanel() {
  return (
    <Panel className="bg-gradient-to-br from-teal-700 via-cyan-700 to-emerald-600 text-white">
      <h2 className="max-w-3xl text-center text-5xl font-semibold tracking-tighter sm:text-7xl">Ship transitions worth scrolling for.</h2>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link href="/docs/templates" className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black transition-transform hover:scale-105">
          Browse all templates <ArrowRight className="size-4" />
        </Link>
        <Link href="/docs" className="rounded-full border border-white/30 px-8 py-4 font-medium transition-colors hover:bg-white/10">
          Get started
        </Link>
      </div>
      <p className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-white/50">SectionFlow · MIT · Built with Framer Motion + GSAP</p>
    </Panel>
  );
}
