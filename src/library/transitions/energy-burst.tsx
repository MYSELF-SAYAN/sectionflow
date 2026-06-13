'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const RAY_COUNT = 24;
const RING_COUNT = 3;

function seeded(i: number): number {
  const x = Math.sin((i + 0.7) * 6271.9 + 2017.3) * 88007.1;
  return x - Math.floor(x);
}

/**
 * EnergyBurst – shockwave rings and rays erupt from viewport centre.
 * Dead zone: 0→0.30 — first section fully visible, all burst elements invisible.
 * Transition fires from 0.30→1.00.
 */
export function EnergyBurst({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rings = root.current!.querySelectorAll<HTMLElement>('.sf-burst-ring');
      const rays = root.current!.querySelectorAll<HTMLElement>('.sf-burst-ray');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      });

      // 0.30→0.40: flash
      tl.fromTo(root.current!.querySelector('.sf-burst-flash'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power4.in', duration: 0.10 }, 0.30);
      tl.fromTo(root.current!.querySelector('.sf-burst-flash'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power2.out', duration: 0.18 }, 0.40);

      // Rings expand 0.30→0.60
      rings.forEach((ring, i) => {
        tl.fromTo(ring, { scale: 0, autoAlpha: 1 }, { scale: 3.5 + i * 0.5, autoAlpha: 0, ease: 'power2.out', duration: 0.30 }, 0.30 + i * 0.03);
      });

      // Rays shoot 0.30→0.58
      rays.forEach((ray, i) => {
        tl.fromTo(ray, { scaleX: 0, autoAlpha: 0.8 }, { scaleX: 1, autoAlpha: 0, ease: 'power3.out', duration: 0.26 }, 0.30 + seeded(i) * 0.06);
      });

      // First fades 0.32→0.52
      tl.fromTo(root.current!.querySelector('.sf-burst-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power1.out', duration: 0.20 }, 0.32);

      // Second fades in 0.52→0.80
      tl.fromTo(root.current!.querySelector('.sf-burst-second'), { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.28 }, 0.52);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-burst-first absolute inset-0">{first}</div>
        <div className="sf-burst-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div className="sf-burst-flash pointer-events-none absolute inset-0 opacity-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(34,211,238,0.6) 40%, transparent 70%)' }} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: RING_COUNT }, (_, i) => (
            <div key={i} className="sf-burst-ring absolute rounded-full will-change-transform" style={{ width: `${8 + i * 4}vmin`, height: `${8 + i * 4}vmin`, border: `${2 - i * 0.3}px solid rgba(34,211,238,${0.9 - i * 0.2})`, boxShadow: `0 0 ${20 + i * 10}px rgba(34,211,238,${0.7 - i * 0.15})`, transform: 'scale(0)', opacity: 0 }} />
          ))}
          {Array.from({ length: RAY_COUNT }, (_, i) => {
            const angle = (i / RAY_COUNT) * 360;
            const length = 40 + seeded(i) * 20;
            const width = 1 + seeded(i + 100) * 2;
            return (
              <div key={i} className="sf-burst-ray absolute will-change-transform" style={{ width: `${length}vmin`, height: `${width}px`, transformOrigin: '0% 50%', transform: `rotate(${angle}deg) scaleX(0)`, background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(34,211,238,0.6) 40%, transparent 100%)', filter: 'blur(0.5px)', opacity: 0 }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
