'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 80;

function seeded(i: number): number {
  const x = Math.sin((i + 0.3) * 8221.7 + 3331.1) * 61843.9;
  return x - Math.floor(x);
}

/**
 * InteractiveParticles – particles converge, pulse, then burst outward.
 * Dead zone: 0→0.30 — first section fully visible, particles invisible.
 * Transition fires from 0.30→1.00.
 */
export function InteractiveParticles({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const particles = root.current!.querySelectorAll<HTMLElement>('.sf-ip-particle');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.50: first fades
      tl.fromTo(root.current!.querySelector('.sf-ip-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.20 }, 0.30);

      particles.forEach((p, i) => {
        const startAngle = seeded(i) * Math.PI * 2;
        const startDist = 250 + seeded(i + 100) * 300;
        const fromX = Math.cos(startAngle) * startDist;
        const fromY = Math.sin(startAngle) * startDist;

        // Formation position
        const ring = Math.floor(i / 20);
        const posInRing = i % 20;
        const formAngle = (posInRing / 20) * Math.PI * 2 + ring * 0.4;
        const formRadius = 40 + ring * 55;
        const toX = Math.cos(formAngle) * formRadius;
        const toY = Math.sin(formAngle) * formRadius;

        // Phase 1: converge — 0.30→0.56
        tl.fromTo(p, { x: fromX, y: fromY, scale: 0.2, autoAlpha: 0 }, { x: toX, y: toY, scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.24 }, 0.30 + seeded(i + 200) * 0.07);

        // Phase 2: pulse — 0.56→0.64
        tl.to(p, { x: toX + (seeded(i + 300) - 0.5) * 20, y: toY + (seeded(i + 400) - 0.5) * 20, ease: 'sine.inOut', duration: 0.08 }, 0.56 + seeded(i + 500) * 0.06);

        // Phase 3: burst out — 0.64→1.00
        const burstAngle = formAngle + (seeded(i + 600) - 0.5) * 1.5;
        const burstDist = 300 + seeded(i + 700) * 400;
        tl.fromTo(p, { x: toX, y: toY, autoAlpha: 1, scale: 1 }, { x: Math.cos(burstAngle) * burstDist, y: Math.sin(burstAngle) * burstDist, autoAlpha: 0, scale: 0, ease: 'power3.in', duration: 0.36 }, 0.64);
      });

      // 0.72→1.00: second in
      tl.fromTo(root.current!.querySelector('.sf-ip-second'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.28 }, 0.72);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-ip-first absolute inset-0">{first}</div>
        <div className="sf-ip-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            const ring = Math.floor(i / 20);
            const posInRing = i % 20;
            const formAngle = (posInRing / 20) * Math.PI * 2 + ring * 0.4;
            const formRadius = 40 + ring * 55;
            const startX = Math.cos(formAngle) * formRadius;
            const startY = Math.sin(formAngle) * formRadius;
            const size = 3 + seeded(i) * 5;
            const hue = 185 + seeded(i + 800) * 80;
            return (
              <div key={i} className="sf-ip-particle absolute rounded-full will-change-transform" style={{ width: size, height: size, background: `radial-gradient(circle, hsl(${hue}, 90%, 75%) 0%, hsl(${hue}, 80%, 55%) 100%)`, boxShadow: `0 0 ${size * 2.5}px hsl(${hue}, 90%, 65%)`, transform: `translate(${startX}px, ${startY}px)`, opacity: 0 }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
