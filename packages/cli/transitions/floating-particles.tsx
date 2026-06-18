'use client';

import { motion, useTransform } from 'framer-motion';
import { useMemo } from 'react';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const PARTICLE_COUNT = 60;
const DEAD  = 0.25;
const ACTIVE = 0.50; // active window = 0.25→0.75

function seeded(i: number): number {
  const x = Math.sin((i + 1.7) * 9301.5 + 49297.3) * 233280.4;
  return x - Math.floor(x);
}

function particleConfig(i: number) {
  return {
    x:       seeded(i) * 100,
    size:    3 + seeded(i + 100) * 8,
    speed:   0.4 + seeded(i + 200) * 0.6,
    drift:   (seeded(i + 300) - 0.5) * 120,
    delay:   seeded(i + 400) * 0.5,
    opacity: 0.2 + seeded(i + 500) * 0.5,
    hue:     seeded(i + 600) > 0.5 ? 185 : 255,
  };
}

function FloatingParticle({ index }: { index: number }) {
  const p   = useTrackProgress();
  const cfg = useMemo(() => particleConfig(index), [index]);

  const startP  = DEAD + cfg.delay * ACTIVE * 0.5;
  const endP    = Math.min(0.75, startP + cfg.speed * ACTIVE * 0.8);
  const yTravel = -(80 + cfg.size * 12);

  const y       = useTransform(p, [startP, endP], [0, yTravel]);
  const x       = useTransform(p, [startP, endP], [0, cfg.drift]);
  const opacity = useTransform(p, [startP, startP + ACTIVE * 0.06, Math.max(startP + ACTIVE * 0.1, endP - ACTIVE * 0.15), endP], [0, cfg.opacity, cfg.opacity, 0]);
  const scale   = useTransform(p, [startP, startP + ACTIVE * 0.1, endP], [0.3, 1, 0.5]);

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full will-change-transform"
      style={{ x, y, opacity, scale, width: cfg.size, height: cfg.size, left: `${cfg.x}%`, bottom: '10%', background: `radial-gradient(circle, hsl(${cfg.hue}, 90%, 75%) 0%, hsl(${cfg.hue}, 80%, 60%) 50%, transparent 100%)`, boxShadow: `0 0 ${cfg.size * 2}px hsl(${cfg.hue}, 90%, 65%)` }}
    />
  );
}

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p             = useTrackProgress();
  const firstOpacity  = useTransform(p, [0.25, 0.72], [1, 0]);
  const secondOpacity = useTransform(p, [0.45, 0.80], [0, 1]);
  const firstScale    = useTransform(p, [0.25, 0.78], [1, 1.04]);

  return (
    <>
      <motion.div style={{ opacity: firstOpacity, scale: firstScale }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ opacity: secondOpacity }} className="absolute inset-0">{second}</motion.div>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => <FloatingParticle key={i} index={i} />)}
    </>
  );
}

export function FloatingParticles({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
