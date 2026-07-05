'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Realistic Particle Dissolve (Structural Fracture Edition).
 *
 * The outgoing section fractures into thousands of fine grains, 
 * expanding outward as a single surface, then shattering.
 * The incoming section is revealed as the cracks widen.
 */
const COLS = 24;
const ROWS = 18;
const TOTAL_FRAGMENTS = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 1.3) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function Fragment({
  col,
  row,
  i,
  progress,
  outgoing,
}: {
  col: number;
  row: number;
  i: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const s = seeded(i);
  
  // Staggered wind: fragments move outward from the center
  const delay = 0.1 + (Math.abs(col - COLS / 2) / COLS) * 0.2;
  const end = 0.95; // Stays active until the very end

  // Physics: Scale up (crack) then explode
  const tx = (s - 0.5) * 600;
  const ty = -300 - (s * 500);
  const rot = (s - 0.5) * 360;

  const x = useTransform(progress, [delay, end], [0, tx]);
  const y = useTransform(progress, [delay, end], [0, ty]);
  const rotate = useTransform(progress, [delay, end], [0, rot]);
  const scale = useTransform(progress, [0, delay, end], [1, 1.05, 0.4]); // Crack then shrink
  
  // Opacity: Stays at 1 for the whole duration, only fading at the very end
  const opacity = useTransform(progress, [end - 0.05, end], [1, 0]);

  return (
    <motion.div
      className="absolute overflow-hidden will-change-transform"
      style={{
        left: `${(col / COLS) * 100}%`,
        top: `${(row / ROWS) * 100}%`,
        width: `${100 / COLS}%`,
        height: `${100 / ROWS}%`,
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex: 30, // Fragments sit on top of everything
      }}
    >
      <div
        className="absolute"
        style={{
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `-${col * 100}%`,
          top: `-${row * 100}%`,
        }}
      >
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

export function ParticleDissolve({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Choreography:
   * The outgoing layer is replaced by fragments immediately.
   * Incoming fades in from 0.2 to 0.5 so it is revealed through the growing cracks.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.01], [1, 0]);
  incoming.style.opacity = useTransform(progress, [0.2, 0.5], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {/* Fragments: These act as the 'outgoing' content */}
      {Array.from({ length: TOTAL_FRAGMENTS }).map((_, i) => (
        <Fragment
          key={i}
          i={i}
          col={i % COLS}
          row={Math.floor(i / COLS)}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(ParticleDissolve as TransitionComponent).copies = true;