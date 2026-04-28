import { motion } from "framer-motion";
import { useMemo } from "react";
import red from "@/assets/balloon-red.png";
import gold from "@/assets/balloon-gold.png";
import pink from "@/assets/balloon-pink.png";

const imgs = [red, gold, pink];

export const Balloons = ({ count = 14 }: { count?: number }) => {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        img: imgs[i % imgs.length],
        x: Math.random() * 100,
        size: 60 + Math.random() * 70,
        delay: Math.random() * 12,
        duration: 16 + Math.random() * 10,
        sway: 30 + Math.random() * 40,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <motion.img
          key={b.id}
          src={b.img}
          alt=""
          className="absolute drop-shadow-2xl"
          style={{ left: `${b.x}%`, width: b.size, bottom: -200 }}
          animate={{
            y: [0, -1400],
            x: [0, b.sway, -b.sway, 0],
            rotate: [-6, 6, -6],
          }}
          transition={{
            y: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" },
            x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
};
