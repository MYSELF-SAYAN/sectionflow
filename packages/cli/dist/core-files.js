/** Source for types.ts — written to components/sectionflow/core/types.ts */
export const TYPES_SOURCE = `import type { ReactNode } from 'react';

export interface SectionTransitionProps {
  /** The outgoing section – fills the screen when the track starts. */
  first: ReactNode;
  /** The incoming section – fills the screen when the track ends. */
  second: ReactNode;
  /**
   * Scroll track height in vh.
   * Longer = slower, more cinematic transition.
   * @default 300
   */
  height?: number;
  className?: string;
}
`;
/** Source for transition-track.tsx — written to components/sectionflow/core/transition-track.tsx */
export const TRACK_SOURCE = `'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useScroll, useSpring, type MotionValue } from 'framer-motion';

const ProgressContext = createContext<MotionValue<number> | null>(null);

/**
 * Spring-smoothed 0→1 scroll progress provided to all SectionFlow transitions.
 * Must be called inside a <TransitionTrack>.
 */
export function useTrackProgress(): MotionValue<number> {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useTrackProgress must be used inside <TransitionTrack>');
  return value;
}

export interface TransitionTrackProps {
  children: ReactNode;
  /** Scroll track height in vh – longer tracks make the transition slower. @default 300 */
  height?: number;
  className?: string;
}

/**
 * Sticky scroll track shared by every SectionFlow transition.
 *
 * Creates a tall scrollable region with a pinned full-screen viewport.
 * Provides a spring-smoothed 0→1 progress MotionValue to children via React context.
 *
 * Timing convention:
 *   0%–25%   Content viewing phase (no animation)
 *   25%–75%  Transition buildup
 *   75%–100% Section handoff
 */
export function TransitionTrack({ children, height = 300, className }: TransitionTrackProps) {
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
      style={{ height: \`\${height}vh\` }}
      className={\`relative w-full \${className ?? ''}\`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressContext.Provider value={smooth}>
          {children}
        </ProgressContext.Provider>
      </div>
    </div>
  );
}
`;
//# sourceMappingURL=core-files.js.map