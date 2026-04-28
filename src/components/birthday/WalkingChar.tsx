import { motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";

interface Props {
  src: string;
  /** entry direction */
  from: "left" | "right" | "bottom";
  /** bottom offset, e.g. "3%" */
  bottom?: string;
  /** width, e.g. "32vw" */
  width: string;
  /** final horizontal alignment */
  align?: "left" | "center" | "right";
  delay?: number;
  zIndex?: number;
  /** notify parent that the image bytes are decoded & rendered */
  onReady?: () => void;
  /** flip horizontally (face other direction) */
  flip?: boolean;
}

/**
 * Walking character: image translates in (walk-in), then bobs (walk cycle)
 * with a subtle arm-swing rotation. All transforms are GPU-only.
 */
export const WalkingChar = forwardRef<HTMLDivElement, Props>(function WalkingChar({
  src,
  from,
  bottom = "3%",
  width,
  align = "center",
  delay = 0,
  zIndex = 30,
  onReady,
  flip = false,
}, ref) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const horiz =
    align === "left" ? "left-[6%]" :
    align === "right" ? "right-[6%]" :
    "left-1/2 -translate-x-1/2";

  const initial =
    from === "left" ? { x: "-130%", y: 0, opacity: 0 } :
    from === "right" ? { x: "130%", y: 0, opacity: 0 } :
    { x: 0, y: "120%", opacity: 0 };

  return (
    <motion.div
      ref={ref}
      className={`absolute ${horiz} pointer-events-none will-change-transform`}
      style={{ bottom, width, zIndex }}
      initial={initial}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{
        x: { type: "tween", duration: 1.6, ease: [0.22, 1, 0.36, 1], delay },
        y: { type: "tween", duration: 1.6, ease: [0.22, 1, 0.36, 1], delay },
        opacity: { duration: 0.5, delay },
      }}
    >
      {/* walk cycle: vertical bob + slight tilt = arm/leg swing illusion */}
      <motion.div
        animate={{ y: [0, -10, 0, -6, 0], rotate: [-2, 2, -2, 2, -2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: delay + 1.4 }}
        style={{ transformOrigin: "50% 100%" }}
      >
        <img
          src={src}
          alt=""
          decoding="async"
          loading="eager"
          onLoad={() => setLoaded(true)}
          className="w-full select-none drop-shadow-[0_18px_24px_rgba(180,80,140,0.4)]"
          style={{ transform: flip ? "scaleX(-1)" : undefined }}
          draggable={false}
        />
      </motion.div>
      {/* soft ground shadow that pulses with the bob */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          bottom: "-1.5%",
          width: "60%",
          height: "4%",
          background: "radial-gradient(ellipse at center, hsl(330 50% 30% / 0.35), transparent 70%)",
          filter: "blur(6px)",
        }}
        animate={{ scaleX: [1, 0.85, 1, 0.9, 1], opacity: [0.5, 0.35, 0.5, 0.4, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: delay + 1.4 }}
      />
    </motion.div>
  );
});