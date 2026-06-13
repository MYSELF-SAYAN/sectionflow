import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Sparkles, Cpu, Zap, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor global page scroll progress for the top progress bar
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="bg-[#030303] text-white min-h-screen font-sans selection:bg-rose-500 selection:text-white relative overflow-clip"
    >
      
      {/* -------------------------------------------------------------
          PREMIUM HEADER
          ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-5 flex justify-between items-center bg-[#030303]/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold tracking-[0.25em] text-xs font-mono text-white/90">
            KINETIC // FUSION
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono tracking-widest text-white/40">
          <span>ZERO-SEAM FUSION MATRIX</span>
          <span>SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Global Scroll Indicator Line */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 z-50 w-full origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* -------------------------------------------------------------
          SECTION 1: HERO (Scroll to trigger)
          ------------------------------------------------------------- */}
      <section className="h-screen w-full flex flex-col justify-between py-32 px-6 relative z-10 bg-[#030303]">
        <div /> {/* Spacer */}
        
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Zero-Seam Subpixel Synthesis
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            SCROLL TO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              ASSEMBLE.
            </span>
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed">
            As you scroll down, the viewport will lock on Section 2. The left and right panels will slide inwards, aligning with sub-pixel mathematical precision to form a single, flawless design canvas.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-white/30 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Initiate Lock</span>
          <ArrowDown className="w-4 h-4 text-rose-500" />
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: THE STICKY SPLIT TRANSITION (Locked Viewport)
          ------------------------------------------------------------- */}
      <SplitSectionTrack />

      {/* -------------------------------------------------------------
          SECTION 3: OUTRO
          ------------------------------------------------------------- */}
      <section className="h-screen w-full flex flex-col justify-center items-center py-24 px-6 relative z-10 border-t border-white/5 bg-[#030303]">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-500 font-semibold block">
            // SEQUENCE COMPLETE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            UNLOCKED & <br /> UNIFIED.
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto font-light leading-relaxed pt-4">
            The screen-lock has released. You can now scroll back up to watch the section divide down the center line dynamically.
          </p>
        </div>
      </section>

    </div>
  );
}

// ============================================================================
// THE TRANSITION TRACK COMPONENT
// ============================================================================
function SplitSectionTrack() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress specifically while Section 2 is locked on screen
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  // High-performance spring configuration for a buttery-smooth, organic transition
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 110, 
    damping: 24, 
    mass: 0.1,
    restDelta: 0.0001
  });

  // Map the animation timeline:
  // Panels start fully separated (-100% and 100%).
  // They merge to exactly 0% by the time we scroll to 0.55 of the track.
  // They remain fully merged from 0.55 to 1.0 to allow clean reading.
  const leftX = useTransform(smoothProgress, [0, 0.55], ["-100%", "0%"]);
  const rightX = useTransform(smoothProgress, [0, 0.55], ["100%", "0%"]);
  
  // Elements scale up slightly as the doors close for dramatic effect
  const innerScale = useTransform(smoothProgress, [0, 0.55], [0.9, 1]);

  // Seam cleanups:
  // Fades out the seam borders and casting shadows BEFORE the doors fully merge (reaches 0 by 0.50 scroll)
  const seamOpacity = useTransform(smoothProgress, [0, 0.44, 0.50], [1, 0.8, 0]);
  const shadowIntensity = useTransform(smoothProgress, [0, 0.44, 0.50], [0.6, 0.3, 0]);

  // Translate status message
  const systemStatusText = useTransform(scrollYProgress, (pos) => {
    if (pos < 0.1) return "STANDBY";
    if (pos < 0.55) return `FUSING... ${Math.round((pos / 0.55) * 100)}%`;
    return "FUSION STABLE [LOCKED]";
  });

  return (
    <div ref={trackRef} className="relative h-[300vh] w-full bg-[#030303]">
      
      {/* THE STICKY VIEWPORT: Stays pinned on your screen for the duration of the track height */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030303]">
        
        {/* Main wrapper for the sliding panels */}
        <div className="relative w-full h-full flex flex-row">
          
          {/* ==============================================
              LEFT SLIDING DOOR (50% Width)
              ============================================== */}
          <motion.div 
            style={{ 
              x: leftX,
              boxShadow: useTransform(shadowIntensity, (opacity) => `15px 0 35px rgba(0, 0, 0, ${opacity})`),
            }}
            className="absolute left-0 top-0 w-1/2 h-full overflow-hidden z-10 bg-[#030303]"
          >
            {/* We render the child canvas exactly twice as wide as the parent door (width: 200%).
              Since the parent is 50% width, 200% of it equals exactly 100% of the screen width.
              This aligns both doors to the exact same screen pixel coordinates, ignoring scrollbars.
            */}
            <div className="absolute top-0 left-0 w-[200%] h-full">
              <UnifiedDesign scaleTransform={innerScale} />
            </div>
          </motion.div>

          {/* ==============================================
              RIGHT SLIDING DOOR (50% Width)
              ============================================== */}
          <motion.div 
            style={{ 
              x: rightX,
              boxShadow: useTransform(shadowIntensity, (opacity) => `-15px 0 35px rgba(0, 0, 0, ${opacity})`),
            }}
            className="absolute right-0 top-0 w-1/2 h-full overflow-hidden z-10 bg-[#030303]"
          >
            {/* We offset the right canvas to the left by exactly its width (-100%).
              This shifts it to start at 0% of the screen, creating an identical coordinate space to the left door!
            */}
            <div className="absolute top-0 left-[-100%] w-[200%] h-full">
              <UnifiedDesign scaleTransform={innerScale} />
            </div>
          </motion.div>

        </div>

        {/* Floating System Lock HUD Indicator */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0.05, 0.1, 0.9, 0.95], [0, 1, 1, 0]) }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <motion.div
              style={{
                color: useTransform(scrollYProgress, (pos) => pos >= 0.55 ? "#10b981" : "#f43f5e")
              }}
              className="flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold">VIEWPORT LOCKED</span>
            </motion.div>
            <div className="w-[1px] h-3 bg-white/20" />
            <motion.span className="text-[10px] font-mono tracking-wider text-white/60">
              {systemStatusText}
            </motion.span>
          </motion.div>
        </div>

        {/* Delicate center alignment hair-line that fades out completely before fusion */}
        <motion.div 
          style={{ opacity: seamOpacity }}
          className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-rose-500/30 to-transparent z-20 pointer-events-none" 
        />

      </div>
    </div>
  );
}

