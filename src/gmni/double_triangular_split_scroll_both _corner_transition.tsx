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
            DUAL-TRIANGLE <br />
            CONVERGENCE
          </h1>

          <p className="mt-8 text-[#8c929e] text-xs sm:text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Scroll downwards to engage the locking chassis. Two heavy-duty physical diagonal panels—**Part 1 (Bottom-Left Corner)** and **Part 2 (Top-Right Corner)**—will converge smoothly across the screen, assembling a seamless unified controller dashboard. The screen will stay pinned until convergence completes.
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
          SECTION 2: THE SPLIT DUAL-TRIANGLE CHASSIS (STYLISH SCROLL TRACK)
          ------------------------------------------------------------- */}
      <DualTriangleSectionTrack />

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
              <span className="text-[10px] font-mono tracking-widest text-[#ff6b00] font-bold">SECTOR LOCK ENGAGED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="text-[#8c929e] text-sm leading-relaxed">
                The diagonal bi-sector split alignment has concluded successfully. The seam tolerance sits below 0.0001mm with no physical friction detected. This digital skeuomorphic assembly model ensures zero visual layout shift upon final convergence.
              </p>
              
              <div className="space-y-3 pt-4">
                <DataRow label="PRIMARY SPLIT MODE" value="DIAGONAL BI-SECTOR" />
                <DataRow label="PART 1 (BOTTOM-LEFT)" value="ELECTRIC ORANGE" />
                <DataRow label="PART 2 (TOP-RIGHT)" value="CYBER BLUE" />
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
// THE DUAL TRIANGLE TRANSITION ENGINE COMPONENT
// Combines clips, scales, and positions for a 2-part diagonal split
// ============================================================================
function DualTriangleSectionTrack() {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 40, 
    damping: 18, 
    mass: 0.2,
    restDelta: 0.0005
  });

  // PART 1 (Bottom-Left Triangle): Translates up and right from bottom-left corner
  // Staged entirely below and left of the viewport (-100vw, 100vh) initially
  const part1X = useTransform(smoothProgress, [0, 0.7], ["-100vw", "0vw"]);
  const part1Y = useTransform(smoothProgress, [0, 0.7], ["100vh", "0vh"]);

  // PART 2 (Top-Right Triangle): Translates down and left from the top-right corner
  // CHANGED: Initiates from the right top corner (100vw, -100vh)
  const part2X = useTransform(smoothProgress, [0, 0.7], ["100vw", "0vw"]);
  const part2Y = useTransform(smoothProgress, [0, 0.7], ["-100vh", "0vh"]);

  // Telemetry lock status activates right as it seals
  const lockProgress = useTransform(smoothProgress, (pos) => pos >= 0.68);
  const pitOpacity = useTransform(smoothProgress, [0, 0.6, 0.7], [1, 0.8, 0]);

  // Diagonal Split: Top-Left to Bottom-Right
  const bottomLeftClip = "polygon(0 0, 100% 100%, 0 100%)";
  const topRightClip = "polygon(0 0, 100% 0, 100% 100%)";

  return (
    <div ref={trackRef} className="relative h-[400vh] w-full bg-[#0f1115]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0f1115]">
        
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

        <div className="relative w-full h-full z-10 select-none">
          
          {/* PART 1: BOTTOM-LEFT TRIANGLE */}
          <motion.div 
            style={{ 
              x: part1X,
              y: part1Y,
              clipPath: bottomLeftClip
            }}
            className="absolute inset-0 w-full h-full bg-[#181b21] shadow-[inset_-5px_5px_20px_rgba(255,107,0,0.1)] will-change-transform"
          >
            <div className="absolute inset-0 bg-[#ff6b00]/[0.02] mix-blend-color" />
            <UnifiedDashboard partName="PART 1" themeColor="#ff6b00" accentShadow="rgba(255, 107, 0, 0.4)" />
          </motion.div>

          {/* PART 2: TOP-RIGHT TRIANGLE */}
          <motion.div 
            style={{ 
              x: part2X,
              y: part2Y,
              clipPath: topRightClip
            }}
            className="absolute inset-0 w-full h-full bg-[#1e222a] shadow-[inset_5px_-5px_20px_rgba(0,184,255,0.1)] will-change-transform"
          >
            <div className="absolute inset-0 bg-[#00b8ff]/[0.02] mix-blend-color" />
            <UnifiedDashboard partName="PART 2" themeColor="#00b8ff" accentShadow="rgba(0, 184, 255, 0.4)" />
          </motion.div>

        </div>

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
// THE SEAMLESS CANVAS (Rendered identically within all split panels)
// ============================================================================
function UnifiedDashboard({ partName, themeColor, accentShadow }: { partName: string; themeColor: string; accentShadow: string }) {
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
          DIAGONAL SECTOR
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
                  SYNCHRONIZED
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
              <span className="text-[8px] tracking-widest text-[#5c6370] font-extrabold font-mono">SECTOR_1_DIAG</span>
              <span className="text-[10px] tracking-widest font-mono text-[#00ffa3] font-bold">READY</span>
           </div>
           
           <Disc className="w-5 h-5 text-[#262a33] animate-[spin_3s_linear_infinite]" />
           
           <div className="flex flex-col text-right">
              <span className="text-[8px] tracking-widest text-[#5c6370] font-extrabold font-mono">SECTOR_2_DIAG</span>
              <span className="text-[10px] tracking-widest font-mono text-[#ff6b00] font-bold">SECURED</span>
           </div>
        </div>

      </div>
    </div>
  );
}