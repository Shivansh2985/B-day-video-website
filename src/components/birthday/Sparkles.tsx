import { useMemo } from "react";

/**
 * Pure-CSS sparkles — no framer-motion, no per-frame React.
 * Uses the existing `twinkle` keyframe (in index.css). Cheap on GPU.
 */
export const Sparkles = ({ count = 40 }: { count?: number }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 2.5,
      })),
    [count]
  );

  const sprayCount = count * 2;
  const sprayParticles = useMemo(
    () =>
      Array.from({ length: sprayCount }).map((_, i) => ({
        id: `spray-${i}`,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20, // start below the screen
        size: 0.5 + Math.random() * 1.5, // much smaller
        delay: Math.random() * 10, // staggered start
        duration: 4 + Math.random() * 6, // float up duration
      })),
    [sprayCount]
  );

  const tones = ["var(--gold)", "var(--rose)", "var(--lilac)", "var(--cream)"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => {
        const tone = tones[s.id % tones.length];
        return (
          <span
            key={s.id}
            className="absolute animate-float-particle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDelay: `${s.delay * -1}s`,
              animationDuration: `${s.duration * 2.5}s`,
            }}
          >
            <span
              className="block rounded-full animate-twinkle"
              style={{
                width: s.size,
                height: s.size,
                background: `hsl(${tone})`,
                boxShadow: `0 0 ${s.size * 5}px hsl(${tone}), 0 0 ${s.size * 10}px hsl(${tone} / 0.4)`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
                willChange: "transform, opacity",
              }}
            />
          </span>
        );
      })}
      
      {/* Sparkler Spray Particles */}
      {sprayParticles.map((s, idx) => {
        const tone = tones[idx % tones.length];
        return (
          <span
            key={s.id}
            className="absolute rounded-full animate-spray-up"
            style={{
              left: `${s.x}%`,
              bottom: `-20px`, // Start just off screen
              width: s.size,
              height: s.size * (1.5 + Math.random()), // slightly elongated
              background: `hsl(${tone})`,
              boxShadow: `0 0 ${s.size * 4}px hsl(${tone})`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
};
