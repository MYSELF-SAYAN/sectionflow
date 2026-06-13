'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionTransitionProps } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const DEPTH_PLANES = 8;

/**
 * CameraFlythrough – depth planes rush toward the camera like a warp jump.
 * Dead zone: 0→0.30 — first section fully visible, planes invisible.
 * Transition fires from 0.30→1.00.
 */
export function CameraFlythrough({ first, second, height = 400, className }: SectionTransitionProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const planes = root.current!.querySelectorAll<HTMLElement>('.sf-fly-plane');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      });

      // 0.30→0.56: first section dims
      tl.fromTo(root.current!.querySelector('.sf-fly-first'), { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power1.in', duration: 0.26 }, 0.30);

      // 0.30→0.84: planes rush toward camera — staggered start
      planes.forEach((plane, i) => {
        const normalised = i / DEPTH_PLANES;
        const startScale = 0.06 + normalised * 0.7;
        const delay = 0.30 + normalised * 0.22;
        tl.fromTo(plane, { scale: startScale, autoAlpha: 0.9, z: -600 + i * 80 }, { scale: 2.5, autoAlpha: 0, z: 200, ease: 'power3.in', duration: 0.42 }, delay);
      });

      // 0.68→1.00: second section arrives
      tl.fromTo(root.current!.querySelector('.sf-fly-second'), { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.32 }, 0.68);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={{ height: `${height}vh` }} className={`relative w-full ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
        <div className="sf-fly-first absolute inset-0">{first}</div>
        {Array.from({ length: DEPTH_PLANES }, (_, i) => {
          const normalised = i / DEPTH_PLANES;
          const startScale = 0.06 + normalised * 0.7;
          const brightness = 0.5 + normalised * 0.5;
          return (
            <div key={i} className="sf-fly-plane absolute inset-0 overflow-hidden will-change-transform" style={{ transform: `scale(${startScale}) translateZ(${-600 + i * 80}px)`, filter: `brightness(${brightness})`, borderRadius: `${Math.max(0, 16 - i * 1.5)}px`, border: '1px solid rgba(255,255,255,0.05)', opacity: 0 }}>
              {first}
            </div>
          );
        })}
        <div className="sf-fly-second absolute inset-0" style={{ visibility: 'hidden', opacity: 0 }}>{second}</div>
      </div>
    </div>
  );
}
