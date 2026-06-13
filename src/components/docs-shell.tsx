import type { ReactNode } from 'react';
import { DocsSidebar } from '@/components/docs-sidebar';
import { getFeaturedTransitions, getGroupedTransitions } from '@/lib/transition-docs';

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),linear-gradient(135deg,#030711_0%,#07111d_50%,#020617_100%)] text-zinc-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DocsSidebar featuredTransitions={getFeaturedTransitions()} groupedTransitions={getGroupedTransitions()} />

        <main className="min-w-0 flex-1 bg-[linear-gradient(135deg,rgba(45,212,191,0.08),transparent_45%)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
