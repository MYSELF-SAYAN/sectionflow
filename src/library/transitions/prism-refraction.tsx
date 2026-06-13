'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const SPECTRUM_BANDS = 7;
const SPECTRUM = [
  'rgba(255,60,60,0.72)', 'rgba(255,165,0,0.72)', 'rgba(255,230,0,0.72)',
  'rgba(60,200,60,0.72)', 'rgba(0,180,255,0.72)', 'rgba(70,80,220,0.72)', 'rgba(148,0,211,0.72)',
];

/**
 * PrismRefraction – white beam splits into spectral bands across the viewport.
 * Dead zone: 0→0.30 — first section fully visible, prism elements invisible.
 * Transition fires from 0.30→1.00.
 */
export function PrismRefraction({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bands = root.current!.querySelectorAll<HTMLElement>('.sf-prism-band');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.54: first fades out
      tl.fromTo(root.current!.querySelector('.sf-prism-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.24 }, 0.30);

      // 0.30→0.44: source beam appears
      tl.fromTo(root.current!.querySelector('.sf-prism-beam'), { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.14 }, 0.30);

      // 0.30→0.60: spectral bands fan out sequentially
      bands.forEach((band, i) => {
        const angle = -30 + i * (60 / (SPECTRUM_BANDS - 1));
        tl.fromTo(band, { scaleX: 0, rotation: 0, autoAlpha: 0 }, { scaleX: 1, rotation: angle, autoAlpha: 0.85, ease: 'power2.out', duration: 0.22 }, 0.30 + i * 0.025);
      });

      // 0.48→0.76: second section sweeps in
      tl.fromTo(root.current!.querySelector('.sf-prism-second'), { autoAlpha: 0, x: '5%' }, { autoAlpha: 1, x: '0%', ease: 'power2.out', duration: 0.28 }, 0.48);

      // 0.72→0.92: bands dissolve
      tl.to([root.current!.querySelector('.sf-prism-beam'), ...Array.from(bands)], { autoAlpha: 0, ease: 'power1.in', duration: 0.20 }, 0.72);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-prism-first absolute inset-0">{first}</div>
        <div className="sf-prism-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div className="sf-prism-beam pointer-events-none absolute left-1/2 top-0 will-change-transform" style={{ width: '4px', height: '50vh', marginLeft: '-2px', transformOrigin: 'top center', background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)', boxShadow: '0 0 12px 4px rgba(255,255,255,0.6)', transform: 'scaleX(0)', opacity: 0 }} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          {Array.from({ length: SPECTRUM_BANDS }, (_, i) => (
            <div key={i} className="sf-prism-band absolute will-change-transform" style={{ width: '200vw', height: `${80 / SPECTRUM_BANDS}vh`, background: `linear-gradient(90deg, transparent 0%, ${SPECTRUM[i]} 30%, ${SPECTRUM[i]} 70%, transparent 100%)`, transformOrigin: 'left center', transform: 'scaleX(0)', opacity: 0, mixBlendMode: 'screen', filter: 'blur(6px)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
