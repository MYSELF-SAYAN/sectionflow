import { Sparkles } from 'lucide-react';

export function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-teal-400/20 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-center gap-3 text-teal-300">
        <div className="rounded-full border border-teal-400/30 bg-teal-500/10 p-2">
          <Sparkles className="size-4" />
        </div>
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-teal-200/80">Coming soon</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}
