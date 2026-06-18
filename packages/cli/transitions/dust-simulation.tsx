'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const DUST_COLS = 20;
const DUST_ROWS = 14;
const TOTAL     = DUST_COLS * DUST_ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 0.9) * 4133.7 + 1597.3) * 46327.9;
  return x - Math.floor(x);
}

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function DustSimulation({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const particles = root.current!.querySelectorAll<HTMLElement>('.sf-dust-p');
      const coverEl   = root.current!.querySelector<HTMLElement>('.sf-dust-cover');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.25);
      particles.forEach((p, i) => {
        const col       = i % DUST_COLS;
        // left cols blow first; remap delay into 0.25→0.55
        const windDelay = 0.25 + (col / DUST_COLS) * 0.28 + seeded(i) * 0.06;
        const windX     = 300 + seeded(i + 100) * 500;
        const windY     = -(40 + seeded(i + 200) * 120);
        const turbX     = (seeded(i + 300) - 0.5) * 80;
        const turbY     = (seeded(i + 400) - 0.5) * 60;
        const rot       = (seeded(i + 500) - 0.5) * 120;
        tl.fromTo(p, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 }, { x: windX + turbX, y: windY + turbY, rotation: rot, scale: 0.15 + seeded(i + 600) * 0.3, autoAlpha: 0, ease: 'power1.in', duration: 0.30 + seeded(i + 700) * 0.16 }, windDelay);
      });
      // second reveals after dust mostly gone
      tl.fromTo(root.current!.querySelector('.sf-dust-second'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.22 }, 0.55);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: `repeat(${DUST_COLS}, 1fr)`, gridTemplateRows: `repeat(${DUST_ROWS}, 1fr)` }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % DUST_COLS;
            const row = Math.floor(i / DUST_COLS);
            return (
              <div key={i} className="sf-dust-p relative overflow-hidden will-change-transform">
                <div className="pointer-events-none absolute" style={{ width: `${DUST_COLS * 100}%`, height: `${DUST_ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>{first}</div>
              </div>
            );
          })}
        </div>
        <div className="sf-dust-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
        <div className="sf-dust-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
