import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Scissors, PenTool, Sparkles, Navigation, Sticker, Zap } from 'lucide-react';

// ============================================================================
// SCRAPBOOK / COLLAGE THEME CONSTANTS
// Style: DIY, Zine, Ransom Note, Tactile Paper, Mixed Media
// Background: #e3dec9 (Kraft Paper / Off-white)
// Accents: #ff007f (Neon Pink marker), #fffb00 (Highlighter), #0011ff (Blue Pen)
// ============================================================================

export default function App() {
  const containerRef = useRef(null);
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toTimeString().split(' ')[0].substring(0, 5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="bg-[#e3dec9] text-[#1a1a1a] min-h-screen relative antialiased selection:bg-[#ff007f] selection:text-white overflow-clip"
    >
      {/* -------------------------------------------------------------
          GLOBAL STYLES & FONTS (Scrapbook Typography)
          ------------------------------------------------------------- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Courier+Prime:wght@400;700&family=Oswald:wght@700&family=Playfair+Display:ital,wght@1,800&display=swap');
        
        .font-marker { font-family: 'Caveat', cursive; }
        .font-typewriter { font-family: 'Courier Prime', monospace; }
        .font-cutout { font-family: 'Oswald', sans-serif; }
        .font-magazine { font-family: 'Playfair Display', serif; }
        
        .paper-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
        }

        .sticker-shadow {
          filter: drop-shadow(2px 4px 0px rgba(0,0,0,0.2)) drop-shadow(-1px -1px 0px white) drop-shadow(1px -1px 0px white) drop-shadow(1px 1px 0px white) drop-shadow(-1px 1px 0px white);
        }
        
        .marker-underline {
          background-image: linear-gradient(120deg, #fffb00 0%, #fffb00 100%);
          background-repeat: no-repeat;
          background-size: 100% 0.4em;
          background-position: 0 88%;
        }

        /* Jagged torn side borders for paper slices */
        .torn-strip-edge-left {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 4px 95%, 1px 90%, 5px 85%, 2px 80%, 4px 75%, 1px 70%, 5px 65%, 2px 60%, 4px 55%, 1px 50%, 5px 45%, 2px 40%, 4px 35%, 1px 30%, 5px 25%, 2px 20%, 4px 15%, 1px 10%, 5px 5%);
        }

        .torn-strip-edge-right {
          clip-path: polygon(0% 0%, calc(100% - 4px) 5%, calc(100% - 1px) 10%, calc(100% - 5px) 15%, calc(100% - 2px) 20%, calc(100% - 4px) 25%, calc(100% - 1px) 30%, calc(100% - 5px) 35%, calc(100% - 2px) 40%, calc(100% - 4px) 45%, calc(100% - 1px) 50%, calc(100% - 5px) 55%, calc(100% - 2px) 60%, calc(100% - 4px) 65%, calc(100% - 1px) 70%, calc(100% - 5px) 75%, calc(100% - 2px) 80%, calc(100% - 4px) 85%, calc(100% - 1px) 90%, calc(100% - 5px) 95%, 100% 100%, 0% 100%);
        }
      `}} />

      {/* Global Paper Grain */}
      <div className="pointer-events-none fixed inset-0 z-[100] paper-grain mix-blend-multiply opacity-70"></div>

      {/* -------------------------------------------------------------
          DIY HEADER (Taped Labels & Stickers)
          ------------------------------------------------------------- */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl flex justify-between items-center pointer-events-none">
        
        <div className="flex items-center gap-4 relative">
          <MaskingTape className="absolute -top-3 -left-4 w-24 h-6 -rotate-6 z-10" />
          <div className="bg-white p-2 border-2 border-dashed border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] rotate-2 flex items-center gap-3 pointer-events-auto">
            <div className="w-8 h-8 bg-[#ff007f] rounded-full flex items-center justify-center sticker-shadow -rotate-12">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-cutout text-lg leading-none uppercase tracking-widest text-[#1a1a1a]">
                ZINE_CRAFT
              </span>
              <span className="font-marker text-sm leading-none text-[#0011ff] mt-1 -rotate-2">
                Issue #01
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="bg-[#fffb00] px-4 py-2 rotate-[-3deg] shadow-[3px_3px_0px_#1a1a1a] border border-black pointer-events-auto relative">
            <MaskingTape className="absolute -right-4 -top-2 w-12 h-5 rotate-[45deg]" />
            <span className="font-typewriter font-bold text-sm">REC: <span className="text-[#ff007f]">ACTIVE</span></span>
          </div>
          <div className="bg-white px-3 py-1 rotate-[2deg] shadow-[2px_2px_0px_#1a1a1a] border border-black pointer-events-auto rounded-full">
            <span className="font-marker text-lg text-[#0011ff]">{time}</span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          SECTION 1: HERO (The Messy Desk)
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 pt-32 pb-12 z-10">
        
        <div className="relative w-full max-w-5xl flex flex-col items-center text-center">
          
          {/* Background decorative photos / polaroids */}
          <div className="absolute top-10 left-0 md:left-10 w-32 h-40 bg-white p-2 shadow-lg -rotate-12 z-0 hidden md:block">
            <div className="w-full h-full bg-[#1a1a1a] overflow-hidden grayscale contrast-150 relative">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
            </div>
            <MaskingTape className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rotate-6" />
          </div>

          <div className="absolute bottom-20 right-0 md:right-10 w-40 h-40 bg-[#ff007f] p-4 shadow-lg rotate-6 z-0 hidden md:block rounded-full flex items-center justify-center">
             <span className="font-marker text-white text-3xl text-center -rotate-12">STICK IT<br/>TOGETHER!</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1 mb-8 bg-black text-white font-typewriter text-sm font-bold rotate-2 shadow-[4px_4px_0px_#fffb00] z-10 relative">
            <Zap className="w-4 h-4 text-[#fffb00]" />
            SCROLL DOWN TO ENGAGE FUSION
            <MaskingTape className="absolute top-0 -left-6 w-10 h-6 -rotate-[70deg]" />
          </div>

          <h1 className="flex flex-wrap justify-center gap-2 z-10 mb-8 max-w-4xl">
            <RansomNote text="STRIP" />
            <span className="font-marker text-[#ff007f] text-6xl md:text-8xl px-4 rotate-[-10deg] pt-4">&</span>
            <RansomNote text="COLLAGE" />
          </h1>

          <div className="mt-8 font-typewriter text-lg md:text-xl text-[#1a1a1a] max-w-xl leading-relaxed bg-white/50 backdrop-blur-sm p-6 border-2 border-dashed border-[#1a1a1a] shadow-[5px_5px_0px_rgba(0,0,0,0.1)] rotate-[-1deg] z-10 relative">
            <MaskingTape className="absolute -top-3 left-10 w-20 h-6 rotate-2" />
            Scroll downwards. The workspace will lock in place as 10 alternating vertical paper slices slide in from opposite sides to rebuild the visual board.
          </div>

          {/* Hand-drawn Scroll Indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 z-10">
            <span className="font-marker text-2xl text-[#0011ff] -rotate-6">Scroll to lock viewport</span>
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="40" height="60" viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-3">
                <path d="M20 5 L20 55 M5 40 L20 55 L35 40" strokeDasharray="4 4"/>
              </svg>
            </motion.div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: THE INTERLOCKING STRIP CHASSIS
          ------------------------------------------------------------- */}
      <SplitSectionTrack />

      {/* -------------------------------------------------------------
          SECTION 3: OUTRO DASHBOARD (The Pinboard)
          ------------------------------------------------------------- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-6 z-10 bg-transparent">
        
        <div className="w-full max-w-4xl bg-white p-4 pb-12 md:p-8 md:pb-16 shadow-[10px_10px_30px_rgba(0,0,0,0.15)] relative rotate-1 border border-[#ddd]">
          {/* Polaroid Frame Styling */}
          <MaskingTape className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 -rotate-2" />
          
          <div className="bg-[#e3dec9]/30 border border-[#1a1a1a]/10 p-6 md:p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-dotted border-[#1a1a1a] pb-6 mb-8 gap-4">
              <h2 className="text-3xl md:text-4xl font-magazine italic font-black text-[#1a1a1a] flex items-center gap-3">
                <PenTool className="w-8 h-8 text-[#ff007f]" />
                Zine Compiled.
              </h2>
              <div className="px-4 py-2 bg-[#fffb00] border-2 border-black font-cutout text-xl rotate-3 shadow-[3px_3px_0px_#1a1a1a]">
                FUSION SUCCESSFUL!
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="font-typewriter text-lg text-[#1a1a1a] leading-relaxed bg-[#fffb00]/20 p-4 border-l-4 border-[#0011ff]">
                  All ten paper segments are successfully locked and sealed. The collage is bound and secure. You are now free to peel back the tape and return to the top desk.
                </p>
                
                <div className="space-y-4 pt-4 font-marker text-2xl text-[#1a1a1a]">
                  <ScrapbookRow label="SEAM STATUS:" value="10 Slices Bound!" />
                  <ScrapbookRow label="GLUE ADHESIVE:" value="Adhesive Tape Strip" />
                  <ScrapbookRow label="ZINE TEMPLATE:" value="Mixed-Media Board" />
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-8 relative p-8">
                {/* Decorative scribbles behind button */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,50 Q30,10 50,50 T90,50" stroke="black" strokeWidth="2" fill="none"/>
                  <path d="M10,70 Q30,30 50,70 T90,70" stroke="black" strokeWidth="2" fill="none"/>
                </svg>
                
                <div className="w-32 h-32 bg-[#ff007f] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1a1a1a] relative rotate-[-10deg]">
                   <Sparkles className="w-16 h-16 text-white" />
                   <div className="absolute -bottom-2 -right-4 bg-black text-white font-typewriter text-xs py-1 px-2 rotate-12 border border-white">#DIY</div>
                </div>
                
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full py-4 bg-white border-4 border-black hover:bg-[#fffb00] hover:rotate-2 transition-all duration-200 flex items-center justify-center gap-3 font-cutout text-2xl tracking-widest text-[#1a1a1a] uppercase shadow-[6px_6px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_#1a1a1a] hover:translate-y-1 hover:translate-x-1 group relative overflow-hidden z-10"
                >
                  <Navigation className="w-6 h-6 group-hover:-rotate-45 transition-transform" />
                  Reset & Un-stitch
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center font-marker text-xl text-[#666]">
            (Fig. 1: Multi-strip manual merge)
          </div>
        </div>

      </section>
    </div>
  );
}

// Helper: Ransom Note Text Generator
function RansomNote({ text }: { text: string }) {
  const fonts = ['font-cutout', 'font-magazine', 'font-typewriter', 'font-marker'];
  const colors = ['bg-white text-black', 'bg-black text-white', 'bg-[#ff007f] text-white', 'bg-[#fffb00] text-black', 'bg-[#0011ff] text-white'];
  
  return (
    <div className="flex flex-wrap items-center justify-center">
      {text.split('').map((char: string, i: number) => {
        if (char === ' ') return <span key={i} className="w-8"></span>;
        
        const fontClass = fonts[(i * 3) % fonts.length];
        const colorClass = colors[(i * 7) % colors.length];
        const rotation = (i % 2 === 0 ? 1 : -1) * ((i * 5) % 15);
        const scale = 1 + ((i % 3) * 0.1);

        return (
          <span 
            key={i} 
            className={`inline-block px-2 py-1 mx-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] border border-black/20 ${fontClass} ${colorClass}`}
            style={{ 
              transform: `rotate(${rotation}deg) scale(${scale})`,
              fontSize: fontClass === 'font-typewriter' ? '1.2em' : fontClass === 'font-marker' ? '1.5em' : '1em'
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

// Helper: Masking Tape
function MaskingTape({ className }: { className?: string }) {
  return (
    <div className={`bg-[#f0ecd6]/90 backdrop-blur-sm border border-[#dcd8c0] shadow-sm ${className}`} style={{ clipPath: 'polygon(5% 0%, 95% 2%, 100% 50%, 93% 98%, 5% 100%, 0% 50%)' }}>
      <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMMCA0TDEgNEwxIDBaTTEgMUwxIDJMMiAyTDIgMVpNMiAyTDIgM0wzIDNMMyAyWk0zIDBMMyA0TDQgNEw0IDBaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
    </div>
  );
}

