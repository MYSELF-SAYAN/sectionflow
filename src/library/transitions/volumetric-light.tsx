'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const GOD_RAY_COUNT = 14;

function seeded(i: number): number {
  const x = Math.sin((i + 1.4) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

/**
 * VolumetricLight – sweeping god-rays bleach the outgoing section, new one materialises.
 * Dead zone: 0→0.30 — first section fully visible, rays and halo invisible.
 * Transition fires from 0.30→1.00.
 */
export function VolumetricLight({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rays = root.current!.querySelectorAll<HTMLElement>('.sf-vl-ray');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.56: rays descend
      rays.forEach((ray, i) => {
        tl.fromTo(ray, { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: seeded(i) * 0.4 + 0.3, ease: 'power2.out', duration: 0.26 }, 0.30 + seeded(i) * 0.08);
      });

      // 0.30→0.44: halo grows
      tl.fromTo(root.current!.querySelector('.sf-vl-halo'), { scale: 0.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.22 }, 0.30);

      // 0.36→0.56: first bleaches then fades
      tl.fromTo(root.current!.querySelector('.sf-vl-first'), { autoAlpha: 1, filter: 'brightness(1)' }, { autoAlpha: 0.2, filter: 'brightness(3)', ease: 'power2.in', duration: 0.20 }, 0.36);
      tl.to(root.current!.querySelector('.sf-vl-first'), { autoAlpha: 0, filter: 'brightness(1)', ease: 'none', duration: 0.08 }, 0.56);

      // 0.56→0.80: second materialises from light
      tl.fromTo(root.current!.querySelector('.sf-vl-second'), { autoAlpha: 0, filter: 'brightness(3)' }, { autoAlpha: 1, filter: 'brightness(1)', ease: 'power2.out', duration: 0.24 }, 0.56);

      // 0.76→1.00: rays and halo recede
      tl.to([root.current!.querySelector('.sf-vl-halo'), ...Array.from(rays)], { autoAlpha: 0, scaleY: 0.5, ease: 'power2.in', duration: 0.22, stagger: 0.008 }, 0.76);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-vl-first absolute inset-0">{first}</div>
        <div className="sf-vl-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div className="sf-vl-halo pointer-events-none absolute left-1/2 top-[-10vh] -translate-x-1/2 will-change-transform" style={{ width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(200,220,255,0.3) 25%, rgba(120,180,255,0.1) 50%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(0.1)', opacity: 0 }} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: GOD_RAY_COUNT }, (_, i) => {
            const xPos = (i / (GOD_RAY_COUNT - 1)) * 100;
            const angle = -25 + (i / (GOD_RAY_COUNT - 1)) * 50;
            const width = 4 + seeded(i) * 8;
            return (
              <div key={i} className="sf-vl-ray absolute will-change-transform" style={{ left: `${xPos}%`, top: 0, width: `${width}px`, height: '130vh', transformOrigin: 'top center', transform: `rotate(${angle}deg) scaleY(0)`, background: `linear-gradient(180deg, rgba(200,220,255,${0.4 + seeded(i) * 0.3}) 0%, rgba(150,180,255,${0.1 + seeded(i + 100) * 0.1}) 60%, transparent 100%)`, filter: `blur(${2 + seeded(i + 200) * 4}px)`, opacity: 0 }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
