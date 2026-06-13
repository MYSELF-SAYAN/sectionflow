'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const DUST_COLS = 20;
const DUST_ROWS = 14;
const TOTAL = DUST_COLS * DUST_ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 0.9) * 4133.7 + 1597.3) * 46327.9;
  return x - Math.floor(x);
}

/**
 * DustSimulation – fine dust blows the outgoing section away.
 * Dead zone: 0→0.30 — first section fully intact, grid hidden under cover.
 * Transition fires from 0.30→1.00.
 */
export function DustSimulation({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const particles = root.current!.querySelectorAll<HTMLElement>('.sf-dust-p');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-dust-cover');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30: cover hides, dust grid takes over
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.30);

      // Each dust particle blows away — left columns go first
      particles.forEach((p, i) => {
        const col = i % DUST_COLS;
        // Remap delay into active window: leftmost col starts at 0.30, rightmost at 0.62
        const windDelay = 0.30 + (col / DUST_COLS) * 0.32 + seeded(i) * 0.08;
        const windX = 300 + seeded(i + 100) * 500;
        const windY = -(40 + seeded(i + 200) * 120);
        const turbX = (seeded(i + 300) - 0.5) * 80;
        const turbY = (seeded(i + 400) - 0.5) * 60;
        const rot = (seeded(i + 500) - 0.5) * 120;

        tl.fromTo(
          p,
          { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 },
          { x: windX + turbX, y: windY + turbY, rotation: rot, scale: 0.15 + seeded(i + 600) * 0.3, autoAlpha: 0, ease: 'power1.in', duration: 0.38 + seeded(i + 700) * 0.20 },
          windDelay,
        );
      });

      // Second section appears after dust has largely cleared
      tl.fromTo(
        root.current!.querySelector('.sf-dust-second'),
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.24 },
        0.64,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dust grid — under the cover */}
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: `repeat(${DUST_COLS}, 1fr)`, gridTemplateRows: `repeat(${DUST_ROWS}, 1fr)` }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % DUST_COLS;
            const row = Math.floor(i / DUST_COLS);
            return (
              <div key={i} className="sf-dust-p relative overflow-hidden will-change-transform">
                <div className="pointer-events-none absolute" style={{ width: `${DUST_COLS * 100}%`, height: `${DUST_ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>
                  {first}
                </div>
              </div>
            );
          })}
        </div>
        {/* Incoming section — rendered on top of grid, hidden until dust clears */}
        <div className="sf-dust-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
        {/* Clean cover — hides tile gaps until transition begins at 0.30 */}
        <div className="sf-dust-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
