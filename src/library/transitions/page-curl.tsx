'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionComponent, TransitionProps } from '../core/types';

/**
 * Page Curl
 * 
 * A hyper-realistic page curl transition simulating true 3D paper physics.
 * Features dynamic cylindrical shading, ambient occlusion, perspective lift, 
 * edge thickness highlights, and accurate geometric mirroring.
 */
export function PageCurl({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  // Main page clip-path: hides the curled portion
  const mainClipPath = useTransform(progress, (v) => {
    const X = v * 201; // Tiny offset to ensure it clears the screen
    
    const p2x = Math.min(100, 200 - X);
    const p2y = 0;
    
    const p3x = X <= 100 ? 100 : p2x;
    const p3y = X <= 100 ? 100 - X : 0;
    
    const p4x = X <= 100 ? 100 - X : 0;
    const p4y = X <= 100 ? 100 : 200 - X;
    
    const p5x = 0;
    const p5y = Math.min(100, 200 - X);

    return `polygon(0% 0%, ${p2x}% ${p2y}%, ${p3x}% ${p3y}%, ${p4x}% ${p4y}%, ${p5x}% ${p5y}%)`;
  });

  // Flap clip-path: the exact reflected shape of the curled portion
  const flapClipPath = useTransform(progress, (v) => {
    const X = v * 200;
    
    const pa_x = Math.min(100, 200 - X);
    const pa_y = Math.max(0, 100 - X);
    
    const pb_x = X > 100 ? 100 : pa_x;
    const pb_y = X > 100 ? 0 : pa_y;
    
    const pc_x = 100;
    const pc_y = 100;
    
    const pd_x = X > 100 ? 0 : Math.max(0, 100 - X);
    const pd_y = X > 100 ? 100 : Math.min(100, 200 - X);
    
    const pe_x = Math.max(0, 100 - X);
    const pe_y = Math.min(100, 200 - X);

    const reflect = (x: number, y: number) => {
      return [(200 - X - y).toFixed(2), (200 - X - x).toFixed(2)];
    };

    const [f1x, f1y] = reflect(pa_x, pa_y);
    const [f2x, f2y] = reflect(pb_x, pb_y);
    const [f3x, f3y] = reflect(pc_x, pc_y);
    const [f4x, f4y] = reflect(pd_x, pd_y);
    const [f5x, f5y] = reflect(pe_x, pe_y);

    return `polygon(${f1x}% ${f1y}%, ${f2x}% ${f2y}%, ${f3x}% ${f3y}%, ${f4x}% ${f4y}%, ${f5x}% ${f5y}%)`;
  });

  // Flap background with 3D cylindrical shading
  const flapBackground = useTransform(progress, (v) => {
    const p = v * 100;
    return `linear-gradient(to top left, 
      transparent 0%, 
      transparent ${p}%, 
      #3f3f46 ${p}%, 
      #a1a1aa max(0%, calc(${p}% + 1.5%)), 
      #ffffff max(0%, calc(${p}% + 8%)), 
      #f4f4f5 max(0%, calc(${p}% + 15%)), 
      #e4e4e7 max(0%, calc(${p}% + 30%))
    )`;
  });

  // Dynamic filter for the flap: thickness highlight + expanding soft drop shadow
  const flapFilter = useTransform(progress, (v) => {
    const offset = v * 30;
    const blur = v * 40;
    return `drop-shadow(1px 1px 0px rgba(255,255,255,0.9)) drop-shadow(${offset}px ${offset}px ${blur}px rgba(0,0,0,0.5))`;
  });

  // Hide the real outgoing layer immediately so our clip-path overlay takes over
  outgoing.style.opacity = useTransform(progress, [0, 0.01], [1, 0]);
  
  // Brightness reveal on the incoming page to simulate passing shadow
  incoming.style.filter = useTransform(progress, [0, 0.8, 1], ['brightness(0.6)', 'brightness(0.95)', 'brightness(1)']);

  // Only render the flap when progress > 0 to avoid visual artifacts at rest
  const opacity = useTransform(progress, [0, 0.02], [0, 1]);

  return (
    <>
      {/* Main flat part of the outgoing page, rendered as an overlay so we can clip it */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          clipPath: mainClipPath,
        }}
      >
        {outgoing.render?.()}
      </motion.div>

      {/* The 3D curled flap overlay */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath: flapClipPath,
          filter: flapFilter,
          opacity,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: flapBackground,
          }}
        />
      </motion.div>
    </>
  );
}

(PageCurl as TransitionComponent).copies = true;
