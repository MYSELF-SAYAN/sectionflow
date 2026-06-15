'use client';

import { motion, useTransform } from 'framer-motion';
import { useMemo } from 'react';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const COLS  = 14;
const ROWS  = 10;
const TOTAL = ROWS * COLS;

// 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
const DEAD   = 0.25;
const ACTIVE = 0.50; // active window width (0.25→0.75)

function seed(i: number): number {
  const x = Math.sin((i + 0.5) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function particleParams(index: number) {
  const col  = index % COLS;
  const row  = Math.floor(index / COLS);
  const cx   = col / (COLS - 1);
  const cy   = row / (ROWS - 1);
  const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2) / Math.SQRT1_2;
  const s    = seed(index);

  const delay    = dist * 0.35 + s * 0.1;
  const duration = 0.45 + s * 0.3;
  const startP   = DEAD + delay * ACTIVE * 0.7;
  const endP     = Math.min(0.75, startP + duration * ACTIVE * 0.7);

  const angle   = Math.atan2(cy - 0.5, cx - 0.5) + (s - 0.5) * 0.8;
  const force   = 60 + dist * 160 + s * 80;
  const gravity = 120 + s * 140;

  return { startP, endP, xDrift: Math.cos(angle) * force, yDrift: Math.sin(angle) * force + gravity, spin: (s - 0.5) * 150, shrink: 0.45 + s * 0.25 };
}

function Particle({ index, children }: { index: number; children: React.ReactNode }) {
  const p      = useTrackProgress();
  const params = useMemo(() => particleParams(index), [index]);
  const { startP, endP, xDrift, yDrift, spin, shrink } = params;

  const x       = useTransform(p, (v) => { if (v <= startP) return 0; if (v >= endP) return xDrift; const t = (v - startP) / (endP - startP); return xDrift * (1 - (1 - t) ** 3); });
  const y       = useTransform(p, (v) => { if (v <= startP) return 0; if (v >= endP) return yDrift; const t = (v - startP) / (endP - startP); return yDrift * (t * t); });
  const rotate  = useTransform(p, (v) => { if (v <= startP) return 0; if (v >= endP) return spin; const t = (v - startP) / (endP - startP); return spin * (1 - (1 - t) ** 2); });
  const opacity = useTransform(p, (v) => { if (v <= startP) return 1; if (v >= endP) return 0; const t = (v - startP) / (endP - startP); return Math.max(0, 1 - t ** 1.6 * 1.3); });
  const scale   = useTransform(p, (v) => { if (v <= startP) return 1; if (v >= endP) return shrink; const t = (v - startP) / (endP - startP); return 1 - (1 - shrink) * (1 - (1 - t) ** 2); });

  return <motion.div style={{ x, y, rotate, opacity, scale }} className="overflow-hidden">{children}</motion.div>;
}

const DUST_COUNT = 24;

function DustParticle({ seed: s }: { seed: number }) {
  const p       = useTrackProgress();
  const x       = useTransform(p, [DEAD, 0.75], [0, (s - 0.5) * 200]);
  const y       = useTransform(p, [DEAD, 0.75], [0, -(40 + s * 60)]);
  const opacity = useTransform(p, [DEAD, DEAD + 0.08, 0.70, 0.75], [0, 0.25 + s * 0.2, 0.25 + s * 0.2, 0]);
  const size    = 2 + s * 3;
  return <motion.div className="absolute rounded-full bg-white/80 pointer-events-none" style={{ x, y, opacity, width: size, height: size, left: `${s * 100}%`, top: `${(s * 0.7 + 0.15) * 100}%` }} />;
}

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p              = useTrackProgress();
  const secondOpacity  = useTransform(p, [0.50, 0.75], [0, 1]);
  const coverOpacity   = useTransform(p, [0.24, 0.26], [1, 0]);

  return (
    <>
      <motion.div style={{ opacity: secondOpacity }} className="absolute inset-0">{second}</motion.div>
      {Array.from({ length: DUST_COUNT }, (_, i) => <DustParticle key={`d-${i}`} seed={seed(i + TOTAL)} />)}
      <div className="absolute inset-0">
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px' }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <Particle key={i} index={i}>
                <div className="pointer-events-none absolute overflow-hidden rounded-[1px] shadow-[inset_0_0_1px_rgba(255,255,255,0.06)]" style={{ width: `${COLS * 100}%`, height: `${ROWS * 100}%`, left: `${-col * 100}%`, top: `${-row * 100}%` }}>
                  {first}
                </div>
              </Particle>
            );
          })}
        </div>
      </div>
      <motion.div style={{ opacity: coverOpacity }} className="absolute inset-0 pointer-events-none">{first}</motion.div>
    </>
  );
}

export function ParticleDissolve({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
