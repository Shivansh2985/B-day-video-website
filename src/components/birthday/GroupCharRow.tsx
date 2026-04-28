import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface CharDef {
  src: string;
  flip?: boolean;
  /** entry direction per character */
  from?: "left" | "right" | "bottom";
}

interface Props {
  chars: CharDef[];
  /** CSS bottom value */
  bottom?: string;
  /** max height of each character image */
  maxHeight?: string;
  zIndex?: number;
}

/**
 * GSAP-powered flex row of characters.
 * - All characters fit within viewport width.
 * - Staggered pop-in from their entry direction.
 * - Continuous wave-bob after they land.
 */
export const GroupCharRow = ({
  chars,
  bottom = "3%",
  maxHeight = "28vh",
  zIndex = 30,
}: Props) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    // Kill any lingering tweens
    gsap.killTweensOf(els);

    // Set initial hidden state per entry direction
    els.forEach((el, i) => {
      const dir = chars[i]?.from ?? "bottom";
      const xInit = dir === "left" ? -180 : dir === "right" ? 180 : 0;
      const yInit = dir === "bottom" ? 200 : 60;
      gsap.set(el, { x: xInit, y: yInit, opacity: 0, scale: 0.6 });
    });

    const tl = gsap.timeline();

    // Staggered slide-in
    tl.to(els, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: "back.out(1.3)",
      stagger: 0.1,
    });

    // Wave bob — from center outward
    tl.to(els, {
      y: -12,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { amount: 0.7, from: "center" },
    }, "+=0.05");

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars.map(c => c.src).join(",")]);

  const perCharVw = Math.floor(92 / chars.length);

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 flex items-end justify-around"
      style={{ bottom, zIndex, padding: "0 2vw" }}
    >
      {chars.map(({ src, flip }, i) => (
        <div
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          className="flex justify-center items-end"
          style={{
            width: `${perCharVw}vw`,
            maxWidth: `${perCharVw}vw`,
            flexShrink: 0,
          }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            decoding="async"
            loading="eager"
            style={{
              width: "100%",
              maxHeight,
              objectFit: "contain",
              transform: flip ? "scaleX(-1)" : undefined,
              filter: "drop-shadow(0 8px 20px rgba(150,50,110,0.55))",
              userSelect: "none",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
};
