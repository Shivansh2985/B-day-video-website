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
// 👇 Replace these PNGs with your own baby photos (same filename, transparent or square is fine)
import babyArisha from "@/assets/baby-arisha.png";
import babyAvira from "@/assets/baby-avira.png";
import { Sparkles } from "@/components/birthday/Sparkles";
import { Balloons } from "@/components/birthday/Balloons";
import { Confetti } from "@/components/birthday/Confetti";
import { Doors } from "@/components/birthday/Doors";
import { MessageCards } from "@/components/birthday/MessageCards";
import { WalkingChar } from "@/components/birthday/WalkingChar";
import { FloatingText } from "@/components/birthday/FloatingText";
import { BabyFloater } from "@/components/birthday/BabyFloater";

type Phase =
  | "gate"
  | "loading"
  | "act1_tomjerry"
  | "act2_doraemon"
  | "act3_bheem"
  | "act4_animals"
  | "act5_ben10"
  | "act6_shinchan"
  | "act7_fairy"
  | "act8_doors"
  | "act9_open"
  | "reveal"
  | "complete";

const ALL_IMAGES = [sky, shinchan, animals, tomjerry, doraemon, bheem, ben10, fairy, babyArisha, babyAvira];

/** Preload + decode all images so the first scene paints instantly. */
function preloadImages(srcs: string[], onProgress: (p: number) => void): Promise<void> {
  let done = 0;
  const total = srcs.length;
  return Promise.all(
    srcs.map(
      (s) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = async () => {
            try { await img.decode(); } catch { /* ignore */ }
            done += 1;
            onProgress(done / total);
            resolve();
          };
          img.onerror = () => {
            done += 1;
            onProgress(done / total);
            resolve();
          };
          img.src = s;
        })
    )
  ).then(() => undefined);
}

