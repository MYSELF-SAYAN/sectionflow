import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Power, Settings2, Activity, Disc, Fingerprint, Lock, Unlock, 
  ChevronUp, ShieldCheck, Cpu, Sliders, Volume2, HelpCircle 
} from 'lucide-react';

// ============================================================================
// PREMIUM SKEUOMORPHIC THEME CONSTANTS (DEEP SPACE & ELECTRIC ORANGE)
// Base Canvas: #0f1115 (Deep Space Blue-Black)
// Raised Panels: #181b21 (Titanium Alloy)
// Accent/Wedge Highlight: #00b8ff (Cyber Blue)
// Primary Accent (Mockup Theme): #ff6b00 (Electric Orange)
// Telemetry Highlight: #00ffa3 (Neon Green)
// ============================================================================

export default function App() {
  const containerRef = useRef(null);
  const [time, setTime] = useState("00:00:00");
  const [systemActive, setSystemActive] = useState(true);
  const [resonance, setResonance] = useState(48);
  const [volume, setVolume] = useState(72);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      // CRITICAL FIX: Removed `overflow-x-hidden` here. 
      // Having overflow hidden on an ancestor breaks `position: sticky` in CSS, 
      // which was causing the transition section to scroll away instantly!
      className="bg-[#0f1115] text-[#f0f2f5] min-h-screen font-sans selection:bg-[#ff6b00] selection:text-white relative antialiased"
    >
      {/* Film Grain/Noise overlay for high-fidelity physical texture */}
      <svg className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.12] mix-blend-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* -------------------------------------------------------------
          TOP CONTROL BAR (TACTILE EMBOSSED HEADER)
          ------------------------------------------------------------- */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-4 flex justify-between items-center bg-[#181b21] rounded-2xl shadow-[8px_8px_16px_#0a0c0f,-8px_-8px_16px_#262a33]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSystemActive(!systemActive)}
            className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
              systemActive 
                ? "bg-[#0f1115] shadow-[inset_3px_3px_6px_#0a0c0f,inset_-3px_-3px_6px_#262a33]" 
                : "bg-[#ff6b00] shadow-[0_0_15px_#ff6b00]"
            }`}
          >
            <Power className={`w-4 h-4 transition-colors ${systemActive ? "text-[#ff6b00]" : "text-white"}`} />
          </button>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-[0.25em] text-xs text-[#9ea3ad] flex items-center gap-1.5">
              APEX INTERLOCK <span className="text-[9px] text-[#ff6b00] bg-[#ff6b00]/10 px-1.5 py-0.5 rounded border border-[#ff6b00]/20 font-mono">V3.0</span>
            </span>
            <span className="text-[8px] text-[#5c6370] tracking-widest font-mono">
              TRI-SECTOR ALIGNMENT LABS
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-widest font-mono font-semibold text-[#5c6370]">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] bg-[#0f1115]">
            <Activity className="w-3.5 h-3.5 text-[#00ffa3] animate-pulse" />
            <span>ALIGNMENT: <span className="text-[#00ffa3] font-bold">100% COHERENT</span></span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] bg-[#0f1115]">
            <span>SYSTEM_TIME: <span className="text-[#f0f2f5]">{time}</span></span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          SECTION 1: INTRO DECK
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 pt-28 pb-12 z-10">
        <div className="w-full max-w-5xl rounded-[3rem] p-8 md:p-14 shadow-[inset_10px_10px_20px_#0a0c0f,inset_-10px_-10px_20px_#262a33] bg-[#181b21] relative overflow-hidden flex flex-col items-center text-center">
          
          {/* Authentic Skeuomorphic Corner Screws */}
          <Screw top="top-8" left="left-8" />
          <Screw top="top-8" left="right-8" />
          <Screw top="bottom-8" left="left-8" />
          <Screw top="bottom-8" left="right-8" />

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full shadow-[3px_3px_6px_#0a0c0f,-3px_-3px_6px_#262a33] text-[10px] tracking-[0.15em] text-[#ff6b00] uppercase font-bold bg-[#181b21]">
            <div className="w-2 h-2 rounded-full bg-[#ff6b00] animate-ping" />
            Multi-Panel Seam Active
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-[#181b21] uppercase select-none leading-none" style={{ textShadow: '4px 4px 8px #0a0c0f, -4px -4px 8px #262a33' }}>
            TRI-WEDGE <br />
            CONVERGENCE
          </h1>

          <p className="mt-8 text-[#8c929e] text-xs sm:text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Scroll downwards to engage the locking chassis. Three heavy-duty physical panels—**Part 1**, **Part 2**, and the **Central Wedge**—will converge smoothly from their respective angles, assembling a seamless unified controller dashboard. The screen will stay pinned until convergence completes.
          </p>

          {/* Interactive Controller Knobs */}
          <div className="mt-10 flex flex-wrap gap-8 justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] tracking-widest font-mono text-[#5c6370]">RESONANCE</span>
              <div className="w-16 h-16 rounded-full shadow-[5px_5px_10px_#0a0c0f,-5px_-5px_10px_#262a33] bg-[#181b21] flex items-center justify-center relative cursor-pointer group" onClick={() => setResonance(r => (r + 15) % 100)}>
                <div 
                  className="w-12 h-12 rounded-full bg-[#0f1115] shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] relative flex items-center justify-center"
                  style={{ transform: `rotate(${resonance * 3.6}deg)` }}
                >
                  <div className="absolute top-1 w-1.5 h-1.5 bg-[#ff6b00] rounded-full shadow-[0_0_8px_#ff6b00]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] tracking-widest font-mono text-[#5c6370]">OUTPUT GAIN</span>
              <div className="w-16 h-16 rounded-full shadow-[5px_5px_10px_#0a0c0f,-5px_-5px_10px_#262a33] bg-[#181b21] flex items-center justify-center relative cursor-pointer" onClick={() => setVolume(v => (v + 10) % 100)}>
                <div 
                  className="w-12 h-12 rounded-full bg-[#0f1115] shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] relative flex items-center justify-center"
                  style={{ transform: `rotate(${volume * 3.6}deg)` }}
                >
                  <div className="absolute top-1 w-1.5 h-1.5 bg-[#00ffa3] rounded-full shadow-[0_0_8px_#00ffa3]" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Wheel Assist */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <span className="text-[9px] tracking-[0.25em] font-bold text-[#5c6370]">SCROLL TO ENGAGE</span>
            <div className="w-7 h-14 rounded-full shadow-[inset_3px_3px_6px_#0a0c0f,inset_-3px_-3px_6px_#262a33] bg-[#0f1115] flex justify-center p-1 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 24, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-5 rounded-full shadow-[1px_1px_2px_#000,-1px_-1px_1px_#333] bg-[#262a33] border border-[#333945] flex items-center justify-center"
              >
                <div className="w-2.5 h-[1.5px] bg-[#8c929e] rounded-full" />
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: THE SPLIT TRI-WEDGE CHASSIS (STYLISH SCROLL TRACK)
          ------------------------------------------------------------- */}
      <TriWedgeSectionTrack />

      {/* -------------------------------------------------------------
          SECTION 3: CONSOLIDATED CALIBRATION SYSTEM
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 z-10 bg-[#0f1115]">
        
        <div className="w-full max-w-4xl rounded-[2.5rem] shadow-[12px_12px_24px_#0a0c0f,-12px_-12px_24px_#262a33] bg-[#181b21] p-8 sm:p-12 relative">
          <Screw top="top-6" left="left-6" />
          <Screw top="top-6" left="right-6" />
          <Screw top="bottom-6" left="left-6" />
          <Screw top="bottom-6" left="right-6" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#262a33] pb-6 mb-8 gap-4">
            <h2 className="text-xl font-bold tracking-widest text-[#9ea3ad] flex items-center gap-3">
              <Settings2 className="w-5.5 h-5.5 text-[#ff6b00]" />
              CHASSIS REPORT
            </h2>
            <div className="px-4 py-1.5 rounded-lg shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] bg-[#0f1115]">
              <span className="text-[10px] font-mono tracking-widest text-[#ff6b00] font-bold">WEDGE LOCK ENGAGED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="text-[#8c929e] text-sm leading-relaxed">
                The triangular segment split alignment has concluded successfully. The seam tolerance sits below 0.0001mm with no physical friction detected. This digital skeuomorphic assembly model ensures zero visual layout shift upon final convergence.
              </p>
              
              <div className="space-y-3 pt-4">
                <DataRow label="PRIMARY SPLIT MODE" value="TRI-DIRECTIONAL WEDGE" />
                <DataRow label="SIDE SHARDS (PART 1 & 2)" value="ELECTRIC ORANGE" />
                <DataRow label="WEDGE (PART 3)" value="CYBER BLUE" />
                <DataRow label="DAMPENING COEFFICIENT" value="SPRING (80 STIFF)" />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-6 bg-[#0f1115] rounded-2xl shadow-[inset_6px_6px_12px_#0a0c0f,inset_-6px_-6px_12px_#262a33] p-8">
              <div className="w-20 h-20 rounded-full shadow-[5px_5px_10px_#0a0c0f,-5px_-5px_10px_#262a33] bg-[#181b21] flex items-center justify-center relative">
                 <div className="absolute inset-1.5 rounded-full border border-dashed border-[#ff6b00]/40 animate-spin" />
                 <Fingerprint className="w-8 h-8 text-[#ff6b00]" />
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 rounded-xl shadow-[4px_4px_8px_#0a0c0f,-4px_-4px_8px_#262a33] active:shadow-[inset_4px_4px_8px_#0a0c0f,inset_-4px_-4px_8px_#262a33] bg-[#181b21] border border-[#262a33] transition-all duration-200 flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-[#9ea3ad] uppercase hover:text-white"
              >
                <ChevronUp className="w-4 h-4 text-[#ff6b00]" />
                DISENGAGE & RE-ORBIT
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

// Screws for authentic mechanical faceplate feel
function Screw({ top, left }: { top: string; left: string }) {
  return (
    <div className={`absolute ${top} ${left} w-5 h-5 rounded-full shadow-[inset_2px_2px_4px_#0a0c0f,2px_2px_2px_rgba(255,255,255,0.03)] bg-[#0f1115] flex items-center justify-center pointer-events-none`}>
      <div className="w-3 h-[1.5px] bg-[#000000] rounded-full rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
    </div>
  );
}

