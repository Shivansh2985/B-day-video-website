import { motion } from "framer-motion";
import { useMemo } from "react";

const colors = ["hsl(var(--gold))", "hsl(var(--rose))", "hsl(var(--sunset))", "hsl(var(--cream))"];

export const Confetti = ({ count = 80 }: { count?: number }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
          }}
          initial={{ y: -50, rotate: p.rot, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rot + 720, opacity: [1, 1, 0] }}
          transition={{ duration: 4 + Math.random() * 2, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
};
