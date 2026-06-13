import type { ReactNode } from 'react';

export interface SectionTransitionProps {
  /** The outgoing section – fills the screen when the track starts. */
  first: ReactNode;
  /** The incoming section – fills the screen when the track ends. */
  second: ReactNode;
  /** Scroll track height in vh. Longer = slower transition. @default 300 */
  height?: number;
  className?: string;
}