// Custom info row for data values
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-[#262a33] pb-2">
      <span className="text-[10px] tracking-widest font-mono text-[#5c6370]">{label}</span>
      <span className="text-[10px] tracking-widest font-mono text-[#ff6b00] font-bold">{value}</span>
    </div>
  );
}

// ============================================================================
// THE WEDGE TRANSITION ENGINE COMPONENT
// Combines clips, scales, and positions according to the image_8a71f7 layout
// ============================================================================
function TriWedgeSectionTrack() {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    // "start start" locks it as soon as it hits the top of viewport.
    // "end end" unlocks it when the 400vh track ends.
    offset: ["start start", "end end"]
  });

  // Extremely smooth, slightly heavy spring for a mechanical sliding feel
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 40, 
    damping: 18, 
    mass: 0.2,
    restDelta: 0.0005
  });

  // We use `vw` and `vh` values here because percentage values on 
  // transforms can sometimes be misinterpreted depending on the layout.
  // The animation finishes at 0.7 progress (70% of the 400vh height),
  // leaving the remaining 30% for the user to view the joined dashboard before moving on.
  
  // PART 1 (Left): Slides in diagonally from top-left
  const part1X = useTransform(smoothProgress, [0, 0.7], ["-50vw", "0vw"]);
  const part1Y = useTransform(smoothProgress, [0, 0.7], ["-50vh", "0vh"]);

  // PART 2 (Right): Slides in diagonally from top-right
  const part2X = useTransform(smoothProgress, [0, 0.7], ["50vw", "0vw"]);
  const part2Y = useTransform(smoothProgress, [0, 0.7], ["-50vh", "0vh"]);

  // PART 3 (Central Wedge Triangle): Ascends vertically from bottom center
  const part3Y = useTransform(smoothProgress, [0, 0.7], ["60vh", "0vh"]);
  const part3Scale = useTransform(smoothProgress, [0, 0.7], [0.85, 1]);

  // Telemetry lock status activates right as it seals
  const lockProgress = useTransform(smoothProgress, (pos) => pos >= 0.68);

  // Background recess pit fades out just as the panels lock
  const pitOpacity = useTransform(smoothProgress, [0, 0.6, 0.7], [1, 0.8, 0]);

  // Design clip-paths according to user's uploaded mockup:
  const wedgeClipPath = "polygon(25% 0%, 75% 0%, 50% 100%)";
  const leftClipPath = "polygon(0% 0%, 25% 0%, 50% 100%, 0% 100%)";
  const rightClipPath = "polygon(75% 0%, 100% 0%, 100% 100%, 50% 100%)";

  return (
    // Height set to 400vh (4x screen height). This forces the user to scroll 
    // down a long distance while the sticky container stays pinned on screen, 
    // causing the parts to animate.
    <div ref={trackRef} className="relative h-[400vh] w-full bg-[#0f1115]">
      
      {/* This is the sticky viewport. It pins to the top and stays there 
        for the entirety of the 400vh scroll space. 
        `overflow-hidden` ensures the sliding parts don't create scrollbars.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0f1115]">
        
        {/* Recessed underlying mechanical bay (visible while parts are traveling) */}
        <motion.div 
          style={{ opacity: pitOpacity }}
          className="absolute inset-0 bg-[#0a0c0f] shadow-[inset_20px_20px_40px_#050608,inset_-20px_-20px_40px_#181b21] z-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <Cpu className="w-12 h-12 text-[#262a33] animate-pulse" />
            <span className="text-[#262a33] text-sm font-extrabold tracking-[0.5em] font-mono text-center">
              SYSTEM SEPARATION<br/>
              <span className="text-[10px]">SCROLL TO CONVERGE</span>
            </span>
          </div>
        </motion.div>

        {/* -------------------------------------------------------------
            THE INTEGRATED CHASSIS (Skeuomorphic Dial divided in 3 parts)
            ------------------------------------------------------------- */}
        <div className="relative w-full h-full z-10 select-none">
          
          {/* =========================================================
              PART 1: LEFT PANEL 
              ========================================================= */}
          <motion.div 
            style={{ 
              x: part1X,
              y: part1Y,
              clipPath: leftClipPath
            }}
            className="absolute inset-0 w-full h-full bg-[#181b21] border-r border-[#ff6b00]/25 shadow-[inset_10px_0_20px_rgba(255,107,0,0.05)] will-change-transform"
          >
            <div className="absolute inset-0 bg-[#ff6b00]/[0.02] mix-blend-color" />
            <UnifiedDashboard partName="PART 1" themeColor="#ff6b00" accentShadow="rgba(255, 107, 0, 0.4)" />
          </motion.div>

          {/* =========================================================
              PART 2: RIGHT PANEL 
              ========================================================= */}
          <motion.div 
            style={{ 
              x: part2X,
              y: part2Y,
              clipPath: rightClipPath
            }}
            className="absolute inset-0 w-full h-full bg-[#181b21] border-l border-[#ff6b00]/25 shadow-[inset_-10px_0_20px_rgba(255,107,0,0.05)] will-change-transform"
          >
            <div className="absolute inset-0 bg-[#ff6b00]/[0.02] mix-blend-color" />
            <UnifiedDashboard partName="PART 2" themeColor="#ff6b00" accentShadow="rgba(255, 107, 0, 0.4)" />
          </motion.div>

          {/* =========================================================
              PART 3: CENTRAL WEDGE 
              ========================================================= */}
          <motion.div 
            style={{ 
              y: part3Y,
              scale: part3Scale,
              clipPath: wedgeClipPath
            }}
            className="absolute inset-0 w-full h-full bg-[#1e222a] border-x border-[#00b8ff]/40 shadow-[0_0_30px_rgba(0,184,255,0.15)] will-change-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00b8ff]/[0.06] to-transparent pointer-events-none" />
            <UnifiedDashboard partName="CHASSIS WEDGE" themeColor="#00b8ff" accentShadow="rgba(0, 184, 255, 0.6)" isWedge />
          </motion.div>

        </div>

        {/* -------------------------------------------------------------
            PHYSICAL TELEMETRY DECK (FLOATING INDICATORS)
            ------------------------------------------------------------- */}
        <div className="absolute top-1/3 left-8 z-30 pointer-events-none hidden lg:block">
          <div className="flex flex-col gap-4 p-5 rounded-2xl shadow-[8px_8px_16px_#0a0c0f,-8px_-8px_16px_#262a33] bg-[#181b21] border border-[#262a33]/60 min-w-[180px]">
            <span className="text-[9px] tracking-widest font-extrabold text-[#5c6370] border-b border-[#262a33] pb-2 font-mono">SECTOR METRIC</span>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] bg-[#0f1115] flex items-center justify-center">
                <motion.div 
                  style={{ color: useTransform(lockProgress, (locked) => locked ? "#5c6370" : "#ff6b00") }}
                >
                  <Unlock className="w-4 h-4" />
                </motion.div>
              </div>
              <span className="text-[9px] tracking-wider font-mono text-[#9ea3ad]">ALIGNING...</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full shadow-[inset_2px_2px_4px_#0a0c0f,inset_-2px_-2px_4px_#262a33] bg-[#0f1115] flex items-center justify-center">
                <motion.div 
                  style={{ color: useTransform(lockProgress, (locked) => locked ? "#00ffa3" : "#5c6370") }}
                >
                  <Lock className="w-4 h-4" />
                </motion.div>
              </div>
              <span className="text-[9px] tracking-wider font-mono text-[#9ea3ad]">SECURED</span>
            </div>
            
            {/* Scroll progress visualizer */}
            <div className="mt-2 h-1.5 w-full bg-[#0f1115] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_#000]">
               <motion.div 
                 className="h-full bg-gradient-to-r from-[#ff6b00] to-[#00ffa3]"
                 style={{ width: useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]) }}
               />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// THE SEAMLESS CANVAS (Rendered identically within all three split panels)
// ============================================================================
function UnifiedDashboard({ partName, themeColor, accentShadow, isWedge = false }: { partName: string; themeColor: string; accentShadow: string; isWedge?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative bg-[#181b21] overflow-hidden">
      
      {/* Background Micro-grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Dial Enclosure */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
        
        {/* Mockup Text Indicator to identify Parts precisely */}
        <div className="absolute top-16 left-12 font-black tracking-widest text-3xl sm:text-5xl opacity-40 select-none font-mono" style={{ color: themeColor }}>
          {partName}
        </div>
        
        <div className="absolute top-16 right-12 font-black tracking-widest text-xs opacity-40 font-mono text-[#5c6370]">
          {isWedge ? "WEDGE PIN" : "LATERAL PANEL"}
        </div>

        {/* LAYER 1: Outer Embossed Metal Ring */}
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#181b21] shadow-[20px_20px_40px_#0a0c0f,-20px_-20px_40px_#262a33] flex items-center justify-center relative">
          
          <div className="absolute inset-0 rounded-full border border-[#262a33]" />
          
          {/* Subtle perimeter circular tick indicators */}
          <div className="absolute inset-4 rounded-full border-2 border-dotted border-[#5c6370]/20 animate-[spin_120s_linear_infinite]" />

          {/* LAYER 2: Recessed Core Track */}
          <div className="w-[240px] h-[240px] md:w-[400px] md:h-[400px] rounded-full bg-[#0f1115] shadow-[inset_12px_12px_24px_#0a0c0f,inset_-12px_-12px_24px_#262a33] flex items-center justify-center relative">
            
            {/* Spinning futuristic circuit graphic */}
            <div className="absolute inset-6 rounded-full border-2 border-[#ff6b00]/10 border-t-[#00b8ff]/50 border-b-[#00ffa3]/50 animate-[spin_15s_linear_infinite]" />

            {/* LAYER 3: Elevated Central Core Knob */}
            <div className="w-[180px] h-[180px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-br from-[#262a33] to-[#0f1115] shadow-[15px_15px_30px_#050608,-5px_-5px_15px_rgba(255,255,255,0.03)] flex items-center justify-center relative overflow-hidden">
              
              <div className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(#0f1115_0_3deg,transparent_3deg_6deg)] opacity-30" />
              
              <div className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] rounded-full bg-[#181b21] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.03),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative z-10">
                
                {/* Dynamic holographic indicator */}
                <span className="text-3xl md:text-5xl font-black tracking-tight text-[#181b21] uppercase select-none" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.08), -1px -1px 1px rgba(0,0,0,0.9)' }}>
                  ALIGN
                </span>
                
                <span 
                  className="text-[9px] md:text-xs font-bold tracking-[0.4em] mt-3"
                  style={{ 
                    color: themeColor,
                    textShadow: `0 0 10px ${accentShadow}`
                  }}
                >
                  {isWedge ? "WEDGE INTEGRAL" : "SYNCHRONIZED"}
                </span>

              </div>

              {/* Brushed metallic reflection sheen */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.06] pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* Embedded physical console panel beneath the massive dial */}
        <div className="mt-8 w-full max-w-md h-16 rounded-xl shadow-[inset_4px_4px_8px_#0a0c0f,inset_-4px_-4px_8px_#262a33] bg-[#0f1115] flex items-center justify-between px-6 border border-[#262a33]/20">
           <div className="flex flex-col">
              <span className="text-[8px] tracking-widest text-[#5c6370] font-extrabold font-mono">SECTOR_A_CHASSIS</span>
              <span className="text-[10px] tracking-widest font-mono text-[#00ffa3] font-bold">READY</span>
           </div>
           
           <Disc className="w-5 h-5 text-[#262a33] animate-[spin_3s_linear_infinite]" />
           
           <div className="flex flex-col text-right">
              <span className="text-[8px] tracking-widest text-[#5c6370] font-extrabold font-mono">SECTOR_B_WEDGE</span>
              <span className="text-[10px] tracking-widest font-mono text-[#ff6b00] font-bold">SECURED</span>
           </div>
        </div>

      </div>
    </div>
  );
}