const Index = () => {
  const [phase, setPhase] = useState<Phase>("gate");
  const [muted, setMuted] = useState(false);
  const [runId, setRunId] = useState(0);

  const [imgProgress, setImgProgress] = useState(0);
  const [imgsReady, setImgsReady] = useState(false);

  const timers = useRef<number[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);
  const ambient = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (muted) {
      ambient.current?.stop();
      ambient.current = null;
    } else if (audioCtx.current && phase !== "gate" && !ambient.current) {
      startAmbient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) =>
    timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    return () => {
      clearTimers();
      ambient.current?.stop();
    };
  }, []);

  // Ambient soft pad
  const startAmbient = () => {
    if (!audioCtx.current || ambient.current || muted) return;
    const ctx = audioCtx.current;
    const master = ctx.createGain();
    master.gain.value = 0.025;
    master.connect(ctx.destination);
    const freqs = [261.63, 329.63, 392, 523.25];
    const oscs = freqs.map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      o.connect(g).connect(master);
      o.start();
      return o;
    });
    ambient.current = {
      stop: () => { oscs.forEach((o) => { try { o.stop(); } catch { /* */ } }); master.disconnect(); },
    };
  };

  const onOpen = useCallback(async () => {
    audioCtx.current ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === "suspended") await audioCtx.current.resume();
    setPhase("loading");
    if (!imgsReady) {
      preloadImages(ALL_IMAGES, setImgProgress).then(() => setImgsReady(true));
    }
  }, [imgsReady]);

  // Start show once images decoded
  useEffect(() => {
    if (phase !== "loading" || !imgsReady) return;
    runShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, imgsReady]);

  // Cinematic timeline (~50s) — each act ~5s, characters in first then text
  const runShow = () => {
    startAmbient();
    setPhase("act1_tomjerry");
    at(5000,  () => setPhase("act2_doraemon"));
    at(10000, () => setPhase("act3_bheem"));
    at(15000, () => setPhase("act4_animals"));
    at(20000, () => setPhase("act5_ben10"));
    at(25000, () => setPhase("act6_shinchan"));
    at(31000, () => setPhase("act7_fairy"));
    at(37000, () => setPhase("act8_doors"));
    at(40000, () => setPhase("act9_open"));
    at(43500, () => setPhase("reveal"));
    at(47000, () => setPhase("complete"));
  };

  const replay = () => {
    clearTimers();
    ambient.current?.stop(); ambient.current = null;
    setRunId((r) => r + 1);
    setPhase("loading");
    at(200, () => runShow());
  };

  const showDoors = phase === "act8_doors" || phase === "act9_open" || phase === "reveal" || phase === "complete";
  const doorsOpen = phase === "act9_open" || phase === "reveal" || phase === "complete";
  const showCards = phase === "reveal" || phase === "complete";

  const currentText = useMemo(() => {
    switch (phase) {
      case "act1_tomjerry": return "Tom & Jerry race in to start the magic!";
      case "act2_doraemon": return "Doraemon, Nobita & Shizuka land with a magical pocket!";
      case "act3_bheem":    return "Chhota Bheem & Chutki bring sweet laddoos!";
      case "act4_animals":  return "All the jungle friends dance into the party!";
      case "act5_ben10":    return "It's hero time — Ben 10 joins the celebration!";
      case "act6_shinchan": return "Shinchan calls everyone — please come for Arisha & Avira!";
      case "act7_fairy":    return "A fairy arrives to bless our twin little stars ✨";
      case "act8_doors":    return "The storybook doors are about to open…";
      default: return null;
    }
  }, [phase]);

  // Which scenes show the floating baby photos (Arisha & Avira)
  const babiesScenes: Phase[] = ["act2_doraemon", "act4_animals", "act6_shinchan", "act7_fairy"];
  const showBabies = babiesScenes.includes(phase);

  const progressMap: Record<Phase, number> = {
    gate: 0, loading: 0,
    act1_tomjerry: 0.08, act2_doraemon: 0.18, act3_bheem: 0.30,
    act4_animals: 0.42, act5_ben10: 0.54, act6_shinchan: 0.66,
    act7_fairy: 0.78, act8_doors: 0.86, act9_open: 0.93, reveal: 0.98, complete: 1,
  };

  const loadProgress = Math.round(imgProgress * 100);

  return (
    <main key={runId} className="relative h-dvh w-screen overflow-hidden bg-fairy">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={sky} alt="" className="h-full w-full object-cover" decoding="async" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, hsl(335 90% 95% / 0.25), hsl(295 70% 80% / 0.55) 70%, hsl(275 60% 70% / 0.75) 100%)" }}
        />
      </div>

      <Sparkles count={36} />
      {phase !== "gate" && phase !== "loading" && <Balloons count={8} />}

      {/* Floating cherry petals */}
      {phase !== "gate" && phase !== "loading" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-3 rounded-full animate-drift"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 17) % 100}%`,
                background: `hsl(${330 + (i % 3) * 10} 90% ${78 + (i % 4) * 3}%)`,
                animationDelay: `${(i * 0.7) % 8}s`,
                animationDuration: `${10 + (i % 5) * 2}s`,
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}

      {/* ===== CHARACTERS — mobile-first BIG sizing ===== */}
      <AnimatePresence mode="popLayout">
        {phase === "act1_tomjerry" && (
          <WalkingChar key="tj" src={tomjerry} from="left" align="center" bottom="4%" width="min(72vw, 420px)" />
        )}
        {phase === "act2_doraemon" && (
          <WalkingChar key="dora" src={doraemon} from="right" align="center" bottom="4%" width="min(78vw, 460px)" flip />
        )}
        {phase === "act3_bheem" && (
          <WalkingChar key="bheem" src={bheem} from="left" align="center" bottom="4%" width="min(70vw, 420px)" />
        )}
        {phase === "act4_animals" && (
          <WalkingChar key="animals" src={animals} from="bottom" align="center" bottom="3%" width="min(92vw, 560px)" />
        )}
        {phase === "act5_ben10" && (
          <>
            <motion.div
              key="ben-flash"
              className="pointer-events-none absolute inset-0 z-25"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0] }}
              transition={{ duration: 0.7 }}
              style={{ background: "radial-gradient(circle, hsl(140 80% 70% / 0.55), transparent 60%)" }}
            />
            <WalkingChar key="ben10" src={ben10} from="right" align="center" bottom="4%" width="min(64vw, 400px)" flip />
          </>
        )}
        {phase === "act6_shinchan" && (
          <>
            <WalkingChar key="sc-tj"    src={tomjerry} from="left"   align="left"   bottom="4%" width="min(40vw, 220px)" delay={0.05} zIndex={28} />
            <WalkingChar key="sc-bheem" src={bheem}    from="left"   align="left"   bottom="4%" width="min(42vw, 240px)" delay={0.18} zIndex={27} />
            <WalkingChar key="sc-dora"  src={doraemon} from="right"  align="right"  bottom="4%" width="min(44vw, 260px)" delay={0.05} zIndex={28} flip />
            <WalkingChar key="sc-ben"   src={ben10}    from="right"  align="right"  bottom="4%" width="min(38vw, 220px)" delay={0.18} zIndex={27} flip />
            <WalkingChar key="sc-shin"  src={shinchan} from="bottom" align="center" bottom="3%" width="min(44vw, 260px)" delay={0.30} zIndex={32} />
          </>
        )}
        {phase === "act7_fairy" && (
          <>
            {/* Magical purple aurora behind fairy */}
            <motion.div
              key="fairy-aura"
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.5] }}
              transition={{ duration: 1.2 }}
              style={{ background: "radial-gradient(circle at 50% 55%, hsl(50 100% 80% / 0.5), hsl(330 90% 70% / 0.3) 45%, transparent 75%)" }}
            />
            <WalkingChar key="fairy" src={fairy} from="bottom" align="center" bottom="2%" width="min(72vw, 380px)" zIndex={35} />
          </>
        )}
        {phase === "act8_doors" && (
          <>
            <WalkingChar key="g-tj"      src={tomjerry} from="left"   align="left"   bottom="2%" width="min(28vw, 160px)" zIndex={28} />
            <WalkingChar key="g-bheem"   src={bheem}    from="left"   align="left"   bottom="2%" width="min(30vw, 170px)" zIndex={27} delay={0.1} />
            <WalkingChar key="g-animals" src={animals}  from="bottom" align="center" bottom="1%" width="min(54vw, 320px)" zIndex={26} delay={0.15} />
            <WalkingChar key="g-dora"    src={doraemon} from="right"  align="right"  bottom="2%" width="min(32vw, 180px)" zIndex={28} delay={0.05} flip />
            <WalkingChar key="g-ben"     src={ben10}    from="right"  align="right"  bottom="2%" width="min(26vw, 150px)" zIndex={27} delay={0.2} flip />
          </>
        )}
      </AnimatePresence>

      {/* GSAP floating babies — appear during select scenes */}
      {showBabies && (
        <>
          <BabyFloater key={`a-${phase}`} src={babyArisha} name="Arisha" side="left"  triggerKey={phase} />
          <BabyFloater key={`b-${phase}`} src={babyAvira}  name="Avira"  side="right" triggerKey={phase} />
        </>
      )}

      {/* Floating English narration text — big, no box */}
      <AnimatePresence mode="wait">
        {currentText && (
          <FloatingText key={phase} text={currentText} triggerKey={phase} />
        )}
      </AnimatePresence>

      {/* Doors */}
      <AnimatePresence>
        {showDoors && (
          <motion.div
            key="doors"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-35"
          >
            <Doors open={doorsOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invitation message cards */}
      <AnimatePresence>
        {showCards && <MessageCards key="cards" />}
      </AnimatePresence>

      {(phase === "act9_open" || phase === "reveal") && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <Confetti count={80} />
        </div>
      )}

      {/* Progress bar */}
      {phase !== "gate" && phase !== "loading" && phase !== "complete" && (
        <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-[hsl(var(--rose))]/15">
          <motion.div
            className="h-full bg-gradient-to-r from-[hsl(var(--rose))] via-[hsl(var(--gold))] to-[hsl(var(--lilac))]"
            animate={{ width: `${progressMap[phase] * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Loading screen */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(var(--background))]/95 px-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="mb-6 text-4xl"
            >✨</motion.div>
            <p className="mb-4 font-display text-2xl text-[hsl(var(--twilight-deep))]">
              The magic is getting ready…
            </p>
            <div className="h-2 w-72 max-w-[80vw] overflow-hidden rounded-full bg-[hsl(var(--rose))]/20">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--rose))] to-[hsl(var(--gold))]"
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="mt-3 font-mono-tag text-xs text-[hsl(var(--twilight-deep))]/60">
              {loadProgress}% · loading characters
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry gate */}
      <AnimatePresence>
        {phase === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: "radial-gradient(ellipse at center, hsl(335 80% 92% / 0.85), hsl(295 70% 82% / 0.95) 80%)" }}
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="mb-3 font-mono-tag text-[11px] uppercase tracking-[0.4em] text-[hsl(var(--rose))]"
            >
              <SparkIcon className="mr-2 inline h-3 w-3" />
              A fairytale invitation
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] text-[hsl(var(--twilight-deep))] md:text-7xl"
              style={{ textWrap: "balance" }}
            >
              Arisha <span className="italic text-[hsl(var(--rose))]">&</span> Avira
              <span className="block text-2xl font-normal italic text-[hsl(var(--rose))] md:text-3xl">turn one ✿</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-10 max-w-md text-[hsl(var(--twilight-deep))]/80"
            >
              A storybook of cartoons &amp; fairies — about 50 seconds of pure magic.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onOpen}
              className="group relative rounded-full bg-[hsl(var(--rose))] px-10 py-5 font-display text-lg font-bold text-white shadow-glow-rose transition"
            >
              <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))] opacity-50 blur-xl group-hover:opacity-80" />
              <span className="relative">Open the storybook ✨</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay */}
      {phase === "complete" && (
        <motion.button
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={replay}
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[hsl(var(--rose))]/40 bg-white/80 px-5 py-3 font-mono-tag text-xs uppercase tracking-widest text-[hsl(var(--twilight-deep))] backdrop-blur hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" /> Replay magic
        </motion.button>
      )}

      {/* Mute */}
      {phase !== "gate" && phase !== "loading" && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="absolute bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--rose))]/40 bg-white/80 text-[hsl(var(--twilight-deep))] backdrop-blur hover:bg-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </main>
  );
};

export default Index;