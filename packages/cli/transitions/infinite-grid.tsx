'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const ROWS = 8;
const COLS = 12;

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function InfiniteGrid({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cells = root.current!.querySelectorAll<HTMLElement>('.sf-grid-cell');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      tl.fromTo(cells, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: { each: 0.025, from: 'center', grid: [ROWS, COLS] }, ease: 'back.out(1.4)', duration: 0.50 }, 0.25);
      tl.fromTo(root.current!.querySelector('.sf-grid-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.50 }, 0.25);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-grid-first absolute inset-0">{first}</div>
        <div className="absolute inset-0">
          <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              return (
                <div key={i} className="sf-grid-cell flex origin-center items-center justify-center overflow-hidden" style={{ perspective: '600px', transform: 'scale(0)', opacity: 0 }}>
                  <div className="absolute" style={{ width: `${COLS * 100}%`, height: `${ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>{second}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
