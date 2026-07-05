'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography transition.
 *
 * The outgoing section settles back like a card (scale + brightness fade +
 * rounded corners) while the incoming section slides up over it with a soft
 * drop shadow. This animates the two real, once-mounted layers in place — no
 * clone, no second subtree.
 *
 * Shape: layer-choreography (transforms on both layers).
 */
export function CardStack({ progress, outgoing, incoming }: TransitionProps) {
  const scale = useTransform(progress, [0, 1], [1, 0.88]);
  const radius = useTransform(progress, [0, 1], [0, 36]);
  const brightness = useTransform(progress, [0, 1], [1, 0.45]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  const y = useTransform(progress, [0, 1], ['102%', '0%']);
  const inRadius = useTransform(progress, [0, 1], [44, 0]);

  outgoing.style.scale = scale;
  outgoing.style.borderRadius = radius;
  outgoing.style.filter = filter;

  incoming.style.y = y;
  incoming.style.borderTopLeftRadius = inRadius;
  incoming.style.borderTopRightRadius = inRadius;
  incoming.style.boxShadow = '0 -40px 120px rgba(0,0,0,0.5)';

  return null;
}
