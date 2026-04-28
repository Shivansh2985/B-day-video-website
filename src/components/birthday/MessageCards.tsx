import { motion } from "framer-motion";
import { CalendarHeart, Clock, MapPin, Heart, Users, Sparkles as SparkIcon } from "lucide-react";

/**
 * Sequential floating English invitation messages that appear after the doors open.
 * Each card is mobile-first, no heavy box — soft translucent glass with glowing border.
 */
const cards = [
  {
    icon: SparkIcon,
    title: "You are warmly invited",
    body: "to celebrate the very first birthday of our twin little stars",
  },
  {
    icon: Heart,
    title: "Arisha & Avira",
    body: "Daughters of Akshay & Ayushi Jain",
  },
  {
    icon: CalendarHeart,
    title: "Date",
    body: "Thursday, 21 May 2026",
  },
  {
    icon: Clock,
    title: "Time",
    body: "Evening 7:00 PM onwards",
  },
  {
    icon: MapPin,
    title: "Venue",
    body: "Sukhchi Garden, Scheme No. 71, Indore",
  },
  {
    icon: Users,
    title: "With love from",
    body: "Sunil — Kiran Jain  •  Akshay — Ayushi Jain",
  },
];

const STEP = 1.6;

export const MessageCards = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[42] flex flex-col items-center justify-start overflow-y-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-2 mt-2 text-center font-display text-5xl font-black leading-none text-white md:text-7xl"
        style={{
          textShadow:
            "0 0 22px hsl(45 100% 75% / 0.95), 0 0 44px hsl(330 90% 70% / 0.8), 0 4px 0 hsl(330 70% 30% / 0.6)",
        }}
      >
        Happy 1<sup className="text-2xl md:text-4xl">st</sup> Birthday
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-6 text-center font-display italic text-[hsl(var(--cream))] text-base md:text-xl"
        style={{ textShadow: "0 2px 8px hsl(330 50% 20% / 0.7)" }}
      >
        a magical evening awaits
      </motion.p>

      <div className="flex w-full max-w-md flex-col items-stretch gap-3 md:max-w-lg md:gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + i * STEP * 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/15 px-5 py-4 backdrop-blur-md md:px-6 md:py-5"
            style={{
              boxShadow:
                "0 8px 32px hsl(330 60% 30% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
            }}
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, hsl(45 100% 75% / 0.25), transparent 40%, hsl(330 90% 75% / 0.25))",
              }}
            />
            <div className="relative flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/30 text-white shadow-inner md:h-12 md:w-12">
                <c.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono-tag text-[10px] uppercase tracking-[0.3em] text-white/80">
                  {c.title}
                </div>
                <div
                  className="mt-0.5 font-display text-lg font-semibold text-white md:text-2xl"
                  style={{ textShadow: "0 2px 8px hsl(330 60% 25% / 0.7)" }}
                >
                  {c.body}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + cards.length * STEP * 0.4, duration: 1 }}
          className="mt-2 text-center font-display italic text-white/95 text-sm md:text-base"
          style={{ textShadow: "0 2px 8px hsl(330 50% 20% / 0.7)" }}
        >
          Step into the storybook — join the celebration of our twin stars' first trip around the sun ✨
        </motion.p>
      </div>
    </div>
  );
};