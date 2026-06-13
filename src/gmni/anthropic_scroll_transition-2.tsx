import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function App() {
  // 1. Single master track to control the entire scroll timeline
  const containerRef = useRef<HTMLDivElement>(null);

  // We track scroll relative to the browser window (bulletproof in all iframes)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ==========================================
  // CARD 1: HERO CANVAS TRANSFORMATIONS (0.0 to 0.5)
  // ==========================================
  // Scales down from 1 to 0.88, then holds
  const heroScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 0.88, 0.88]);
  // Border radius goes from 0px to 48px, then holds
  const heroRadius = useTransform(scrollYProgress, [0, 0.45, 1], ["0px", "48px", "48px"]);
  // Text fades out quickly in the first half
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [1, 0, 0]);
  // Subtle parallax lift
  const heroY = useTransform(scrollYProgress, [0, 0.45, 1], [0, -80, -80]);


  // ==========================================
  // CARD 2: GLASSWING CANVAS TRANSFORMATIONS (0.45 to 0.9)
  // ==========================================
  // Slides up from off-screen bottom to fully covering the viewport
  const card2Y = useTransform(scrollYProgress, [0.4, 0.85, 1], ["100vh", "0vh", "0vh"]);
  // Starts rounded, then flattens out to 0px as it fits the full screen
  const card2Radius = useTransform(scrollYProgress, [0.4, 0.85, 1], ["48px", "0px", "0px"]);
  // Smoothly fade in content as it arrives
  const card2ContentOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  return (
    <main className="relative w-full bg-[#191919] font-sans selection:bg-[#fbfaf7] selection:text-[#191919]">
      
      {/* -------------------------------------------
          THE TIMELINE MASTER TRACK (300vh)
          Provides 3 screens worth of scroll duration to pin animations
          ------------------------------------------- */}
      <div
        ref={containerRef}
        className="relative w-full h-[300vh] overflow-visible"
      >
        {/* Sticky viewport container - keeps things fixed on screen */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          
          {/* CARD 1: Bright Hero Canvas */}
          <motion.div
            style={{ 
              scale: heroScale, 
              borderRadius: heroRadius 
            }}
            className="absolute inset-0 w-full h-full bg-[#fbfaf7] text-[#191919] flex flex-col items-center justify-center origin-center will-change-transform shadow-[0_0_80px_rgba(0,0,0,0.5)] z-10"
          >
            <motion.div
              style={{ opacity: heroOpacity, y: heroY }}
              className="flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center"
            >
              <span className="font-mono uppercase tracking-[0.2em] text-xs md:text-sm font-semibold mb-6 text-[#191919]/60">
                Claude 3.5 Series
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif tracking-tighter mb-8 leading-[0.9]">
                Intelligence,
                <br />
                evolved.
              </h1>
              <p className="text-lg md:text-2xl font-sans tracking-tight text-[#191919]/80 max-w-2xl leading-relaxed">
                Our most advanced models yet. Unmatched reasoning, speed, and
                coding capabilities designed for the frontier.
              </p>
            </motion.div>
          </motion.div>

          {/* CARD 2: Sliding Glasswing Canvas */}
          <motion.div
            style={{ 
              y: card2Y,
              borderTopLeftRadius: card2Radius,
              borderTopRightRadius: card2Radius
            }}
            className="absolute inset-0 w-full h-full bg-[#141414] text-[#fbfaf7] z-20 overflow-hidden flex flex-col justify-center shadow-[0_-30px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Animating the inner elements synchronously */}
            <motion.div 
              style={{ opacity: card2ContentOpacity }}
              className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-32 py-12 flex flex-col justify-between h-full max-h-[85vh]"
            >
              
              {/* Header Grid */}
              <div className="border-b border-white/10 pb-8 md:pb-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                  <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-serif tracking-tighter font-medium leading-[0.9]">
                    safety at the frontier
                  </h2>
                  <p className="max-w-xs text-base md:text-lg text-[#fbfaf7]/60 leading-snug">
                    dedicated to securing its benefits and mitigating its risks.
                  </p>
                </div>
              </div>

              {/* Core Content */}
              <div className="flex flex-col items-start max-w-3xl mt-8">
                <h3 className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif mb-6 leading-[0.9] tracking-tight">
                  Project<br/>Glasswing
                </h3>
                <p className="text-lg md:text-2xl text-[#fbfaf7]/80 font-serif italic mb-8 md:mb-12 leading-snug">
                  Securing critical software<br/>for the AI era
                </p>
                <button className="bg-[#fbfaf7] text-[#141414] px-8 py-4 rounded-full font-medium hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  Continue reading
                </button>
              </div>

            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* -------------------------------------------
          SECTION 3: CONTINUOUS CONTENT FLOW
          Naturally scrolls into view after the sticky track completes
          ------------------------------------------- */}
      <section className="relative w-full min-h-screen bg-[#141414] text-[#fbfaf7] z-30 px-6 md:px-12 lg:px-32 py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h4 className="text-mono uppercase tracking-[0.2em] text-sm font-semibold mb-8 text-[#fbfaf7]/40">
            Our Approach
          </h4>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-12">
            AI safety requires active research and real-world testing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-[#fbfaf7]/70 leading-relaxed">
            <p>
              We design our models to be safe, reliable, and aligned with human values. Through intensive red-teaming, external audits, and cutting-edge safety protocols, we make sure Claude acts as a trusted assistant.
            </p>
            <p>
              Our research team is continuously pioneering new methods of alignment, interpretability, and robust verification to stay ahead of capabilities and ensure secure model deployment globally.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}