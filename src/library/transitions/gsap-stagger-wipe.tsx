'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const SLATS = 8;

export interface GsapStaggerWipeProps extends SectionTransitionProps {
  slatClassName?: string;
}

/**
 * GsapStaggerWipe – staggered slats rise to cover the screen, sections swap, then slats peel away.
 *
 * Fix: outgoing section now has an explicit exit animation (dims + slight scale-down) while
 * the slats are covering it, so there is a visible transition on the outgoing side too.
 * Dead zone: 0→0.30. Transition fires 0.30→1.00.
 */
export function GsapStaggerWipe({
  first,
  second,
  height = 350,
  className,
  slatClassName = 'bg-zinc-900',
}: GsapStaggerWipeProps) {
  const root = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const slats = self.selector!('.sf-slat');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0→0.30: dead zone — nothing moves

      // 0.30→0.56: outgoing section dims and shrinks (exit animation)
      tl.fromTo(
        firstRef.current,
        { autoAlpha: 1, scale: 1, filter: 'brightness(1)' },
        { autoAlpha: 0.4, scale: 0.92, filter: 'brightness(0.5)', ease: 'power1.in', duration: 0.26 },
        0.30,
      );

      // 0.30→0.56: slats rise to cover
      tl.fromTo(
        slats,
        { yPercent: 101 },
        { yPercent: 0, stagger: 0.04, ease: 'power2.inOut', duration: 0.26 },
        0.30,
      );

      // 0.56: swap sections underneath the slats
      tl.set(secondRef.current, { autoAlpha: 1 }, 0.57);
      tl.set(firstRef.current, { autoAlpha: 0 }, 0.57);

      // 0.58→1.00: slats peel away to reveal second section
      tl.to(
        slats,
        { yPercent: -101, stagger: 0.04, ease: 'power2.inOut', duration: 0.40 },
        0.58,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Outgoing section */}
        <div ref={firstRef} className="absolute inset-0">{first}</div>
        {/* Incoming section — hidden until slat swap */}
        <div ref={secondRef} className="absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>
          {second}
        </div>
        {/* Slat overlay — all start parked below the screen */}
        <div className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: SLATS }, (_, i) => (
            <div
              key={i}
              className={`sf-slat h-full flex-1 ${slatClassName}`}
              style={{ transform: 'translateY(101%)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
