'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Realistic Cloth Simulation (Content-Sampling Edition).
 *
 * The outgoing section seamlessly fractures into vertical strips. 
 * As you scroll, these strips ripple, bend, and lift off unevenly 
 * like heavy fabric blowing upward, revealing the incoming section.
 *
 * Mapped Timeline:
 * 0.00 - 0.15: Dead zone (Solid section, no cuts visible).
 * 0.15: The section is instantly replaced by perfectly aligned strips.
 * 0.15 - 0.90: Strips peel upward with 3D cloth physics.
 * 0.15 - 0.85: Incoming section fades in.
 */
const STRIPS = 20;
const DEAD_ZONE = 0.15;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function ClothStrip({
  index,
  progress,
  outgoing,
}: {
  index: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const s = seeded(index);
  
  // Create a natural "ripple" wave across the strips, plus some chaotic wind variation
  const wave = Math.sin((index / STRIPS) * Math.PI);
  const delay = DEAD_ZONE + (wave * 0.15) + (s * 0.15);
  const end = Math.min(1, delay + 0.45);

  // Lifts far above the screen
  const y = useTransform(progress, [delay, end], ['0%', '-120%']);
  
  // 3D Cloth Physics: The strips tilt backward and skew as they lift, creating drag
  const rotateX = useTransform(progress, [delay, delay + 0.2, end], [0, 25 + s * 15, 0]);
  const skewY = useTransform(progress, [delay, end], [0, (s - 0.5) * 10]);
  
  // Dynamic Lighting: The strips darken slightly as they tilt away from the "light"
  const filter = useTransform(progress, [delay, end], ['brightness(1)', `brightness(${0.4 + s * 0.3})`]);

  // Strips are invisible during the dead zone, then instantly snap into existence
  const opacity = useTransform(
    progress,
    [0, DEAD_ZONE - 0.001, DEAD_ZONE],
    [0, 0, 1]
  );

  return (
    <motion.div
      aria-hidden
      className="relative h-full overflow-hidden will-change-transform"
      style={{
        width: `${100 / STRIPS}%`,
        y: y as MotionValue<string>,
        rotateX: rotateX as MotionValue<number>,
        skewY: skewY as MotionValue<number>,
        filter: filter as MotionValue<string>,
        opacity: opacity as MotionValue<number>,
        transformOrigin: 'top center',
      }}
    >
      {/* 
        This renders the ACTUAL outgoing section inside the strip.
        Negative margins perfectly align the content across all 20 strips.
      */}
      <div
        className="absolute top-0 h-full pointer-events-none"
        style={{
          width: `${STRIPS * 100}%`,
          left: `-${index * 100}%`,
        }}
      >
        {outgoing.render?.()}
      </div>

      {/* Dynamic shadow seam to give the cut pieces depth as they bend */}
      <motion.div 
        className="absolute inset-y-0 right-0 w-[2px] bg-black"
        style={{ 
          opacity: useTransform(progress, [delay, delay + 0.1], [0, 0.4]) 
        }} 
      />
    </motion.div>
  );
}

export function ClothReveal({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Cover Layer
   * Stays solid until the dead zone ends, then vanishes instantly,
   * handing the screen over to the perfectly aligned ClothStrips.
   */
  outgoing.style.opacity = useTransform(progress, [0, DEAD_ZONE - 0.001, DEAD_ZONE], [1, 1, 0]);

  /*
   * 2. Incoming Layer
   * Fades in smoothly as the cloth strips lift up and away.
   */
  incoming.style.opacity = useTransform(progress, [DEAD_ZONE, 0.85], [0, 1]);

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-20 flex overflow-hidden"
      style={{ perspective: '1200px' }} // Deep perspective for the 3D cloth bending
    >
      {Array.from({ length: STRIPS }).map((_, i) => (
        <ClothStrip 
          key={i} 
          index={i} 
          progress={progress} 
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

// Ensure SectionFlow knows it needs to provide `outgoing.render()` for the clones
(ClothReveal as TransitionComponent).copies = true;