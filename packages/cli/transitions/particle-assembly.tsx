'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const COLS  = 16;
const ROWS  = 11;
const TOTAL = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 2.3) * 7919.1 + 3571.7) * 99991.3;
  return x - Math.floor(x);
}

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function ParticleAssembly({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = root.current!.querySelectorAll<HTMLElement>('.sf-assemble-tile');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
      // 0.25→0.42: fade out first
      tl.fromTo(root.current!.querySelector('.sf-assemble-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.17 }, 0.25);
      // Tiles assemble centre-first, compressed into 0.25→0.75
      tiles.forEach((tile, i) => {
        const col  = i % COLS;
        const row  = Math.floor(i / COLS);
        const cx   = (col + 0.5) / COLS;
        const cy   = (row + 0.5) / ROWS;
        const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2);
        const angle  = seeded(i) * Math.PI * 2;
        const d      = 300 + seeded(i + 100) * 400;
        const fromX  = Math.cos(angle) * d;
        const fromY  = Math.sin(angle) * d;
        const fromRot = (seeded(i + 200) - 0.5) * 240;
        const delay  = 0.25 + dist * 0.28;
        tl.fromTo(tile, { x: fromX, y: fromY, rotation: fromRot, scale: 0.1, opacity: 0 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'back.out(1.2)', duration: 0.42 }, delay);
      });
      // 0.88: clean cover fades in to hide tile gaps
      tl.fromTo(root.current!.querySelector('.sf-assemble-cover'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.80);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-assemble-first absolute inset-0">{first}</div>
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: '1px' }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const col  = i % COLS;
            const row  = Math.floor(i / COLS);
            const fromX = (seeded(i) - 0.5) * 2 * 300;
            const fromY = (seeded(i + 100) - 0.5) * 2 * 300;
            return (
              <div key={i} className="sf-assemble-tile relative overflow-hidden will-change-transform" style={{ opacity: 0, transform: `translate(${fromX}px,${fromY}px) scale(0.1)` }}>
                <div className="pointer-events-none absolute" style={{ width: `${COLS * 100}%`, height: `${ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>{second}</div>
              </div>
            );
          })}
        </div>
        <div className="sf-assemble-cover absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
      </div>
    </div>
  );
}
