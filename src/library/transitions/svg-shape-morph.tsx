'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

// Mask morphs: tiny invisible point → diamond → starburst → shield → full screen
const SHAPE_STEPS = [
  'circle(0% at 50% 50%)',                     // invisible at rest
  'polygon(50% 45%, 55% 50%, 50% 55%, 45% 50%)',
  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
];

/**
 * SVGShapeMorph – clip-path mask morphs through shapes to reveal the incoming section.
 * Fix: mask starts at circle(0%) so nothing of second is visible at rest.
 * Dead zone: 0→0.30. Transition fires 0.30→1.00.
 */
export function SvgShapeMorph({ first, second, height = 380, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
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

      // 0.30→0.54: dim first section
      tl.fromTo(
        root.current!.querySelector('.sf-morph-first'),
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: 'none', duration: 0.24 },
        0.30,
      );

      // Morph through each shape step — evenly distributed across [0.30, 1.00]
      // Skip step 0 (already the initial state), animate through 1..4
      const activeSteps = SHAPE_STEPS.slice(1);
      activeSteps.forEach((shape, i) => {
        const t = 0.30 + i * (0.70 / (activeSteps.length - 1));
        tl.to(
          maskRef.current,
          { clipPath: shape, ease: i === activeSteps.length - 1 ? 'power2.inOut' : 'back.out(1.4)', duration: 0.16 },
          t,
        );
        // Sync glow outline to match
        tl.to(
          glowRef.current,
          { clipPath: shape, ease: 'none', duration: 0.16 },
          t,
        );
      });

      // Glow appears at start of transition and fades before end
      tl.fromTo(glowRef.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power2.out', duration: 0.08 }, 0.31);
      tl.to(glowRef.current, { autoAlpha: 0, ease: 'power2.in', duration: 0.12 }, 0.80);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Outgoing section */}
        <div className="sf-morph-first absolute inset-0">{first}</div>
        {/* Incoming section — masked, starts fully clipped (invisible) */}
        <div
          ref={maskRef}
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
          style={{ clipPath: SHAPE_STEPS[0] }}
        >
          {second}
        </div>
        {/* Glow border tracking the mask */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 will-change-[clip-path]"
          style={{
            clipPath: SHAPE_STEPS[0],
            boxShadow: 'inset 0 0 0 2px rgba(34,211,238,0.8), 0 0 30px rgba(34,211,238,0.4)',
          }}
        />
      </div>
    </div>
  );
}
