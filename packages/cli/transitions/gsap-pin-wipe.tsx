'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_CLIP = 'polygon(0% 100%, 100% 115%, 100% 115%, 0% 100%)';
const FULL_CLIP   = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function GsapPinWipe({ first, second, height = 300, className }: SectionTransitionProps) {
  const root     = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      tl.fromTo(panelRef.current, { clipPath: HIDDEN_CLIP }, { clipPath: FULL_CLIP, ease: 'none', duration: 0.50 }, 0.25);
      tl.fromTo(firstRef.current, { scale: 1, filter: 'brightness(1)' }, { scale: 0.94, filter: 'brightness(0.5)', ease: 'none', duration: 0.50 }, 0.25);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={firstRef} className="absolute inset-0">{first}</div>
        <div ref={panelRef} className="absolute inset-0" style={{ clipPath: HIDDEN_CLIP }}>{second}</div>
      </div>
    </div>
  );
}
