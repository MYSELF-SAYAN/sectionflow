'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 48;
const RING_COUNT     = 4;

function seeded(i: number): number {
  const x = Math.sin((i + 1.1) * 5527.3 + 1009.7) * 79813.9;
  return x - Math.floor(x);
}

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function OrbitingParticles({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const particles = root.current!.querySelectorAll<HTMLElement>('.sf-orbit-p');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });

      tl.fromTo(root.current!.querySelector('.sf-orbit-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power1.in', duration: 0.22 }, 0.25);

      particles.forEach((p, i) => {
        const ring        = Math.floor(i / (PARTICLE_COUNT / RING_COUNT));
        const posInRing   = i % (PARTICLE_COUNT / RING_COUNT);
        const rParticles  = PARTICLE_COUNT / RING_COUNT;
        const angle       = (posInRing / rParticles) * Math.PI * 2;
        const orbitRadius = 120 + ring * 70;
        const sX          = Math.cos(angle) * orbitRadius;
        const sY          = Math.sin(angle) * orbitRadius;
        const rotDir      = ring % 2 === 0 ? 1 : -1;
        // Phase 1: spiral in — 0.25→0.50
        tl.fromTo(p, { x: sX, y: sY, rotation: 0, scale: 1, autoAlpha: seeded(i) * 0.5 + 0.5 }, { x: sX * 0.05, y: sY * 0.05, rotation: rotDir * 300, scale: 0.3, autoAlpha: 0.8, ease: 'power2.in', duration: 0.22 }, 0.25 + seeded(i + 50) * 0.04);
        // Phase 2: burst — 0.50→0.75
        const bAngle = angle + (seeded(i + 200) - 0.5) * 1.2;
        const bDist  = 250 + seeded(i + 300) * 350;
        tl.fromTo(p, { x: sX * 0.05, y: sY * 0.05, scale: 0.3, autoAlpha: 0.8 }, { x: Math.cos(bAngle) * bDist, y: Math.sin(bAngle) * bDist, scale: 0, autoAlpha: 0, ease: 'power3.out', duration: 0.24 }, 0.50 + seeded(i + 50) * 0.02);
      });

      tl.fromTo(root.current!.querySelector('.sf-orbit-second'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.25 }, 0.75);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-orbit-first absolute inset-0">{first}</div>
        <div className="sf-orbit-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
            const ring = Math.floor(i / (PARTICLE_COUNT / RING_COUNT));
            const pos  = i % (PARTICLE_COUNT / RING_COUNT);
            const rP   = PARTICLE_COUNT / RING_COUNT;
            const a    = (pos / rP) * Math.PI * 2;
            const r    = 120 + ring * 70;
            const size = 3 + seeded(i) * 5;
            const hue  = ring * 30 + 170;
            return <div key={i} className="sf-orbit-p absolute rounded-full will-change-transform" style={{ width: size, height: size, background: `hsl(${hue},90%,70%)`, boxShadow: `0 0 ${size*2}px hsl(${hue},90%,65%)`, transform: `translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px)`, opacity: 0 }} />;
          })}
        </div>
      </div>
    </div>
  );
}
