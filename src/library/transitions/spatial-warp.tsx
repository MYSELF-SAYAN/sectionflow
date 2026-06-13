'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const WARP_STRIPS = 20;

/**
 * SpatialWarp – horizontal strips skew and stretch in a gravitational-lens wave.
 * Dead zone: 0→0.30 — first section fully visible via clean cover.
 * Transition fires from 0.30→1.00.
 */
export function SpatialWarp({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const strips = root.current!.querySelectorAll<HTMLElement>('.sf-warp-strip');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-warp-cover');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // 0.30: cover hides, warp strips take over
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.30);

      // Each strip warps in wave — remapped to [0.30, 0.82]
      strips.forEach((strip, i) => {
        const center = WARP_STRIPS / 2;
        const distFromCenter = Math.abs(i - center) / center;
        const skewMag = 18 * (1 - distFromCenter);
        const scaleMag = 1 + 0.6 * (1 - distFromCenter);
        const delay = 0.30 + distFromCenter * 0.16;

        tl.fromTo(strip, { scaleX: 1, skewY: 0 }, { scaleX: scaleMag, skewY: skewMag, ease: 'power2.inOut', duration: 0.26 }, delay);
        tl.fromTo(strip, { scaleX: scaleMag, skewY: skewMag }, { scaleX: 1, skewY: 0, ease: 'power2.out', duration: 0.22 }, delay + 0.26);
      });

      // Fade sections at peak warp
      tl.fromTo(root.current!.querySelector('.sf-warp-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.18 }, 0.42);
      tl.fromTo(root.current!.querySelector('.sf-warp-second'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.22 }, 0.54);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-warp-first absolute inset-0">{first}</div>
        <div className="sf-warp-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        {/* Warp strip overlay — sits under the cover */}
        <div className="pointer-events-none absolute inset-0 flex flex-col overflow-hidden">
          {Array.from({ length: WARP_STRIPS }, (_, i) => (
            <div key={i} className="sf-warp-strip relative flex-1 overflow-hidden will-change-transform">
              <div className="pointer-events-none absolute" style={{ width: '100%', height: `${WARP_STRIPS * 100}%`, top: `${-i * 100}%` }}>
                {first}
              </div>
              {i % 3 === 0 && (
                <div className="absolute inset-0" style={{ background: i < WARP_STRIPS / 2 ? 'linear-gradient(180deg, rgba(34,211,238,0.08) 0%, transparent 50%)' : 'linear-gradient(180deg, transparent 50%, rgba(244,114,182,0.08) 100%)' }} />
              )}
            </div>
          ))}
        </div>
        {/* Clean cover — hides strips until transition begins */}
        <div className="sf-warp-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
