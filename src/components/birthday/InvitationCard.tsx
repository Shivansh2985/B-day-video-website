import { motion } from "framer-motion";
import { CalendarHeart, Clock, MapPin, Sparkles as SparkIcon } from "lucide-react";

const details = [
  { icon: CalendarHeart, label: "Date", value: "Saturday · Add Date" },
  { icon: Clock, label: "Time", value: "5:00 PM onwards" },
  { icon: MapPin, label: "Venue", value: "The Enchanted Hall" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.4 } },
};
const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

export const InvitationCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-40 mx-6 w-full max-w-xl"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-[hsl(var(--rose))]/50 bg-[hsl(var(--cream))]/85 px-8 py-10 backdrop-blur-xl shadow-soft"
      >
        {/* corner glow */}
        <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-70" style={{ background: "radial-gradient(circle at top, hsl(var(--rose) / 0.35), transparent 60%)" }} />

        <motion.div variants={item} className="relative mb-2 flex items-center justify-center gap-2 font-mono-tag text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--rose))]">
          <SparkIcon className="h-3 w-3" /> You are invited <SparkIcon className="h-3 w-3" />
        </motion.div>

        <motion.h1 variants={item} className="relative mb-2 text-center font-display text-5xl font-bold leading-[1.1] text-[hsl(var(--twilight-deep))] md:text-6xl">
          Avisha <span className="text-[hsl(var(--rose))]">&</span> Avira
        </motion.h1>
        <motion.p variants={item} className="relative mb-8 text-center font-display text-xl italic text-[hsl(var(--rose))] md:text-2xl">
          turn one — a magical evening awaits
        </motion.p>

        <motion.ul variants={stagger} className="relative space-y-4">
          {details.map((d) => (
            <motion.li key={d.label} variants={item} className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--rose))]/25 bg-white/70 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--rose))]/20 text-[hsl(var(--rose))]">
                <d.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono-tag text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--twilight-deep))]/60">{d.label}</div>
                <div className="font-display text-lg text-[hsl(var(--twilight-deep))]">{d.value}</div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p variants={item} className="relative mt-8 text-center text-sm text-[hsl(var(--twilight-deep))]/70">
          Step into the storybook — join the celebration of our twin stars' first trip around the sun.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
