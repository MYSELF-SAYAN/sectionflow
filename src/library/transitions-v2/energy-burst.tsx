'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Energy Burst (Nuclear Ripple Edition).
 *
 * Multiple shockwave rings erupt from the center. The screen "bleaches" 
 * at the moment of impact, followed by a sequence of expanding ripples.
 * No rays, just high-fidelity atmospheric pressure waves.
 */
const RING_COUNT = 15;

function ShockwaveRing({ index, progress }: { index: number; progress: MotionValue<number> }) {
  // Stagger the rings so they ripple outward like a physical shockwave
  const delay = 0.25 + (index * 0.03); 
  const end = Math.min(1, delay + 0.6);

  // Rings expand rapidly, then decelerate
  const scale = useTransform(progress, [delay, end], [0.1, 4]);
  // Opacity fades out as they expand to simulate dissipating energy
  const opacity = useTransform(progress, [delay, delay + 0.1, end], [0, 0.6, 0]);
  // Width decreases as they expand to mimic thinning air pressure
  const border = useTransform(progress, [delay, end], [8, 1]);

  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100"
      style={{
        width: '50vmin',
        height: '50vmin',
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        borderWidth: border as MotionValue<string | number>,
        boxShadow: '0 0 20px rgba(165, 243, 252, 0.4)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

export function EnergyBurst({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Layer: Bleaches out at the moment of impact
   */
  outgoing.style.opacity = useTransform(progress, [0.3, 0.45], [1, 0]);
  outgoing.style.scale = useTransform(progress, [0, 0.45], [1, 1.05]);
  outgoing.style.filter = useTransform(progress, [0.3, 0.45], ['brightness(1)', 'brightness(5)']);

  /*
   * 2. Incoming Layer: Materializes from the glow
   */
  incoming.style.opacity = useTransform(progress, [0.45, 0.6], [0, 1]);
  incoming.style.scale = useTransform(progress, [0.45, 1], [0.95, 1]);
  incoming.style.filter = useTransform(progress, [0.45, 0.7], ['brightness(5)', 'brightness(1)']);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      
      {/* The "Nuclear" Flash - A blinding white frame at the exact impact */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{
          opacity: useTransform(progress, [0.4, 0.45, 0.5], [0, 1, 0]),
          mixBlendMode: 'screen',
        }}
      />

      {/* Rushing Shockwave Rings */}
      <div className="absolute inset-0">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <ShockwaveRing key={i} index={i} progress={progress} />
        ))}
      </div>

      {/* Ambient center bloom */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '80vmin',
          height: '80vmin',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(34,211,238,0.1) 50%, transparent 70%)',
          opacity: useTransform(progress, [0.35, 0.45, 0.7], [0, 1, 0]),
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

(EnergyBurst as TransitionComponent).copies = true;