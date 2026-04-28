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

  const tones = ["var(--gold)", "var(--rose)", "var(--lilac)", "var(--cream)"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => {
        const tone = tones[s.id % tones.length];
        return (
          <span
            key={s.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
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
