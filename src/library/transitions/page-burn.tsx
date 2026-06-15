'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

// ─── Timeline constants ────────────────────────────────────────────────────
// 0.00 – 0.25  safe viewing zone  (nothing moves, cover intact)
// 0.25 – 0.75  transition buildup (burn frontier sweeps across)
// 0.75 – 1.00  section handoff    (ash clears, second section revealed)

const EMBER_COUNT = 80;
const BURN_STRIPS = 36; // horizontal strips for the burn mask

function seeded(i: number): number {
  const x = Math.sin((i + 0.4) * 9337.1 + 1999.3) * 71993.7;
  return x - Math.floor(x);
}

/**
 * PageBurn – the outgoing section catches fire from the bottom edge.
 * An organic burn frontier sweeps upward, leaving glowing embers and
 * char in its wake. The second section waits pristine beneath the ash.
 *
 * Timeline:
 *  0.00 – 0.25  first section fully visible, no fire elements
 *  0.25 – 0.75  fire sweeps upward through burn strips
 *  0.75 – 1.00  second section fully visible
 */
export function PageBurn({ first, second, height = 420, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const strips = root.current!.querySelectorAll<HTMLElement>('.sf-burn-strip');
      const embers = root.current!.querySelectorAll<HTMLElement>('.sf-burn-ember');
      const glowEl = root.current!.querySelector<HTMLElement>('.sf-burn-glow');
      const coverEl = root.current!.querySelector<HTMLElement>('.sf-burn-cover');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // 0.25: cover snaps away
      tl.to(coverEl, { autoAlpha: 0, duration: 0.01 }, 0.25);

      // 0.25→0.35: glow line appears at bottom, signalling ignition
      tl.fromTo(glowEl, { autoAlpha: 0, scaleX: 0.2 }, { autoAlpha: 1, scaleX: 1, ease: 'power2.out', duration: 0.10 }, 0.25);

      // 0.26→0.72: burn strips disappear bottom-to-top (simulating burning)
      // Strip 0 = bottom, Strip BURN_STRIPS-1 = top
      strips.forEach((strip, i) => {
        const normalised = i / (BURN_STRIPS - 1); // 0=bottom → 1=top
        const startT = 0.26 + normalised * 0.40; // burn propagates upward
        const jitter = (seeded(i) - 0.5) * 0.04;
        const burnDur = 0.10 + seeded(i + 100) * 0.08;

        // Strip burns through: first visible → charred orange edge → gone
        tl.fromTo(strip,
          { autoAlpha: 1, filter: 'brightness(1)' },
          { autoAlpha: 0, filter: 'brightness(2.5) sepia(1) hue-rotate(-20deg)', ease: 'power2.in', duration: burnDur },
          startT + jitter,
        );
      });

      // 0.28→0.68: second section reveals beneath the ash
      tl.fromTo(
        root.current!.querySelector('.sf-burn-second'),
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 0.40 },
        0.28,
      );

      // 0.30→0.70: embers drift upward during the burn
      embers.forEach((ember, i) => {
        const startT = 0.30 + seeded(i) * 0.28;
        const xDrift = (seeded(i + 100) - 0.5) * 120;
        const yDrift = -(60 + seeded(i + 200) * 120);

        tl.fromTo(ember,
          { x: 0, y: 0, autoAlpha: 0, scale: 0.5 },
          { x: xDrift, y: yDrift, autoAlpha: seeded(i + 300) * 0.5 + 0.3, scale: 1, ease: 'power1.out', duration: 0.20 },
          startT,
        );
        tl.to(ember, { autoAlpha: 0, scale: 0.1, duration: 0.12 }, startT + 0.20);
      });

      // Glow line drifts upward with the burn frontier
      tl.fromTo(glowEl,
        { yPercent: 100 },
        { yPercent: -100, ease: 'none', duration: 0.46 },
        0.26,
      );
      tl.to(glowEl, { autoAlpha: 0, duration: 0.08 }, 0.72);

      // 0.75→1.00: second section fully arrives
      tl.fromTo(
        root.current!.querySelector('.sf-burn-second'),
        { autoAlpha: 0.8 },
        { autoAlpha: 1, ease: 'none', duration: 0.25 },
        0.75,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0803]">
        {/* Second section — behind everything */}
        <div className="sf-burn-second absolute inset-0" style={{ opacity: 0, visibility: 'hidden' }}>{second}</div>

        {/* Burn strip grid — divides first section into horizontal rows */}
        <div
          className="absolute inset-0"
          style={{ display: 'grid', gridTemplateRows: `repeat(${BURN_STRIPS}, 1fr)` }}
        >
          {Array.from({ length: BURN_STRIPS }, (_, i) => {
            // i=0 is top of DOM, but we want bottom to burn first
            // So visual row 0 (top) = strip BURN_STRIPS-1 in burn order
            const col = i;
            return (
              <div key={i} className="sf-burn-strip relative overflow-hidden will-change-transform">
                <div
                  className="pointer-events-none absolute inset-x-0"
                  style={{
                    height: `${BURN_STRIPS * 100}%`,
                    top: `${-col * 100}%`,
                  }}
                >
                  {first}
                </div>
              </div>
            );
          })}
        </div>

        {/* Burn glow line — horizontal ember glow that sweeps upward */}
        <div
          className="sf-burn-glow pointer-events-none absolute inset-x-0 bottom-0 will-change-transform"
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,100,0,0.8) 20%, rgba(255,200,0,1) 50%, rgba(255,100,0,0.8) 80%, transparent 100%)',
            boxShadow: '0 0 20px 8px rgba(255,120,0,0.6), 0 0 60px 20px rgba(255,60,0,0.3)',
            opacity: 0,
          }}
        />

        {/* Ember particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: EMBER_COUNT }, (_, i) => {
            const size = 2 + seeded(i) * 4;
            const hue = 20 + seeded(i + 400) * 30; // orange-red range
            return (
              <div
                key={i}
                className="sf-burn-ember absolute rounded-full will-change-transform"
                style={{
                  width: size,
                  height: size,
                  left: `${seeded(i + 500) * 100}%`,
                  bottom: `${seeded(i + 600) * 60}%`,
                  background: `hsl(${hue}, 100%, 60%)`,
                  boxShadow: `0 0 ${size * 3}px hsl(${hue}, 100%, 50%)`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>

        {/* Clean cover — keeps first section pristine at rest */}
        <div className="sf-burn-cover absolute inset-0">{first}</div>
      </div>
    </div>
  );
}
