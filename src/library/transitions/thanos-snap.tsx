'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Dust Simulation (Cinematic Fragmentation Edition).
 *
 * The outgoing section shatters into hundreds of tiny pieces that catch 
 * a turbulent wind, blowing away from left to right as dust.
 *
 * Mapped Timeline:
 * 0.15 - 0.75: A wind front sweeps from left to right.
 *              - The outgoing layer is wiped away perfectly synced with the incoming reveal.
 *              - Grid pieces spawn exactly on the wind front and blow away.
 */
const COLS = 16;
const ROWS = 12;
const TOTAL_PARTICLES = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function ThanosSnapParticle({
  index,
  progress,
  outgoing,
}: {
  index: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const cfg = useMemo(() => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const s = seeded(index);

    // The wind sweeps from left to right (col 0 to COLS)
    const delay = 0.15 + (col / COLS) * 0.6;
    // Add slight random turbulence to when the particle breaks off
    const breakTime = delay + s * 0.05; 
    const end = Math.min(1, breakTime + 0.35);

    return {
      col,
      row,
      s,
      breakTime,
      end,
      // Positioning math to perfectly tile the outgoing clones
      cellLeft: `${(col / COLS) * 100}%`,
      cellTop: `${(row / ROWS) * 100}%`,
      cellWidth: `${100 / COLS}%`,
      cellHeight: `${100 / ROWS}%`,
      innerLeft: `-${col * 100}%`,
      innerTop: `-${row * 100}%`,
      innerWidth: `${COLS * 100}%`,
      innerHeight: `${ROWS * 100}%`,
    };
  }, [index]);

  // Particle Physics (Drift right, lift up, shrink, spin, and fade)
  const x = useTransform(progress, [cfg.breakTime, cfg.end], [0, 40 + cfg.s * 60]);
  const y = useTransform(progress, [cfg.breakTime, cfg.end], [0, -(15 + cfg.s * 30)]);
  const rotate = useTransform(progress, [cfg.breakTime, cfg.end], [0, (cfg.s - 0.5) * 360]);
  const scale = useTransform(progress, [cfg.breakTime, cfg.end], [1, 0]);
  const blur = useTransform(progress, [cfg.breakTime, cfg.end], [0, 4]);

  // The particle ONLY exists exactly when it breaks off, preventing double-rendering
  const opacity = useTransform(
    progress,
    [0, cfg.breakTime - 0.001, cfg.breakTime, cfg.end - 0.05, cfg.end],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="absolute overflow-hidden will-change-transform"
      style={{
        left: cfg.cellLeft,
        top: cfg.cellTop,
        width: cfg.cellWidth,
        height: cfg.cellHeight,
        x: useMotionTemplate`${x}vw`,
        y: useMotionTemplate`${y}vh`,
        rotate,
        scale,
        opacity,
        filter: useMotionTemplate`blur(${blur}px)`,
        zIndex: 30,
      }}
    >
      <div
        className="absolute"
        style={{
          left: cfg.innerLeft,
          top: cfg.innerTop,
          width: cfg.innerWidth,
          height: cfg.innerHeight,
        }}
      >
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

export function ThanosSnap({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Base Layer Choreography (The Dovetail Wipe)
   */
  // The Wind Front travels from 0 to 100
  const wipeX = useTransform(progress, [0.15, 0.75], [0, 100]);

  // 1. Erase the OUTGOING layer from left to right
  outgoing.style.clipPath = useMotionTemplate`inset(0 0 0 ${wipeX}%)`;

  // 2. Reveal the INCOMING layer from left to right
  // We calculate the reverse percentage to pull the right-edge inset back to 0
  const incomingRightInset = useTransform(wipeX, (v) => 100 - v);
  incoming.style.clipPath = useMotionTemplate`inset(0 ${incomingRightInset}% 0 0)`;
  
  // Snap incoming to fully opaque immediately so the clip-path takes over visibility
  incoming.style.opacity = useTransform(progress, [0, 0.01], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Render the 192 fragment pieces */}
      {Array.from({ length: TOTAL_PARTICLES }).map((_, i) => (
        <ThanosSnapParticle
          key={i}
          index={i}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(ThanosSnap as TransitionComponent).copies = true;