'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronRight, Search, Sparkles } from 'lucide-react';
import { transitions, type TransitionMeta } from '@/library/registry';
import Image from 'next/image';

const docsSections = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/installation', label: 'Installation' },
  { href: '/docs/cli', label: 'CLI Reference' },
  { href: '/docs/api', label: 'API Reference' },
  { href: '/docs/migration', label: 'Migration Guide' },
  { href: '/docs/templates', label: 'Templates' },
];

function isActive(pathname: string, href: string) {
  if (href === '/docs') {
    return pathname === '/docs';
  }
  return pathname.startsWith(href);
}

function SidebarItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${active ? 'bg-teal-500/15 text-white shadow-[inset_0_0_0_1px_rgba(45,212,191,0.2)]' : 'text-white/65 hover:bg-white/5 hover:text-white'
        }`}
    >
      <span>{label}</span>
      {active ? <ArrowRight className="size-3.5" /> : null}
    </Link>
  );
}

export function DocsSidebar({
  featuredTransitions,
  groupedTransitions,
}: {
  featuredTransitions: TransitionMeta[];
  groupedTransitions: { group: string; transitions: TransitionMeta[] }[];
}) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Featured: true,
    'All Transitions': true,
  });

  const filteredTransitions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    return transitions.filter((item) => {
      const haystack = `${item.name} ${item.description} ${item.tags?.join(' ') ?? ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search]);

  const currentTransition = pathname.startsWith('/docs/transitions/')
    ? transitions.find((item) => item.slug === pathname.split('/').pop())
    : undefined;

  return (
    <aside className="w-full shrink-0 border-b border-teal-400/15 bg-slate-950/85 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-[320px] lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex items-center justify-between rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-2">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">
          <Image src="/favicon.png" alt="Logo" width={24} height={24} />
          SectionFlow Docs
        </Link>

      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-3">
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/60">
          <Search className="size-4" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transitions"
            className="w-full bg-transparent outline-none placeholder:text-white/30"
          />
        </label>
        {search ? (
          <div className="mt-3 space-y-2">
            {filteredTransitions.length > 0 ? filteredTransitions.map((item) => (
              <Link key={item.slug} href={`/docs/transitions/${item.slug}`} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                <span>{item.name}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">{item.category}</span>
              </Link>
            )) : <p className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/60">No matches yet.</p>}
          </div>
        ) : null}
      </div>
      <div className='lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto'>
        <div className="mt-6 space-y-2">
          {docsSections.map((section) => (
            <SidebarItem key={section.href} href={section.href} label={section.label} active={isActive(pathname, section.href)} />
          ))}
        </div>

        <div className="mt-8  lg:pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.16) transparent' }}>
          <div>
            <button
              type="button"
              onClick={() => setOpenSections((prev) => ({ ...prev, Featured: !prev.Featured }))}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white/85"
            >
              <span>Featured</span>
              {openSections.Featured ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
            {openSections.Featured ? (
              <div className="mt-3 space-y-2">
                {featuredTransitions.map((item) => (
                  <Link key={item.slug} href={`/docs/transitions/${item.slug}`} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${pathname === `/docs/transitions/${item.slug}` ? 'bg-teal-500/15 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}>
                    <span>{item.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">{item.engine === 'gsap' ? 'GSAP' : 'Motion'}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setOpenSections((prev) => ({ ...prev, 'All Transitions': !prev['All Transitions'] }))}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-3 py-3 text-left text-sm font-semibold text-white/85"
            >
              <span>All Transitions</span>
              {openSections['All Transitions'] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
            {openSections['All Transitions'] ? (
              <div className="mt-3 space-y-3">
                {groupedTransitions.map((section) => (
                  <div key={section.group}>
                    <button
                      type="button"
                      onClick={() => setOpenSections((prev) => ({ ...prev, [`group:${section.group}`]: !prev[`group:${section.group}`] }))}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-white/80"
                    >
                      <span>{section.group}</span>
                      {openSections[`group:${section.group}`] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </button>
                    {openSections[`group:${section.group}`] ? (
                      <div className="mt-2 space-y-2 pl-2">
                        {section.transitions.map((item) => (
                          <Link key={item.slug} href={`/docs/transitions/${item.slug}`} className={`block rounded-xl px-3 py-2 text-sm transition ${pathname === `/docs/transitions/${item.slug}` ? 'bg-teal-500/15 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}>
                            <div className="flex items-center justify-between gap-2">
                              <span>{item.name}</span>
                              <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">{item.status === 'planned' ? 'Soon' : item.engine === 'gsap' ? 'GSAP' : 'Motion'}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>


      {currentTransition ? (
        <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-500/10 p-3 text-sm text-teal-100">
          <div className="font-semibold">Current transition</div>
          <div className="mt-1 text-teal-100/80">{currentTransition.name}</div>
        </div>
      ) : null}
    </aside>
  );
}
