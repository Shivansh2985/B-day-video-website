import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles as SparkIcon, Volume2, VolumeX } from "lucide-react";
import sky from "@/assets/sky-bg.jpg";
import shinchan from "@/assets/char-shinchan.png";
import animals from "@/assets/char-animals.png";
import tomjerry from "@/assets/char-tomjerry.png";
import doraemon from "@/assets/char-doraemon.png";
import bheem from "@/assets/char-bheem.png";
import ben10 from "@/assets/char-ben10.png";
import fairy from "@/assets/char-fairy.png";
import babyArisha from "@/assets/baby-arisha.png";
import babyAvira from "@/assets/baby-avira.png";
import { Sparkles } from "@/components/birthday/Sparkles";
import { Balloons } from "@/components/birthday/Balloons";
import { Confetti } from "@/components/birthday/Confetti";
import { Doors } from "@/components/birthday/Doors";
import { MessageCards } from "@/components/birthday/MessageCards";
import { WalkingChar } from "@/components/birthday/WalkingChar";
import { GroupCharRow } from "@/components/birthday/GroupCharRow";
import { FloatingText } from "@/components/birthday/FloatingText";
import { BabyFloater } from "@/components/birthday/BabyFloater";

type Phase =
  | "gate" | "loading"
  | "act1_tomjerry" | "act2_doraemon" | "act3_bheem"
  | "act4_animals"  | "act5_ben10"   | "act6_shinchan"
  | "act7_fairy"    | "act8_doors"   | "act9_open"
  | "reveal"        | "complete";

const ALL_IMAGES = [
  sky, shinchan, animals, tomjerry, doraemon, bheem, ben10, fairy, babyArisha, babyAvira,
];

function preloadImages(srcs: string[], onProgress: (p: number) => void): Promise<void> {
  let done = 0;
  const total = srcs.length;
  return Promise.all(
    srcs.map((s) => new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try { await img.decode(); } catch { /* */ }
        onProgress(++done / total); resolve();
      };
      img.onerror = () => { onProgress(++done / total); resolve(); };
      img.src = s;
    }))
  ).then(() => undefined);
}

/* ── per-act invitation texts (2–3 lines shown sequentially) ── */
const ACT_TEXTS: Record<string, string[]> = {
  act1_tomjerry: [
    "Tom & Jerry race in…",
    "…to invite YOU to the party! 🎉",
    "Come celebrate with us!",
  ],
  act2_doraemon: [
    "Doraemon pulled out a gadget…",
    "…an invitation just for you! 💌",
    "Please don't miss this one!",
  ],
  act3_bheem:    [
    "Chhota Bheem eats laddoos…",
    "…and invites you with love! 🍬",
    "Bring your whole family!",
  ],
  act4_animals:  [
    "All the jungle friends gather…",
    "…calling you to join the fun! 🦁",
    "It'll be a wild celebration!",
  ],
  act5_ben10:    [
    "It's Hero Time — Ben 10 says:",
    "\"Don't miss Arisha & Avira's Day!\" ⚡",
    "Come be our hero too!",
  ],
  act6_shinchan: [
    "Shinchan yells as loud as he can…",
    "\"Please come, pretty please! 🙏\"",
    "Everyone's waiting for YOU!",
  ],
  act7_fairy:    [
    "A fairy descends with blessings…",
    "…and delivers this golden invite ✨",
    "You are truly special to us!",
  ],
  act8_doors:    [
    "The magical doors await…",
    "…something beautiful inside 🌸",
    "Step in when you're ready…",
  ],
};

/* How long each act lasts (ms) */
const ACT_MS = 8000;

