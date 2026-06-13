'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const FRAMES = 12;

/**
 * InfiniteTunnel – nested frames rush toward the camera like a perspective tunnel.
 *
 * Fix: All tunnel frames now start with opacity:0 in HTML so they don't
 * stack and corrupt the outgoing section at rest. GSAP fades them in as
 * they animate. The first section base layer is always on top via z-index
 * until GSAP hides it, preventing any visual overlap.
 *
 * Dead zone: 0→0.30. Transition fires 0.30→1.00.
 */
export function InfiniteTunnel({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const frames = root.current!.querySelectorAll<HTMLElement>('.sf-tunnel-frame');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.30→0.52: first section dims
      tl.fromTo(
        root.current!.querySelector('.sf-tunnel-first'),
        { autoAlpha: 1, scale: 1 },
        { autoAlpha: 0, scale: 1.06, ease: 'none', duration: 0.22 },
        0.30,
      );

      // 0.30→0.82: each frame fades in small, zooms to fill, then fades out
      // Staggered so earlier (smaller/further) frames move first
      frames.forEach((frame, i) => {
        const normI = i / (FRAMES - 1); // 0 = smallest/furthest, 1 = largest/nearest
        const startScale = 0.06 + normI * 0.82;
        const delay = 0.30 + normI * 0.28; // furthest frame starts first

        // Fade in while rushing toward camera
        tl.fromTo(
          frame,
          { scale: startScale, autoAlpha: 0 },
          { scale: startScale * 2.5, autoAlpha: 0.7, ease: 'none', duration: 0.14 },
          delay,
        );
        // Then blow past camera (scale beyond 1 and fade out)
        tl.fromTo(
          frame,
          { scale: startScale * 2.5, autoAlpha: 0.7 },
          { scale: 4, autoAlpha: 0, ease: 'power1.in', duration: 0.20 },
          delay + 0.14,
        );
      });

      // 0.68→1.00: second section blooms in from the far end of the tunnel
      tl.fromTo(
        root.current!.querySelector('.sf-tunnel-second'),
        { autoAlpha: 0, scale: 0.85 },
        { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.32 },
        0.68,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      style={{ height: `${height}vh` }}
      className={`relative w-full ${className ?? ''}`}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ perspective: '900px' }}
      >
        {/* Frames sit at the bottom of the stack — all invisible at rest */}
        {Array.from({ length: FRAMES }, (_, i) => {
          const normI = i / (FRAMES - 1);
          const startScale = 0.06 + normI * 0.82;
          const brightness = 0.35 + normI * 0.65;
          return (
            <div
              key={i}
              className="sf-tunnel-frame absolute inset-0 overflow-hidden will-change-transform"
              style={{
                transform: `scale(${startScale})`,
                filter: `brightness(${brightness})`,
                borderRadius: `${Math.round(20 - normI * 18)}px`,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 60px rgba(0,0,0,0.9)',
                opacity: 0, // hidden at rest — GSAP controls visibility
              }}
            >
              {first}
            </div>
          );
        })}

        {/* Outgoing section — clean full view on top at rest */}
        <div className="sf-tunnel-first absolute inset-0">{first}</div>

        {/* Incoming section — hidden until tunnel ends */}
        <div
          className="sf-tunnel-second absolute inset-0"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {second}
        </div>
      </div>
    </div>
  );
}
