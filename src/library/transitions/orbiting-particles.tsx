'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 48;
const RING_COUNT = 4;

function seeded(i: number): number {
  const x = Math.sin((i + 1.1) * 5527.3 + 1009.7) * 79813.9;
  return x - Math.floor(x);
}

/**
 * OrbitingParticles – rings of particles spiral inward then explode outward.
 * Dead zone: 0→0.30 — first section fully visible, particles invisible.
 * Transition fires from 0.30→1.00.
 */
export function OrbitingParticles({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const particles = root.current!.querySelectorAll<HTMLElement>('.sf-orbit-p');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.56: first fades out
      tl.fromTo(root.current!.querySelector('.sf-orbit-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power1.in', duration: 0.26 }, 0.30);

      particles.forEach((p, i) => {
        const ring = Math.floor(i / (PARTICLE_COUNT / RING_COUNT));
        const posInRing = i % (PARTICLE_COUNT / RING_COUNT);
        const ringParticles = PARTICLE_COUNT / RING_COUNT;
        const angle = (posInRing / ringParticles) * Math.PI * 2;
        const orbitRadius = 120 + ring * 70;
        const startX = Math.cos(angle) * orbitRadius;
        const startY = Math.sin(angle) * orbitRadius;
        const rotDir = ring % 2 === 0 ? 1 : -1;

        // Phase 1: spiral in — 0.30 → 0.60
        tl.fromTo(p,
          { x: startX, y: startY, rotation: 0, scale: 1, autoAlpha: seeded(i) * 0.5 + 0.5 },
          { x: startX * 0.05, y: startY * 0.05, rotation: rotDir * 300, scale: 0.3, autoAlpha: 0.8, ease: 'power2.in', duration: 0.28 },
          0.30 + seeded(i + 50) * 0.05,
        );

        // Phase 2: burst out — 0.60 → 1.00
        const burstAngle = angle + (seeded(i + 200) - 0.5) * 1.2;
        const burstDist = 250 + seeded(i + 300) * 350;
        tl.fromTo(p,
          { x: startX * 0.05, y: startY * 0.05, scale: 0.3, autoAlpha: 0.8 },
          { x: Math.cos(burstAngle) * burstDist, y: Math.sin(burstAngle) * burstDist, scale: 0, autoAlpha: 0, ease: 'power3.out', duration: 0.36 },
          0.60 + seeded(i + 50) * 0.03,
        );
      });

      // 0.68→1.00: second section in
      tl.fromTo(root.current!.querySelector('.sf-orbit-second'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.32 }, 0.68);
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
            const posInRing = i % (PARTICLE_COUNT / RING_COUNT);
            const ringParticles = PARTICLE_COUNT / RING_COUNT;
            const angle = (posInRing / ringParticles) * Math.PI * 2;
            const orbitRadius = 120 + ring * 70;
            const size = 3 + seeded(i) * 5;
            const hue = ring * 30 + 170;
            return (
              <div key={i} className="sf-orbit-p absolute rounded-full will-change-transform" style={{ width: size, height: size, background: `hsl(${hue}, 90%, 70%)`, boxShadow: `0 0 ${size * 2}px hsl(${hue}, 90%, 65%)`, transform: `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px)`, opacity: 0 }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