const Index = () => {
  const [phase, setPhase] = useState<Phase>("gate");
  const [textIdx, setTextIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [runId, setRunId] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [imgsReady, setImgsReady] = useState(false);

  const timers = useRef<number[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);
  const ambient = useRef<{ stop: () => void } | null>(null);

  /* ── text cycling inside each act ── */
  useEffect(() => {
    const texts = ACT_TEXTS[phase];
    if (!texts) { setTextIdx(0); return; }
    setTextIdx(0);
    const interval = Math.floor(ACT_MS / texts.length);
    const ids = texts.slice(1).map((_, i) =>
      window.setTimeout(() => setTextIdx(i + 1), interval * (i + 1))
    );
    return () => ids.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (muted) { ambient.current?.stop(); ambient.current = null; }
    else if (audioCtx.current && phase !== "gate" && !ambient.current) startAmbient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => () => { clearTimers(); ambient.current?.stop(); }, []);

  const startAmbient = () => {
    if (!audioCtx.current || ambient.current || muted) return;
    const ctx = audioCtx.current;
    const master = ctx.createGain();
    master.gain.value = 0.022;
    master.connect(ctx.destination);
    const oscs = [261.63, 329.63, 392, 523.25].map((f) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.25;
      o.connect(g).connect(master); o.start(); return o;
    });
    ambient.current = {
      stop: () => { oscs.forEach((o) => { try { o.stop(); } catch { /* */ } }); master.disconnect(); },
    };
  };

  const onOpen = useCallback(async () => {
    audioCtx.current ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === "suspended") await audioCtx.current.resume();
    setPhase("loading");
    if (!imgsReady) preloadImages(ALL_IMAGES, setImgProgress).then(() => setImgsReady(true));
  }, [imgsReady]);

  useEffect(() => {
    if (phase !== "loading" || !imgsReady) return;
    runShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, imgsReady]);

  const runShow = () => {
    startAmbient();
    const A = ACT_MS;
    setPhase("act1_tomjerry");
    at(A * 1, () => setPhase("act2_doraemon"));
    at(A * 2, () => setPhase("act3_bheem"));
    at(A * 3, () => setPhase("act4_animals"));
    at(A * 4, () => setPhase("act5_ben10"));
    at(A * 5, () => setPhase("act6_shinchan"));
    at(A * 6, () => setPhase("act7_fairy"));
    at(A * 7, () => setPhase("act8_doors"));
    at(A * 7 + 3800, () => setPhase("act9_open"));
    at(A * 7 + 7500, () => setPhase("reveal"));
    at(A * 7 + 12000, () => setPhase("complete"));
  };

  const replay = () => {
    clearTimers(); ambient.current?.stop(); ambient.current = null;
    setRunId((r) => r + 1); setPhase("loading");
    at(200, () => runShow());
  };

  const showDoors = ["act8_doors","act9_open","reveal","complete"].includes(phase);
  const doorsOpen = ["act9_open","reveal","complete"].includes(phase);
  const showCards  = ["reveal","complete"].includes(phase);

  const currentText = useMemo(() => {
    const arr = ACT_TEXTS[phase];
    return arr ? arr[Math.min(textIdx, arr.length - 1)] : null;
  }, [phase, textIdx]);

  const babiesScenes: Phase[] = ["act2_doraemon","act4_animals","act6_shinchan","act7_fairy"];
  const showBabies = babiesScenes.includes(phase);

  const progressMap: Record<Phase, number> = {
    gate:0, loading:0,
    act1_tomjerry:0.07, act2_doraemon:0.16, act3_bheem:0.26,
    act4_animals:0.36,  act5_ben10:0.47,   act6_shinchan:0.58,
    act7_fairy:0.70,    act8_doors:0.82,   act9_open:0.90,
    reveal:0.96, complete:1,
  };

  const loadProgress = Math.round(imgProgress * 100);

  /* ── character sizes ── safe for any mobile width */
  const SOLO_W  = "min(62vw, 250px)";   // single character
  const GROUP_H = "25vh";              // group row max height

  return (
    <main
      key={runId}
      style={{ position:"relative", width:"100vw", height:"100dvh", overflow:"hidden" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <img src={sky} alt="" className="h-full w-full object-cover" decoding="async" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, hsl(335 90% 95% / 0.18), hsl(295 70% 80% / 0.48) 70%, hsl(275 60% 70% / 0.68) 100%)",
          }}
        />
      </div>

      <Sparkles count={24} />
      {phase !== "gate" && phase !== "loading" && <Balloons count={6} />}

      {/* ── Petals ── */}
      {phase !== "gate" && phase !== "loading" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="absolute h-2 w-3 rounded-full animate-drift" style={{
              left:`${(i*67)%100}%`, top:`${(i*21)%80}%`,
              background:`hsl(${330+(i%3)*10} 90% ${78+(i%4)*3}%)`,
              animationDelay:`${(i*0.9)%8}s`,
              animationDuration:`${11+(i%4)*2.5}s`,
              willChange:"transform",
            }} />
          ))}
        </div>
      )}

      {/* ── GSAP FLOATING TEXT ── */}
      <AnimatePresence mode="wait">
        {currentText && (
          <motion.div
            key={`${phase}-${textIdx}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <FloatingText text={currentText} triggerKey={`${phase}-${textIdx}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════
           CHARACTERS
          ══════════════════════════════════ */}
      <AnimatePresence mode="popLayout">

        {/* ACT 1 — Tom & Jerry: single, centred */}
        {phase === "act1_tomjerry" && (
          <WalkingChar key="tj" src={tomjerry} from="left" align="center"
            bottom="5%" width={SOLO_W} />
        )}

        {/* ACT 2 — Doraemon: single, centred */}
        {phase === "act2_doraemon" && (
          <WalkingChar key="dora" src={doraemon} from="right" align="center"
            bottom="5%" width={SOLO_W} flip />
        )}

        {/* ACT 3 — Bheem: single, centred */}
        {phase === "act3_bheem" && (
          <WalkingChar key="bheem" src={bheem} from="left" align="center"
            bottom="5%" width={SOLO_W} />
        )}

        {/* ACT 4 — Animals: single, centred, slightly wider */}
        {phase === "act4_animals" && (
          <WalkingChar key="animals" src={animals} from="bottom" align="center"
            bottom="4%" width="min(70vw, 280px)" />
        )}

        {/* ACT 5 — Ben 10: single with flash */}
        {phase === "act5_ben10" && (
          <>
            <motion.div key="ben-flash"
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 25, background: "radial-gradient(circle, hsl(140 80% 70% / 0.45), transparent 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0] }}
              transition={{ duration: 0.7 }}
            />
            <WalkingChar key="ben10" src={ben10} from="right" align="center"
              bottom="5%" width={SOLO_W} flip />
          </>
        )}

        {/* ACT 6 — Shinchan GROUP: flex row, no overlap */}
        {phase === "act6_shinchan" && (
          <GroupCharRow
            key="sc-group"
            chars={[
              { src: tomjerry, from: "left"  },
              { src: bheem,    from: "left"  },
              { src: shinchan, from: "bottom"},
              { src: doraemon, from: "right", flip: true },
              { src: ben10,    from: "right", flip: true },
            ]}
            bottom="3%"
            maxHeight={GROUP_H}
            zIndex={30}
          />
        )}

        {/* ACT 7 — Fairy: single, centred */}
        {phase === "act7_fairy" && (
          <>
            <motion.div key="fairy-aura"
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 20 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.4] }}
              transition={{ duration: 1.4 }}
            >
              <div className="w-full h-full" style={{
                background: "radial-gradient(circle at 50% 55%, hsl(50 100% 80% / 0.4), hsl(330 90% 70% / 0.22) 45%, transparent 72%)"
              }} />
            </motion.div>
            <WalkingChar key="fairy" src={fairy} from="bottom" align="center"
              bottom="4%" width="min(58vw, 235px)" zIndex={35} />
          </>
        )}

        {/* ACT 8 — Doors + peeking chars as GROUP at sides */}
        {phase === "act8_doors" && (
          <GroupCharRow
            key="doors-group"
            chars={[
              { src: tomjerry, from: "left"  },
              { src: bheem,    from: "left"  },
              { src: doraemon, from: "right", flip: true },
              { src: ben10,    from: "right", flip: true },
            ]}
            bottom="2%"
            maxHeight="20vh"
            zIndex={28}
          />
        )}
      </AnimatePresence>

      {/* ── WELCOME ROW after doors open ── */}
      <AnimatePresence>
        {doorsOpen && (
          <motion.div
            key="welcome-row"
            className="pointer-events-none absolute left-0 right-0 bottom-0 flex items-end justify-around px-1"
            style={{ zIndex: 38 }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          >
            {[
              { src: tomjerry, flip: false },
              { src: bheem,    flip: false },
              { src: shinchan, flip: false },
              { src: doraemon, flip: true  },
              { src: ben10,    flip: true  },
            ].map(({ src, flip }, i) => (
              <motion.div
                key={i}
                style={{ flex: "1 1 0", maxWidth: "19vw" }}
                animate={{ y: [0, -10, 0, -6, 0] }}
                transition={{ y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 } }}
              >
                <img
                  src={src} alt="" draggable={false} decoding="async"
                  style={{
                    width: "100%",
                    maxHeight: "22vh",
                    objectFit: "contain",
                    display: "block",
                    transform: flip ? "scaleX(-1)" : undefined,
                    filter: "drop-shadow(0 6px 16px rgba(140,50,100,0.55))",
                    userSelect: "none",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Baby portraits ── */}
      {showBabies && (
        <>
          <BabyFloater key={`a-${phase}`} src={babyArisha} name="Arisha" side="left"  triggerKey={phase} />
          <BabyFloater key={`b-${phase}`} src={babyAvira}  name="Avira"  side="right" triggerKey={phase} />
        </>
      )}

      {/* ── DOORS ── */}
      <AnimatePresence>
        {showDoors && (
          <motion.div key="doors" className="absolute inset-0" style={{ zIndex: 35 }}
            initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <Doors open={doorsOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INVITATION CARDS ── */}
      <AnimatePresence>
        {showCards && <MessageCards key="cards" />}
      </AnimatePresence>

      {/* ── CONFETTI ── */}
      {(phase === "act9_open" || phase === "reveal") && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          <Confetti count={65} />
        </div>
      )}

      {/* ── PROGRESS BAR ── */}
      {phase !== "gate" && phase !== "loading" && phase !== "complete" && (
        <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-[hsl(var(--rose))]/15">
          <motion.div
            className="h-full bg-gradient-to-r from-[hsl(var(--rose))] via-[hsl(var(--gold))] to-[hsl(var(--lilac))]"
            animate={{ width: `${progressMap[phase] * 100}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      )}

      {/* ── LOADING SCREEN ── */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div key="loading"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(var(--background))]/95 px-6 text-center"
          >
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="mb-5 text-5xl">✨</motion.div>
            <p className="mb-4 font-display text-xl text-[hsl(var(--twilight-deep))]">
              The magic is getting ready…
            </p>
            <div className="h-2 w-72 max-w-[80vw] overflow-hidden rounded-full bg-[hsl(var(--rose))]/20">
              <motion.div className="h-full bg-gradient-to-r from-[hsl(var(--rose))] to-[hsl(var(--gold))]"
                animate={{ width: `${loadProgress}%` }} transition={{ duration: 0.4 }} />
            </div>
            <p className="mt-3 font-mono-tag text-xs text-[hsl(var(--twilight-deep))]/60">
              {loadProgress}% · loading characters
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENTRY GATE (English version of the Invitation Card) ── */}
      <AnimatePresence>
        {phase === "gate" && (
          <motion.div key="gate"
            initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden text-center pb-24"
            style={{ 
              background: "url('https://www.transparenttextures.com/patterns/floral-pattern.png'), radial-gradient(circle at 50% 30%, #fff0f5 0%, #ffb6c1 100%)",
              backgroundSize: "cover, cover"
            }}
          >
            {/* Top Deities */}
            <div className="flex w-full justify-between px-1 pt-4 text-[9px] md:text-xs font-semibold tracking-tighter" style={{ color: "#a11d33" }}>
              <span>|| Shree Ganeshay Namah ||</span>
              <span>|| Shree Mahaveeray Namah ||</span>
              <span>|| Shree Vayan Mataji ||</span>
            </div>

            {/* Main Centerpiece (Number 1 + Babies) */}
            <div className="relative mt-8 flex items-center justify-center w-full max-w-[400px]">
              {/* Giant 1 with Crown */}
              <div className="relative font-black z-10" style={{ 
                fontSize: "13rem", 
                lineHeight: 0.8, 
                color: "#ff8da1",
                textShadow: "6px 6px 0px #ffffff, -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 0 10px 20px rgba(150,50,100,0.5)",
                WebkitTextStroke: "2px #e53e3e"
              }}>
                1
                <div className="absolute -top-[12%] -right-[15%] text-6xl drop-shadow-xl rotate-12">👑</div>
              </div>

              {/* Left Baby */}
              <div className="absolute left-0 top-1/4 w-[38%] drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20">
                <img src={babyArisha} alt="Arisha" className="w-full object-contain" />
              </div>

              {/* Right Baby */}
              <div className="absolute right-0 top-1/4 w-[38%] drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20">
                <img src={babyAvira} alt="Avira" className="w-full object-contain" />
              </div>
            </div>

            {/* Happy Birthday (Colorful) */}
            <div className="mt-8 flex flex-col items-center font-black uppercase drop-shadow-md z-20" style={{ fontFamily: "Impact, sans-serif", fontSize: "2.8rem", lineHeight: 1.1 }}>
              <div className="flex gap-0.5" style={{ textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 4px 6px rgba(0,0,0,0.2)" }}>
                <span className="text-[#0ea5e9]">H</span>
                <span className="text-[#ef4444]">A</span>
                <span className="text-[#3b82f6]">P</span>
                <span className="text-[#eab308]">P</span>
                <span className="text-[#10b981]">Y</span>
              </div>
              <div className="flex gap-0.5" style={{ textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 4px 6px rgba(0,0,0,0.2)" }}>
                <span className="text-[#ef4444]">B</span>
                <span className="text-[#0ea5e9]">I</span>
                <span className="text-[#ef4444]">R</span>
                <span className="text-[#eab308]">T</span>
                <span className="text-[#0ea5e9]">H</span>
                <span className="text-[#ef4444]">D</span>
                <span className="text-[#eab308]">A</span>
                <span className="text-[#10b981]">Y</span>
              </div>
            </div>

            {/* Invitation Details */}
            <div className="mt-8 flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: "#8b0000", textShadow: "1px 1px 0 #fff" }}>
                Birthday Invitation
              </h2>
              <p className="mt-2 text-lg font-bold" style={{ color: "#d11141", textShadow: "1px 1px 0 #fff" }}>
                Thursday, 21 May 2026
              </p>
            </div>

            {/* Names */}
            <div className="mt-8 flex flex-col items-center font-black" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1 }}>
              <div style={{
                fontSize: "4.5rem",
                color: "#ffc107",
                textShadow: "3px 3px 0 #8b0000, -1px -1px 0 #8b0000, 1px -1px 0 #8b0000, -1px 1px 0 #8b0000, 0 8px 16px rgba(100,0,0,0.6)"
              }}>
                Arisha
              </div>
              <div style={{
                fontSize: "4.5rem",
                color: "#ffc107",
                textShadow: "3px 3px 0 #8b0000, -1px -1px 0 #8b0000, 1px -1px 0 #8b0000, -1px 1px 0 #8b0000, 0 8px 16px rgba(100,0,0,0.6)"
              }}>
                Avira
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-12 mb-8 flex flex-col items-center text-xs text-[#a11d33] font-semibold leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>
              <p className="text-sm">With Best Compliments:</p>
              <p className="text-lg font-bold text-[#8b0000] mt-1 mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                Sunil Kumar Sohanlal Jain
              </p>
              <p>3-B, Shikshak Nagar, Indore</p>
              <p>Chhota Sarafa, Indore</p>
              <p className="font-bold mt-1 text-[#8b0000]">Mo. 7987288221, 9827043456</p>
            </div>

            {/* Sticky Enter Button */}
            <motion.div
              className="fixed bottom-6 left-0 right-0 flex justify-center z-[60]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="group relative rounded-full bg-gradient-to-r from-[#d11141] to-[#8b0000] font-display font-bold text-white shadow-[0_8px_20px_rgba(139,0,0,0.6)] border-2 border-white/40"
                style={{
                  fontSize: "clamp(1rem, 4.8vw, 1.2rem)",
                  padding: "clamp(0.75rem, 3.5vw, 1.1rem) clamp(1.8rem, 8vw, 2.8rem)",
                }}
              >
                <span className="absolute inset-0 rounded-full bg-[#d11141] opacity-0 blur-xl group-hover:opacity-60 transition" />
                <span className="relative">Open the storybook ✨</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REPLAY ── */}
      {phase === "complete" && (
        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={replay}
          className="absolute bottom-6 right-5 z-50 flex items-center gap-2 rounded-full border border-[hsl(var(--rose))]/40 bg-white/80 px-4 py-2.5 font-mono-tag uppercase tracking-widest text-[hsl(var(--twilight-deep))] backdrop-blur hover:bg-white"
          style={{ fontSize: "clamp(0.6rem, 2.6vw, 0.72rem)" }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Replay
        </motion.button>
      )}

      {/* ── MUTE ── */}
      {phase !== "gate" && phase !== "loading" && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="absolute bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--rose))]/40 bg-white/80 text-[hsl(var(--twilight-deep))] backdrop-blur hover:bg-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </main>
  );
};

export default Index;