// Helper: Row for outro
function ScrapbookRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-end border-b-2 border-[#1a1a1a] pb-1 border-dashed">
      <span className="font-cutout text-lg text-[#1a1a1a]/70 tracking-widest">{label}</span>
      <span className="text-[#0011ff]">{value}</span>
    </div>
  );
}

// ============================================================================
// THE TRANSITION TRACK COMPONENT (INTERLOCKING JAGGED STRIPS)
// ============================================================================
function SplitSectionTrack() {
  const trackRef = useRef(null);

  // Expanded container to 400vh to give a significantly wider scroll canvas for pinning.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  // A ultra-responsive, highly damped spring to handle smooth, jitter-free mouse and touch scrolling.
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 40, 
    damping: 24, 
    mass: 0.8,
    restDelta: 0.0001
  });

  // Timeline mapped dynamically across the 400vh range:
  // - [0.0 to 0.15]: Setup / entry delay
  // - [0.15 to 0.75]: Buttery smooth sliding movement from extreme offsets down to 0vh
  // - [0.75 to 1.0]: Fully unified, resting state with taped overlays
  const topY = useTransform(smoothProgress, [0.0, 0.15, 0.75, 1.0], ["-110%", "-110%", "0%", "0%"]);
  const bottomY = useTransform(smoothProgress, [0.0, 0.15, 0.75, 1.0], ["110%", "110%", "0%", "0%"]);
  
  // High-impact physical pop-in effect once unified
  const innerScale = useTransform(smoothProgress, [0.0, 0.70, 0.82, 1.0], [0.85, 0.85, 1.0, 1.0]);
  const pitOpacity = useTransform(smoothProgress, [0.0, 0.50, 0.75], [1.0, 0.5, 0.0]);

  // Seam tape and sticker overlays trigger beautifully right as they lock together
  const isLocked = useTransform(smoothProgress, (pos) => pos >= 0.74);
  const tapeOpacity = useTransform(smoothProgress, [0.72, 0.78], [0, 1]);
  
  // Fades in a seamless version of the artwork to hide all fractional gaps/borders
  const unifiedOpacity = useTransform(smoothProgress, [0.74, 0.76], [0, 1]);

  const NUM_STRIPS = 10;
  const strips = Array.from({ length: NUM_STRIPS }, (_, i) => i);

  return (
    <div ref={trackRef} className="relative h-[400vh] w-full bg-[#1e1d18] z-20">
      
      {/* This is the critical viewport lock.
        By setting "sticky top-0 h-screen", this container pins directly to the viewport
        while the user scrolls through the 400vh parent container.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#e3dec9] z-20">
        
        {/* The messy desk workspace seen behind the strips as they close */}
        <motion.div 
          style={{ opacity: pitOpacity }}
          className="absolute inset-0 bg-[#2b251a] z-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
        >
           <div className="absolute inset-0 paper-grain opacity-40"></div>
           {/* Desk clutter elements */}
           <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rotate-12 border-4 border-white/10" />
           <div className="absolute bottom-40 right-20 w-64 h-2 bg-yellow-900/40 -rotate-45 rounded-full" />
           
           <span className="font-cutout text-[#fffb00] text-5xl md:text-8xl tracking-widest opacity-25 -rotate-12">CUTTING BOARD</span>
        </motion.div>

        {/* -------------------------------------------------------------
            THE INTERLOCKING GANGED PAPER STRIPS
            ------------------------------------------------------------- */}
        <div className="relative w-full h-full flex flex-row z-10 drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
          
          {strips.map((i) => {
            const isTop = i % 2 === 0;
            // Added safe 0.1% overlap buffer to avoid gaps from fractional viewport sizing
            const stripWidthVw = 100 / NUM_STRIPS;

            return (
              <motion.div 
                key={i}
                style={{ 
                  y: isTop ? topY : bottomY,
                  left: `${i * stripWidthVw}vw`,
                  width: `calc(${stripWidthVw}vw + 2px)`, // Gap avoidance logic
                }}
                className={`absolute top-0 h-full bg-[#f4ecd8] overflow-hidden z-10 ${
                  isTop ? 'torn-strip-edge-left' : 'torn-strip-edge-right'
                }`}
              >
                <div className="absolute inset-0 paper-grain opacity-50 pointer-events-none"></div>

                {/* Offset calculations to maintain one unified visual coordinate system */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `-${i * stripWidthVw}vw`,
                    width: '100vw',
                    height: '100vh'
                  }}
                >
                  <CollageArtwork scaleTransform={innerScale} />
                </div>
              </motion.div>
            );
          })}

          {/* ==============================================
              UNIFIED OVERLAY (Hides all seams when locked)
              ============================================== */}
          <motion.div
            style={{ opacity: unifiedOpacity }}
            className="absolute inset-0 z-[15] pointer-events-none"
          >
            <CollageArtwork scaleTransform={innerScale} />
          </motion.div>

          {/* ==============================================
              SEAM TAPE (Fuses across vertical seams on lock)
              ============================================== */}
          <div className="absolute inset-x-0 top-0 h-full z-20 pointer-events-none flex flex-row justify-around items-center px-4">
             {strips.slice(0, NUM_STRIPS - 1).map((i) => (
                <motion.div 
                  key={i} 
                  style={{ 
                    opacity: tapeOpacity,
                    left: `${(i + 1) * (100 / NUM_STRIPS)}vw`
                  }}
                  className="absolute"
                >
                  {/* Alternating tape orientation over interlocking joins */}
                  <MaskingTape className="w-10 h-28 -rotate-12 mt-12" />
                  <MaskingTape className="w-8 h-20 rotate-45 mt-96" />
                </motion.div>
             ))}
          </div>

        </div>

        {/* Polaroid Status Monitor Overlay */}
        <div className="absolute bottom-12 right-12 z-30 pointer-events-none hidden lg:block">
          <div className="bg-white p-3 pb-8 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] rotate-6 border border-[#ddd]">
            <div className="w-48 h-32 bg-[#e3dec9] border border-black/10 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 paper-grain"></div>
              
              <motion.div className="flex flex-col items-center justify-center gap-2 absolute inset-0 bg-[#ff007f]" style={{ opacity: useTransform(isLocked, (locked) => locked ? 0 : 1) }}>
                <Scissors className="w-8 h-8 text-white" />
                <span className="font-cutout text-xl text-white">STRIPPED</span>
              </motion.div>

              <motion.div className="flex flex-col items-center justify-center gap-2 absolute inset-0 bg-[#fffb00]" style={{ opacity: useTransform(isLocked, (locked) => locked ? 1 : 0) }}>
                <Sticker className="w-8 h-8 text-black" />
                <span className="font-cutout text-xl text-black">INTERLOCKED</span>
              </motion.div>

            </div>
            <div className="mt-4 text-center font-marker text-xl text-[#0011ff]">
              Chassis.jpg
            </div>
            <MaskingTape className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 -rotate-2" />
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// THE COLLAGE ARTWORK (Rendered across the virtual viewport canvas)
// ============================================================================
function CollageArtwork({ scaleTransform }: { scaleTransform: MotionValue<number> | number }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden select-none bg-[#f4ecd8]">
      
      {/* Background ink doodles and guidelines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 0 50 Q 25 30, 50 50 T 100 50" stroke="#0011ff" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
        <path d="M 0 70 Q 25 90, 50 70 T 100 70" stroke="#ff007f" strokeWidth="1" fill="none" />
        <circle cx="20" cy="20" r="10" stroke="#1a1a1a" strokeWidth="0.5" fill="none" />
        <rect x="80" y="80" width="10" height="10" stroke="#1a1a1a" strokeWidth="1" fill="none" transform="rotate(15 85 85)" />
      </svg>

      <motion.div 
        style={{ scale: scaleTransform }}
        className="relative flex items-center justify-center w-full h-full"
      >
        
        {/* Main Central Piece: The Giant Cutout Eye / Record hybrid */}
        <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#1a1a1a] shadow-[15px_15px_0px_#fffb00] flex items-center justify-center relative border-4 border-white rotate-3">
          
          <div className="absolute inset-0 paper-grain opacity-30 rounded-full mix-blend-overlay"></div>
          
          {/* Magazine cutout text radiating */}
          <div className="absolute -top-8 -left-4 font-cutout text-5xl text-black bg-white px-2 py-1 -rotate-12 shadow-[4px_4px_0px_#ff007f]">
            LOOK
          </div>
          <div className="absolute -bottom-6 -right-6 font-marker text-6xl text-[#0011ff] rotate-12 bg-[#fffb00] px-4 shadow-[4px_4px_0px_black]">
            HERE!
          </div>

          {/* Inner ring */}
          <div className="w-[240px] h-[240px] md:w-[480px] md:h-[480px] rounded-full border-8 border-dashed border-[#ff007f] flex items-center justify-center relative bg-[repeating-radial-gradient(circle,black,black_10px,transparent_10px,transparent_20px)]">
            
            {/* The "Eye" */}
            <div className="w-[180px] h-[100px] md:w-[360px] md:h-[200px] bg-white rounded-[50%] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden -rotate-6 border-4 border-black">
              
              {/* Pupil */}
              <div className="w-[80px] h-[80px] md:w-[160px] md:h-[160px] bg-[#0011ff] rounded-full flex flex-col items-center justify-center relative border-4 border-black">
                <div className="absolute top-2 right-4 w-4 h-4 md:w-8 md:h-8 bg-white rounded-full"></div>
                
                <span className="font-cutout text-white text-3xl md:text-5xl mt-2 tracking-widest">
                  ART
                </span>
              </div>
              
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                <line x1="10" y1="50" x2="90" y2="50" stroke="black" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Decorative Scrapbook Scribbles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 pointer-events-none">
        <svg viewBox="0 0 100 100" className="animate-[spin_10s_linear_infinite]">
           <polygon points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" fill="#fffb00" stroke="black" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="animate-[spin_15s_linear_infinite_reverse]">
           <polygon points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" fill="#ff007f" stroke="black" strokeWidth="2" />
        </svg>
      </div>

    </div>
  );
}