import type { ReactNode } from 'react';

const variants = {
  light: 'bg-[#fbfaf7] text-[#191919]',
  dark: 'bg-[#0e0e11] text-[#fbfaf7]',
  accent:
    'bg-gradient-to-br from-violet-700 via-fuchsia-700 to-rose-600 text-white',
  teal: 'bg-gradient-to-br from-slate-950 via-teal-900 to-emerald-800 text-white',
} as const;

export function DemoSection({
  variant = 'dark',
  eyebrow,
  title,
  body,
  children,
}: {
  variant?: keyof typeof variants;
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={`flex h-full min-h-screen w-full flex-col items-center justify-center px-6 text-center ${variants[variant]}`}
    >
      {eyebrow && (
        <span className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.25em] opacity-50">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tighter sm:text-7xl">
        {title}
      </h2>
      {body && (
        <p className="mt-8 max-w-xl text-lg leading-relaxed opacity-70">{body}</p>
      )}
      {children}
    </section>
  );
}
