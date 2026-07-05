'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Effect-overlay gravitational-lens warp (Bright Cinematic Edition).
 *
 * Space itself bends between sections. Horizontal strips skew, stretch, 
 * and refract light in a gravitational wave. The dark overlays have been 
 * removed for a pure, bright, optical glass effect.
 */
const STRIP_COUNT = 24; 

function WarpStrip({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const centerDist = Math.abs(index - (STRIP_COUNT - 1) / 2) / ((STRIP_COUNT - 1) / 2);
  const isTop = index < STRIP_COUNT / 2;
  const dir = isTop ? 1 : -1;

  const delay = centerDist * 0.25;
  const peak = 0.4 + delay; 
  const end = Math.min(1, peak + 0.35);

  const skewMag = 45 * (1 - centerDist) * dir; 
  const xMag = 120 * (1 - centerDist) * dir; 
  const scaleXMag = 1 + 1.2 * (1 - centerDist); 

  const skewX = useTransform(progress, [0, delay, peak, end], [0, 0, skewMag, 0]);
  const x = useTransform(progress, [0, delay, peak, end], [0, 0, xMag, 0]);
  const scaleX = useTransform(progress, [0, delay, peak, end], [1, 1, scaleXMag, 1]);
  
  // Overlap strips to prevent transparent gaps
  const scaleY = useTransform(progress, [0, delay, peak, end], [1, 1, 1.5, 1]);

  // FIX: Reduced the dark overlay from 0.95 to just 0.1 for a bright, clean glass look
  const bgOpacity = useTransform(progress, [0, delay, peak, end], [0, 0, 0.1, 0]);
  const blurValue = useTransform(progress, [0, delay, peak, end], [0, 0, 16, 0]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  // FIX: Boosted the chromatic aberration opacity to keep it punchy and colorful
  const shadowOpacity = useTransform(progress, [0, delay, peak, end], [0, 0, 0.6, 0]);
  const boxShadow = useTransform(
    shadowOpacity,
    (v) => `inset 0 ${8 * dir}px 20px rgba(0,255,255,${v}), inset 0 ${-8 * dir}px 20px rgba(255,0,255,${v})`
  );

  return (
    <motion.div
      aria-hidden
      className="relative flex-1 origin-center will-change-transform"
      style={{
        skewX: skewX as MotionValue<number>,
        x: x as MotionValue<number>,
        scaleX: scaleX as MotionValue<number>,
        scaleY: scaleY as MotionValue<number>,
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(255, 255, 255, ${v})`), 
        backdropFilter: filter as MotionValue<string>,
        boxShadow: boxShadow as MotionValue<string>,
        zIndex: Math.round((1 - centerDist) * 100), 
      }}
    />
  );
}

export function DepthLayers({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * FIX: Tighter crossfade. 
   * Outgoing stays at full opacity (1) until 0.45, then vanishes by 0.55.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.45, 0.55], [1, 1, 0]);
  outgoing.style.scale = useTransform(progress, [0, 0.55], [1, 1.15]);
  
  const outBlur = useTransform(progress, [0.3, 0.55], [0, 8]);
  outgoing.style.filter = useTransform(outBlur, (v) => `blur(${v}px)`);

  /*
   * FIX: Incoming starts showing exactly as outgoing vanishes (0.45), peaking at 0.55.
   * This ensures the screen is never left empty/dull.
   */
  incoming.style.opacity = useTransform(progress, [0.45, 0.55, 1], [0, 1, 1]);
  incoming.style.scale = useTransform(progress, [0.45, 1], [1.15, 1]);
  
  const inBlur = useTransform(progress, [0.45, 0.7], [8, 0]);
  incoming.style.filter = useTransform(inBlur, (v) => `blur(${v}px)`);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col overflow-hidden">
      {Array.from({ length: STRIP_COUNT }).map((_, i) => (
        <WarpStrip 
          key={i} 
          index={i} 
          progress={progress} 
        />
      ))}
      
      {/* Central Light Flash: Adds a bright pop exactly at the handoff point */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{
          opacity: useTransform(progress, [0.45, 0.5, 0.55], [0, 0.25, 0]),
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}

(DepthLayers as TransitionComponent).copies = true;