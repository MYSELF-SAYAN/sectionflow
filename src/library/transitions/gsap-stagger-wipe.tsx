'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const SLATS = 8;

export interface GsapStaggerWipeProps extends SectionTransitionProps { slatClassName?: string; }

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
export function GsapStaggerWipe({ first, second, height = 350, className, slatClassName = 'bg-zinc-900' }: GsapStaggerWipeProps) {
  const root      = useRef<HTMLDivElement>(null);
  const firstRef  = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const slats = self.selector!('.sf-slat');
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
      // 0.25: outgoing dims while slats rise
      tl.fromTo(firstRef.current, { autoAlpha: 1, scale: 1, filter: 'brightness(1)' }, { autoAlpha: 0.4, scale: 0.92, filter: 'brightness(0.5)', ease: 'power1.in', duration: 0.20 }, 0.25);
      tl.fromTo(slats, { yPercent: 101 }, { yPercent: 0, stagger: 0.04, ease: 'power2.inOut', duration: 0.22 }, 0.25);
      // 0.48: swap sections
      tl.set(secondRef.current, { autoAlpha: 1 }, 0.48);
      tl.set(firstRef.current,  { autoAlpha: 0 }, 0.48);
      // 0.50→0.75: slats peel away
      tl.to(slats, { yPercent: -101, stagger: 0.04, ease: 'power2.inOut', duration: 0.25 }, 0.50);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={firstRef} className="absolute inset-0">{first}</div>
        <div ref={secondRef} className="absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>
        <div className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: SLATS }, (_, i) => (
            <div key={i} className={`sf-slat h-full flex-1 ${slatClassName}`} style={{ transform: 'translateY(101%)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
