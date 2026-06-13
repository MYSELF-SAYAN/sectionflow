'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_CLIP = 'polygon(0% 100%, 100% 115%, 100% 115%, 0% 100%)';
const FULL_CLIP = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

/**
 * GsapPinWipe – ScrollTrigger pins the viewport while a skew-edged panel wipes in.
 * Dead zone: first 30% of scroll is content-reading time, transition fires from 30%→100%.
 */
export function GsapPinWipe({ first, second, height = 300, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });
      // 0→0.30: dead zone — first section is fully visible, nothing moves
      // 0.30→1.00: transition fires
      tl.fromTo(
        panelRef.current,
        { clipPath: HIDDEN_CLIP },
        { clipPath: FULL_CLIP, ease: 'none', duration: 0.7 },
        0.3,
      ).fromTo(
        firstRef.current,
        { scale: 1, filter: 'brightness(1)' },
        { scale: 0.94, filter: 'brightness(0.5)', ease: 'none', duration: 0.7 },
        0.3,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={firstRef} className="absolute inset-0">{first}</div>
        <div ref={panelRef} className="absolute inset-0" style={{ clipPath: HIDDEN_CLIP }}>
          {second}
        </div>
      </div>
    </div>
  );
}
