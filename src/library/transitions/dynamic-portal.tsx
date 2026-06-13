'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

/**
 * DynamicPortal – a glowing iris portal opens from a central point.
 * Dead zone: 0→0.30 — first section fully visible, portal invisible.
 * Transition fires from 0.30→1.00.
 */
export function DynamicPortal({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0→0.30: dead zone
      // 0.30→0.42: glow dot and ring appear
      tl.fromTo(glowRef.current, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.12 }, 0.30);
      // 0.32→0.76: iris expands
      tl.fromTo(portalRef.current, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'power3.inOut', duration: 0.44 }, 0.32);
      // Spinning ring
      tl.fromTo(ringRef.current, { scale: 0.05, rotation: -90, autoAlpha: 0.8 }, { scale: 1.4, rotation: 30, autoAlpha: 0, ease: 'none', duration: 0.50 }, 0.32);
      // First section fades behind the portal
      tl.fromTo(root.current!.querySelector('.sf-portal-first'), { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.96, ease: 'none', duration: 0.28 }, 0.30);
      // 0.76→1.00: portal fills screen
      tl.fromTo(portalRef.current, { clipPath: 'circle(75% at 50% 50%)' }, { clipPath: 'circle(100% at 50% 50%)', ease: 'power2.out', duration: 0.20 }, 0.78);
      tl.to(glowRef.current, { autoAlpha: 0, duration: 0.14 }, 0.74);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: '1200px' }}>
        <div className="sf-portal-first absolute inset-0">{first}</div>
        <div ref={portalRef} className="absolute inset-0 overflow-hidden shadow-[0_0_120px_rgba(34,211,238,0.25)]" style={{ clipPath: 'circle(0% at 50% 50%)' }}>{second}</div>
        <div ref={ringRef} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '50vmin', height: '50vmin', borderRadius: '50%', border: '3px solid rgba(34,211,238,0.7)', boxShadow: '0 0 30px rgba(34,211,238,0.5), inset 0 0 30px rgba(34,211,238,0.2)', transform: 'scale(0.05) rotate(-90deg)', opacity: 0 }} />
        <div ref={glowRef} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(34,211,238,1)', boxShadow: '0 0 40px 20px rgba(34,211,238,0.6), 0 0 80px 40px rgba(99,102,241,0.3)', transform: 'scale(0)', opacity: 0 }} />
      </div>
    </div>
  );
}
