"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';

export default function App() {
  const glasswingRef = useRef<HTMLDivElement>(null);

  // Track Section 2 as it travels through the viewport
  const { scrollYProgress } = useScroll({
    target: glasswingRef,
    offset: ["start end", "center center"], 
  });

  // ==========================================
  // FIXED 60% SCROLL THRESHOLD TRIGGER
  // ==========================================
  // Input array [0, 0.6, 1]:
  // - From 0% to 60% scroll progress: Values stay locked at maximum inset (5vw, 5vh, 40px)
  // - From 60% to 100% scroll progress: Values dynamically shrink down to 0, expanding the card
  const hInsetNum = useTransform(scrollYProgress, [0, 0.6, 1], [5, 5, 0]); 
  const vInsetNum = useTransform(scrollYProgress, [0, 0.6, 1], [5, 5, 0]); 
  const radiusNum = useTransform(scrollYProgress, [0, 0.6, 1], [40, 40, 0]);

  // Adjusting spring physics: Higher stiffness makes the expansion punchy and responsive
  // the moment the page crosses that 60% mark.
  const springConfig = { stiffness: 220, damping: 28, bounce: 0 };
  const hSpring = useSpring(hInsetNum, springConfig);
  const vSpring = useSpring(vInsetNum, springConfig);
  const rSpring = useSpring(radiusNum, springConfig);

  const bgLeftRight = useMotionTemplate`${hSpring}vw`;
  const bgTopBottom = useMotionTemplate`${vSpring}vh`;
  const bgRadius = useMotionTemplate`${rSpring}px`;

  return (
    <div className="w-full bg-[#fbfaf7] text-[#191919] antialiased">
      
      {/* ==========================================
          SECTION 1: FIXED HERO SECTION
          ========================================== */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center p-6 md:p-12 z-10 overflow-hidden">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center mt-20">
          <span className="font-mono uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-6 text-[#191919]/40">
            Claude 3.5 Series
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-serif tracking-tighter mb-6 sm:mb-8 leading-[0.9] text-[#191919]">
            Intelligence,
            <br />
            evolved.
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-sans tracking-tight text-[#191919]/70 max-w-2xl leading-relaxed">
            Our most advanced models yet. Unmatched reasoning, speed, and coding capabilities designed for the frontier.
          </p>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: PROJECT GLASSWING (DELAYED EXPANSION)
          ========================================== */}
      <section ref={glasswingRef} className="relative w-full min-h-screen z-20 flex flex-col items-center justify-center overflow-hidden">
        
        {/* THE EXPANDING BACKGROUND LAYER */}
        <motion.div 
          style={{ 
            left: bgLeftRight, 
            right: bgLeftRight, 
            top: bgTopBottom, 
            bottom: bgTopBottom,
            borderRadius: bgRadius
          }}
          className="absolute bg-[#141414]  overflow-hidden flex flex-col lg:flex-row border border-white/5"
        >
          {/* Decorative graphic layer */}
          <div className="hidden lg:flex absolute right-0 top-0 w-1/2 h-full bg-[#0a0a0a] border-l border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffffff0d] via-transparent to-transparent"></div>
            <svg className="absolute w-[180%] h-[180%] opacity-40 animate-[spin_180s_linear_infinite]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hex-grid" width="46" height="79.67" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                  <path d="M23 0 L46 13.28 L46 53.11 L23 66.39 L0 53.11 L0 13.28 Z" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeOpacity="0.25" />
                  <circle cx="23" cy="0" r="2.5" fill="#ffffff" fillOpacity="0.4" />
                  <circle cx="46" cy="13.28" r="1.5" fill="#ffffff" fillOpacity="0.3" />
                  <circle cx="0" cy="13.28" r="1.5" fill="#ffffff" fillOpacity="0.3" />
                  <circle cx="46" cy="53.11" r="2" fill="#ffffff" fillOpacity="0.35" />
                  <circle cx="0" cy="53.11" r="2" fill="#ffffff" fillOpacity="0.35" />
                  <circle cx="23" cy="66.39" r="2.5" fill="#ffffff" fillOpacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex-grid)" />
            </svg>
            <div className="absolute w-[140%] h-[1.5px] bg-white/60 rotate-[22deg] top-[45%] left-[-20%] shadow-[0_0_30px_10px_rgba(255,255,255,0.2)] z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none"></div>
          </div>
        </motion.div>

        {/* STATIC CONTENT LAYER */}
        <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row text-[#fbfaf7] pointer-events-none px-[5vw] py-[5vh]">
          <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center items-start pointer-events-auto h-full min-h-[60vh] lg:min-h-screen">
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif mb-6 leading-[0.95] tracking-tight">
              Project<br />Glasswing
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl text-[#fbfaf7]/60 font-serif italic mb-10">
              Securing critical software for the AI era
            </p>
            <button className="bg-[#fbfaf7] text-[#141414] px-8 py-4 rounded-full font-medium text-base hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl">
              Continue reading
            </button>
          </div>
          <div className="hidden lg:flex w-full lg:w-1/2 h-full"></div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: CONTINUATION
          ========================================== */}
      <section className="relative w-full min-h-screen bg-[#141414] text-[#fbfaf7] z-30 px-6 sm:px-12 lg:px-24 xl:px-32 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-6 sm:mb-8 block text-[#fbfaf7]/40">
            Our Mission & Approach
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight mb-12 sm:mb-16 max-w-4xl leading-[1.1]">
            AI safety requires active research and real-world testing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 text-base sm:text-lg text-[#fbfaf7]/70 leading-relaxed font-sans">
            <p>
              We design our models to be safe, reliable, and aligned with human values. Through intensive red-teaming, external audits, and cutting-edge safety protocols, we make sure Claude acts as a trusted assistant.
            </p>
            <p>
              Our research team is continuously pioneering new methods of alignment, interpretability, and robust verification to stay ahead of capabilities and ensure secure model deployment globally.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}