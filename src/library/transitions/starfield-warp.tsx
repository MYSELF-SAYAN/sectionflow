'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

// ─── Timeline constants ────────────────────────────────────────────────────
// 0.00 – 0.25  safe viewing zone  (nothing moves)
// 0.25 – 0.75  transition buildup (stars accelerate into warp)
// 0.75 – 1.00  section handoff    (second section arrives)

const STAR_COUNT = 220;

function seeded(i: number): number {
  const x = Math.sin((i + 1.3) * 7919.1 + 3571.7) * 99991.3;
  return x - Math.floor(x);
}

/**
 * StarfieldWarp – hundreds of star particles stretch into hyperspace streaks
 * and converge toward a central vanishing point, accelerating the viewer
 * into the next section at warp speed.
 *
 * Timeline:
 *  0.00 – 0.25  first section fully visible, stars invisible
 *  0.25 – 0.60  stars fade in and begin stretching outward
 *  0.60 – 0.75  warp peak — maximum streak length, first dims
 *  0.75 – 1.00  stars fade out, second section fades in clean
 */
export function StarfieldWarp({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const stars = root.current!.querySelectorAll<HTMLElement>('.sf-star');
      const streaks = root.current!.querySelectorAll<HTMLElement>('.sf-streak');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.25→0.60: stars fade in and drift outward from centre
      stars.forEach((star, i) => {
        const angle = seeded(i) * Math.PI * 2;
        const radius = 15 + seeded(i + 100) * 35; // vmin from centre
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;
        const endX = Math.cos(angle) * (radius * 3.5 + seeded(i + 200) * 40);
        const endY = Math.sin(angle) * (radius * 3.5 + seeded(i + 200) * 40);

        tl.fromTo(star,
          { x: 0, y: 0, autoAlpha: 0, scale: 0.3 },
          { x: startX * 10, y: startY * 10, autoAlpha: seeded(i + 300) * 0.6 + 0.3, scale: 1, ease: 'power1.in', duration: 0.28 },
          0.25 + seeded(i + 400) * 0.06,
        );

        // 0.55→0.75: stars accelerate to warp speed
        tl.fromTo(star,
          { x: startX * 10, y: startY * 10, autoAlpha: seeded(i + 300) * 0.6 + 0.3 },
          { x: endX * 20, y: endY * 20, autoAlpha: 0, ease: 'power3.in', duration: 0.20 },
          0.55 + seeded(i + 400) * 0.04,
        );
      });

      // 0.25→0.75: streak lines stretch from centre
      streaks.forEach((streak, i) => {
        const angle = seeded(i + 500) * Math.PI * 2;
        const dist = 8 + seeded(i + 600) * 25;

        tl.fromTo(streak,
          { scaleX: 0, autoAlpha: 0, rotation: (angle * 180) / Math.PI },
          { scaleX: 1, autoAlpha: seeded(i + 700) * 0.4 + 0.1, ease: 'power2.in', duration: 0.35 },
          0.30 + seeded(i + 800) * 0.10,
        );
        tl.to(streak, { autoAlpha: 0, duration: 0.15 }, 0.64);
      });

      // 0.25→0.70: first section dims
      tl.fromTo(
        root.current!.querySelector('.sf-star-first'),
        { autoAlpha: 1, filter: 'brightness(1)' },
        { autoAlpha: 0, filter: 'brightness(0.2)', ease: 'power1.in', duration: 0.45 },
        0.25,
      );

      // 0.75→1.00: second section fades in
      tl.fromTo(
        root.current!.querySelector('.sf-star-second'),
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.25 },
        0.75,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* First section */}
        <div className="sf-star-first absolute inset-0">{first}</div>
        {/* Second section */}
        <div className="sf-star-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>

        {/* Star field — centred, all invisible at rest */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Point stars */}
          {Array.from({ length: STAR_COUNT }, (_, i) => {
            const angle = seeded(i) * Math.PI * 2;
            const r = 5 + seeded(i + 100) * 30;
            const size = 1 + seeded(i + 200) * 2.5;
            const hue = seeded(i + 300) > 0.7 ? 185 : seeded(i + 300) > 0.4 ? 220 : 60;
            return (
              <div
                key={i}
                className="sf-star absolute rounded-full will-change-transform"
                style={{
                  width: size,
                  height: size,
                  background: `hsl(${hue}, 80%, 90%)`,
                  boxShadow: `0 0 ${size * 2}px hsl(${hue}, 80%, 80%)`,
                  left: `calc(50% + ${Math.cos(angle) * r}vmin)`,
                  top: `calc(50% + ${Math.sin(angle) * r}vmin)`,
                  opacity: 0,
                }}
              />
            );
          })}

          {/* Warp streaks — radial lines from centre */}
          {Array.from({ length: 60 }, (_, i) => {
            const angle = seeded(i + 500) * Math.PI * 2;
            const dist = 8 + seeded(i + 600) * 25;
            const len = 80 + seeded(i + 700) * 180;
            const width = 0.5 + seeded(i + 800) * 1.5;
            return (
              <div
                key={i}
                className="sf-streak absolute will-change-transform"
                style={{
                  width: `${len}px`,
                  height: `${width}px`,
                  left: `calc(50% + ${Math.cos(angle) * dist}vmin)`,
                  top: `calc(50% + ${Math.sin(angle) * dist}vmin)`,
                  transformOrigin: '0% 50%',
                  transform: `rotate(${(angle * 180) / Math.PI}deg) scaleX(0)`,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(180,220,255,0.5) 50%, transparent 100%)',
                  opacity: 0,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
