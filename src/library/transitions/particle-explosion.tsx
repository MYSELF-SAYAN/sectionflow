'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const COLS = 16;
const ROWS = 11;
const TOTAL = COLS * ROWS;

// Deterministic trajectories
const TRAJECTORIES = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const cx = (col + 0.5) / COLS;
  const cy = (row + 0.5) / ROWS;
  const angle = Math.atan2(cy - 0.5, cx - 0.5);
  const dist = 300 + Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2) * 500;
  const r = Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453;
  const rand = r - Math.floor(r);
  return {
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist,
    rot: (rand - 0.5) * 180,
    centerDist: Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2),
  };
});

/**
 * ParticleExplosion – outgoing section tile-grid explodes radially on scroll.
 * Dead zone: 0→0.30 — first section fully intact via clean cover layer.
 * Transition fires from 0.30→1.00.
 */
export function ParticleExplosion({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = root.current!.querySelectorAll<HTMLElement>('.sf-explode-tile');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-explode-cover');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30: cover hides, tile grid takes over
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.30);
      // Second section fades in behind tiles
      tl.fromTo(
        root.current!.querySelector('.sf-explode-second'),
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.28 },
        0.46,
      );
      // Tiles explode — compressed into 0.30→1.00
      tiles.forEach((tile, i) => {
        const { tx, ty, rot, centerDist } = TRAJECTORIES[i];
        const delay = 0.30 + centerDist * 0.28;
        tl.fromTo(
          tile,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
          { x: tx, y: ty, rotation: rot, scale: 0.2, opacity: 0, ease: 'power3.in', duration: 0.52 },
          delay,
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Incoming section — behind everything */}
        <div className="sf-explode-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
        {/* Tile grid — under the cover */}
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: '1px' }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <div key={i} className="sf-explode-tile relative overflow-hidden will-change-transform" style={{ borderRadius: '1px' }}>
                <div className="pointer-events-none absolute" style={{ width: `${COLS * 100}%`, height: `${ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>
                  {first}
                </div>
              </div>
            );
          })}
        </div>
        {/* Clean cover — hides tile gaps until transition begins */}
        <div className="sf-explode-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
