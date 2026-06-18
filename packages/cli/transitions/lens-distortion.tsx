'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const RING_SLICES = 12;

/**
 * LensDistortion – a barrel-lens grows from centre, refracts, then fills the screen.
 * Dead zone: 0→0.30 — first section fully visible, lens invisible (scale 0.04).
 * Transition fires from 0.30→1.00.
 */
export function LensDistortion({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rings = root.current!.querySelectorAll<HTMLElement>('.sf-lens-ring');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.58: lens grows from tiny point
      tl.fromTo(lensRef.current, { scale: 0.04, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.28 }, 0.30);

      // Ring distortion wave — 0.36→0.64
      rings.forEach((ring, i) => {
        const wobble = 1 + (i / RING_SLICES) * 0.3;
        tl.fromTo(ring, { scaleX: 1, scaleY: 1 }, { scaleX: wobble, scaleY: 1 / wobble, ease: 'sine.inOut', duration: 0.18 }, 0.36 + i * 0.014);
        tl.to(ring, { scaleX: 1, scaleY: 1, ease: 'sine.inOut', duration: 0.14 }, 0.54 + i * 0.014);
      });

      // First fades 0.32→0.58
      tl.fromTo(root.current!.querySelector('.sf-lens-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.26 }, 0.32);

      // 0.62→0.84: lens inflates to fill screen
      tl.fromTo(lensRef.current, { scale: 1 }, { scale: 4, autoAlpha: 0, ease: 'power3.in', duration: 0.22 }, 0.62);

      // 0.72→1.00: second section appears
      tl.fromTo(root.current!.querySelector('.sf-lens-second'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.28 }, 0.72);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-lens-first absolute inset-0">{first}</div>
        <div className="sf-lens-second absolute inset-0 opacity-0" style={{ visibility: 'hidden' }}>{second}</div>
        <div ref={lensRef} className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform" style={{ width: '60vmin', height: '60vmin', marginLeft: '-30vmin', marginTop: '-30vmin', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 2px rgba(255,255,255,0.12), 0 0 80px rgba(34,211,238,0.2), 0 30px 80px rgba(0,0,0,0.6)', transform: 'scale(0.04)', opacity: 0 }}>
          {Array.from({ length: RING_SLICES }, (_, i) => {
            const pct = (i / RING_SLICES) * 100;
            const blur = (1 - i / RING_SLICES) * 4;
            const brightness = 0.7 + (i / RING_SLICES) * 0.6;
            return (
              <div key={i} className="sf-lens-ring absolute inset-0 rounded-full will-change-transform" style={{ clipPath: `circle(${50 - pct / 2.2}% at 50% 50%)`, filter: `blur(${blur}px) brightness(${brightness})`, overflow: 'hidden' }}>
                <div className="absolute inset-[-50%] overflow-hidden"><div className="absolute inset-0 scale-150">{first}</div></div>
              </div>
            );
          })}
          <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 65% 70%, rgba(255,255,255,0.06) 0%, transparent 40%)', border: '1px solid rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    </div>
  );
}
