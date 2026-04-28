import { motion } from "framer-motion";

interface Props {
  text: string;
  /** unique key to retrigger animation */
  triggerKey: string | number;
}

/**
 * Big, classy floating narration text — no box, just glow + gentle float.
 * Mobile-first sizing.
 */
export const FloatingText = ({ text, triggerKey }: Props) => {
  const words = text.split(" ");
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-[10%] z-40 flex justify-center px-5 md:top-[12%]">
      <motion.h2
        key={triggerKey}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: [20, -6, 0, -4, 0], scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          scale:   { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          y:       { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="max-w-[92vw] text-center font-display text-[1.9rem] font-bold leading-[1.1] tracking-tight text-white md:text-6xl"
        style={{
          textWrap: "balance",
          textShadow:
            "0 0 18px hsl(330 90% 75% / 0.9), 0 0 36px hsl(45 100% 75% / 0.6), 0 4px 14px hsl(330 50% 20% / 0.55), 0 2px 0 hsl(330 70% 35% / 0.7)",
        }}
      >
        {words.map((w, i) => (
          <motion.span
            key={`${triggerKey}-${i}`}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mr-[0.28em] inline-block"
          >
            {w}
          </motion.span>
        ))}
      </motion.h2>
    </div>
  );
};