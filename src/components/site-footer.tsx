import Link from 'next/link';
import { transitions } from '@/library/registry';
import { BsGithub } from 'react-icons/bs';

const LINKS = {
  Library: [
    { label: 'Browse all templates', href: '/docs/templates' },
    { label: 'Docs overview', href: '/docs' },
    { label: 'Getting started', href: '/docs/installation' },
    { label: 'CLI reference', href: '/docs/cli' },
    { label: 'API reference', href: '/docs/api' },
  ],
  Categories: [
    { label: 'Creative', href: '/docs/templates#creative' },
    { label: 'Split & Fragment', href: '/docs/templates#split-&-fragment' },
    { label: '3D', href: '/docs/templates#3d' },
    { label: 'Scroll', href: '/docs/templates#scroll' },
    { label: 'Particles', href: '/docs/templates#particles' },
    { label: 'Premium', href: '/docs/templates#premium' },
  ],
  Resources: [
    { label: 'Framer Motion docs', href: 'https://motion.dev', external: true },
    { label: 'GSAP ScrollTrigger', href: 'https://gsap.com/docs/v3/Plugins/ScrollTrigger/', external: true },
    { label: 'Next.js App Router', href: 'https://nextjs.org/docs', external: true },
    { label: 'Tailwind CSS v4', href: 'https://tailwindcss.com/docs', external: true },
  ],
} as const;

const available = transitions.filter((t) => t.status === 'available').length;
const planned = transitions.filter((t) => t.status === 'planned').length;

export function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#0b0b0e]">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-0 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-0 h-72 w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/8 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Top row */}
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-lg font-bold tracking-tight text-white">
              SectionFlow<span className="text-teal-400">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/50">
              A growing library of production-ready, scroll-driven section transitions for modern React websites. Framer Motion first, GSAP when you need more.
            </p>
            {/* Stats pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {available} available
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                <span className="size-1.5 rounded-full bg-amber-400" />
                {planned}+ coming soon
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                <span className="size-1.5 rounded-full bg-teal-400" />
                MIT license
              </span>
            </div>

            {/* GitHub Button */}
            <div className="mt-8">
              <a 
                href="https://github.com/MYSELF-SAYAN/sectionflow"
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-2 pr-5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">
                  <BsGithub size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Open Source</span>
                  <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">Star on GitHub</span>
                </div>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} SectionFlow. MIT licensed. Built with{' '}
              <a href="https://motion.dev" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white/80">
                Framer Motion
              </a>
              {' '}+{' '}
              <a href="https://gsap.com" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white/80">
                GSAP
              </a>
              {' '}+{' '}
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white/80">
                Next.js
              </a>
              .
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30">
              scroll · transition · repeat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
