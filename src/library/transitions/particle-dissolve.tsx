'use client';

import { motion, useTransform } from 'framer-motion';
import { useMemo } from 'react';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const COLS = 14;
const ROWS = 10;
const TOTAL = ROWS * COLS;

// Dead zone: first 0.30 of scroll is content-reading time.
const DEAD = 0.30;
const ACTIVE = 0.70; // 1 - DEAD

function seed(i: number): number {
  const x = Math.sin((i + 0.5) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface ParticleParams {
  startP: number;
  endP: number;
  xDrift: number;
  yDrift: number;
  spin: number;
  shrink: number;
}

function particleParams(index: number): ParticleParams {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const cx = col / (COLS - 1);
  const cy = row / (ROWS - 1);
  const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2) / Math.SQRT1_2;
  const s = seed(index);

  const delay = dist * 0.35 + s * 0.1;
  const duration = 0.45 + s * 0.3;
  // Remap into active window
  const startP = DEAD + delay * ACTIVE * 0.7;
  const endP = Math.min(0.97, startP + duration * ACTIVE * 0.7);

  const angle = Math.atan2(cy - 0.5, cx - 0.5) + (s - 0.5) * 0.8;
  const force = 60 + dist * 160 + s * 80;
  const gravity = 120 + s * 140;

  return {
    startP,
    endP,
    xDrift: Math.cos(angle) * force,
    yDrift: Math.sin(angle) * force + gravity,
    spin: (s - 0.5) * 150,
    shrink: 0.45 + s * 0.25,
  };
}

// Individual particle — renders a clipped window of `first` and animates it away.
// The particle is visible (opacity=1) UNTIL its own startP, then dissolves.
function Particle({ index, children }: { index: number; children: React.ReactNode }) {
  const p = useTrackProgress();
  const params = useMemo(() => particleParams(index), [index]);
  const { startP, endP, xDrift, yDrift, spin, shrink } = params;

  const x = useTransform(p, (v) => {
    if (v <= startP) return 0;
    if (v >= endP) return xDrift;
    const t = (v - startP) / (endP - startP);
    return xDrift * (1 - (1 - t) ** 3);
  });
  const y = useTransform(p, (v) => {
    if (v <= startP) return 0;
    if (v >= endP) return yDrift;
    const t = (v - startP) / (endP - startP);
    return yDrift * (t * t);
  });
  const rotate = useTransform(p, (v) => {
    if (v <= startP) return 0;
    if (v >= endP) return spin;
    const t = (v - startP) / (endP - startP);
    return spin * (1 - (1 - t) ** 2);
  });
  const opacity = useTransform(p, (v) => {
    if (v <= startP) return 1;
    if (v >= endP) return 0;
    const t = (v - startP) / (endP - startP);
    return Math.max(0, 1 - t ** 1.6 * 1.3);
  });
  const scale = useTransform(p, (v) => {
    if (v <= startP) return 1;
    if (v >= endP) return shrink;
    const t = (v - startP) / (endP - startP);
    return 1 - (1 - shrink) * (1 - (1 - t) ** 2);
  });

  return (
    <motion.div style={{ x, y, rotate, opacity, scale }} className="overflow-hidden">
      {children}
    </motion.div>
  );
}

const DUST_COUNT = 24;

function DustParticle({ seed: s }: { seed: number }) {
  const p = useTrackProgress();
  const x = useTransform(p, [DEAD, 1], [0, (s - 0.5) * 200]);
  const y = useTransform(p, [DEAD, 1], [0, -(40 + s * 60)]);
  const opacity = useTransform(p, [DEAD, DEAD + 0.10, 0.88, 1], [0, 0.25 + s * 0.2, 0.25 + s * 0.2, 0]);
  const size = 2 + s * 3;
  return (
    <motion.div
      className="absolute rounded-full bg-white/80 pointer-events-none"
      style={{ x, y, opacity, width: size, height: size, left: `${s * 100}%`, top: `${(s * 0.7 + 0.15) * 100}%` }}
    />
  );
}

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();

  // Second section fades in mid-transition
  const secondOpacity = useTransform(p, [0.56, 0.82], [0, 1]);

  // Cover opacity: fully visible until 0.30, then instantly hides so particle grid takes over
  const coverOpacity = useTransform(p, [0.29, 0.31], [1, 0]);

  return (
    <>
      {/* Incoming section fades in from behind */}
      <motion.div style={{ opacity: secondOpacity }} className="absolute inset-0">
        {second}
      </motion.div>

      {/* Dust motes — atmospheric depth, appear after dead zone */}
      {Array.from({ length: DUST_COUNT }, (_, i) => (
        <DustParticle key={`dust-${i}`} seed={seed(i + TOTAL)} />
      ))}

      {/* Particle grid — the outgoing section fragmented into tiles */}
      <div className="absolute inset-0">
        <div
          className="grid h-full w-full"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px' }}
        >
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <Particle key={i} index={i}>
                <div
                  className="pointer-events-none absolute overflow-hidden rounded-[1px] shadow-[inset_0_0_1px_rgba(255,255,255,0.06)]"
                  style={{
                    width: `${COLS * 100}%`,
                    height: `${ROWS * 100}%`,
                    left: `${-col * 100}%`,
                    top: `${-row * 100}%`,
                  }}
                >
                  {first}
                </div>
              </Particle>
            );
          })}
        </div>
      </div>

      {/* Clean cover — keeps first section pristine until dead zone ends at 0.30 */}
      <motion.div style={{ opacity: coverOpacity }} className="absolute inset-0 pointer-events-none">
        {first}
      </motion.div>
    </>
  );
}

/**
 * ParticleDissolve – the outgoing section fragments into drifting particles.
 * Dead zone 0→0.30 keeps the section fully readable. Particles burst from 0.30 onward.
 */
export function ParticleDissolve({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
