import { motion } from "framer-motion";
import { CalendarHeart, Clock, MapPin, Heart, Users, Sparkles as SparkIcon } from "lucide-react";

const cards = [
  {
    icon: SparkIcon,
    title: "You are warmly invited",
    body: "to celebrate the very first birthday of our twin little stars",
    accent: "hsla(324, 90%, 40%, 1.00)",
  },
  {
    icon: Heart,
    title: "Arisha & Avira",
    body: "Daughters of Akshay & Ayushi Jain",
    accent: "hsl(340 90% 72%)",
  },
  {
    icon: CalendarHeart,
    title: "Date",
    body: "Thursday, 21 May 2026",
    accent: "hsl(280 80% 72%)",
  },
  {
    icon: Clock,
    title: "Time",
    body: "Evening 7:00 PM onwards",
    accent: "hsl(45 100% 70%)",
  },
  {
    icon: MapPin,
    title: "Venue",
    body: "Suruchi Garden, Scheme No. 71, Indore",
    accent: "hsl(340 90% 72%)",
  },
  {
    icon: Users,
    title: "With love from",
    body: "Sunil — Kiran Jain  •  Akshay — Ayushi Jain",
    accent: "hsl(280 80% 72%)",
  },
];

export const MessageCards = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[42] flex flex-col items-center overflow-y-auto px-3 pt-4 pb-6">
      {/* Hero title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-1 mt-2 text-center font-display font-black leading-none"
        style={{
          fontSize: "clamp(2.4rem, 11vw, 4rem)",
          color: "#fff",
          textShadow:
            "0 0 24px hsl(45 100% 75% / 1), 0 0 48px hsl(330 90% 70% / 0.9), 0 5px 0 hsl(330 70% 30% / 0.7)",
        }}
      >
        Happy 1<sup style={{ fontSize: "0.45em" }}>st</sup> Birthday
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="mb-4 text-center font-display italic"
        style={{
          fontSize: "clamp(0.95rem, 4vw, 1.25rem)",
          color: "hsl(45 100% 90%)",
          textShadow: "0 2px 12px hsl(330 60% 20% / 0.9), 0 1px 0 hsl(330 50% 30% / 0.6)",
          letterSpacing: "0.03em",
        }}
      >
        ✨ a magical evening awaits ✨
      </motion.p>

      {/* Cards */}
      <div className="flex w-full flex-col gap-2.5" style={{ maxWidth: 420 }}>
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.28, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl border border-white/60 backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)",
              boxShadow:
                `0 12px 40px hsl(330 70% 20% / 0.5), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1)`,
            }}
          >
            {/* Coloured left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
              style={{ background: c.accent, opacity: 1 }}
            />

            <div className="flex items-center gap-4 px-4 py-4 pl-6">
              {/* Icon circle */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))`,
                  border: `2px solid rgba(255,255,255,0.6)`,
                  boxShadow: `0 4px 15px ${c.accent}66`,
                }}
              >
                <c.icon
                  className="h-5.5 w-5.5"
                  style={{ color: c.accent, filter: `drop-shadow(0 0 8px ${c.accent})` }}
                />
              </div>

              <div className="min-w-0 flex-1">
                {/* Title / Label */}
                <div
                  style={{
                    fontSize: c.title === "Arisha & Avira" 
                      ? "clamp(1.2rem, 5.5vw, 1.5rem)" 
                      : "clamp(0.65rem, 2.8vw, 0.75rem)",
                    letterSpacing: c.title === "Arisha & Avira" ? "0.01em" : "0.3em",
                    textTransform: c.title === "Arisha & Avira" ? "none" : "uppercase",
                    color: "#ffffff",
                    fontFamily: c.title === "Arisha & Avira" ? "'Fraunces', serif" : "'JetBrains Mono', monospace",
                    fontWeight: c.title === "Arisha & Avira" ? 800 : 700,
                    textShadow: c.title === "Arisha & Avira" 
                      ? "0 2px 10px rgba(0,0,0,0.4), 0 0 20px hsl(340 90% 70% / 0.4)" 
                      : `0 1px 3px rgba(0,0,0,0.6), 0 0 12px ${c.accent}`,
                  }}
                >
                  {c.title}
                </div>
                {/* Body / Value */}
                <div
                  className={c.title === "Arisha & Avira" ? "mt-0.5" : "mt-1 font-display font-semibold"}
                  style={{
                    fontSize: c.title === "Arisha & Avira" 
                      ? "clamp(0.8rem, 3.5vw, 0.95rem)" 
                      : "clamp(0.95rem, 4.2vw, 1.25rem)",
                    color: "#ffffff",
                    textShadow: c.title === "Arisha & Avira"
                      ? "0 1px 4px rgba(0,0,0,0.4)"
                      : "0 2px 6px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.3)",
                    lineHeight: 1.2,
                    fontFamily: c.title === "Arisha & Avira" ? "'Nunito', sans-serif" : undefined,
                  }}
                >
                  {c.body}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Footer tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + cards.length * 0.28 + 0.3, duration: 1 }}
          className="mt-1 text-center font-display italic"
          style={{
            fontSize: "clamp(0.82rem, 3.5vw, 1rem)",
            color: "#fff",
            textShadow:
              "0 2px 14px hsl(330 50% 20% / 0.85), 0 0 30px hsl(45 100% 70% / 0.35)",
            lineHeight: 1.5,
          }}
        >
          Join us as our twin stars take their first magical trip around the sun 🌟
        </motion.p>
      </div>
    </div>
  );
};