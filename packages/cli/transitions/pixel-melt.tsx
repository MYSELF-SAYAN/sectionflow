'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

// ─── Timeline constants ────────────────────────────────────────────────────
// 0.00 – 0.25  safe viewing zone  (nothing moves, cover intact)
// 0.25 – 0.75  transition buildup (columns melt left→right)
// 0.75 – 1.00  section handoff    (second section arrives)

const COLS = 32;

function seeded(i: number): number {
  const x = Math.sin((i + 0.6) * 6173.9 + 2311.1) * 83221.7;
  return x - Math.floor(x);
}

/**
 * PixelMelt – the outgoing section melts downward column by column in a
 * staggered cascade. Each of the 32 columns slides off the bottom at a
 * slightly different speed and delay, simulating a pixel-drip effect.
 * A clean cover keeps the first section pristine until scroll begins.
 *
 * Timeline:
 *  0.00 – 0.25  first section fully visible, zero artifacts
 *  0.25 – 0.75  columns melt left-to-right, second section reveals beneath
 *  0.75 – 1.00  second section fully visible
 */
export function PixelMelt({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cols = root.current!.querySelectorAll<HTMLElement>('.sf-melt-col');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-melt-cover');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.25: cover snaps away, column grid takes over
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.25);

      // 0.25→0.55: second section fades in beneath the melting columns
      tl.fromTo(
        root.current!.querySelector('.sf-melt-second'),
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.30 },
        0.28,
      );

      // Columns melt in staggered left-to-right wave
      // Left column starts at 0.25, right column starts at 0.55 — all finish by 0.75
      cols.forEach((col, i) => {
        const normalised = i / (COLS - 1); // 0 (left) → 1 (right)
        const startT = 0.25 + normalised * 0.28; // 0.25 → 0.53
        const jitter = seeded(i) * 0.04;
        const dropDuration = 0.18 + seeded(i + 100) * 0.06;
        const dropY = 110 + seeded(i + 200) * 20; // % — off bottom

        tl.fromTo(col,
          { y: '0%', autoAlpha: 1 },
          { y: `${dropY}%`, autoAlpha: 0, ease: 'power2.in', duration: dropDuration },
          startT + jitter,
        );
      });

      // 0.75→1.00: ensure second section fully visible
      tl.fromTo(
        root.current!.querySelector('.sf-melt-second'),
        { autoAlpha: 0.7 },
        { autoAlpha: 1, ease: 'none', duration: 0.25 },
        0.75,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Second section — behind the melt grid */}
        <div className="sf-melt-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>

        {/* Column grid — each column carries a slice of first */}
        <div
          className="absolute inset-0"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {Array.from({ length: COLS }, (_, i) => (
            <div key={i} className="sf-melt-col relative overflow-hidden will-change-transform">
              {/* Full-width first section, offset so only this column's slice shows */}
              <div
                className="pointer-events-none absolute inset-y-0"
                style={{
                  width: `${COLS * 100}%`,
                  left: `${-i * 100}%`,
                }}
              >
                {first}
              </div>
            </div>
          ))}
        </div>

        {/* Clean cover — keeps first section pristine at rest */}
        <div className="sf-melt-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
