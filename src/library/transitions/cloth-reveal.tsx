'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const STRIPS = 40;

/**
 * ClothReveal – a simulated cloth lifts off the next section.
 * Dead zone: first 30% of scroll is content-reading time.
 * The fabric is invisible at rest; it appears and peels away only after 30% scroll.
 */
export function ClothReveal({ first, second, height = 350, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const strips = root.current!.querySelectorAll<HTMLElement>('.sf-cloth-strip');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // 0→0.30: dead zone — first section fully visible, fabric invisible
      // 0.30→0.38: fabric snaps in over the first section
      tl.fromTo(fabricRef.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.30);
      // 0.30→0.50: first section dims behind the cloth
      tl.fromTo(
        root.current!.querySelector('.sf-cloth-first'),
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: 'none', duration: 0.20 },
        0.30,
      );
      // 0.44: second section appears beneath the cloth
      tl.set(secondRef.current, { autoAlpha: 1 }, 0.44);
      // 0.44→1.00: cloth peels away from bottom
      tl.to(
        strips,
        {
          scaleY: 0,
          transformOrigin: 'bottom center',
          stagger: { each: 0.018, from: 'end' },
          ease: 'power3.in',
          duration: 0.56,
        },
        0.44,
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
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Outgoing section — fully visible at rest */}
        <div className="sf-cloth-first absolute inset-0">{first}</div>

        {/* Incoming section — hidden until cloth begins peeling */}
        <div ref={secondRef} className="absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>
          {second}
        </div>

        {/* Fabric covering — invisible at rest, appears only on scroll */}
        <div ref={fabricRef} className="pointer-events-none absolute inset-0 flex flex-col" style={{ opacity: 0 }}>
          {Array.from({ length: STRIPS }, (_, i) => {
            const fold = Math.sin((i / STRIPS) * Math.PI * 8) * 0.06;
            const lightness = 18 + Math.abs(fold) * 30;
            return (
              <div
                key={i}
                className="sf-cloth-strip relative flex-1 will-change-transform"
                style={{
                  background: i % 2 === 0
                    ? `linear-gradient(180deg, rgba(26,26,46,1) 0%, rgba(22,33,62,1) 40%, rgba(15,52,96,${0.4 + lightness * 0.008}) 70%, rgba(26,26,46,1) 100%)`
                    : `linear-gradient(180deg, rgba(15,52,96,${0.5 + lightness * 0.006}) 0%, rgba(26,26,46,1) 30%, rgba(22,33,62,1) 70%, rgba(15,52,96,1) 100%)`,
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  boxShadow: i % 3 === 0 ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : 'inset 0 -1px 0 rgba(0,0,0,0.2)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
