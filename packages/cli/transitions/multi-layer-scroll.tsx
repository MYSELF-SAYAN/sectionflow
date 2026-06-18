'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const LAYER_COUNT = 6;

const LAYER_CONFIG = [
  { yFrom: '-110%', yTo: '0%', xFrom: '0%',    xTo: '0%',   skew: 0,  brightness: 1.0, delay: 0 },
  { yFrom: '0%',   yTo: '0%', xFrom: '-105%',  xTo: '0%',   skew: -3, brightness: 0.9, delay: 0.04 },
  { yFrom: '110%', yTo: '0%', xFrom: '0%',     xTo: '0%',   skew: 0,  brightness: 0.8, delay: 0.08 },
  { yFrom: '0%',   yTo: '0%', xFrom: '105%',   xTo: '0%',   skew: 3,  brightness: 0.85, delay: 0.12 },
  { yFrom: '-110%', yTo: '0%', xFrom: '0%',    xTo: '0%',   skew: 2,  brightness: 0.75, delay: 0.16 },
  { yFrom: '0%',   yTo: '0%', xFrom: '-105%',  xTo: '0%',   skew: -2, brightness: 0.7, delay: 0.20 },
] as const;

/**
 * MultiLayerScroll – six layers enter from different directions on one timeline.
 * Dead zone: 0→0.30 — first section fully visible.
 * Transition fires from 0.30→1.00.
 */
export function MultiLayerScroll({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const layers = root.current!.querySelectorAll<HTMLElement>('.sf-mls-layer');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // 0.30→0.54: dim outgoing section
      tl.fromTo(root.current!.querySelector('.sf-mls-first'), { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.96, ease: 'none', duration: 0.24 }, 0.30);

      // Layers slide in — each remapped from [0.30+delay, 0.30+delay+0.40]
      layers.forEach((layer, i) => {
        const cfg = LAYER_CONFIG[i];
        const start = 0.30 + cfg.delay;
        tl.fromTo(layer, { x: cfg.xFrom, y: cfg.yFrom, skewX: cfg.skew, autoAlpha: 0 }, { x: cfg.xTo, y: cfg.yTo, skewX: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.40 }, start);
      });

      // Consolidate last layer at end
      tl.to(layers, { opacity: (i) => (i === LAYER_COUNT - 1 ? 1 : 0), duration: 0.18, ease: 'power1.out' }, 0.80);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="sf-mls-first absolute inset-0">{first}</div>
        {Array.from({ length: LAYER_COUNT }, (_, i) => {
          const cfg = LAYER_CONFIG[i];
          const clips = [
            'polygon(0% 0%, 100% 0%, 100% 17%, 0% 17%)',
            'polygon(0% 17%, 100% 17%, 100% 34%, 0% 34%)',
            'polygon(0% 34%, 100% 34%, 100% 51%, 0% 51%)',
            'polygon(0% 51%, 100% 51%, 100% 68%, 0% 68%)',
            'polygon(0% 68%, 100% 68%, 100% 84%, 0% 84%)',
            'polygon(0% 84%, 100% 84%, 100% 100%, 0% 100%)',
          ];
          return (
            <div key={i} className="sf-mls-layer absolute inset-0 overflow-hidden will-change-transform" style={{ clipPath: clips[i], filter: `brightness(${cfg.brightness})`, opacity: 0, transform: `translateX(${cfg.xFrom}) translateY(${cfg.yFrom})` }}>
              <div className="absolute inset-0">{second}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
