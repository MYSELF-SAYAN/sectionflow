'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useScroll, useSpring, type MotionValue } from 'framer-motion';

const ProgressContext = createContext<MotionValue<number> | null>(null);

/** Spring-smoothed 0→1 scroll progress of the parent <TransitionTrack>. */
export function useTrackProgress(): MotionValue<number> {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error('useTrackProgress must be used inside <TransitionTrack>');
  }
  return value;
}

export interface TransitionTrackProps {
  children: ReactNode;
  /** Track height in vh – longer tracks make the transition slower. */
  height?: number;
  className?: string;
}

/**
 * Sticky scroll track shared by every SectionFlow transition.
 * Renders a tall scroll region with a pinned full-screen viewport and
 * provides a spring-smoothed scroll progress value to its children.
 * This is the same sticky-track pattern used by the presets in src/gmni.
 */
export function TransitionTrack({
  children,
  height = 300,
  className,
}: TransitionTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0001,
  });

  return (
    <div
      ref={ref}
      style={{ height: `${height}vh` }}
      className={`relative w-full ${className ?? ''}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressContext.Provider value={smooth}>
          {children}
        </ProgressContext.Provider>
      </div>
    </div>
  );
}