// ============================================================================
// THE BEAUTIFUL CENTRAL CANVAS (Rendered identically inside both doors)
// ============================================================================
function UnifiedDesign({ scaleTransform }: { scaleTransform: any }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative bg-[#030303] overflow-hidden">
      
      {/* Deep Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Decorative Technical UI Overlays */}
      <div className="absolute top-24 left-12 flex flex-col gap-1 text-[10px] font-mono tracking-widest text-white/30 hidden md:flex">
        <span>SECTOR: OMEGA</span>
        <span>COORD: 88.42.11</span>
      </div>
      <div className="absolute top-24 right-12 flex flex-col gap-1 text-[10px] font-mono tracking-widest text-white/30 text-right hidden md:flex">
        <span>STATUS: SYNCHRONIZED</span>
        <span>POWER: 100%</span>
      </div>

      {/* CENTRAL GRAPHIC & TYPOGRAPHY THAT GETS SLICED */}
      <motion.div 
        style={{ scale: scaleTransform }}
        className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center"
      >
        
        {/* Massive Glowing Core */}
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

        {/* Geometric Rings */}
        <div className="absolute w-[280px] h-[280px] md:w-[540px] md:h-[540px] rounded-full border border-white/[0.04] flex items-center justify-center pointer-events-none">
          <div className="w-[240px] h-[240px] md:w-[460px] md:h-[460px] rounded-full border border-rose-500/20 border-dashed animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[160px] h-[160px] md:w-[320px] md:h-[320px] rounded-full border border-orange-500/20" />
        </div>

        {/* Huge Central Typography */}
        <div className="relative z-10 flex flex-col items-center mix-blend-difference pointer-events-none">
          <h2 className="text-[12vw] sm:text-[10vw] font-black tracking-tighter text-white leading-none m-0">
            UNIFIED
          </h2>
          <span className="text-[4vw] sm:text-[3vw] font-bold tracking-[0.5em] text-white/50 leading-none mt-2">
            SYSTEMS
          </span>
        </div>

      </motion.div>

      {/* Bottom Technical Status Readout */}
      <div className="absolute bottom-16 w-full px-12 flex justify-between items-end">
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <Cpu className="w-5 h-5 text-rose-500" />
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">GPU Active</span>
          </div>
          <div className="flex flex-col gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Zero Latency</span>
          </div>
          <div className="flex flex-col gap-2 hidden sm:flex">
            <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Perfect Seam</span>
          </div>
        </div>

        <div className="text-[10px] font-mono tracking-widest text-white/20 text-right max-w-[200px] hidden sm:block select-none">
          BOTH PANELS RENDER IDENTICAL SYSTEM MATRICES.
        </div>
      </div>

    </div>
  );
}