'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography pin reveal.
 *
 * The current section pins in place (dims via brightness filter) while the
 * next section slides up over it with a deep shadow.
 *
 * Shape: layer-choreography (filter on outgoing, y on incoming).
 */
export function PinReveal({ progress, outgoing, incoming }: TransitionProps) {
  const dim = useTransform(progress, [0, 1], [1, 0.5]);
  const filter = useMotionTemplate`brightness(${dim})`;
  const y = useTransform(progress, [0, 1], ['100%', '0%']);

  outgoing.style.filter = filter;

  incoming.style.y = y;
  incoming.style.boxShadow = '0 -40px 100px rgba(0,0,0,0.5)';

  return null;
}
