'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const SHARDS: { clip: string; cx: number; cy: number }[] = [
  { clip: 'polygon(0% 0%, 22% 0%, 14% 18%, 0% 12%)', cx: 9, cy: 8 },
  { clip: 'polygon(22% 0%, 48% 0%, 38% 22%, 14% 18%)', cx: 31, cy: 10 },
  { clip: 'polygon(48% 0%, 72% 0%, 68% 20%, 38% 22%)', cx: 57, cy: 10 },
  { clip: 'polygon(72% 0%, 100% 0%, 100% 15%, 68% 20%)', cx: 85, cy: 9 },
  { clip: 'polygon(0% 12%, 14% 18%, 8% 38%, 0% 32%)', cx: 6, cy: 25 },
  { clip: 'polygon(14% 18%, 38% 22%, 32% 42%, 8% 38%)', cx: 23, cy: 30 },
  { clip: 'polygon(38% 22%, 68% 20%, 62% 44%, 32% 42%)', cx: 50, cy: 32 },
  { clip: 'polygon(68% 20%, 100% 15%, 100% 38%, 62% 44%)', cx: 82, cy: 29 },
  { clip: 'polygon(0% 32%, 8% 38%, 4% 58%, 0% 52%)', cx: 4, cy: 45 },
  { clip: 'polygon(8% 38%, 32% 42%, 28% 62%, 4% 58%)', cx: 18, cy: 50 },
  { clip: 'polygon(32% 42%, 62% 44%, 55% 65%, 28% 62%)', cx: 44, cy: 53 },
  { clip: 'polygon(62% 44%, 100% 38%, 100% 62%, 55% 65%)', cx: 79, cy: 52 },
  { clip: 'polygon(0% 52%, 4% 58%, 2% 78%, 0% 72%)', cx: 2, cy: 65 },
  { clip: 'polygon(4% 58%, 28% 62%, 24% 80%, 2% 78%)', cx: 15, cy: 70 },
  { clip: 'polygon(28% 62%, 55% 65%, 50% 84%, 24% 80%)', cx: 39, cy: 73 },
  { clip: 'polygon(55% 65%, 100% 62%, 100% 82%, 50% 84%)', cx: 76, cy: 73 },
  { clip: 'polygon(0% 72%, 2% 78%, 0% 100%)', cx: 1, cy: 83 },
  { clip: 'polygon(2% 78%, 24% 80%, 18% 100%, 0% 100%)', cx: 11, cy: 90 },
  { clip: 'polygon(24% 80%, 50% 84%, 44% 100%, 18% 100%)', cx: 34, cy: 91 },
  { clip: 'polygon(50% 84%, 100% 82%, 100% 100%, 44% 100%)', cx: 72, cy: 91 },
];

// Deterministic trajectories — no Math.random() at render time
const TRAJECTORIES = SHARDS.map((s, i) => {
  const angle = Math.atan2(s.cy - 50, s.cx - 50);
  const r = Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453;
  const rand = r - Math.floor(r);
  return { tx: Math.cos(angle) * (150 + rand * 200), ty: Math.sin(angle) * (150 + rand * 200), rot: (rand - 0.5) * 160 };
});

/**
 * Shatter – the outgoing section fractures into shards on scroll.
 * Dead zone: 0→0.30 — first section fully intact via clean cover layer.
 * Transition fires from 0.30→1.00.
 */
export function Shatter({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const shards = root.current!.querySelectorAll<HTMLElement>('.sf-shard');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-shatter-cover');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // 0→0.30: dead zone — cover keeps first section intact, nothing moves
      // 0.30: cover hides instantly, shards take over
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.30);
      // Second section fades in behind shards
      tl.fromTo(
        root.current!.querySelector('.sf-shatter-second'),
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.20 },
        0.36,
      );
      // Shards explode — compressed into 0.30→1.00 window
      shards.forEach((shard, i) => {
        const { tx, ty, rot } = TRAJECTORIES[i];
        const delay = 0.30 + (i / shards.length) * 0.32;
        tl.fromTo(
          shard,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
          { x: tx, y: ty, rotation: rot, scale: 0.4, opacity: 0, ease: 'power2.in', duration: 0.56 },
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
        <div className="sf-shatter-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
        {/* Shards — sit under the cover */}
        {SHARDS.map((s, i) => (
          <div key={i} className="sf-shard absolute inset-0 will-change-transform" style={{ clipPath: s.clip }} data-cx={s.cx} data-cy={s.cy}>
            <div className="absolute inset-0">{first}</div>
            <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(${45 + i * 17}deg, transparent 40%, rgba(255,255,255,${0.04 + (i % 3) * 0.03}) 50%, transparent 60%)` }} />
          </div>
        ))}
        {/* Clean cover — hides shard seams until transition begins */}
        <div className="sf-shatter-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
