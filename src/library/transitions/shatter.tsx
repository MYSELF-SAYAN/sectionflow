'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Content-sampling fragment explosion.
 *
 * Mapped Timeline:
 * 0.00 - 0.15: Dead zone (Normal scroll, cracks are completely hidden).
 * 0.15: Cover vanishes, shards instantly appear to reveal the "cracked" state.
 * 0.15 - 0.45: Staggered shard explosion begins.
 * 0.20 - 0.45: Incoming layer fades in smoothly.
 * 0.60 - 0.90: Final shards fly out and fade away.
 */

// Reduced dead zone for a faster initial response
const TRIGGER = 0.15;

const SHARDS: { clip: string; cx: number; cy: number }[] = [
  { clip: 'polygon(0% 0%, 22% 0%, 14% 18%, 0% 12%)', cx: 9, cy: 8 },
  { clip: 'polygon(22% 0%, 48% 0%, 38% 22%, 14% 18%)', cx: 31, cy: 10 },
  { clip: 'polygon(48% 0%, 72% 0%, 68% 20%, 38% 22%)', cx: 57, cy: 10 },
  { clip: 'polygon(72% 0%, 100% 0%, 100% 15%, 68% 20%)', cx: 85, cy: 9 },
  { clip: 'polygon(0% 12%, 14% 18%, 8% 38%, 0% 32%)', cx: 6, cy: 25 },
  { clip: 'polygon(14% 18%, 38% 22%, 32% 42%, 8% 38%)', cx: 23, cy: 30 },
  { clip: 'polygon(38% 22%, 68% 20%, 62% 44%, 32% 42%)', cx: 50, cy: 32 },
  { clip: 'polygon(68% 20%, 100% 15%, 100% 38%, 62% 44%)', cx: 82, cy: 29 },
  { clip: 'polygon(0% 32%, 8% 38%, 4% 58%, 0% 52%)', cx: 4, cy: 45 },
  { clip: 'polygon(8% 38%, 32% 42%, 28% 62%, 4% 58%)', cx: 18, cy: 50 },
  { clip: 'polygon(32% 42%, 62% 44%, 55% 65%, 28% 62%)', cx: 44, cy: 53 },
  { clip: 'polygon(62% 44%, 100% 38%, 100% 62%, 55% 65%)', cx: 79, cy: 52 },
  { clip: 'polygon(0% 52%, 4% 58%, 2% 78%, 0% 72%)', cx: 2, cy: 65 },
  { clip: 'polygon(4% 58%, 28% 62%, 24% 80%, 2% 78%)', cx: 15, cy: 70 },
  { clip: 'polygon(28% 62%, 55% 65%, 50% 84%, 24% 80%)', cx: 39, cy: 73 },
  { clip: 'polygon(55% 65%, 100% 62%, 100% 82%, 50% 84%)', cx: 76, cy: 73 },
  { clip: 'polygon(0% 72%, 2% 78%, 0% 100%)', cx: 1, cy: 83 },
  { clip: 'polygon(2% 78%, 24% 80%, 18% 100%, 0% 100%)', cx: 11, cy: 90 },
  { clip: 'polygon(24% 80%, 50% 84%, 44% 100%, 18% 100%)', cx: 34, cy: 91 },
  { clip: 'polygon(50% 84%, 100% 82%, 100% 100%, 44% 100%)', cx: 72, cy: 91 },
];

const TRAJECTORIES = SHARDS.map((s, i) => {
  const angle = Math.atan2(s.cy - 50, s.cx - 50);
  const r = Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453;
  const rand = r - Math.floor(r);
  return { 
    tx: Math.cos(angle) * (150 + rand * 200), 
    ty: Math.sin(angle) * (150 + rand * 200), 
    rot: (rand - 0.5) * 160 
  };
});

function ShardPiece({
  index,
  shard,
  trajectory,
  progress,
  outgoing,
}: {
  index: number;
  shard: typeof SHARDS[number];
  trajectory: typeof TRAJECTORIES[number];
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const delay = TRIGGER + (index / SHARDS.length) * 0.30;
  const end = Math.min(1, delay + 0.45);

  const x = useTransform(progress, [0, delay, end], [0, 0, trajectory.tx]);
  const y = useTransform(progress, [0, delay, end], [0, 0, trajectory.ty]);
  const rotation = useTransform(progress, [0, delay, end], [0, 0, trajectory.rot]);
  const scale = useTransform(progress, [0, delay, end], [1, 1, 0.4]);
  
  // FIX: Shards are completely invisible (0) until the TRIGGER point. 
  // Then they snap to visible (1), hold until they start moving (delay), and fade out (0) by the end.
  const startFade = Math.max(TRIGGER + 0.001, delay); 
  const opacity = useTransform(
    progress, 
    [0, TRIGGER - 0.001, TRIGGER, startFade, end], 
    [0, 0, 1, 1, 0]
  );

  const gradientAngle = 45 + index * 17;
  const alpha = 0.04 + (index % 3) * 0.03;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden will-change-transform"
      style={{
        clipPath: shard.clip,
        x: x as MotionValue<number>,
        y: y as MotionValue<number>,
        rotate: rotation as MotionValue<number>,
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
      }}
    >
      <div className="absolute inset-0">
        {outgoing.render?.()}
      </div>
      
      <div 
        className="pointer-events-none absolute inset-0" 
        style={{ background: `linear-gradient(${gradientAngle}deg, transparent 40%, rgba(255,255,255,${alpha}) 50%, transparent 60%)` }} 
      />
    </motion.div>
  );
}

export function Shatter({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Cover Layer
   * Stays solid hiding all shards. At the exact trigger point, it vanishes,
   * handing the display perfectly over to the static shards before they explode.
   */
  outgoing.style.opacity = useTransform(
    progress, 
    [0, TRIGGER - 0.001, TRIGGER], 
    [1, 1, 0]
  );

  /*
   * 2. Incoming Layer
   * Adjusted to fade in smoothly exactly as the shatter reveals what's behind it.
   */
  incoming.style.opacity = useTransform(progress, [0, 0.20, 0.45], [0, 0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {SHARDS.map((shard, i) => (
        <ShardPiece
          key={i}
          index={i}
          shard={shard}
          trajectory={TRAJECTORIES[i]}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(Shatter as TransitionComponent).copies = true;