import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Power, Settings2, Activity, Disc, Fingerprint, Lock, Unlock, ArrowDown, ChevronUp } from 'lucide-react';

// ============================================================================
// NEO-SKEUOMORPHIC THEME CONSTANTS
// Base: #1e1d22 (Warm Matte Charcoal)
// Dark Shadow: #161519
// Light Shadow: #2b2a30
// ============================================================================

export default function App() {
  const containerRef = useRef(null);
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="bg-[#1e1d22] text-[#e8e6e3] min-h-screen font-sans selection:bg-[#ff4500] selection:text-white relative antialiased"
    >
      {/* Global Noise Texture for Physical Material Feel */}
      <svg className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.15] mix-blend-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* -------------------------------------------------------------
          PHYSICAL HEADER (Embossed Control Bar)
          ------------------------------------------------------------- */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl px-6 py-4 flex justify-between items-center bg-[#1e1d22] rounded-2xl shadow-[8px_8px_16px_#161519,-8px_-8px_16px_#2b2a30]">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-full shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] flex items-center justify-center bg-[#1a191d]">
            <Power className="w-4 h-4 text-[#ff4500]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.2em] text-xs text-[#a09e9a]">
              APEX // ACOUSTICS
            </span>
            <span className="text-[9px] text-[#6b6965] tracking-widest font-mono">
              ANALOG SYNTHESIS
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] tracking-widest font-mono font-semibold text-[#6b6965]">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-[inset_2px_2px_4px_#161519,inset_-2px_-2px_4px_#2b2a30] bg-[#1a191d]">
            <Activity className="w-3 h-3 text-[#00ffcc]" />
            <span>FREQ: <span className="text-[#a09e9a]">44.1kHz</span></span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-[inset_2px_2px_4px_#161519,inset_-2px_-2px_4px_#2b2a30] bg-[#1a191d]">
            <span>LCL_TIME: <span className="text-[#a09e9a]">{time}</span></span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          SECTION 1: HERO (Recessed Faceplate)
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 pt-32 pb-12 z-10">
        
        <div className="w-full max-w-5xl rounded-[3rem] p-8 md:p-16 shadow-[inset_12px_12px_24px_#161519,inset_-12px_-12px_24px_#2b2a30] bg-[#1e1d22] relative overflow-hidden flex flex-col items-center text-center">
          
          {/* Physical Panel Screws */}
          <Screw top="top-8" left="left-8" />
          <Screw top="top-8" left="right-8" />
          <Screw top="bottom-8" left="left-8" />
          <Screw top="bottom-8" left="right-8" />

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full shadow-[4px_4px_8px_#161519,-4px_-4px_8px_#2b2a30] text-[10px] tracking-widest text-[#a09e9a] uppercase font-bold bg-[#1e1d22]">
            <div className="w-2 h-2 rounded-full bg-[#ff4500] shadow-[0_0_8px_#ff4500]" />
            Mechanical Interlock Active
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#1e1d22] uppercase drop-shadow-[2px_2px_2px_rgba(255,255,255,0.05)]" style={{ textShadow: '4px 4px 8px #161519, -4px -4px 8px #2b2a30' }}>
            TACTILE <br />
            ALIGNMENT
          </h1>

          <p className="mt-8 text-[#8a8883] text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Scroll downwards to engage the locking chassis. Two heavy-duty physical panels will slide into place vertically. Notice the perfect flush seam as the extruded mechanical dials merge into a single solid component.
          </p>

          {/* Physical Scroll Wheel */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#6b6965]">ENGAGE TRACK</span>
            <div className="w-8 h-20 rounded-full shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] bg-[#1a191d] flex justify-center p-1 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 48, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-6 rounded-full shadow-[2px_2px_4px_#000,-1px_-1px_2px_#333] bg-gradient-to-b from-[#3a393e] to-[#1e1d22] border border-[#4a494e] flex items-center justify-center"
              >
                <div className="w-3 h-0.5 bg-[#a09e9a]/50 rounded-full" />
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: THE SPLIT CHASSIS (Locked Viewport)
          ------------------------------------------------------------- */}
      <SplitSectionTrack />

      {/* -------------------------------------------------------------
          SECTION 3: OUTRO DASHBOARD
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-6 z-10 bg-[#1e1d22]">
        
        <div className="w-full max-w-4xl rounded-[2rem] shadow-[12px_12px_24px_#161519,-12px_-12px_24px_#2b2a30] bg-[#1e1d22] p-8 sm:p-12">
          <div className="flex justify-between items-center border-b border-[#2b2a30] pb-6 mb-8">
            <h2 className="text-xl font-bold tracking-widest text-[#a09e9a] flex items-center gap-4">
              <Settings2 className="w-6 h-6" />
              SYSTEM DIAGNOSTICS
            </h2>
            <div className="px-3 py-1 rounded shadow-[inset_2px_2px_4px_#161519,inset_-2px_-2px_4px_#2b2a30] bg-[#1a191d]">
              <span className="text-[10px] font-mono tracking-widest text-[#00ffcc]">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-[#8a8883] leading-relaxed">
                The mechanical chassis has fully locked. The vertical seam has been sealed, leaving no visible trace. You are now permitted to release the interlock and scroll back to the top of the interface.
              </p>
              
              <div className="space-y-4 pt-4">
                <DataRow label="SEAM TOLERANCE" value="0.0001 MM" />
                <DataRow label="MATERIAL" value="MATTE POLYMER" />
                <DataRow label="ACTUATOR LIFT" value="HARDWARE ACCEL" />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-8 bg-[#1a191d] rounded-2xl shadow-[inset_6px_6px_12px_#161519,inset_-6px_-6px_12px_#2b2a30] p-8">
              <div className="w-24 h-24 rounded-full shadow-[6px_6px_12px_#161519,-6px_-6px_12px_#2b2a30] bg-[#1e1d22] flex items-center justify-center relative">
                 <div className="absolute inset-2 rounded-full border-2 border-[#00ffcc] opacity-20" />
                 <Fingerprint className="w-10 h-10 text-[#a09e9a]" />
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 rounded-xl shadow-[6px_6px_12px_#161519,-6px_-6px_12px_#2b2a30] active:shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] bg-[#1e1d22] transition-all duration-200 flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-[#a09e9a] uppercase"
              >
                <ChevronUp className="w-4 h-4" />
                Disengage & Return
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

// Reusable decorative screw component
function Screw({ top, left }: { top: string; left: string }) {
  return (
    <div className={`absolute ${top} ${left} w-5 h-5 rounded-full shadow-[inset_2px_2px_4px_#161519,2px_2px_2px_rgba(255,255,255,0.05)] bg-[#1a191d] flex items-center justify-center pointer-events-none`}>
      <div className="w-3 h-[1.5px] bg-[#0c0c0e] rounded-full rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
    </div>
  );
}

// Reusable data row for the dashboard
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-[#2b2a30] pb-2">
      <span className="text-[10px] tracking-widest font-mono text-[#6b6965]">{label}</span>
      <span className="text-[10px] tracking-widest font-mono text-[#a09e9a]">{value}</span>
    </div>
  );
}

// ============================================================================
// THE TRANSITION TRACK COMPONENT
// ============================================================================
function SplitSectionTrack() {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 80, 
    damping: 26, 
    mass: 0.2,
    restDelta: 0.0001
  });

  const leftY = useTransform(smoothProgress, [0, 0.55, 1], ["-100%", "0%", "0%"]);
  const rightY = useTransform(smoothProgress, [0, 0.55, 1], ["100%", "0%", "0%"]);
  
  // Physical pressure effect: doors slightly "push in" as they slide, then snap flush
  const innerScale = useTransform(smoothProgress, [0, 0.55, 1], [0.92, 1, 1]);

  // FADE THE SHADOWS AND PIT TO 0 RIGHT BEFORE THE MERGE 
  // This physically prevents DOM stack shadowing from bleeding over the seam
  const shadowOpacity = useTransform(smoothProgress, [0, 0.45, 0.54], [0.6, 0.3, 0]);
  const pitOpacity = useTransform(smoothProgress, [0, 0.45, 0.54], [1, 0.5, 0]);

  // Translate lock status
  const isLocked = useTransform(smoothProgress, (pos) => pos >= 0.54);

  return (
    <div ref={trackRef} className="relative h-[300vh] w-full bg-[#1e1d22]">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1e1d22]">
        
        {/* Deep recessed background seen BEFORE doors close.
            It completely fades out before merge to avoid showing through subpixel gaps. */}
        <motion.div 
          style={{ opacity: pitOpacity }}
          className="absolute inset-0 bg-[#161519] shadow-[inset_15px_15px_30px_#0c0c0e,inset_-15px_-15px_30px_#1e1d22] z-0 flex items-center justify-center pointer-events-none"
        >
           <span className="text-[#2b2a30] text-xl font-bold tracking-[0.5em]">CHASSIS BAY</span>
        </motion.div>

        {/* Main wrapper for the sliding doors */}
        <div className="relative w-full h-full flex flex-row z-10">
          
          {/* ==============================================
              LEFT DOOR (50% Width, descending)
              ============================================== */}
          <motion.div 
            style={{ 
              y: leftY,
              boxShadow: useTransform(shadowOpacity, (op) => `0 30px 60px rgba(0,0,0,${op})`)
            }}
            className="absolute left-0 top-0 w-1/2 h-full overflow-hidden bg-[#1e1d22] z-10"
          >
            {/* The Unified Design Canvas - Anchored Left */}
            <div className="absolute top-0 left-0 w-[200%] h-full">
              <PhysicalDial scaleTransform={innerScale} />
            </div>
          </motion.div>

          {/* ==============================================
              RIGHT DOOR (50% Width, ascending)
              ============================================== */}
          <motion.div 
            style={{ 
              y: rightY,
              boxShadow: useTransform(shadowOpacity, (op) => `0 -30px 60px rgba(0,0,0,${op})`)
            }}
            className="absolute right-0 top-0 w-1/2 h-full overflow-hidden bg-[#1e1d22] z-10"
          >
            {/* The Unified Design Canvas - Anchored Right */}
            <div className="absolute top-0 left-[-100%] w-[200%] h-full">
              <PhysicalDial scaleTransform={innerScale} />
            </div>
          </motion.div>

        </div>

        {/* Physical LED Status Module (Floating above everything) */}
        <div className="absolute top-1/4 left-12 z-30 pointer-events-none hidden md:block">
          <div className="flex flex-col gap-4 p-6 rounded-2xl shadow-[8px_8px_16px_#161519,-8px_-8px_16px_#2b2a30] bg-[#1e1d22] border border-[#2b2a30]/50">
            <span className="text-[10px] tracking-widest font-bold text-[#6b6965] border-b border-[#2b2a30] pb-2">INTERLOCK</span>
            
            <motion.div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] bg-[#1a191d] flex items-center justify-center">
                <motion.div 
                  style={{ color: useTransform(isLocked, (locked) => locked ? "#6b6965" : "#ff4500") }}
                >
                  <Unlock className="w-4 h-4" />
                </motion.div>
              </div>
              <span className="text-[9px] tracking-wider font-mono text-[#a09e9a]">TRANSIT</span>
            </motion.div>

            <motion.div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] bg-[#1a191d] flex items-center justify-center">
                <motion.div 
                  style={{ color: useTransform(isLocked, (locked) => locked ? "#00ffcc" : "#6b6965") }}
                >
                  <Lock className="w-4 h-4" />
                </motion.div>
              </div>
              <span className="text-[9px] tracking-wider font-mono text-[#a09e9a]">SECURE</span>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// THE MASSIVE PHYSICAL DIAL (Rendered seamlessly across both doors)
// ============================================================================
function PhysicalDial({ scaleTransform }: { scaleTransform: MotionValue<number> | number }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative bg-[#1e1d22] overflow-hidden select-none">
      
      {/* Background physical etching lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Decorative physical divots on the background */}
      <div className="absolute top-16 left-16 w-8 h-8 rounded-full shadow-[inset_3px_3px_6px_#161519,inset_-3px_-3px_6px_#2b2a30] bg-[#1a191d]" />
      <div className="absolute top-16 right-16 w-8 h-8 rounded-full shadow-[inset_3px_3px_6px_#161519,inset_-3px_-3px_6px_#2b2a30] bg-[#1a191d]" />
      <div className="absolute bottom-16 left-16 w-8 h-8 rounded-full shadow-[inset_3px_3px_6px_#161519,inset_-3px_-3px_6px_#2b2a30] bg-[#1a191d]" />
      <div className="absolute bottom-16 right-16 w-8 h-8 rounded-full shadow-[inset_3px_3px_6px_#161519,inset_-3px_-3px_6px_#2b2a30] bg-[#1a191d]" />

      <motion.div 
        style={{ scale: scaleTransform }}
        className="relative flex items-center justify-center w-full h-full"
      >
        {/* LAYER 1: The Massive Outer Ring (Elevated) */}
        <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#1e1d22] shadow-[20px_20px_40px_#161519,-20px_-20px_40px_#2b2a30] flex items-center justify-center relative">
          
          <div className="absolute inset-0 rounded-full border border-[#2b2a30]" />

          {/* LAYER 2: The Inner Recessed Track */}
          <div className="w-[240px] h-[240px] md:w-[480px] md:h-[480px] rounded-full bg-[#1a191d] shadow-[inset_15px_15px_30px_#111014,inset_-15px_-15px_30px_#2b2a30] flex items-center justify-center relative">
            
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#2b2a30] animate-[spin_60s_linear_infinite]" />

            {/* LAYER 3: The Central Extruded Knob */}
            <div className="w-[180px] h-[180px] md:w-[360px] md:h-[360px] rounded-full bg-gradient-to-br from-[#2b2a30] to-[#161519] shadow-[15px_15px_30px_#111014,-5px_-5px_20px_rgba(255,255,255,0.05)] flex items-center justify-center relative overflow-hidden">
              
              <div className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(#1a191d_0_2deg,transparent_2deg_4deg)] opacity-30" />
              
              <div className="w-[160px] h-[160px] md:w-[320px] md:h-[320px] rounded-full bg-[#1e1d22] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.05),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative z-10">
                
                <span className="text-[#1a191d] text-4xl md:text-6xl font-black tracking-tight" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.8)' }}>
                  SYNC
                </span>
                <span className="text-[#ff4500] text-[10px] md:text-xs font-bold tracking-[0.4em] mt-2 drop-shadow-[0_0_8px_rgba(255,69,0,0.6)]">
                  LOCKED
                </span>

              </div>

              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] pointer-events-none z-20" />
            </div>
          </div>
        </div>

      </motion.div>

      {/* Embedded LED Status Panel at Bottom */}
      <div className="absolute bottom-12 w-[300px] h-16 rounded-xl shadow-[inset_4px_4px_8px_#161519,inset_-4px_-4px_8px_#2b2a30] bg-[#1a191d] flex items-center justify-between px-6">
         <div className="flex flex-col">
            <span className="text-[8px] tracking-widest text-[#6b6965] font-bold">LEFT ACTUATOR</span>
            <span className="text-[10px] tracking-widest text-[#00ffcc] font-mono">ENGAGED</span>
         </div>
         <Disc className="w-6 h-6 text-[#2b2a30] animate-[spin_4s_linear_infinite]" />
         <div className="flex flex-col text-right">
            <span className="text-[8px] tracking-widest text-[#6b6965] font-bold">RIGHT ACTUATOR</span>
            <span className="text-[10px] tracking-widest text-[#00ffcc] font-mono">ENGAGED</span>
         </div>
      </div>

    </div>
  );
}